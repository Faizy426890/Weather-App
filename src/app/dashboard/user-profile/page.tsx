"use client"

import { motion } from "framer-motion"
import { Bell, LogOut, UserX, Users, ChevronRight, Award, Calendar, Mail } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

const userProfile = {
  name: "Ahsan Shahzad",
  username: "@ahsan212",
  joinDate: "May 15, 2023",
  bio: "Sports enthusiast | Always up for a game | Let's play!",
  invites: 23,
  badges: [
    { name: "Pro Player", icon: Award, color: "bg-yellow-500" },
    { name: "Team Captain", icon: Users, color: "bg-blue-500" },
    { name: "Event Organizer", icon: Calendar, color: "bg-green-500" },
  ],
}

const settingOptions = [
  { name: "Notifications", icon: Bell },
  { name: "Logout", icon: LogOut },
  { name: "Block User", icon: UserX },
  { name: "Switch User", icon: Users },
]

export default function UserProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" w-full sm:max-w-6xl mx-auto relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                src="/images/user.jpg"
                alt={userProfile.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-white/20"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"
              />
            </motion.div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                {userProfile.name}
              </h1>
              <p className="text-blue-400 mb-2">{userProfile.username}</p>
              <p className="text-gray-400 mb-4">{userProfile.bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {userProfile.badges.map((badge, index) => (
                  <TooltipProvider key={badge.name}>
                    <Tooltip>
                      <TooltipTrigger>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          <Badge variant="secondary" className={`${badge.color} text-white px-3 py-1`}>
                            <badge.icon className="w-4 h-4 mr-1" />
                            {badge.name}
                          </Badge>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Earned for exceptional performance</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {userProfile.joinDate}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>{userProfile.invites} invites</span>
                  <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {userProfile.invites}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settingOptions.map((option, index) => (
                <motion.div
                  key={option.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors duration-200 cursor-pointer group"
                >
                  {option.name === "Notifications" ? (
                    <div className="flex items-center">
                      <option.icon className="w-5 h-5 text-blue-400 mr-3" />
                      <span className="text-white">{option.name}</span>
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">New</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <option.icon className="w-5 h-5 text-blue-400 mr-3" />
                      <span className="text-white">{option.name}</span>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-semibold text-white mb-2">Ready to play?</h2>
            <p className="text-gray-300 mb-4">Join a game or create your own event!</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              Find a Game
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

