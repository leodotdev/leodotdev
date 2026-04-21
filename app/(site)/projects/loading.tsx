function ListRowSkeleton({ withThumbs = false }: { withThumbs?: boolean }) {
  return (
    <div className="px-6 py-4 md:px-12">
      <div className="flex w-full items-center justify-between gap-6">
        <div className="flex flex-row items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="h-3 w-64 animate-pulse rounded bg-muted/60" />
          </div>
        </div>
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
      {withThumbs && (
        <div className="mt-3 flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 w-32 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col gap-12">
      <div className="px-6 pt-12 md:px-12">
        <div className="mb-2 h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted/60" />
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <div className="px-6 pb-6 md:px-12">
          <div className="mb-2 h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded bg-muted/60" />
        </div>
        <div className="flex flex-col">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <ListRowSkeleton />
              {i < 2 && <div className="h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <div className="px-6 pb-6 md:px-12">
          <div className="mb-2 h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted/60" />
        </div>
        <div className="flex gap-6 overflow-hidden px-6 pb-12 md:px-12">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex h-fit w-[32rem] shrink-0 flex-col gap-4 rounded-xl border bg-muted/10 p-6"
            >
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted/50" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-muted/50" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted/50" />
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <div className="px-6 pb-6 md:px-12">
          <div className="mb-2 h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted/60" />
          <div className="mt-6 flex flex-wrap gap-1">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 animate-pulse rounded-full bg-muted"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <ListRowSkeleton withThumbs />
              {i < 3 && <div className="h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-12">
        <div className="h-4 w-full max-w-lg animate-pulse rounded bg-muted/40" />
      </div>
    </div>
  );
}
