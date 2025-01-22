"use client"

import { motion } from "framer-motion"
import { WeatherSection } from "./components/weather-section"
import { GameSuggestions } from "./components/game-suggestions"

export default function GameSuggestionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              Game Suggestions
            </h1>
            <p className="text-gray-400 mt-2">Discover the perfect game based on the weather</p>
          </div>
        </motion.div>

        {/* Weather Section */}
        <WeatherSection />

        {/* Game Suggestions */}
        <GameSuggestions />
      </div>
    </div>
  )
}

