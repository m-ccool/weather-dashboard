/**
 * Maps OpenWeatherMap condition codes → gradient + accent color
 * https://openweathermap.org/weather-conditions
 */
export function getWeatherTheme(conditionCode, isDaytime = true) {
  // Thunderstorm
  if (conditionCode >= 200 && conditionCode < 300) {
    return {
      gradient: 'from-slate-800 via-slate-700 to-slate-900',
      accent: '#94a3b8',
      cardBg: 'bg-slate-800/60',
      text: 'text-slate-100',
    };
  }
  // Drizzle / Rain
  if (conditionCode >= 300 && conditionCode < 600) {
    return {
      gradient: 'from-slate-600 via-blue-700 to-slate-700',
      accent: '#7dd3fc',
      cardBg: 'bg-blue-900/60',
      text: 'text-blue-50',
    };
  }
  // Snow
  if (conditionCode >= 600 && conditionCode < 700) {
    return {
      gradient: 'from-slate-300 via-blue-100 to-slate-200',
      accent: '#bfdbfe',
      cardBg: 'bg-white/40',
      text: 'text-slate-800',
    };
  }
  // Atmosphere (fog, haze, etc)
  if (conditionCode >= 700 && conditionCode < 800) {
    return {
      gradient: 'from-gray-400 via-gray-300 to-gray-500',
      accent: '#d1d5db',
      cardBg: 'bg-gray-500/50',
      text: 'text-gray-100',
    };
  }
  // Clear
  if (conditionCode === 800) {
    return isDaytime
      ? {
          gradient: 'from-sky-400 via-blue-500 to-indigo-600',
          accent: '#fde68a',
          cardBg: 'bg-sky-500/30',
          text: 'text-white',
        }
      : {
          gradient: 'from-indigo-900 via-slate-900 to-slate-800',
          accent: '#c7d2fe',
          cardBg: 'bg-indigo-900/60',
          text: 'text-indigo-100',
        };
  }
  // Clouds
  if (conditionCode > 800 && conditionCode < 900) {
    return isDaytime
      ? {
          gradient: 'from-sky-300 via-slate-400 to-blue-400',
          accent: '#e2e8f0',
          cardBg: 'bg-slate-400/40',
          text: 'text-white',
        }
      : {
          gradient: 'from-slate-700 via-slate-800 to-gray-900',
          accent: '#94a3b8',
          cardBg: 'bg-slate-700/60',
          text: 'text-slate-200',
        };
  }
  // Default
  return {
    gradient: 'from-sky-500 via-blue-600 to-indigo-700',
    accent: '#e0f2fe',
    cardBg: 'bg-white/20',
    text: 'text-white',
  };
}

export function isDaytime(sunrise, sunset) {
  const now = Date.now() / 1000;
  return now >= sunrise && now <= sunset;
}
