import Groq from "groq-sdk"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a fitness coach creating a weekly workout plan.

Person's name: ${user.name.split(" ")[0]}
Weekly goal: ${user.weeklyGoal} days per week
Current streak: ${user.streak} days
Fitness level: intermediate

Create a ${user.weeklyGoal}-day workout plan for this week.
Format it exactly like this for each day:
Day 1: [workout name] - [3-4 exercises with sets/reps]
Day 2: [workout name] - [3-4 exercises with sets/reps]
...and so on.

Keep it practical, motivating, and achievable. No long intros.`
        }
      ]
    })

    const plan = completion.choices[0].message.content
    return NextResponse.json({ plan })

  } catch (error) {
    console.error("PLAN ERROR:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}