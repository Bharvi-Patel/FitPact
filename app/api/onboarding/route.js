import Groq from "groq-sdk"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    const { height, weight, age, bmi, goals, fitnessLevel } = await request.json()

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `You are a professional fitness coach creating a personalized weekly workout plan.

Client Profile:
- Name: ${user.name.split(" ")[0]}
- Age: ${age}
- Height: ${height}cm
- Weight: ${weight}kg
- BMI: ${bmi}
- Goals: ${goals.join(", ")}
- Fitness Level: ${fitnessLevel}
- Workout days per week: ${user.weeklyGoal}

Rules:
- Create exactly ${user.weeklyGoal} workout days
- Beginner: bodyweight exercises, low sets/reps (2-3 sets of 8-10 reps), simple movements, no heavy compound lifts
- Intermediate: mix of bodyweight + weights, moderate sets/reps (3-4 sets of 10-12 reps), compound + isolation exercises
- Advanced: heavy compound lifts, high sets/reps (4-5 sets of 12-15 reps), supersets allowed

Format strictly like this, nothing else:
Day 1: [Muscle Group]
- Exercise 1: X sets x Y reps
- Exercise 2: X sets x Y reps
- Exercise 3: X sets x Y reps
- Exercise 4: X sets x Y reps

Day 2: [Muscle Group]
...and so on for all ${user.weeklyGoal} days.

Be specific, practical and tailored to their BMI and goal. No intro text. No explanation. Just the plan.`
        }
      ]
    })

    const workoutPlan = completion.choices[0].message.content

    await User.findByIdAndUpdate(user._id, {
      height: parseFloat(height),
      weight: parseFloat(weight),
      age: parseInt(age),
      bmi: parseFloat(bmi),
      goals,
      fitnessLevel,
      workoutPlan,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("ONBOARDING ERROR:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}