/**
 * Shimmer skeleton components for loading states.
 * Uses a CSS shimmer sweep animation via Tailwind custom keyframes.
 */

function ShimmerBar({ className = '' }) {
  return (
    <div
      className={`rounded-xl bg-white/10 overflow-hidden relative ${className}`}
      style={{ isolation: 'isolate' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
          backgroundSize: '1000px 100%',
          animation: 'shimmer 1.8s linear infinite',
        }}
      />
    </div>
  );
}

export function CurrentWeatherSkeleton() {
  return (
    <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 mr-4">
          <ShimmerBar className="h-8 w-48 mb-2" />
          <ShimmerBar className="h-4 w-32" />
        </div>
        <ShimmerBar className="w-20 h-20 rounded-2xl" />
      </div>
      <ShimmerBar className="h-4 w-36 mb-5" />
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
            <ShimmerBar className="h-3 w-14 mb-2" />
            <ShimmerBar className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 flex flex-col items-center gap-2"
        >
          <ShimmerBar className="h-3 w-14" />
          <ShimmerBar className="w-12 h-12 rounded-full" />
          <ShimmerBar className="h-6 w-12" />
          <ShimmerBar className="h-3 w-20" />
          <ShimmerBar className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}
