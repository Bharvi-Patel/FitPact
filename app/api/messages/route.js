import { connectDB } from "@/lib/mongodb"
import Message from "@/models/Message"
import User from "@/models/User"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

// GET — fetch messages for current user's pact
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user.pact) return NextResponse.json({ messages: [] })

    const messages = await Message.find({ pact: user.pact })
      .populate("user", "name image")
      .sort({ createdAt: 1 })
      .limit(50)

    return NextResponse.json({ messages })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — send a message
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user.pact) return NextResponse.json({ error: "Join a pact first!" }, { status: 400 })

    const { text, isAI } = await request.json()
    if (!text) return NextResponse.json({ error: "Message is empty!" }, { status: 400 })

    const message = await Message.create({
      pact: user.pact,
      user: isAI ? null : user._id,
      text,
      isAI: isAI || false,
    })

    const populated = await Message.findById(message._id).populate("user", "name image")

    return NextResponse.json({ message: populated })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}