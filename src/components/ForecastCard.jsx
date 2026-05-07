import { motion } from 'framer-motion';
import dayjs from 'dayjs';

export default function ForecastCard({ item, index, theme }) {
  const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ scale: 1.04, y: -4 }}
      className={`
        rounded-2xl ${theme.cardBg} backdrop-blur-md
        border border-white/20 p-4
        flex flex-col items-center gap-2
        shadow-lg cursor-default
        transition-shadow duration-300
        hover:shadow-xl
      `}
    >
      <p className="text-white/70 text-xs font-sora font-medium">
        {dayjs(item.dt_txt).format('ddd M/D')}
      </p>
      <img src={iconUrl} alt={item.weather[0].description} className="w-12 h-12" />
      <p className="text-white font-bold font-sora text-lg">
        {Math.round(item.main.temp)}°F
      </p>
      <p className="text-white/60 text-xs font-sora capitalize text-center leading-tight">
        {item.weather[0].description}
      </p>
      <div className="flex gap-3 text-xs text-white/60 font-sora">
        <span>💧 {item.main.humidity}%</span>
        <span>💨 {Math.round(item.wind.speed)}mph</span>
      </div>
    </motion.div>
  );
}
