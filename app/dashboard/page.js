"use client"

import {useSession} from "next-auth/react"
import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"

export default function Dashboard() {
    const {data: session, status} = useSession()
    const [greeting, setGreeting] = useState("")
    const [pact, setPact] = useState(null)
    const [loadingPact, setLoadingPact] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting("Good Morning")
        else if (hour < 17) setGreeting("Good Afternoon")
        else setGreeting("Good Evening")
    }, [])

      useEffect(() => {
        if (status === "authenticated") {
          fetch("/api/pacts")
            .then((res) => res.json())
            .then((data) => {
              setPact(data.pact)
              setLoadingPact(false)
            })
        }
      }, [status])

       // Redirect to onboarding if not onboarded yet
      useEffect(() => {
        if (status === "authenticated" && session?.user?.onboarded === false) {
          router.push("/onboarding")
        }
      }, [status, session])

    if (status === "loading") {
      return (
        <main className="min-h-screen bg-black flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </main>
      )
    }

    if( status === "unauthenticated") {
      return(
        <main className="min-h-screen bg-black flex items-center justify-center">
          <p className="text-gray-400">Please sign in to view your dashboard.</p>
        </main>
      )
    }

   

  return (
    <main className="min-h-screen bg-black pt-24 px-6">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white">
              {greeting}, {session.user.name.split(" ")[0]}
            </h1>

        <p className="text-gray-400 mt-2">Here's your daily progress</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">Current Streak</p>
            <p className="text-4xl font-bold text-green-400 mt-1">
              {session.user.streak} 
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">Weekly Goal</p>
            <p className="text-4xl font-bold text-white mt-1">
              {session.user.weeklyGoal} days
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">Strikes</p>
            <p className="text-4xl font-bold text-red-400 mt-1">
              {session.user.strikes} 
            </p>
          </div>
        </div>

        {/* Pact Status */}
        <div className="mt-6 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          {loadingPact ? (
            <p className="text-gray-400">Loading pact...</p>
          ) : pact ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Your Pact</p>
                  <p className="text-white font-bold text-xl mt-1">{pact.name} </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Invite Code</p>
                  <p className="text-green-400 font-bold text-xl mt-1 tracking-widest">
                    {pact.inviteCode}
                  </p>
                </div>
              </div>
              {/* Members */}
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Members ({pact.members.length})</p>
                <div className="flex gap-2">
                  {pact.members.map((member) => (
                    <div key={member._id} className="flex items-center gap-2 bg-black rounded-full px-3 py-1">
                      <img src={member.image} className="w-6 h-6 rounded-full" />
                      <span className="text-white text-sm">{member.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-500">You are not in a pact yet.</p>
              <button
                onClick={() => router.push("/pacts")}
                className="bg-green-400 text-black font-bold px-4 py-2 rounded-full hover:bg-green-300 transition"
              >
                Join or Create a Pact
              </button>
            </div>
          )}
        </div>

        {/* Points */}
        <div className="mt-6 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Your Points</p>
          <p className="text-4xl font-bold text-yellow-400 mt-1">{session.user.points} pts </p>
        </div>

        {/* Workout + Diet Plan */}
        {session.user.workoutPlan ? (
          <div className="mt-6 grid grid-cols-1 gap-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white font-bold text-lg">Your Workout Plan </p>
                <span className="text-green-400 text-sm">{session.user.goals?.join(", ")}</span>
              </div>
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {session.user.workoutPlan}
              </pre>
            </div>
            
    
          </div>
        ) : (
          <div className="mt-6 bg-gray-900 rounded-2xl p-6 border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-white font-bold">No plan yet</p>
              <p className="text-gray-400 text-sm mt-1">Set up your profile to get a personalized plan</p>
            </div>
            <button
              onClick={() => router.push("/onboarding")}
              className="bg-green-400 text-black font-bold px-4 py-2 rounded-full hover:bg-green-300 transition text-sm"
            >
              Get My Plan 
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

