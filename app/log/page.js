"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LogWorkout() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!photo) return setError("Upload a photo as proof!")
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("photo", photo)
      formData.append("note", note)

      const res = await fetch("/api/workouts", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.error) return setError(data.error)

      await update()
      router.push("/dashboard")
    } catch (err) {
      setError("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Please sign in first.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black pt-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Log <span className="text-green-400">Workout</span>
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Show your pact you showed up!
        </p>

        {/* Photo Upload */}
        <div
          onClick={() => document.getElementById("photoInput").click()}
          className="w-full h-64 bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl flex items-center justify-center cursor-pointer hover:border-green-400 transition overflow-hidden"
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <div className="text-center flex flex-col items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <p className="text-gray-400">Tap to upload workout photo</p>
              <p className="text-gray-600 text-sm">JPG, PNG supported</p>
            </div>
          )}
        </div>
        <input
          id="photoInput"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />

        {/* Note */}
        <div className="mt-4">
          <textarea
            placeholder="Add a note... (optional) e.g. Chest day done"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-400 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mt-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-green-400 text-black font-bold py-4 rounded-2xl hover:bg-green-300 transition disabled:opacity-50 text-lg"
        >
          {loading ? "Uploading..." : "Submit Workout"}
        </button>
      </div>
    </main>
  )
}