"use client"
import React, { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Cloud, CloudRain, Moon } from "lucide-react"

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <circle cx="12" cy="12" r="5" className="text-yellow-300" />
    <g className="text-yellow-100">
      <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
)

export function WeatherWidget() {
  const controls = useAnimation()
  const [isClient, setIsClient] = React.useState(false)

  useEffect(() => {
    setIsClient(true)
    controls.start({
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })
  }, [controls])

  if (!isClient) return null

  return (
    <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-3 sm:p-6 lg:p-8 rounded-xl shadow-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full  max-w-6xl mx-auto backdrop-blur-xl bg-transparent sm:bg-white/5 rounded-3xl p-2 sm:p-6 lg:p-8  border border-white/10 shadow-lg"
      >
        {/* Enhanced background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 via-cyan-500/20 to-teal-500/20 blur-3xl rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 grid gap-6 lg:gap-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:bg-white/10">
              <motion.div animate={controls} className="relative w-20 h-20 sm:w-24 sm:h-24">
                <div className="absolute inset-0 bg-yellow-400/30 blur-2xl rounded-full" />
                <div className="relative bg-gradient-to-br from-yellow-400/50 to-orange-500/50 p-4 rounded-2xl backdrop-blur-md border border-yellow-500/20 shadow-lg">
                  <SunIcon />
                </div>
              </motion.div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-medium text-gray-100">Current Weather</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl sm:text-7xl font-bold bg-gradient-to-br from-yellow-200 via-yellow-100 to-orange-200 bg-clip-text text-transparent mt-2">
                    28
                  </p>
                  <span className="text-2xl sm:text-3xl font-semibold text-yellow-100/70">°C</span>
                </div>
                <p className="text-yellow-100 mt-1 font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-400/70" />
                  Sunny
                </p>
              </div>
            </div>

            <div className="space-y-3  backdrop-blur-lg bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 transition-all duration-300 hover:bg-white/10">
              <p className="text-sm text-gray-200 flex justify-between items-center">
                UV Index
                <span className="text-yellow-300 font-semibold bg-yellow-500/10 px-2 py-1 rounded-md">High</span>
              </p>
              <p className="text-sm text-gray-200 flex justify-between items-center">
                Humidity
                <span className="text-yellow-300 font-semibold bg-yellow-500/10 px-2 py-1 rounded-md">45%</span>
              </p>
              <p className="text-sm text-gray-200 flex justify-between items-center">
                Wind
                <span className="text-yellow-300 font-semibold bg-yellow-500/10 px-2 py-1 rounded-md">8 km/h</span>
              </p>
            </div>
          </div>

          <div>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10">
                <h4 className="text-sm font-medium text-gray-200 mb-2 sm:mb-0">24-hour forecast</h4>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-yellow-300 hover:text-yellow-200 bg-yellow-500/10 px-4 py-2 rounded-lg backdrop-blur-md border border-yellow-500/20 transition-colors hover:bg-yellow-500/20"
                >
                  View detailed forecast
                </motion.button>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full min-w-[300px] sm:min-w-[500px]">
                  {[...Array(5)].map((_, i) => {
                    const hour = i * 3
                    const isNight = hour < 6 || hour > 18
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="backdrop-blur-md bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <p className="text-sm text-gray-300 text-center">{`${hour}:00`}</p>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className="my-2 sm:my-3 relative w-8 h-8 sm:w-10 sm:h-10 mx-auto"
                        >
                          <div className="absolute inset-0 blur-xl opacity-50">
                            {isNight ? (
                              <Moon className="w-full h-full text-purple-400" />
                            ) : i % 2 === 0 ? (
                              <Cloud className="w-full h-full text-blue-400" />
                            ) : (
                              <SunIcon />
                            )}
                          </div>
                          {isNight ? (
                            <Moon className="w-full h-full text-purple-300 relative z-10" />
                          ) : i % 2 === 0 ? (
                            <Cloud className="w-full h-full text-blue-300 relative z-10" />
                          ) : (
                            <SunIcon />
                          )}
                        </motion.div>
                        <p className="text-base sm:text-lg font-medium text-yellow-100 text-center">{24 + i}°</p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6">
                <div className="h-2.5 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-full overflow-hidden backdrop-blur-xl">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className="h-full w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

