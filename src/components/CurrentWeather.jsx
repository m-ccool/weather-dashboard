import { motion } from 'framer-motion';
import dayjs from 'dayjs';

export default function CurrentWeather({ data, theme, unit }) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const tempUnit = unit === 'metric' ? 'C' : 'F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';
  const visibility = unit === 'metric'
    ? `${((data.visibility || 0) / 1000).toFixed(1)} km`
    : `${((data.visibility || 0) / 1609).toFixed(1)} mi`;

  const stats = [
    { label: 'Temp', value: `${Math.round(data.main.temp)}°${tempUnit}`, emoji: '🌡️' },
    { label: 'Feels like', value: `${Math.round(data.main.feels_like)}°${tempUnit}`, emoji: '🤔' },
    { label: 'Humidity', value: `${data.main.humidity}%`, emoji: '💧' },
    { label: 'Wind', value: `${Math.round(data.wind.speed)} ${speedUnit}`, emoji: '💨' },
    { label: 'Pressure', value: `${data.main.pressure} hPa`, emoji: '🧭' },
    { label: 'Visibility', value: visibility, emoji: '👁️' },
    { label: 'Sunset', value: dayjs.unix(data.sys.sunset).format('h:mm A'), emoji: '🌇' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`rounded-3xl ${theme.cardBg} backdrop-blur-xl border border-white/20 p-6 shadow-2xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-3xl font-bold font-sora ${theme.text}`}>
            {data.name}, {data.sys.country}
          </h2>
          <p className="text-white/70 text-sm font-sora mt-0.5">
            {dayjs().format('dddd, MMMM D YYYY')}
          </p>
        </div>
        <motion.img
          src={iconUrl}
          alt={data.weather[0].description}
          className="w-20 h-20 drop-shadow-lg"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Condition */}
      <p className="capitalize text-white/80 font-sora text-base mb-5">
        {data.weather[0].description}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(({ label, value, emoji, colorClass }) => (
          <div
            key={label}
            className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3"
          >
            <p className="text-white/50 text-xs font-sora mb-1">
              {emoji} {label}
            </p>
            <p className={`font-semibold font-sora text-sm ${colorClass || 'text-white'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
