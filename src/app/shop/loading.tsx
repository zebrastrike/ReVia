export default function ShopLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="h-9 w-64 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-2 h-4 w-32 animate-pulse rounded bg-white/5" />

      {/* Search + sort bar skeleton */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 max-w-md flex-1 animate-pulse rounded-lg bg-white/5" />
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-md bg-white/5" />
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="mt-10 flex flex-col gap-10 lg:flex-row">
        {/* Sidebar skeleton */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
          <div className="mt-3 space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        </aside>

        {/* Product grid skeleton */}
        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="aspect-square w-full rounded-xl bg-white/10" />
              <div className="mt-4 h-5 w-3/4 rounded bg-white/10" />
              <div className="mt-2 h-4 w-1/2 rounded bg-white/5" />
              <div className="mt-3 h-8 w-full rounded-lg bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
