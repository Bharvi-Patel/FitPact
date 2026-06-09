import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import Pact from "@/models/Pact"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user.pact) return NextResponse.json({ leaderboard: [] })

    const pact = await Pact.findById(user.pact).populate(
      "members",
      "name image points streak strikes email"
    )

    const leaderboard = pact.members
      .map(m => m.toObject())
      .sort((a, b) => b.points - a.points)

    return NextResponse.json({ leaderboard })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}