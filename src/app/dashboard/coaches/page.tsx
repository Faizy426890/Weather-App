"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Award, Code, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import BookingModal from "./booking-modal"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
interface CoachDetails {
  _id: string
  yearsOfExperience: number
  userId: string
  certification: string[]
  specialities: string[]
  preferredSessionDuration: string
  bio: string
  languages: string[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface Coach {
  _id: string
  clerkId: string
  __v: number
  achievements: any[]
  bio: string
  coaches: any[]
  createdSessions: any[]
  createdTournaments: any[]
  email: string
  firstName: string
  friendRequests: any[]
  friends: any[]
  invitedSessions: any[]
  invitedSessionsAsCoach: string[]
  invitedTournaments: any[]
  isCoach: string
  lastName: string
  profileImageUrl: string
  role: string
  sentRequests: any[]
  coachDetails: CoachDetails
}

interface CoachesResponse {
  coaches: Coach[]
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/coaches`)
        if (!response.ok) {
          throw new Error("Failed to fetch coaches")
        }
        const data: CoachesResponse = await response.json()
        setCoaches(data.coaches)
      } catch (error) {
        console.error("Error fetching coaches:", error)
       toast.error("Failed to load coaches. Please try again later.");

      } finally {
        setLoading(false)
      }
    }

    fetchCoaches()
  }, [toast])

  const handleBookSession = (coach: Coach) => {
    setSelectedCoach(coach)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Coach</h1>
        <p className="text-gray-300">Browse our elite roster of professional coaches</p>
      </motion.div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? // Skeleton loading
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden backdrop-blur-lg bg-white/10 border-0 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </Card>
            ))
          : coaches.map((coach) => (
              <motion.div
                key={coach._id}
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
                          src={coach.profileImageUrl || "/placeholder.svg?height=64&width=64"}
                          alt={`${coach.firstName} ${coach.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{`${coach.firstName} ${coach.lastName}`}</h3>
                        <p className="text-blue-300">{coach.coachDetails.specialities[0] || "Coach"}</p>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="flex items-center text-gray-300 mb-2">
                        <Globe className="w-5 h-5 mr-2 text-emerald-400" />
                        <span>Languages</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {coach.coachDetails.languages.map((language, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-emerald-900/30 text-emerald-300 border-emerald-700"
                          >
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Specialities */}
                    <div className="mb-4">
                      <div className="flex items-center text-gray-300 mb-2">
                        <Code className="w-5 h-5 mr-2 text-purple-400" />
                        <span>Specialities</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {coach.coachDetails.specialities.map((specialty, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-purple-900/30 text-purple-300 border-purple-700"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        <span>{coach.coachDetails.preferredSessionDuration}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Award className="w-5 h-5 mr-2 text-amber-400" />
                        <span>{coach.coachDetails.yearsOfExperience} years experience</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleBookSession(coach)}
                    >
                      Book Session
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Booking Modal */}
      {selectedCoach && (
        <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} coach={selectedCoach} />
      )}
    </div>
  )
}
