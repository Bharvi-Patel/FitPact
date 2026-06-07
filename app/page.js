export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-white">Fit<span className="text-green-400">Pact</span></h1>
      <p className="text-gray-400 mt-4 text-lg">Workout with friends. No excuses.</p>
      <button className="mt-8 bg-green-400 text-black font-bold px-8 py-3 rounded-full hover:bg-green-300 transition">
        Get Started
      </button>
    </main>
  )
}