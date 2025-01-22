"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Calendar, Star, Clock, Award, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Coach {
  id: number
  name: string
  specialty: string
  rating: number
  experience: string
  price: string
  availability: string
  clients: number
  image: string
}

const coaches: Coach[] = [
  {
    id: 1,
    name: "Alex Thompson",
    specialty: "Strength & Conditioning",
    rating: 4.9,
    experience: "8 years",
    price: "$75/hour",
    availability: "Mon-Fri",
    clients: 120,
    image: "/images/coach1.jpg",
  },
  {
    id: 2,
    name: "Sarah Chen",
    specialty: "HIIT & Cardio",
    rating: 4.8,
    experience: "6 years",
    price: "$65/hour",
    availability: "Weekends",
    clients: 90,
    image: "/images/coach2.jpg",
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    specialty: "Sports Performance",
    rating: 4.7,
    experience: "10 years",
    price: "$85/hour",
    availability: "Flexible",
    clients: 150,
    image: "/images/coach3.jpg",
  },
]

export default function CoachesPage() {
  const [activeTab, setActiveTab] = useState<"book" | "hire">("book")

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Coach</h1>
        <p className="text-gray-300">Choose between instant booking or hiring from our elite roster</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("book")}
          className={`px-6 py-3 rounded-xl backdrop-blur-md transition-all duration-300 ${
            activeTab === "book" ? "bg-white/20 text-white shadow-lg" : "bg-white/5 text-gray-300"
          }`}
        >
          Quick Booking
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("hire")}
          className={`px-6 py-3 rounded-xl backdrop-blur-md transition-all duration-300 ${
            activeTab === "hire" ? "bg-white/20 text-white shadow-lg" : "bg-white/5 text-gray-300"
          }`}
        >
          Hire a Coach
        </motion.button>
      </div>

      {/* Content Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {activeTab === "book" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden backdrop-blur-lg bg-white/10 border-0">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={coach.image || "/placeholder.svg"}
                          alt={coach.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{coach.name}</h3>
                        <p className="text-blue-300">{coach.specialty}</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Star className="w-5 h-5 mr-2 text-yellow-400" />
                        <span>{coach.rating} Rating</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        <span>{coach.availability}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Award className="w-5 h-5 mr-2 text-purple-400" />
                        <span>{coach.experience}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Book Session ({coach.price})
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "hire" && (
          <div className="space-y-6">
            {coaches.map((coach) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden backdrop-blur-lg bg-white/10 border-0">
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden">
                      <img
                        src={coach.image || "/placeholder.svg"}
                        alt={coach.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-white mb-2">{coach.name}</h3>
                          <p className="text-blue-300 text-lg">{coach.specialty}</p>
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-5 h-5 mr-1" />
                          <span>{coach.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-5 h-5 mr-2 text-blue-400" />
                          <span>{coach.availability}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Award className="w-5 h-5 mr-2 text-purple-400" />
                          <span>{coach.experience}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Users className="w-5 h-5 mr-2 text-green-400" />
                          <span>{coach.clients} Clients</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xl text-white font-semibold">{coach.price}</p>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          View Full Profile <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

