import { useEffect, useState } from 'react';
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
import ModuleErrorBoundary from './components/ModuleErrorBoundary';

export default function App() {
  const [query, setQuery] = useState(null);
  const [unit, setUnit] = useState(() => localStorage.getItem('weather_unit') || 'imperial');
  const [isLocating, setIsLocating] = useState(false);
  const [localError, setLocalError] = useState('');
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const activeQuery = query ? { ...query, units: unit } : null;
  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useWeather(activeQuery);
  const { data: forecastData, isLoading: forecastLoading, refetch: refetchForecast } = useForecast(activeQuery);

  const conditionCode = weatherData?.weather?.[0]?.id;
  const daytime = weatherData ? isDaytime(weatherData.sys.sunrise, weatherData.sys.sunset) : true;
  const theme = conditionCode
    ? getWeatherTheme(conditionCode, daytime)
    : { gradient: 'from-sky-500 via-blue-600 to-indigo-800', accent: '#e0f2fe', cardBg: 'bg-white/10', text: 'text-white' };

  function handleSearch(searchCity) {
    setLocalError('');
    setQuery({ city: searchCity });
    addToHistory(searchCity);
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setLocalError('Geolocation is not supported in this browser.');
      return;
    }

    setLocalError('');
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setQuery({
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
        setIsLocating(false);
      },
      () => {
        setLocalError('Unable to access your location. Check browser permissions.');
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  }

  function handleRefresh() {
    if (!query) return;
    refetchWeather();
    refetchForecast();
  }

  useEffect(() => {
    localStorage.setItem('weather_unit', unit);
  }, [unit]);

  useEffect(() => {
    if (query?.coords && weatherData?.name) {
      addToHistory(weatherData.name);
    }
  }, [query, weatherData, addToHistory]);

  const isLoading = weatherLoading || forecastLoading;

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-br ${theme.gradient} transition-all duration-1000 ease-in-out`}
    >
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/15 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <span className="text-2xl">🌤️</span>
          <h1 className="font-sora font-bold text-white text-xl tracking-tight">
            Weather Dashboard
          </h1>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
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
          <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="inline-flex rounded-2xl border border-white/30 overflow-hidden bg-white/10">
              <button
                type="button"
                onClick={() => setUnit('imperial')}
                className={`px-4 py-2 text-xs font-sora font-semibold transition ${
                  unit === 'imperial' ? 'bg-white/30 text-white' : 'text-white/70 hover:bg-white/15'
                }`}
              >
                Fahrenheit
              </button>
              <button
                type="button"
                onClick={() => setUnit('metric')}
                className={`px-4 py-2 text-xs font-sora font-semibold transition ${
                  unit === 'metric' ? 'bg-white/30 text-white' : 'text-white/70 hover:bg-white/15'
                }`}
              >
                Celsius
              </button>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={!query || isLoading}
              className="px-3 py-2 text-xs rounded-xl border border-white/30 text-white/85 hover:bg-white/15 transition disabled:opacity-40"
            >
              Refresh Data
            </button>
          </div>

          <SearchBar
            onSearch={handleSearch}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLoading={isLoading}
            isLocating={isLocating}
          />
          <SearchHistory history={history} onSelect={handleSearch} onClear={clearHistory} />
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {(weatherError || localError) && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-2xl bg-red-500/20 border border-red-400/40 px-5 py-4 text-red-200 font-sora text-sm"
            >
              ⚠️ {localError || weatherError.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area */}
        <AnimatePresence mode="wait">
          {!query && !isLoading && (
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
              key={query?.city || `${query?.coords?.lat || 'lat'}-${query?.coords?.lon || 'lon'}-${unit}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ModuleErrorBoundary moduleName="Current Weather">
                <CurrentWeather data={weatherData} theme={theme} unit={unit} />
              </ModuleErrorBoundary>

              {forecastData && forecastData.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-sora font-semibold text-white text-lg mb-3">
                    5-Day Forecast
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {forecastData.map((item, i) => (
                      <ModuleErrorBoundary key={item.dt} moduleName="Forecast Card">
                        <ForecastCard item={item} index={i} theme={theme} unit={unit} />
                      </ModuleErrorBoundary>
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
        <p className="mt-2 text-white/50 text-[11px] font-sora">build v2.1</p>
      </footer>
    </div>
  );
}
