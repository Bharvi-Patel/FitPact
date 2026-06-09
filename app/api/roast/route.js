import Groq from "groq-sdk"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const { targetUserId } = await request.json()

    const targetUser = await User.findById(targetUserId)
    if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `You are a savage but funny fitness coach roasting someone for skipping their workout.
          
Person's name: ${targetUser.name.split(" ")[0]}
Current streak: ${targetUser.streak} days
Strikes: ${targetUser.strikes}
Points: ${targetUser.points}

Write a short, funny, savage roast (2-3 sentences max) for missing today's workout.
Be creative, reference their stats, you can be little mean. No emojis in the roast itself.`
        }
      ]
    })

    const roast = completion.choices[0].message.content

    return NextResponse.json({ roast })

  } catch (error) {
    console.error("ROAST ERROR:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}