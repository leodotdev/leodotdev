export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Navigation skeleton */}
      <div className="sticky left-0 right-0 top-0 z-50">
        <div className="flex w-full justify-between border-b bg-secondary/20 py-4 backdrop-blur-md md:px-12">
          <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-4">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="mx-auto px-6 py-12 md:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 h-16 w-96 animate-pulse rounded bg-muted" />
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                <div className="h-5 w-1 animate-pulse rounded bg-muted" />
                <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                <div className="h-5 w-1 animate-pulse rounded bg-muted" />
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-14 w-48 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-8 max-w-3xl space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
        </div>
        
        {/* Hero Image */}
        <div className="mb-8 aspect-video animate-pulse rounded-lg bg-muted" />
        
        {/* Content */}
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}