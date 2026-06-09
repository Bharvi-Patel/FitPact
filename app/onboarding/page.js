"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Onboarding() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    height: "",
    weight: "",
    age: "",
    goals: [],
    fitnessLevel: "",
  })

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function calculateBMI() {
    const heightM = form.height / 100
    const bmi = (form.weight / (heightM * heightM)).toFixed(1)
    return parseFloat(bmi)
  }

  function getBMICategory(bmi) {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" }
    if (bmi < 25) return { label: "Normal", color: "text-green-400" }
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-400" }
    return { label: "Obese", color: "text-red-400" }
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")
    try {
      const bmi = calculateBMI()
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bmi }),
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

  const bmi = form.height && form.weight ? calculateBMI() : null
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  return (
    <main className="min-h-screen bg-black pt-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Let's set up your <span className="text-green-400">profile</span>
        </h1>
        <p className="text-gray-400 text-center mb-8">
          We'll generate a personalized plan just for you
        </p>

        {/* Step indicators */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, ].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition ${
                s <= step ? "bg-green-400" : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Body Stats */}
        {step === 1 && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
            <p className="text-white font-bold text-lg">Body Stats</p>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Height (cm)</label>
              <input
                type="number"
                placeholder="e.g. 175"
                value={form.height}
                onChange={(e) => handleChange("height", e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Weight (kg)</label>
              <input
                type="number"
                placeholder="e.g. 70"
                value={form.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Age</label>
              <input
                type="number"
                placeholder="e.g. 21"
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-400"
              />
            </div>

            {/* BMI Preview */}
            {bmi && (
              <div className="bg-black rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Your BMI</p>
                <p className={`text-2xl font-bold mt-1 ${bmiCategory.color}`}>
                  {bmi} — {bmiCategory.label}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                if (!form.height || !form.weight || !form.age)
                  return setError("Fill all fields!")
                setError("")
                setStep(2)
              }}
              className="bg-green-400 text-black font-bold py-3 rounded-full hover:bg-green-300 transition"
            >
              Next →
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </div>
        )}

        {/* Step 2 — Goal */}
        
        {step === 2 && (
  <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
    <p className="text-white font-bold text-lg">What are your goals?</p>
    <p className="text-gray-400 text-sm">Pick all that apply</p>
    {[
      { value: "Build Muscle" },
      { value: "Lose Weight"},
      { value: "Improve Endurance"},
      { value: "Stay Fit" },
    ].map((g) => (
      <button
        key={g.value}
        onClick={() => {
          const already = form.goals.includes(g.value)
          handleChange(
            "goals",
            already
              ? form.goals.filter((x) => x !== g.value)
              : [...form.goals, g.value]
          )
        }}
        className={`w-full py-4 rounded-xl font-bold transition border ${
          form.goals.includes(g.value)
            ? "bg-green-400 text-black border-green-400"
            : "bg-black text-white border-gray-700 hover:border-green-400"
        }`}
      >
        {g.emoji} {g.value}
      </button>
    ))}
    <div className="flex gap-3">
      <button
        onClick={() => setStep(1)}
        className="flex-1 py-3 rounded-full border border-gray-700 text-gray-400 hover:text-white transition"
      >
        ← Back
      </button>
      <button
        onClick={() => {
          if (form.goals.length === 0) return setError("Pick at least one goal!")
          setError("")
          setStep(3)
        }}
        className="flex-1 bg-green-400 text-black font-bold py-3 rounded-full hover:bg-green-300 transition"
      >
        Next →
      </button>
    </div>
    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
  </div>
)}


        {/* Step-3  */}
        {step === 3 && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
            <p className="text-white font-bold text-lg">Your fitness level?</p>
            {[
              { value: "Beginner", desc: "Just getting started" },
              { value: "Intermediate", desc: "Working out 3-4x/week" },
              { value: "Advanced", desc: "Training seriously 5+x/week" },
            ].map((l) => (
              <button
                key={l.value}
                onClick={() => handleChange("fitnessLevel", l.value)}
                className={`w-full py-4 px-5 rounded-xl font-bold transition border text-left ${
                  form.fitnessLevel === l.value
                    ? "bg-green-400 text-black border-green-400"
                    : "bg-black text-white border-gray-700 hover:border-green-400"
                }`}
              >
                {l.emoji} {l.value}
                <span className={`block text-sm font-normal mt-1 ${
                  form.fitnessLevel === l.value ? "text-black" : "text-gray-400"
                }`}>
                  {l.desc}
                </span>
              </button>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-full border border-gray-700 text-gray-400 hover:text-white transition"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (!form.fitnessLevel) return setError("Pick your fitness level!")
                  setError("")
                  handleSubmit()
                }}
                disabled={loading}
                className="flex-1 bg-green-400 text-black font-bold py-3 rounded-full hover:bg-green-300 transition disabled:opacity-50"
              >
                {loading ? "Generating plan..." : "Generate My Plan "}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </div>
        )}

      </div>
    </main>
  )
}