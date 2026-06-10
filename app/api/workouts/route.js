import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";
import User from "@/models/User";
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getPointsForAction } from "@/lib/ranks";
import Message from "@/models/Message"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user.pact) return NextResponse.json({ error: "Join a pact first!" }, { status: 400 })

    const formData = await request.formData()
    const photo = formData.get("photo")
    const note = formData.get("note") || ""

    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${photo.type};base64,${buffer.toString("base64")}`

    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "fitpact",
    })

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

    const pactWorkoutToday = await Workout.findOne({
      pact: user.pact,
      date: { $gte: today }
    })
    const isFirstToLog = !pactWorkoutToday

    const workout = await Workout.create({
      user: user._id,
      pact: user.pact,
      photoUrl: uploadResult.secure_url,
      note,
    })

    const yesterday = new Date(today)
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)

    const yesterdayWorkout = await Workout.findOne({
      user: user._id,
      date: { $gte: yesterday, $lt: today }
    })

    let newStreak = user.streak
    let pointsEarned = getPointsForAction("LOG_WORKOUT") // ✅ defined here

    if (yesterdayWorkout) {
      newStreak = user.streak + 1
    } else if (user.streak === 0) {
      newStreak = 1
    } else {
      if (!user.restDayUsed) {
        newStreak = user.streak
        await User.findByIdAndUpdate(user._id, { restDayUsed: true })
      } else {
        newStreak = 0
      }
    }

    await Message.create({
        pact: user.pact,
        user: user._id,
        text: note || "workout",
        isWorkout: true,
        photoUrl: uploadResult.secure_url,
        })

    // Bonus points
    if (newStreak === 7) pointsEarned += getPointsForAction("SEVEN_DAY_STREAK")
    if (isFirstToLog) pointsEarned += getPointsForAction("FIRST_TO_LOG")

    console.log("Points earned:", pointsEarned)
    console.log("New points total:", user.points + pointsEarned)

    // ✅ points now saved
    await User.findByIdAndUpdate(user._id, {
      streak: newStreak,
      lastWorkout: new Date(),
      points: user.points + pointsEarned,
    })

    return NextResponse.json({ workout, streak: newStreak, pointsEarned })

  } catch (error) {
    console.error("WORKOUT ERROR:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
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