import { useEffect, useState } from "react"
import {
  TbArrowUpRight,
  TbChevronLeft,
  TbChevronRight,
  TbX,
} from "react-icons/tb"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/** One frame exported from a design file. */
export type GalleryFrame = {
  /** Path under `base`, without the `-thumb.webp` / `-full.webp` ending. */
  file: string
  /** The group it belongs to (shown under the first tile of each group). */
  label: string
  /** Size in the design file. */
  w: number
  h: number
  /** Size of the part the thumbnail shows (the top of a tall frame). */
  tw: number
  th: number
}

export type GalleryChapter = {
  title: string
  description: string
  /**
   * Width over height of the chapter's usual tile, which four of fit a row
   * (two on phones); other frames keep the row's height at their own width.
   */
  ratio: number
  frames: Array<GalleryFrame>
}

const DEVICES: Record<number, string> = {
  390: "Mobile",
  744: "Tablet",
  1280: "Laptop",
}

const title = (chapter: GalleryChapter, frame: GalleryFrame) =>
  [chapter.title, frame.label, DEVICES[frame.w]].filter(Boolean).join(" · ")

type Entry = { chapter: GalleryChapter; frame: GalleryFrame }

/**
 * A design file as rows of small tiles, chapter by chapter. A tile opens the
 * frame in a full-screen viewer with previous/next (arrow keys work too).
 */
export function FrameGallery({
  base,
  chapters,
  bare = false,
}: {
  base: string
  chapters: Array<GalleryChapter>
  /** Tiles only: no rule, heading or side margins around each chapter. */
  bare?: boolean
}) {
  const entries: Array<Entry> = chapters.flatMap((chapter) =>
    chapter.frames.map((frame) => ({ chapter, frame }))
  )
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      {chapters.map((chapter) => (
        <div key={chapter.title} className="flex flex-col gap-12">
          {!bare && <Separator bleed />}
          <section>
            <div
              className={cn(
                "flex items-baseline justify-between gap-4 px-6 pb-6 md:px-12",
                bare && "hidden"
              )}
            >
              <div>
                <h2 className="font-semibold">{chapter.title}</h2>
                <p className="text-pretty text-muted-foreground">
                  {chapter.description}
                </p>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {chapter.frames.length}
              </div>
            </div>

            <div className={cn("@container", !bare && "mx-6")}>
              <div
                className="flex flex-wrap items-start gap-x-3 gap-y-4 [--tile-h:calc((100cqw-13px)/2/var(--ratio))] md:[--tile-h:calc((100cqw-37px)/4/var(--ratio))]"
                style={{ "--ratio": chapter.ratio } as React.CSSProperties}
              >
                {chapter.frames.map((frame, i) => {
                  const index = entries.findIndex((e) => e.frame === frame)
                  const first =
                    i === 0 || chapter.frames[i - 1].label !== frame.label
                  return (
                    <figure
                      key={frame.file}
                      className="flex max-w-full flex-col gap-1.5"
                      style={{
                        width: `min(100%, calc(var(--tile-h) * ${frame.tw / frame.th}))`,
                      }}
                    >
                      <a
                        href={`${base}/${frame.file}-full.webp`}
                        target="_blank"
                        aria-label={`${title(chapter, frame)}: view`}
                        // No wave on the artwork: it would distort the frame.
                        data-wave-hover="off"
                        data-wave-manual
                        className="block cursor-zoom-in overflow-hidden rounded-lg bg-card outline outline-1 -outline-offset-1 outline-border hover:outline-gray"
                        style={{ aspectRatio: `${frame.tw} / ${frame.th}` }}
                        onClick={(e) => {
                          // Modified clicks keep their meaning (new tab).
                          if (e.metaKey || e.ctrlKey || e.shiftKey) return
                          e.preventDefault()
                          setOpen(index)
                        }}
                      >
                        <img
                          src={`${base}/${frame.file}-thumb.webp`}
                          alt={title(chapter, frame)}
                          width={frame.tw}
                          height={frame.th}
                          loading="lazy"
                          className="block h-full w-full object-cover object-top"
                        />
                      </a>
                      {/* Only a group's first tile is labelled; the label may
                          run on under the tiles that follow it. */}
                      <figcaption className="h-4 text-xs whitespace-nowrap text-muted-foreground">
                        {first && frame.label}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      ))}

      {open !== null && (
        <Viewer base={base} entries={entries} index={open} onChange={setOpen} />
      )}
    </>
  )
}

const BAR_BUTTON =
  "flex h-10 w-10 items-center justify-center rounded-full text-white [corner-shape:round] hover:bg-white/15"

function Viewer({
  base,
  entries,
  index,
  onChange,
}: {
  base: string
  entries: Array<Entry>
  index: number
  onChange: (index: number | null) => void
}) {
  const { chapter, frame } = entries[index]
  const count = entries.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null)
      if (e.key === "ArrowLeft") onChange((index - 1 + count) % count)
      if (e.key === "ArrowRight") onChange((index + 1) % count)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, count, onChange])

  // The page behind does not scroll while the viewer is open.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const src = `${base}/${frame.file}-full.webp`
  // A slide fits the screen; a page keeps a readable width and scrolls.
  const scrolls = frame.h / frame.w > 1.2

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title(chapter, frame)}
      className="fixed inset-0 z-50 flex flex-col bg-black/90 text-white backdrop-blur-sm [--color-ring:#fff]"
    >
      <div className="flex items-center justify-between gap-4 py-2 pr-2 pl-6">
        <div className="min-w-0">
          <div className="truncate">{title(chapter, frame)}</div>
          <div className="text-xs text-white/60 tabular-nums">
            {index + 1} of {count}
          </div>
        </div>
        <div
          className="flex shrink-0 items-center"
          data-wave-hover="off"
          data-wave-manual
        >
          <button
            type="button"
            className={BAR_BUTTON}
            aria-label="Previous"
            onClick={() => onChange((index - 1 + count) % count)}
          >
            <TbChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={BAR_BUTTON}
            aria-label="Next"
            onClick={() => onChange((index + 1) % count)}
          >
            <TbChevronRight className="h-5 w-5" />
          </button>
          <a
            className={BAR_BUTTON}
            href={src}
            target="_blank"
            aria-label="Open the image in a new tab"
          >
            <TbArrowUpRight className="h-5 w-5" />
          </a>
          <button
            type="button"
            autoFocus
            className={BAR_BUTTON}
            aria-label="Close"
            onClick={() => onChange(null)}
          >
            <TbX className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        // A new frame starts at its top.
        key={frame.file}
        className={cn(
          "min-h-0 flex-1 px-4 pb-4",
          scrolls
            ? "overflow-y-auto overscroll-contain"
            : "flex items-center justify-center"
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) onChange(null)
        }}
      >
        <img
          src={src}
          alt={title(chapter, frame)}
          width={frame.w}
          height={frame.h}
          className={cn(
            "rounded-lg bg-white/5",
            scrolls
              ? "mx-auto h-auto w-full"
              : "max-h-full w-auto max-w-full object-contain"
          )}
          style={scrolls ? { maxWidth: Math.min(frame.w, 1280) } : undefined}
        />
      </div>
    </div>
  )
}
