import { motion, AnimatePresence } from 'framer-motion';

export default function SearchHistory({ history, onSelect, onClear }) {
  if (history.length === 0) return null;

  return (
    <div className="w-full mt-4">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {history.map((city) => (
            <motion.button
              key={city}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelect(city)}
              className="
                px-3 py-1.5 rounded-full
                bg-white/20 backdrop-blur-sm
                border border-white/25
                text-white/90 text-xs font-sora font-medium
                hover:bg-white/35 transition-all duration-200
                cursor-pointer
              "
            >
              {city}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <button
        onClick={onClear}
        className="mt-3 text-xs text-white/50 hover:text-white/80 transition-colors duration-200 font-sora underline underline-offset-2"
      >
        Clear history ♻️
      </button>
    </div>
  );
}
