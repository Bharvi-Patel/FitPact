"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getRank } from "@/lib/ranks"

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/leaderboard")
        .then(res => res.json())
        .then(data => setLeaderboard(data.leaderboard || []))
    }
  }, [status])

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".leaderboard-dropdown")) {
        setShowLeaderboard(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const rank = session?.user?.points !== undefined ? getRank(session.user.points) : null

  return (
    <nav className="fixed top-0 w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between z-50">
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-bold text-white cursor-pointer"
      >
        Fit<span className="text-green-500">Pact</span>
      </h1>

      <div className="flex items-center gap-4">
        {status === "authenticated" ? (
          <>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 hover:text-white transition text-sm"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/feed")}
              className="text-gray-400 hover:text-white transition text-sm"
            >
              Feed
            </button>
            <button
              onClick={() => router.push("/log")}
              className="bg-green-400 text-black font-bold px-4 py-2 rounded-full hover:bg-green-300 transition text-sm"
            >
              Log Workout
            </button>

            {/* Points + Leaderboard Dropdown */}
            <div className="relative leaderboard-dropdown">
              <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition"
            >
              <span>{rank?.emoji}</span>
              <span className="text-sm font-bold">{session.user.points} pts</span>
              <span className="text-xs">▼</span>
            </button>

              {/* Dropdown */}
              {showLeaderboard && (
              <div className="absolute right-0 top-10 w-56 p-2">
                <div className="flex flex-col">
                  {leaderboard.length === 0 ? (
                    <p className="text-gray-500 text-xs px-1">Join a pact to see standings!</p>
                  ) : (
                    leaderboard.map((member, index) => {
                      const memberRank = getRank(member.points)
                      const isMe = member.email === session.user.email
                      return (
                        <div
                          key={member._id}
                          className="flex items-center justify-between px-1 py-1"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-xs w-3">{index + 1}</span>
                            <img src={member.image} className="w-5 h-5 rounded-full" />
                            <div>
                              <p className={`text-xs font-medium ${isMe ? "text-green-400" : "text-gray-300"}`}>
                                {member.name.split(" ")[0]} {isMe && "· you"}
                              </p>
                              <p className="text-gray-600 text-xs">{memberRank.emoji} {memberRank.label}</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-xs font-bold">{member.points} pts</p>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
            </div>  {/* ← closes relative div */}

            <img
              src={session.user.image}
              alt="profile"
              className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition"
              onClick={() => router.push("/profile")}
            />
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="text-gray-400 hover:text-white transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/login")}
              className="bg-green-400 text-black font-bold px-4 py-2 rounded-full hover:bg-green-300 transition"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  )
}