export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Navigation skeleton */}
      <div className="sticky left-4 right-4 top-4 z-50 px-6 md:px-12">
        <div className="flex w-full justify-between rounded-3xl border bg-secondary/20 p-1 backdrop-blur-md">
          <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-1">
            <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-28 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-12">
        <div className="mb-12">
          <div className="mb-4 h-12 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-12 aspect-video animate-pulse rounded-lg bg-muted" />
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}