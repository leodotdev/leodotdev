export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Navigation skeleton */}
      <div className="sticky left-0 right-0 top-0 z-50">
        <div className="flex w-full justify-between border-b bg-secondary/20 py-4 backdrop-blur-md md:px-12">
          <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-4">
            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-12">
        {/* Intro section skeleton */}
        <div className="flex flex-col px-6 md:px-12">
          <div className="mb-2 h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="max-w-xl space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Category filters skeleton */}
        <div className="px-6 md:px-12">
          <div className="mb-4 h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="flex flex-wrap gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 w-32 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        </div>

        {/* Projects grid skeleton */}
        <div className="grid gap-6 px-6 md:grid-cols-2 md:px-12 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-card">
              <div className="aspect-video rounded-t-lg bg-muted" />
              <div className="p-6">
                <div className="mb-2 h-6 w-3/4 rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-5/6 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}