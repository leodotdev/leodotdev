export default function Loading() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero section skeleton with photos placeholder */}
      <div className="relative -my-12 min-h-[500px]">
        {/* Scattered photos skeleton */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${60 + (i % 3) * 10}%`,
                transform: `rotate(${-10 + i * 5}deg)`,
              }}
            >
              <div className="h-28 w-28 rounded-sm bg-muted/20 p-1.5 md:h-36 md:w-36 md:p-2">
                <div className="h-full w-full rounded-sm bg-muted/40" />
              </div>
            </div>
          ))}
        </div>
        {/* Hero content skeleton */}
        <div className="pointer-events-none relative z-30 flex flex-col px-6 py-24 md:px-12">
          <div className="mb-2 h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="max-w-xl space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      <div className="h-px animate-pulse bg-muted" />

      {/* Experience section skeleton */}
      <div className="px-6 md:px-12">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        
        {/* Experience items */}
        <div className="mt-8 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-12 w-12 animate-pulse rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="space-y-1">
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px animate-pulse bg-muted" />

      {/* References section skeleton */}
      <div id="references">
        <div className="px-6 pb-12 md:px-12">
          <div className="mb-1 h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>

        {/* Horizontal scroll testimonials */}
        <div className="relative -mb-12 flex w-full gap-6 overflow-hidden px-6 pb-12 md:px-12">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex h-fit w-[32rem] shrink-0 animate-pulse flex-col gap-4 rounded-xl border bg-muted/10 p-6"
            >
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted/40" />
                <div className="h-4 w-5/6 rounded bg-muted/40" />
                <div className="h-4 w-4/6 rounded bg-muted/40" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted/40" />
                <div>
                  <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />
                  <div className="mt-1 h-3 w-32 animate-pulse rounded bg-muted/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px animate-pulse bg-muted" />

      {/* Projects section skeleton */}
      <div className="px-6 md:px-12">
        <div className="mb-4 h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="mb-8 h-4 w-48 animate-pulse rounded bg-muted" />

        {/* Category filters skeleton */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          ))}
        </div>

        {/* Projects grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="group animate-pulse">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-transparent" />
              </div>
              <div className="mt-3 space-y-1">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="flex flex-col gap-4 p-6 md:p-12">
        <div className="h-4 w-full max-w-lg animate-pulse rounded bg-muted/40" />
      </div>
    </div>
  );
}