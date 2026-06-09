"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  function handleCTA() {
    if (status === "authenticated") {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  return (
    <main className="min-h-screen bg-black">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full mb-8">
           Workout accountability for real ones
        </div>
        <h1 className="text-6xl font-bold text-white leading-tight max-w-2xl">
          Your friends will see if you <span className="text-green-400">skip leg day.</span>
        </h1>
        <p className="text-gray-400 text-xl mt-6 max-w-lg">
          Create a pact with friends, log daily workouts, and get publicly roasted by AI when you slack. No excuses.
        </p>
        <button
          onClick={handleCTA}
          className="mt-10 bg-green-400 text-black font-bold px-10 py-4 rounded-full text-lg hover:bg-green-300 transition"
        >
          {status === "authenticated" ? "Go to Dashboard →" : "Start a Pact — it's free"}
        </button>
        <p className="text-gray-600 text-sm mt-4">No credit card. Just accountability.</p>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Create a Pact",
              desc: "Invite your friends with a 6-digit code. Everyone commits to the same workout goal.",
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              )
            },
            {
              step: "02",
              title: "Log Daily",
              desc: "Upload a photo as proof every day. Your streak grows, your friends are watching.",
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              )
            },
            {
              step: "03",
              title: "Slack & Suffer",
              desc: "Miss a day? Get publicly roasted by AI on the group feed. 3 strikes and it gets worse.",
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              )
            },
          ].map((item) => (
            <div key={item.step} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                {item.icon}
                <span className="text-green-400 font-bold text-sm">{item.step}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ranks */}
      <section className="px-6 py-24 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Climb the ranks
          </h2>
          <p className="text-gray-400 text-center mb-16">
            Earn points by showing up. Lose them by slacking.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
                {
                  label: "Beast Mode", points: "500+ pts", color: "text-yellow-400",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                },
                {
                  label: "On Fire", points: "300+ pts", color: "text-orange-400",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                },
                {
                  label: "Grinder", points: "150+ pts", color: "text-blue-400",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                },
                {
                  label: "Casual", points: "50+ pts", color: "text-gray-400",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                },
                {
                  label: "Couch Potato", points: "0+ pts", color: "text-green-300",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-300"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                },
                {
                  label: "Shame Zone", points: "Negative", color: "text-red-400",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                },
              ].map((rank) => (
                <div key={rank.label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex items-center gap-3">
                  {rank.icon}
                  <div>
                    <p className={`font-bold text-sm ${rank.color}`}>{rank.label}</p>
                    <p className="text-gray-500 text-xs">{rank.points}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="px-6 py-24 flex flex-col items-center text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to stop making excuses?
        </h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Your future self will thank you. Your friends will roast you if you don't start.
        </p>
        <button
          onClick={handleCTA}
          className="bg-green-400 text-black font-bold px-10 py-4 rounded-full text-lg hover:bg-green-300 transition"
        >
          {status === "authenticated" ? "Go to Dashboard →" : "Get Started Free →"}
        </button>
      </section>

    </main>
  )
}