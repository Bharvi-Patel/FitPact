"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getRank } from "@/lib/ranks"
import { useState } from "react"

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      const res = await fetch("/api/user", { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        await signOut({ callbackUrl: "/" })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Please sign in first.</p>
      </main>
    )
  }

  const rank = getRank(session.user.points || 0)

  return (
    <main className="min-h-screen bg-black pt-24 px-6 pb-32">
      <div className="max-w-2xl mx-auto">

        {/* Profile Header */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex items-center gap-6 mb-6">
          <img
            src={session.user.image}
            alt={session.user.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{session.user.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{session.user.email}</p>
            <div className={`flex items-center gap-1 mt-2 ${rank.color}`}>
              <span>{rank.emoji}</span>
              <span className="font-bold text-sm">{rank.label}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Current Streak</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{session.user.streak} 🔥</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Points</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{session.user.points} 🏆</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Strikes</p>
            <p className="text-3xl font-bold text-red-400 mt-1">{session.user.strikes} ⚡</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Weekly Goal</p>
            <p className="text-3xl font-bold text-white mt-1">{session.user.weeklyGoal} days</p>
          </div>
        </div>

        {/* Body Stats */}
        {session.user.bmi && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <p className="text-white font-bold mb-4">Body Stats</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-xs">Height</p>
                <p className="text-white font-bold mt-1">{session.user.height} cm</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Weight</p>
                <p className="text-white font-bold mt-1">{session.user.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">BMI</p>
                <p className="text-white font-bold mt-1">{session.user.bmi}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {session.user.goals?.map(goal => (
                <span key={goal} className="bg-green-400/10 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-400/30">
                  {goal}
                </span>
              ))}
              {session.user.fitnessLevel && (
                <span className="bg-blue-400/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
                  {session.user.fitnessLevel}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Workout Plan */}
        {session.user.workoutPlan && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-bold">Your Workout Plan 💪</p>
              <button
                onClick={() => router.push("/onboarding")}
                className="text-green-400 text-xs hover:text-green-300 transition"
              >
                Regenerate →
              </button>
            </div>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
              {session.user.workoutPlan}
            </pre>
          </div>
        )}

        {/* Actions — only show if needed */}
        {(!session.user.workoutPlan || !session.user.pact) && (
          <div className="flex flex-col gap-3 mb-6">
            {!session.user.workoutPlan && (
              <button
                onClick={() => router.push("/onboarding")}
                className="w-full bg-green-400 text-black font-bold py-3 rounded-full hover:bg-green-300 transition"
              >
                Get My Workout Plan
              </button>
            )}
            {!session.user.pact && (
              <button
                onClick={() => router.push("/pacts")}
                className="w-full bg-gray-800 text-white font-bold py-3 rounded-full hover:bg-gray-700 transition"
              >
                Join or Create a Pact
              </button>
            )}
          </div>
        )}

        {/* Account Actions */}
        <div className="border-t border-gray-800 pt-6 flex flex-col gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full border border-gray-700 text-gray-400 font-bold py-3 rounded-full hover:border-white hover:text-white transition"
          >
            Sign Out
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full border border-red-900 text-red-500 font-bold py-3 rounded-full hover:border-red-500 transition"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <p className="text-white font-bold text-center mb-1">Are you sure?</p>
              <p className="text-gray-400 text-sm text-center mb-4">
                This will delete your account, workouts, and remove you from your pact. This can't be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-gray-700 text-gray-400 font-bold py-2 rounded-full hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 bg-red-500 text-white font-bold py-2 rounded-full hover:bg-red-400 transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}