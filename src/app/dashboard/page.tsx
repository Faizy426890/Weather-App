'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherWidget } from './Components/WeatherWidget';
import { StatsWidget } from './Components/StatsWidget';
import { AlertWidget } from './Components/AlertWidget';
export default function Dashboard() {
  const [stepsData, setStepsData] = useState(Array.from({ length: 24 }, () => ({ value: 0 })));
  const [heartRateData, setHeartRateData] = useState(Array.from({ length: 24 }, () => ({ value: 0 })));
  const [caloriesData, setCaloriesData] = useState(Array.from({ length: 24 }, () => ({ value: 0 })));
  
  const [isClient, setIsClient] = useState(false); 
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiKey = '6745c98c8992f382217f7d45c36aba00';
          
          const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
          
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

          Promise.all([
            fetch(currentWeatherUrl).then(response => response.json()),
            fetch(forecastUrl).then(response => response.json())
          ])
          .then(([currentData, forecastData]) => {
            setWeatherData(currentData);
            setForecastData(forecastData);
            setLoading(false);
          })
          .catch(error => {
            console.error('Fetch error:', error);
            setErrorMsg('Failed to fetch weather data.');
            setLoading(false);
          });
        },
        function (error) {
          console.error('Geolocation error:', error);
          setErrorMsg('Location permission denied or unavailable.');
          setLoading(false);
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-[#0f172a] overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="relative min-h-screen">
        <main className="min-h-screen p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <WeatherWidget 
              weatherData={weatherData} 
              forecastData={forecastData}
              loading={loading}
              error={errorMsg}
            />

            <div className="grid gap-6 md:grid-cols-3">
              <StatsWidget
                title="Daily Steps"
                value={7.4}
                maxValue={10}
                color="#10B981"
                gradientId="steps-gradient"
                icon="steps"
                data={stepsData}
              />

              <StatsWidget
                title="Heart Rate"
                value={87}
                maxValue={200}
                color="#EF4444"
                gradientId="heart-gradient"
                icon="heart"
                data={heartRateData}
              />

              <StatsWidget
                title="Calories"
                value={600}
                maxValue={2500}
                color="#3B82F6"
                gradientId="calories-gradient"
                icon="flame"
                data={caloriesData}
              />
            </div>

            <AlertWidget />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
