import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";
import Pact from "@/models/Pact";
import User from "@/models/User";
import {authOptions} from "@/lib/authOptions"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

            await connectDB()
            const user = await User.findOne({email: session.user.email})
            if (!user.pact) return NextResponse.json({ error: "You are not in a pact" }, { status: 400 })

            //Get all pact members
            const pact = await Pact.findById(user.pact).populate("members", "name image streak strikes restDayUsed")
            
            // Get today's workouts for this pact
            const now = new Date()
            const today = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                0, 0, 0, 0
            ))


            // Add this debug line
            console.log("Looking for workouts after:", today)
            console.log("User pact:", user.pact)

            const todayWorkouts = await Workout.find({
                pact: user.pact,
                date: { $gte: today }
            }).populate("user", "name image")

            // Add this too
            console.log("Found workouts:", todayWorkouts.length)

            // Add this — let's see ALL workouts in the pact
            const allWorkouts = await Workout.find({ pact: user.pact })
            console.log("ALL workouts:", JSON.stringify(allWorkouts, null, 2))

            // Figure out who logged and who missed
            const loggedUserIds = todayWorkouts.map(w => w.user._id.toString())

            const members = pact.members.map(member => ({
                ...member.toObject(),
                loggedToday: loggedUserIds.includes(member._id.toString()),
                workout: todayWorkouts.find(w => w.user._id.toString() === member._id.toString()) || null
            }))

            //Get recent workouts (last 7 days) for the feed
            const recentWorkouts = await Workout.find({
                pact: user.pact,
                date: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
            })
                .populate("user", "name image")
                .sort({ date: -1 })

                return NextResponse.json({ members, recentWorkouts, pact})

    } catch (error) {
        console.error("FEED ERROR:", error.message, error.stack)  
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}