import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
    try{
        const session = await getServerSession()
        if(!session) return NextResponse.json({error: "Unauthorized"}, {status: 401})
            
            await connectDB()

            const user = await User.findOne({ email: session.user.email })
            if (!user.pact) return NextResponse.json({ error: "Join a pact first!" }, { status: 400 })

            const formData = await request.formData()
            const photo = formData.get("photo")
            const note = formData.get("note") || ""

            // Convert photo to base64 for Cloudinary
            const bytes = await photo.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const base64 = `data:${photo.type};base64,${buffer.toString("base64")}`

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(base64, {
            folder: "fitpact",
            })

            // Check if already logged today
            const now = new Date()
            const today = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                0, 0, 0, 0
            ))

            const existingWorkout = await Workout.findOne({
            user: user._id,
            date: { $gte: today }
            })
            if (existingWorkout) return NextResponse.json({ error: "Already logged today!" }, { status: 400 })

            // Save workout to MongoDB
            const workout = await Workout.create({
            user: user._id,
            pact: user.pact,
            photoUrl: uploadResult.secure_url,
            note,
            })

            // Update streak logic
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            yesterday.setHours(0, 0, 0, 0)


            const yesterdayWorkout = await Workout.findOne({
            user: user._id,
            date: { $gte: yesterday, $lt: today }
            })

            let newStreak = user.streak

            if (yesterdayWorkout) {
            // Worked out yesterday → continue streak
            newStreak = user.streak + 1
            } else if (user.streak === 0) {
            // First ever workout
            newStreak = 1
            } else {
            // Missed yesterday — check rest day
            if (!user.restDayUsed) {
                // Use rest day, streak continues
                newStreak = user.streak 
                await User.findByIdAndUpdate(user._id, { restDayUsed: true })
            } else {
                // Rest day already used → streak resets
                newStreak = 0
            }
            }

            // Update user
            await User.findByIdAndUpdate(user._id, {
            streak: newStreak,
            lastWorkout: new Date(),
            })

            return NextResponse.json({ workout, streak: newStreak })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    const workouts = await Workout.find({ pact: user.pact })
      .populate("user", "name image")
      .sort({ date: -1 })
      .limit(20)

    return NextResponse.json({ workouts })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
