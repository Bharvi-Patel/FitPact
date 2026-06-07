"use client"

import {useState, useEffect} from "react"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"

export default function Feed(){
    const {data: session, status} = useSession()
    const router = useRouter()
    const [feedData, setFeedData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(status === "authenticated") {
            fetch("/api/feed")
                .then(res => res.json())
                .then(data => {
                    setFeedData(data)
                    setLoading(false)
                })
        }
}, [status])

    if (status === "unauthenticated") {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-gray-400">Please sign in first</p>
            </main>
        )
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-gray-400">Loading feed...</p>
            </main>
        )
    }

    return(
        <main className="min-h-screen bg-black pt-24 px-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Pact <span className="text-green-400">Feed</span>
                </h1>
                <p className="text-gray-400 mb-8">
                    {feedData?.pact?.name && `${feedData.pact.name} · `}{feedData?.members?.length} members
                </p>
                {/* Today's Status */}
                <div  className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
          <p className="text-gray-400 text-sm mb-4">Today's Status</p>
          <div className="flex flex-col gap-3">
            {feedData?.members?.map((member) => (
              <div key={member._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {member.name.split(" ")[0]}
                    </p>
                    <p className="text-gray-500 text-xs">
                      🔥 {member.streak} streak · ⚡ {member.strikes} strikes
                    </p>
                  </div>
                </div>
                {member.loggedToday ? (
                  <span className="bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                     Done
                  </span>
                ) : (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Slacking
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <p className="text-gray-400 text-sm mb-4">Recent Workouts</p>
        <div className="flex flex-col gap-6">
          {feedData?.recentWorkouts?.length === 0 && (
            <p className="text-gray-600 text-center py-8">
              No workouts yet. Be the first! 💪
            </p>
          )}
          {feedData?.recentWorkouts?.map((workout) => (
            <div
              key={workout._id}
              className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4">
                <img
                  src={workout.user.image}
                  alt={workout.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-white font-medium">
                    {workout.user.name.split(" ")[0]}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(workout.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Photo */}
              <img
                src={workout.photoUrl}
                alt="workout"
                className="w-full object-cover max-h-96"
              />

              {/* Note */}
              {workout.note && (
                <div className="p-4">
                  <p className="text-gray-300">{workout.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
    