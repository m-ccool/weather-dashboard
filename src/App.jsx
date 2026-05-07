import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWeather, useForecast } from './hooks/useWeather';
import { useSearchHistory } from './hooks/useSearchHistory';
import { getWeatherTheme, isDaytime } from './utils/weatherTheme';
import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import CurrentWeather from './components/CurrentWeather';
import ForecastCard from './components/ForecastCard';
import IdleScene from './components/IdleScene';
import { CurrentWeatherSkeleton, ForecastSkeleton } from './components/SkeletonCard';

export default function App() {
  const [city, setCity] = useState('');
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useWeather(city);
  const { data: forecastData, isLoading: forecastLoading } = useForecast(city);

  const conditionCode = weatherData?.weather?.[0]?.id;
  const daytime = weatherData ? isDaytime(weatherData.sys.sunrise, weatherData.sys.sunset) : true;
  const theme = conditionCode
    ? getWeatherTheme(conditionCode, daytime)
    : { gradient: 'from-sky-500 via-blue-600 to-indigo-800', accent: '#e0f2fe', cardBg: 'bg-white/10', text: 'text-white' };

  function handleSearch(searchCity) {
    setCity(searchCity);
    addToHistory(searchCity);
  }

  const isLoading = weatherLoading || forecastLoading;

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${theme.gradient} transition-all duration-1000 ease-in-out`}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <span className="text-2xl">🌤️</span>
          <h1 className="font-sora font-bold text-white text-xl tracking-tight">
            Weather Dashboard
          </h1>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Search panel */}
        <motion.div
          layout
          className="mb-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl"
        >
          <p className="font-sora text-white/70 text-sm mb-4">
            Powered by{' '}
            <span className="text-white font-medium">React 18</span> ·{' '}
            <span className="text-white font-medium">TanStack Query</span> ·{' '}
            <span className="text-white font-medium">Framer Motion</span> ·{' '}
            <span className="text-white font-medium">Tailwind CSS</span>
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <SearchHistory history={history} onSelect={handleSearch} onClear={clearHistory} />
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {weatherError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-2xl bg-red-500/20 border border-red-400/40 px-5 py-4 text-red-200 font-sora text-sm"
            >
              ⚠️ {weatherError.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area */}
        <AnimatePresence mode="wait">
          {!city && !isLoading && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IdleScene />
            </motion.div>
          )}

          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CurrentWeatherSkeleton />
              <div className="mt-6">
                <div className="h-7 w-36 rounded-xl bg-white/10 mb-3" />
                <ForecastSkeleton />
              </div>
            </motion.div>
          )}

          {!isLoading && weatherData && (
            <motion.div
              key={city}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CurrentWeather data={weatherData} theme={theme} />

              {forecastData && forecastData.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-sora font-semibold text-white text-lg mb-3">
                    5-Day Forecast
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {forecastData.map((item, i) => (
                      <ForecastCard key={item.dt} item={item} index={i} theme={theme} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center">
        <a
          href="https://github.com/m-ccool"
          target="_blank"
          rel="noreferrer"
          className="font-gradient font-sora text-xs"
        >
          created by b mccool @m-ccool on github 🐉
        </a>
      </footer>
    </div>
  );
}
