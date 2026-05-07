import { motion } from 'framer-motion';

const clouds = [
  { id: 1, size: 'text-7xl', top: '18%', delay: 0, duration: 22, opacity: 0.7 },
  { id: 2, size: 'text-5xl', top: '35%', delay: 4, duration: 28, opacity: 0.5 },
  { id: 3, size: 'text-8xl', top: '55%', delay: 8, duration: 18, opacity: 0.6 },
  { id: 4, size: 'text-4xl', top: '72%', delay: 2, duration: 32, opacity: 0.4 },
  { id: 5, size: 'text-6xl', top: '10%', delay: 12, duration: 25, opacity: 0.55 },
];

export default function IdleScene() {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 overflow-hidden select-none">
      {/* Drifting clouds */}
      {clouds.map((c) => (
        <motion.span
          key={c.id}
          className={`absolute ${c.size} pointer-events-none`}
          style={{ top: c.top, opacity: c.opacity }}
          initial={{ x: '-15vw' }}
          animate={{ x: '110vw' }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 0,
          }}
        >
          ☁️
        </motion.span>
      ))}

      {/* Central floating sun */}
      <motion.div
        className="z-10 text-8xl mb-6 drop-shadow-2xl"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌤️
      </motion.div>

      {/* Title */}
      <motion.h1
        className="z-10 font-sora font-bold text-white text-3xl sm:text-4xl text-center mb-3 drop-shadow-lg"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Weather Dashboard
      </motion.h1>

      <motion.p
        className="z-10 font-sora text-white/70 text-base sm:text-lg text-center max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Search for any city to see live weather conditions and a 5-day forecast.
      </motion.p>

      {/* Rainbow gradient credit */}
      <motion.p
        className="z-10 mt-8 text-xs font-sora"
        style={{
          background:
            'linear-gradient(to right, #FF6EEB, #FF9D6C, #79FF6E, #6EFFFF, #D09DF2, #FF6EEB)',
          backgroundSize: '250% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradient 5s ease infinite',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        created by b mccool @m-ccool 🐉
      </motion.p>
    </div>
  );
}
