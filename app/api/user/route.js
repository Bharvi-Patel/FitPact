import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import Pact from "@/models/Pact"
import Workout from "@/models/Workout"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    // Remove user from their pact
    if (user.pact) {
      await Pact.findByIdAndUpdate(user.pact, {
        $pull: { members: user._id }
      })
    }

    // Delete all their workouts
    await Workout.deleteMany({ user: user._id })

    // Delete the user
    await User.findByIdAndDelete(user._id)

    return NextResponse.json({ success: true })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}