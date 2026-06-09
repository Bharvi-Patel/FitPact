import GoogleProvider from "next-auth/providers/google"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB()
        const existingUser = await User.findOne({ email: user.email })
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          })
        }
        return true
      } catch (error) {
        return false
      }
    },
    async session({ session }) {
      try {
        await connectDB()
        const dbUser = await User.findOne({ email: session.user.email })
        if (dbUser) {
          session.user.id = dbUser._id.toString()
          session.user.streak = dbUser.streak
          session.user.strikes = dbUser.strikes
          session.user.weeklyGoal = dbUser.weeklyGoal
          session.user.pact = dbUser.pact
          session.user.points = dbUser.points
          session.user.bmi = dbUser.bmi
          session.user.goals = dbUser.goals
          session.user.workoutPlan = dbUser.workoutPlan
          session.user.height = dbUser.height
          session.user.weight = dbUser.weight
          session.user.fitnessLevel = dbUser.fitnessLevel
          session.user.onboarded = !!dbUser.workoutPlan
        }
        return session
      } catch (error) {
        return session
      }
    }
  }
}