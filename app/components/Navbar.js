"use client"

import {useSession, signIn, signOut} from "next-auth/react"
import {useRouter} from "next/navigation"

export default function Navbar() {
  const {data: session, status} = useSession()
  const router = useRouter()

  return (
    <nav className="fixed top-0 w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between z-50">
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-bold text-white cursor-pointer"
      >
        Fit<span className="text-green-400">Pact</span>
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
            <img
              src={session.user.image}
              alt="profile"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => signOut()}
            />
          </>
        ) : (
          <>
            <button
              onClick={() => signIn("google")}
              className="text-gray-400 hover:text-white transition"
            >
              Login
            </button>
            <button
              onClick={() => signIn("google")}
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