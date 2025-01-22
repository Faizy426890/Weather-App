"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Static event data
const events = [
  {
    id: 1,
    name: "Summer Football Championship",
    sport: "Football",
    location: "City Sports Complex",
    startDate: "2024-06-15T09:00",
    endDate: "2024-06-15T18:00",
    maxMembers: 22,
    currentMembers: 16,
    status: "Upcoming",
  },
  {
    id: 2,
    name: "Cricket Premier League",
    sport: "Cricket",
    location: "National Stadium",
    startDate: "2024-07-01T10:00",
    endDate: "2024-07-01T20:00",
    maxMembers: 30,
    currentMembers: 25,
    status: "Registration Closing",
  },
  {
    id: 3,
    name: "Badminton Tournament",
    sport: "Badminton",
    location: "Indoor Sports Hall",
    startDate: "2024-06-20T14:00",
    endDate: "2024-06-20T20:00",
    maxMembers: 16,
    currentMembers: 8,
    status: "Open",
  },
]

const sports = ["Football", "Cricket", "Badminton", "Basketball", "Tennis", "Table Tennis", "Volleyball", "Hockey"]

export default function EventManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 mb-8 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              Sports Events
            </h1>
            <p className="text-gray-400 mt-2">Manage and track your sports tournaments</p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 group"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{event.name}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                      {event.sport}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      event.status === "Open"
                        ? "bg-green-500/20 text-green-300"
                        : event.status === "Registration Closing"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div>{new Date(event.startDate).toLocaleDateString()}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(event.startDate).toLocaleTimeString()} -{" "}
                        {new Date(event.endDate).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span>
                          {event.currentMembers}/{event.maxMembers} members
                        </span>
                        <span className="text-gray-400">
                          {Math.round((event.currentMembers / event.maxMembers) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.currentMembers / event.maxMembers) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 
                    border border-white/10 rounded-xl text-white font-medium
                    transition-colors duration-200"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Event Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent mb-6">
              Create New Event
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Event Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter event name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300">
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter event location"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sport" className="text-gray-300">
                    Sport
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 text-gray-300">
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {sports.map((sport) => (
                        <SelectItem key={sport} value={sport.toLowerCase()}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxMembers" className="text-gray-300">
                    Maximum Players
                  </Label>
                  <Input
                    id="maxMembers"
                    type="number"
                    placeholder="Enter maximum players"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-300">
                    Start Date & Time
                  </Label>
                  <Input id="startDate" type="datetime-local" className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-gray-300">
                    End Date & Time
                  </Label>
                  <Input id="endDate" type="datetime-local" className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>

              <div className="md:col-span-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 
                    hover:to-purple-500/30 rounded-xl text-white font-medium border border-white/10 
                    transition-all duration-200"
                >
                  Create Event
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

