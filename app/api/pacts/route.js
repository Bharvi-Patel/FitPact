import {connectDB} from "@/lib/mongodb"
import Pact from "@/models/Pact"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

// Generate a random 6 character invite code
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// GET — fetch current user's pact
export async function GET(request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user.pact) return NextResponse.json({ pact: null })

    const pact = await Pact.findById(user.pact).populate("members", "name image streak strikes")
    return NextResponse.json({ pact })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — create or join a pact
export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    const { action, name, weeklyGoal, inviteCode } = await request.json()

    if (action === "create") {

        // Create a new Pact
        const newPact = await Pact.create({
            name,
            weeklyGoal: weeklyGoal || 6,
            inviteCode: generateInviteCode(),
            createdBy: user._id,
            members: [user._id],
        })  

        // Update user's pact reference
        await User.findByIdAndUpdate(user._id, { pact: newPact._id })

        return NextResponse.json({ pact: newPact })

        } else if (action === "join") {
            // Find pact by invite code
            const pact = await Pact.findOne({ inviteCode: inviteCode.toUpperCase() })
            if (!pact) return NextResponse.json({ error: "Invalid invite code" }, { status: 400 })

                // add user to pact
                await Pact.findByIdAndUpdate(pact._id, { 
                    $push: { members: user._id } 
                })

                // Update user's pact reference
                await User.findByIdAndUpdate(user._id, { pact: pact._id })

                return NextResponse.json({ pact })
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

