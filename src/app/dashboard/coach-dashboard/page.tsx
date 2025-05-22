"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Activity, Users, Calendar, Star } from "lucide-react"

const stats = [
  {
    label: "Active Clients",
    value: "24",
    icon: Users,
    color: "text-blue-400",
  },
  {
    label: "Sessions This Week",
    value: "12",
    icon: Calendar,
    color: "text-purple-400",
  },
  {
    label: "Average Rating",
    value: "4.9",
    icon: Star,
    color: "text-yellow-400",
  },
  {
    label: "Hours Coached",
    value: "156",
    icon: Activity,
    color: "text-green-400",
  },
]

export default function CoachHome() {
  return (
    <div className="max-w-7xl p-4 mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, Coach</h1>
        <p className="text-gray-300">Here's an overview of your coaching activities</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-lg bg-white/10 border-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <span className="text-3xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-gray-300">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

