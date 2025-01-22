"use client"
import React from "react"
import { motion, useAnimation } from "framer-motion"
import { Cloud, Sun, CloudRain, Moon } from "lucide-react"
import { useEffect } from "react"

export function WeatherWidget() {
  const controls = useAnimation()
  const [isClient, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure animations are rendered only on the client
    controls.start({
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  if (!isClient) return null;

  return (
    <div className="bg-gradient-to-br rounded-lg from-slate-950 via-blue-950 to-slate-950 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-6xl mx-auto backdrop-blur-xl bg-white/5 rounded-3xl p-8 overflow-hidden border border-white/10"
      >
        {/* Enhanced background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-6 bg-white/5 rounded-2xl p-6 backdrop-blur-lg border border-white/10">
              <motion.div animate={controls} className="relative">
                <div className="absolute inset-0 bg-blue-400/30 blur-2xl rounded-full" />
                <div className="relative bg-gradient-to-br from-blue-600/30 to-blue-400/30 p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                  <CloudRain size={52} className="relative z-10 text-blue-300" />
                </div>
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-300/90">Current Weather</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-7xl font-bold bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent mt-2">
                    22
                  </p>
                  <span className="text-3xl font-semibold text-white/70">°C</span>
                </div>
                <p className="text-gray-400 mt-1 font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400/70" />
                  Rainy
                </p>
              </div>
            </div>

            <div className="space-y-3 backdrop-blur-lg bg-white/5 rounded-xl p-5 border border-white/10">
              <p className="text-sm text-gray-300 flex justify-between items-center">
                Precipitation
                <span className="text-blue-300 font-semibold bg-blue-500/10 px-2 py-1 rounded-md">62%</span>
              </p>
              <p className="text-sm text-gray-300 flex justify-between items-center">
                Humidity
                <span className="text-blue-300 font-semibold bg-blue-500/10 px-2 py-1 rounded-md">85%</span>
              </p>
              <p className="text-sm text-gray-300 flex justify-between items-center">
                Wind
                <span className="text-blue-300 font-semibold bg-blue-500/10 px-2 py-1 rounded-md">12 km/h</span>
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10">
                <h4 className="text-sm font-medium text-gray-300">24-hour forecast</h4>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-blue-300 hover:text-blue-200 bg-blue-500/10 px-4 py-2 rounded-lg backdrop-blur-md border border-blue-500/20 transition-colors"
                >
                  View detailed forecast
                </motion.button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => {
                  const hour = i * 3
                  const isNight = hour < 6 || hour > 18
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="backdrop-blur-md bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <p className="text-sm text-gray-400 text-center">{`${hour}:00`}</p>
                      <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="my-3 relative">
                        <div className="absolute inset-0 blur-xl opacity-50">
                          {isNight ? (
                            <Moon className="mx-auto text-purple-400" />
                          ) : i % 2 === 0 ? (
                            <Cloud className="mx-auto text-blue-400" />
                          ) : (
                            <Sun className="mx-auto text-yellow-400" />
                          )}
                        </div>
                        {isNight ? (
                          <Moon className="mx-auto text-purple-300 relative z-10" />
                        ) : i % 2 === 0 ? (
                          <Cloud className="mx-auto text-blue-300 relative z-10" />
                        ) : (
                          <Sun className="mx-auto text-yellow-300 relative z-10" />
                        )}
                      </motion.div>
                      <p className="text-lg font-medium text-white text-center">{20 + i}°</p>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-6">
                <div className="h-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full overflow-hidden backdrop-blur-xl">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className="h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400"
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

