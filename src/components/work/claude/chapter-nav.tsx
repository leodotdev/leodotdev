import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { glideTo } from "@/lib/glide"
import { cn } from "@/lib/utils"

/** Space between two segments, in px. */
const GAP = 3
/** The narrowest a segment gets, however short its chapter, in px. */
const MIN = 6

/**
 * The chapters of a group's page, as a bar under the tabs (Leo, 2026-11-20:
 * the "Chapter bar" of the layouts he was shown, after a minimap down the
 * window's right edge that sat too far from the page). Each chapter is a
 * segment as long as the chapter is on the page, as a video's chapters are
 * marked along its progress bar: the chapters already read are filled in
 * the muted color, the one being read in the text color, and those to come
 * are left in the line color. Under the segments the chapter being read is
 * named with its number; under the pointer or with a segment focused, that
 * segment's chapter is named instead. A segment glides the page to its
 * chapter. The styles are `.chapter-*` in src/styles.css.
 */
export function ChapterNav({
  group,
  className,
}: {
  /** A group of a system's docs: its chapters, by slug and title. */
  group: {
    slug: string
    name: string
    docs: ReadonlyArray<{ slug: string; title: string }>
  }
  className?: string
}) {
  // The chapter being read: the last one whose top has passed a line a little
  // below the bar, or the last chapter once the page is at its end (a short
  // one never gets that high). Measured once a frame while scrolling.
  const [reading, setReading] = useState<string | null>(null)
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      let found: string | null = null
      const page = document.documentElement
      const atEnd = window.innerHeight + window.scrollY >= page.scrollHeight - 2
      const bar = document.querySelector("[data-docs-bar]")
      const line = (bar?.getBoundingClientRect().height ?? 81) + 81
      for (const el of document.querySelectorAll("article[data-chapter]")) {
        if (!atEnd && el.getBoundingClientRect().top > line) break
        found = el.id
      }
      setReading(found)
    }
    const queue = () => {
      frame ||= requestAnimationFrame(measure)
    }
    queue()
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", queue)
      window.removeEventListener("resize", queue)
    }
  }, [group.slug])

  // Each segment's width: the bar's width shared out by how long each chapter
  // is on the page, from its top to the next one's (the last to its foot),
  // in whole pixels so the segments' ends are crisp. Measured again whenever
  // the page or the bar changes size (the figures take their heights after
  // the page is first drawn).
  const track = useRef<HTMLDivElement>(null)
  const [widths, setWidths] = useState<Array<number>>([])
  useLayoutEffect(() => {
    const el = track.current
    if (!el) return
    let frame = 0
    const place = () => {
      frame = 0
      const chapters = Array.from(
        document.querySelectorAll<HTMLElement>("article[data-chapter]")
      )
      if (!chapters.length) return
      const tops = chapters.map((c) => c.getBoundingClientRect().top)
      const final = chapters[chapters.length - 1]
      const end = tops[tops.length - 1] + final.offsetHeight
      const sizes = tops.map((top, i) =>
        Math.max(0, (tops[i + 1] ?? end) - top)
      )
      const next = share(sizes, Math.floor(el.clientWidth))
      setWidths((was) => (was.join() === next.join() ? was : next))
    }
    const queue = () => {
      frame ||= requestAnimationFrame(place)
    }
    place()
    const sizes = new ResizeObserver(queue)
    sizes.observe(el)
    const main = document.querySelector("article[data-chapter]")?.parentElement
    if (main) sizes.observe(main)
    return () => {
      cancelAnimationFrame(frame)
      sizes.disconnect()
    }
  }, [group.slug])

  // A segment glides the page to its chapter: quickly, but so the way there
  // shows. The address gets the chapter's hash once it has arrived (set
  // first, the router would jump there at once). A click with a modifier key
  // keeps its browser meaning.
  const visit = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    const chapter = document.getElementById(slug)
    if (!chapter) return
    e.preventDefault()
    const margin = parseFloat(getComputedStyle(chapter).scrollMarginTop) || 0
    const top = chapter.getBoundingClientRect().top + window.scrollY - margin
    void glideTo(top).then(() =>
      window.history.replaceState(window.history.state, "", `#${slug}`)
    )
  }

  const index = Math.max(
    0,
    group.docs.findIndex((doc) => doc.slug === reading)
  )
  // The segment under the pointer or focused, whose chapter is named.
  const [pointed, setPointed] = useState<number | null>(null)
  const named = pointed ?? index
  const count = group.docs.length
  const number = (i: number) => String(i + 1).padStart(2, "0")

  return (
    <nav
      aria-label={`${group.name} chapters`}
      className={cn("chapter-bar", className)}
      data-no-wave
    >
      <div
        ref={track}
        className="chapter-track"
        onPointerLeave={() => setPointed(null)}
      >
        {group.docs.map((doc, i) => (
          <a
            key={doc.slug}
            href={`#${doc.slug}`}
            className="chapter-seg"
            data-read={i < index || undefined}
            aria-current={i === index ? "location" : undefined}
            style={widths.length ? { width: widths.at(i) } : { flexGrow: 1 }}
            onPointerEnter={() => setPointed(i)}
            onFocus={() => setPointed(i)}
            onBlur={() => setPointed(null)}
            onClick={(e) => visit(e, doc.slug)}
          >
            <span className="sr-only">{doc.title}</span>
          </a>
        ))}
      </div>
      <p aria-hidden className="chapter-name">
        <span className="shrink-0 text-muted-foreground">
          {number(named)} / {number(count - 1)}
        </span>
        <span className="truncate">{group.docs.at(named)?.title}</span>
      </p>
    </nav>
  )
}

/**
 * `width` shared out among segments in proportion to `sizes`, each at least
 * `MIN` wide with `GAP` between them, in whole pixels: the running total is
 * rounded, not each share, so the segments still fill the width exactly.
 */
function share(sizes: Array<number>, width: number) {
  const n = sizes.length
  const room = width - GAP * (n - 1) - MIN * n
  const total = sizes.reduce((a, b) => a + b, 0)
  if (room <= 0 || total <= 0) {
    const each = Math.max(1, (width - GAP * (n - 1)) / n)
    return sizes.map(() => Math.floor(each))
  }
  let sum = 0
  let edge = 0
  return sizes.map((size) => {
    sum += size
    const next = Math.round((sum / total) * room)
    const w = MIN + next - edge
    edge = next
    return w
  })
}
