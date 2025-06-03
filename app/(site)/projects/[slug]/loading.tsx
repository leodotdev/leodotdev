export default function Loading() {
  return (
    <div>
      {/* Navigation skeleton */}
      <div className="sticky left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 md:px-12">
          {/* Back button */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          </div>
          {/* Theme toggle */}
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
      
      {/* Project Content */}
      <div className="mx-auto px-6 py-12 md:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-12">
            <div>
              <div className="mb-2 h-[72px] w-[400px] animate-pulse rounded bg-muted" />
              <div className="flex items-center gap-2">
                <div className="h-5 w-32 animate-pulse rounded bg-muted/60" />
                <div className="h-5 w-1 animate-pulse rounded bg-muted/60" />
                <div className="h-5 w-16 animate-pulse rounded bg-muted/60" />
                <div className="h-5 w-1 animate-pulse rounded bg-muted/60" />
                <div className="h-5 w-24 animate-pulse rounded bg-muted/60" />
              </div>
            </div>
            {/* Next project card */}
            <div className="hidden h-14 w-48 animate-pulse rounded-xl bg-muted md:block" />
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-8 max-w-3xl space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/6 animate-pulse rounded bg-muted" />
        </div>
        
        {/* Media Gallery - Hero Image and thumbnails */}
        <div className="mb-12">
          <div className="relative aspect-[16/10] animate-pulse overflow-hidden rounded-xl bg-muted" />
          {/* Thumbnail strip */}
          <div className="mt-4 flex gap-2 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 w-20 animate-pulse rounded bg-muted/60" />
            ))}
          </div>
        </div>
        
        {/* Content blocks */}
        <div className="mb-12 space-y-8">
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted/60" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted/60" />
          </div>
          
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
            <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
            <div className="h-4 w-3/6 animate-pulse rounded bg-muted/60" />
          </div>
        </div>
        
        {/* Navigation cards */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Previous project */}
            <div className="h-28 animate-pulse rounded-xl bg-muted" />
            {/* Next project */}
            <div className="h-28 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}