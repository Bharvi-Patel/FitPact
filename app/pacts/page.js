"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Pacts() {
  const { data: session } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState("create") // "create" or "join"
  const [pactName, setPactName] = useState("")
  const [weeklyGoal, setWeeklyGoal] = useState(6)
  const [inviteCode, setInviteCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleCreate() {
    if (!pactName) return setError("Enter a pact name!")
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/pacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", name: pactName, weeklyGoal }),
      })
      const data = await res.json()
      if (data.error) return setError(data.error)
      router.push("/dashboard")
    } catch (err) {
      setError("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin() {
    if (!inviteCode) return setError("Enter an invite code!")
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/pacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", inviteCode }),
      })
      const data = await res.json()
      if (data.error) return setError(data.error)
      router.push("/dashboard")
    } catch (err) {
      setError("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black pt-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Start a <span className="text-green-400">Pact</span>
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Workout together. No excuses.
        </p>

        {/* Tabs */}
        <div className="flex bg-gray-900 rounded-full p-1 mb-8">
          <button
            onClick={() => setTab("create")}
            className={`flex-1 py-2 rounded-full font-bold transition text-sm ${
              tab === "create"
                ? "bg-green-400 text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Create Pact
          </button>
          <button
            onClick={() => setTab("join")}
            className={`flex-1 py-2 rounded-full font-bold transition text-sm ${
              tab === "join"
                ? "bg-green-400 text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Join Pact
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        {/* Create Form */}
        {tab === "create" && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Pact Name</label>
              <input
                type="text"
                placeholder="e.g. Scouts "
                value={pactName}
                onChange={(e) => setPactName(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Weekly Goal — {weeklyGoal} days/week
              </label>
              <input
                type="range"
                min={3}
                max={7}
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                className="w-full accent-green-400"
              />
              <div className="flex justify-between text-gray-600 text-xs mt-1">
                <span>3 days</span>
                <span>7 days</span>
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-green-400 text-black font-bold py-3 rounded-full hover:bg-green-300 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Pact "}
            </button>
          </div>
        )}

        {/* Join Form */}
        {tab === "join" && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Invite Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit code e.g. AB12CD"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-400 uppercase"
              />
            </div>
            <button
              onClick={handleJoin}
              disabled={loading}
              className="bg-green-400 text-black font-bold py-3 rounded-full hover:bg-green-300 transition disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Pact "}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}