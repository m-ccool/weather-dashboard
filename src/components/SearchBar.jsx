import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch, onUseCurrentLocation, isLoading, isLocating }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const city = value.trim();
    if (!city) return;
    onSearch(city);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2 flex-col sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter city name…"
          disabled={isLoading}
          className="
            flex-1 px-4 py-3 rounded-2xl
            bg-white/20 backdrop-blur-md
            border border-white/30
            text-white placeholder-white/60
            font-sora text-sm
            outline-none ring-0
            focus:bg-white/30 focus:border-white/60
            transition-all duration-300
            disabled:opacity-50
          "
        />
        <motion.button
          type="submit"
          disabled={isLoading || !value.trim()}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.06 }}
          className="
            px-5 py-3 rounded-2xl
            bg-white/25 backdrop-blur-md
            border border-white/30
            text-white font-sora font-semibold text-sm
            hover:bg-white/40 transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed
            flex items-center gap-2
          "
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
          ) : (
            <span>🔍</span>
          )}
          Search
        </motion.button>
        <motion.button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLoading || isLocating}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.06 }}
          className="
            px-4 py-3 rounded-2xl
            bg-white/20 backdrop-blur-md
            border border-white/30
            text-white font-sora font-semibold text-sm
            hover:bg-white/35 transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {isLocating ? (
            <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
          ) : (
            <span>📍</span>
          )}
          Use Location
        </motion.button>
      </div>
    </form>
  );
}
