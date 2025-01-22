"use client"

import { motion } from "framer-motion"
import { Sun, Cloud, Wind, Droplets } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const weatherData = [
  { time: "00:00", temperature: 18 },
  { time: "03:00", temperature: 16 },
  { time: "06:00", temperature: 15 },
  { time: "09:00", temperature: 17 },
  { time: "12:00", temperature: 22 },
  { time: "15:00", temperature: 24 },
  { time: "18:00", temperature: 21 },
  { time: "21:00", temperature: 19 },
]

const weatherDetails = [
  { icon: Sun, label: "UV Index", value: "3 (Moderate)" },
  { icon: Wind, label: "Wind Speed", value: "15 km/h" },
  { icon: Droplets, label: "Humidity", value: "65%" },
  { icon: Cloud, label: "Cloud Cover", value: "20%" },
]

export function WeatherSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-l from-purple-500/10 via-cyan-500/20 to-purple-500 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-purple-500/10 via-purple-500/10 to-purple-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent mb-4 sm:mb-6">
          Weather Forecast
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Temperature Graph */}
          <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Temperature Trend</h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {weatherDetails.map((detail, index) => (
              <motion.div
                key={detail.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 flex flex-col items-center justify-center"
              >
                <detail.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 mb-2 sm:mb-4" />
                <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 text-center">
                  {detail.label}
                </h4>
                <p className="text-xl sm:text-2xl font-bold text-blue-300 text-center">{detail.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

