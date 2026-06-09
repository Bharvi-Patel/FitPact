import { connectDB } from "@/lib/mongodb"
import Workout from "@/models/Workout"
import Pact from "@/models/Pact"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await connectDB()

    const now = new Date()
    const today = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    ))

    // Get all pacts
    const pacts = await Pact.find({}).populate("members")

    for (const pact of pacts) {
      for (const member of pact.members) {

        // Did they log today?
        const workout = await Workout.findOne({
          user: member._id,
          pact: pact._id,
          date: { $gte: today }
        })

        if (!workout) {
          // Missed today
          if (member.restDayUsed) {
            // No rest day left → add strike
            const newStrikes = member.strikes + 1
            await User.findByIdAndUpdate(member._id, {
              strikes: newStrikes,
              streak: 0
            })
            console.log(`Strike added to ${member.name} — total: ${newStrikes}`)
          } else {
            // Use rest day
            await User.findByIdAndUpdate(member._id, {
              restDayUsed: true
            })
            console.log(`Rest day used for ${member.name}`)
          }
        }
      }
    }

    // Every Monday → reset restDayUsed for everyone
    if (now.getUTCDay() === 1) {
      await User.updateMany({}, { restDayUsed: false })
      console.log("Weekly rest day reset done ✅")
    }

    return NextResponse.json({ message: "Strikes processed ✅" })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}