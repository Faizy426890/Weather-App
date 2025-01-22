"use client"

import { motion } from "framer-motion"
import { Star, Clock, Users, MapPin } from "lucide-react"

const games = [
  {
    id: 1,
    name: "Cricket",
    description: "Experience the thrill of cricket with friends and family in local parks or professional stadiums.",
    rating: 4.8,
    duration: "3-7 hours",
    players: "11 players per team",
    location: "Cricket Ground",
    image: "/images/cricket.jpg",
  },
  {
    id: 2,
    name: "Football",
    description: "Engage in the world's most popular sport, kicking the ball and scoring goals with your team.",
    rating: 4.9,
    duration: "90 minutes",
    players: "11 players per team",
    location: "Football Field",
    image: "/images/football.jpg",
  },
  {
    id: 3,
    name: "Baseball",
    description: "Step up to the plate and experience America's favorite pastime with friends and family.",
    rating: 4.7,
    duration: "3 hours avg.",
    players: "9 players per team",
    location: "Baseball Diamond",
    image: "/images/baseball.jpg",
  },
  {
    id: 4,
    name: "Tennis",
    description: "Serve, rally, and volley your way to victory in this fast-paced and exciting racket sport.",
    rating: 4.6,
    duration: "1-3 hours",
    players: "Singles or Doubles",
    location: "Tennis Court",
    image: "/images/tennis.jpg",
  },
  {
    id: 5,
    name: "Badminton",
    description: "Enjoy a fun and energetic game of badminton, perfect for both casual play and competitive matches.",
    rating: 4.5,
    duration: "30-60 minutes",
    players: "Singles or Doubles",
    location: "Badminton Court",
    image: "/images/badmintion.jpg",
  },
]

export function GameSuggestions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-purple-500/20 via-pink-500/20 to-red-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent mb-6">
          Recommended Sports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2">{game.description}</p>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{game.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{game.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{game.players}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{game.location}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600"
                >
                  Interested
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

