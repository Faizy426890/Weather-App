"use client"

import React, { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Cloud, CloudRain, Moon, Sun, CloudSnow, Zap, CloudDrizzle, Eye, Wind, Droplets } from "lucide-react"

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

interface WeatherWidgetProps {
  weatherData: any
  forecastData: any
  loading: boolean
  error: string
}

export function WeatherWidget({ weatherData, forecastData, loading, error }: WeatherWidgetProps) {
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

  const getWeatherIcon = (weatherMain: string, isNight = false) => {
    if (isNight) {
      return <Moon className="w-full h-full text-purple-300" />
    }

    switch (weatherMain?.toLowerCase()) {
      case "clear":
        return <SunIcon />
      case "clouds":
        return <Cloud className="w-full h-full text-blue-300" />
      case "rain":
        return <CloudRain className="w-full h-full text-blue-400" />
      case "drizzle":
        return <CloudDrizzle className="w-full h-full text-blue-300" />
      case "thunderstorm":
        return <Zap className="w-full h-full text-yellow-400" />
      case "snow":
        return <CloudSnow className="w-full h-full text-blue-100" />
      default:
        return <SunIcon />
    }
  }

  const getWeatherBackground = (weatherMain: string, isNight = false) => {
    if (isNight) {
      return {
        gradient: "from-slate-950 via-purple-950 to-slate-950",
        accent: "purple",
        particles: "from-purple-500/20 via-blue-500/20 to-purple-500/20",
      }
    }

    switch (weatherMain?.toLowerCase()) {
      case "clear":
        return {
          gradient: "from-slate-950 via-blue-950 to-slate-950",
          accent: "yellow",
          particles: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
        }
      case "clouds":
        return {
          gradient: "from-slate-950 via-gray-800 to-slate-950",
          accent: "gray",
          particles: "from-gray-500/20 via-blue-500/20 to-gray-500/20",
        }
      case "rain":
      case "drizzle":
        return {
          gradient: "from-slate-950 via-blue-900 to-slate-950",
          accent: "blue",
          particles: "from-blue-500/20 via-cyan-500/20 to-blue-500/20",
        }
      case "thunderstorm":
        return {
          gradient: "from-slate-950 via-gray-900 to-slate-950",
          accent: "yellow",
          particles: "from-yellow-500/20 via-purple-500/20 to-yellow-500/20",
        }
      case "snow":
        return {
          gradient: "from-slate-950 via-blue-950 to-slate-950",
          accent: "blue",
          particles: "from-blue-500/20 via-white/20 to-blue-500/20",
        }
      default:
        return {
          gradient: "from-slate-950 via-blue-950 to-slate-950",
          accent: "yellow",
          particles: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
        }
    }
  }

  const isNightTime = () => {
    if (!weatherData) return false
    const currentTime = new Date().getTime() / 1000
    return currentTime < weatherData.sys?.sunrise || currentTime > weatherData.sys?.sunset
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (!isClient) return null

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-3 sm:p-6 lg:p-8 rounded-xl shadow-2xl">
        <div className="relative w-full max-w-6xl mx-auto backdrop-blur-xl bg-white/5 rounded-3xl p-2 sm:p-6 lg:p-8 border border-white/10 shadow-lg">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
            />
            <span className="ml-3 text-white">Loading weather data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 p-3 sm:p-6 lg:p-8 rounded-xl shadow-2xl">
        <div className="relative w-full max-w-6xl mx-auto backdrop-blur-xl bg-white/5 rounded-3xl p-2 sm:p-6 lg:p-8 border border-white/10 shadow-lg">
          <div className="flex items-center justify-center h-64">
            <span className="text-red-300">{error || "Failed to load weather data"}</span>
          </div>
        </div>
      </div>
    )
  }

  const isNight = isNightTime()
  const weatherBg = getWeatherBackground(weatherData.weather[0].main, isNight)
  const temperature = Math.round(weatherData.main.temp)
  const feelsLike = Math.round(weatherData.main.feels_like)

  return (
    <div className={`bg-gradient-to-br ${weatherBg.gradient} p-3 sm:p-6 lg:p-8 rounded-xl shadow-2xl`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-6xl mx-auto backdrop-blur-xl bg-transparent sm:bg-white/5 rounded-3xl p-2 sm:p-6 lg:p-8 border border-white/10 shadow-lg"
      >
        {/* Enhanced background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r ${weatherBg.particles} blur-3xl rounded-full animate-pulse`}
          />
          <div
            className={`absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l ${weatherBg.particles} blur-3xl rounded-full animate-pulse`}
          />
        </div>

        <div className="relative z-10 grid gap-6 lg:gap-8">
          <div className="space-y-6">
            {/* Location and current weather */}
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:bg-white/10">
              <motion.div animate={controls} className="relative w-20 h-20 sm:w-24 sm:h-24">
                <div className={`absolute inset-0 bg-${weatherBg.accent}-400/30 blur-2xl rounded-full`} />
                <div
                  className={`relative bg-gradient-to-br from-${weatherBg.accent}-400/50 to-${weatherBg.accent}-500/50 p-4 rounded-2xl backdrop-blur-md border border-${weatherBg.accent}-500/20 shadow-lg`}
                >
                  {getWeatherIcon(weatherData.weather[0].main, isNight)}
                </div>
              </motion.div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-medium text-gray-100">
                    {weatherData.name}, {weatherData.sys.country}
                  </h3>
                  <span className="text-sm text-gray-300">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-4xl sm:text-7xl font-bold bg-gradient-to-br from-${weatherBg.accent}-200 via-${weatherBg.accent}-100 to-${weatherBg.accent}-200 bg-clip-text text-transparent mt-2`}
                  >
                    {temperature}
                  </p>
                  <span className={`text-2xl sm:text-3xl font-semibold text-${weatherBg.accent}-100/70`}>°C</span>
                </div>
                <p className={`text-${weatherBg.accent}-100 mt-1 font-medium flex items-center gap-2`}>
                  <span className={`inline-block w-2 h-2 rounded-full bg-${weatherBg.accent}-400/70`} />
                  {weatherData.weather[0].description.charAt(0).toUpperCase() +
                    weatherData.weather[0].description.slice(1)}
                </p>
                <p className="text-gray-300 text-sm mt-1">Feels like {feelsLike}°C</p>
              </div>
            </div>

            {/* Weather details */}
            <div className="space-y-3 backdrop-blur-lg bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 transition-all duration-300 hover:bg-white/10">
              <div className="grid grid-cols-2 gap-4">
                <p className="text-sm text-gray-200 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visibility
                  <span
                    className={`text-${weatherBg.accent}-300 font-semibold bg-${weatherBg.accent}-500/10 px-2 py-1 rounded-md ml-auto`}
                  >
                    {Math.round(weatherData.visibility / 1000)} km
                  </span>
                </p>
                <p className="text-sm text-gray-200 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Humidity
                  <span
                    className={`text-${weatherBg.accent}-300 font-semibold bg-${weatherBg.accent}-500/10 px-2 py-1 rounded-md ml-auto`}
                  >
                    {weatherData.main.humidity}%
                  </span>
                </p>
                <p className="text-sm text-gray-200 flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Wind
                  <span
                    className={`text-${weatherBg.accent}-300 font-semibold bg-${weatherBg.accent}-500/10 px-2 py-1 rounded-md ml-auto`}
                  >
                    {Math.round(weatherData.wind?.speed * 3.6)} km/h
                  </span>
                </p>
                <p className="text-sm text-gray-200 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  UV Index
                  <span
                    className={`text-${weatherBg.accent}-300 font-semibold bg-${weatherBg.accent}-500/10 px-2 py-1 rounded-md ml-auto`}
                  >
                    Moderate
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <p className="text-sm text-gray-200">
                  Sunrise:{" "}
                  <span className={`text-${weatherBg.accent}-300 font-semibold`}>
                    {formatTime(weatherData.sys?.sunrise)}
                  </span>
                </p>
                <p className="text-sm text-gray-200">
                  Sunset:{" "}
                  <span className={`text-${weatherBg.accent}-300 font-semibold`}>
                    {formatTime(weatherData.sys?.sunset)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Forecast section */}
          <div>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10">
                <h4 className="text-sm font-medium text-gray-200 mb-2 sm:mb-0">24-hour forecast</h4>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-sm text-${weatherBg.accent}-300 hover:text-${weatherBg.accent}-200 bg-${weatherBg.accent}-500/10 px-4 py-2 rounded-lg backdrop-blur-md border border-${weatherBg.accent}-500/20 transition-colors hover:bg-${weatherBg.accent}-500/20`}
                >
                  View detailed forecast
                </motion.button>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full min-w-[300px] sm:min-w-[500px]">
                  {forecastData?.list?.slice(0, 5).map((item: any, i: number) => {
                    const forecastTime = new Date(item.dt * 1000)
                    const hour = forecastTime.getHours()
                    const isNightForecast = hour < 6 || hour > 18
                    const temp = Math.round(item.main.temp)

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="backdrop-blur-md bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <p className="text-sm text-gray-300 text-center">
                          {forecastTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className="my-2 sm:my-3 relative w-8 h-8 sm:w-10 sm:h-10 mx-auto"
                        >
                          <div className="absolute inset-0 blur-xl opacity-50">
                            {getWeatherIcon(item.weather[0].main, isNightForecast)}
                          </div>
                          {getWeatherIcon(item.weather[0].main, isNightForecast)}
                        </motion.div>
                        <p className={`text-base sm:text-lg font-medium text-${weatherBg.accent}-100 text-center`}>
                          {temp}°
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6">
                <div
                  className={`h-2.5 bg-gradient-to-r from-${weatherBg.accent}-500/10 via-${weatherBg.accent}-500/10 to-${weatherBg.accent}-500/10 rounded-full overflow-hidden backdrop-blur-xl`}
                >
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className={`h-full w-full bg-gradient-to-r from-${weatherBg.accent}-500 via-${weatherBg.accent}-500 to-${weatherBg.accent}-400`}
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
