"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"

export default function Feed() {
  const { data: session, status } = useSession()
  const [feedData, setFeedData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/feed")
        .then(res => res.json())
        .then(data => {
          setFeedData(data)
          setLoading(false)
        })
      fetchMessages()
    }
  }, [status])

  useEffect(() => {
    if (status !== "authenticated") return
    const interval = setInterval(fetchMessages, 30000)
    return () => clearInterval(interval)
  }, [status])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchMessages() {
    const res = await fetch("/api/messages")
    const data = await res.json()
    if (data.messages) setMessages(data.messages)
  }

  async function handleSendMessage() {
    if (!newMessage.trim()) return
    setSending(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMessage })
      })
      const data = await res.json()
      if (data.message) {
        setMessages(prev => [...prev, data.message])
        setNewMessage("")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Please sign in first.</p>
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

  return (
    <main className="min-h-screen bg-black pt-24 px-6 pb-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          Pact <span className="text-green-400">Feed</span>
        </h1>
        <p className="text-gray-400 mb-6">
          {feedData?.pact?.name && `${feedData.pact.name} · `}{feedData?.members?.length} members
        </p>

        {/* Today's Status — clean, no buttons */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">Today's Status</p>
          <div className="flex flex-col gap-3">
            {feedData?.members?.map((member) => (
              <div key={member._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-9 h-9 rounded-full"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${member.loggedToday ? "bg-green-400" : "bg-red-500"}`} />
                  </div>
                  <p className="text-white text-sm font-medium">
                    {member.name.split(" ")[0]}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">{member.streak} day streak</p>
                    <p className="text-gray-600 text-xs">{member.strikes} strikes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Chat */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <p className="text-white font-bold">Pact Chat</p>
            <p className="text-gray-500 text-xs mt-0.5">Workouts and roasts appear here</p>
          </div>

          {/* Messages */}
          <div className="p-4 flex flex-col gap-4 h-96 overflow-y-auto">
            {messages.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-8">
                No messages yet. Start the conversation.
              </p>
            )}
            {messages.map((msg) => {
              const isMe = msg.user?._id === session.user.id

              // AI Roast message
              if (msg.isAI) {
                return (
                  <div key={msg._id} className="flex justify-center">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-3 max-w-xs">
                      <p className="text-orange-400 text-xs font-bold mb-1">AI Roast</p>
                      <p className="text-orange-300 text-sm italic">{msg.text}</p>
                    </div>
                  </div>
                )
              }

              // Workout log message
              if (msg.isWorkout) {
                return (
                  <div key={msg._id} className="flex justify-center">
                    <div className="bg-green-400/5 border border-green-400/20 rounded-2xl overflow-hidden max-w-xs w-full">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-green-400/10">
                        <img src={msg.user?.image} className="w-5 h-5 rounded-full" />
                        <p className="text-white-400 text-xs font-bold">{msg.user?.name?.split(" ")[0]} logged a workout</p>
                      </div>
                      {msg.photoUrl && (
                        <img src={msg.photoUrl} alt="workout" className="w-full max-h-48 object-cover" />
                      )}
                      {msg.text && msg.text !== "workout" && (
                        <p className="text-gray-300 text-xs px-3 py-2">{msg.text}</p>
                      )}
                    </div>
                  </div>
                )
              }

              // Regular message
              return (
                <div
                  key={msg._id}
                  className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  <img
                    src={msg.user?.image}
                    className="w-7 h-7 rounded-full flex-shrink-0 mt-1"
                  />
                  <div className={`max-w-xs flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                    {!isMe && (
                      <p className="text-gray-500 text-xs px-1">
                        {msg.user?.name?.split(" ")[0]}
                      </p>
                    )}
                    <div className={`px-4 py-2 rounded-2xl text-sm ${
                      isMe ? "bg-green-400 text-black" : "bg-gray-800 text-white"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800 flex gap-3">
            <input
              type="text"
              placeholder="Send a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-black border border-gray-700 rounded-full px-4 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              className="bg-green-400 text-black font-bold px-5 py-2 rounded-full hover:bg-green-300 transition disabled:opacity-50 text-sm"
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}