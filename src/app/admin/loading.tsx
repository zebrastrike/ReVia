export default function AdminLoading() {
  return (
    <div className="space-y-8">
      {/* Title skeleton */}
      <div className="h-8 w-52 animate-pulse rounded-lg bg-white/10" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-sky-200/40 bg-white/50 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="h-10 w-10 rounded-xl bg-white/50" />
            </div>
            <div className="h-7 w-20 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Recent orders skeleton */}
      <div className="animate-pulse rounded-2xl border border-sky-200/40 bg-white/50 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-white/10" />
          <div className="h-4 w-16 rounded bg-white/50" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-20 rounded bg-white/50" />
              <div className="h-4 w-32 rounded bg-white/50" />
              <div className="h-4 w-16 rounded bg-white/50" />
              <div className="h-4 w-20 rounded bg-white/50" />
              <div className="h-4 w-24 rounded bg-white/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
