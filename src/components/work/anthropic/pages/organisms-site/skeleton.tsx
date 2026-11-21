import { useEffect, useRef } from "react"
import { Bar, Lines } from "@/components/work/claude/skeleton"
import { usePreviewTheme } from "@/components/work/claude/ui"

// The Anthropic.com pages round the site-wide organisms, as skeletons: plain
// bars where text, buttons, and pictures would be, so only the component is
// drawn for real. They follow the pages the file draws the organisms on:
// the expanded navigation's frames sit over a list of posts (a topic and
// date, a picture, a bold title) and over a hero (a two-line serif
// headline, a rule, a line of text and a button). The bars are the shared
// kit's (`Bar`, `Lines`); the layouts are `.ads-demo-skel*` in
// src/anthropic/organisms-site.css.

/** The site's header as bars: pills, the wordmark, pills and icons. */
export function SkeletonSiteNav() {
  return (
    <div className="ads-demo-skel-nav" aria-hidden>
      <span>
        {[44, 76, 60, 96].map((w) => (
          <Bar key={w} w={w} h={28} className="cds-skel-outline" />
        ))}
      </span>
      <Bar w={166} h={19} r={2} />
      <span>
        <Bar w={84} h={28} className="cds-skel-outline" />
        <Bar w={92} h={28} className="cds-skel-outline" />
        {[0, 1, 2].map((i) => (
          <Bar key={i} w={28} h={28} r={8} className="cds-skel-outline" />
        ))}
      </span>
    </div>
  )
}

/** A hero: a two-line headline, a rule, then a line of text and a button. */
export function SkeletonHero() {
  return (
    <div className="ads-demo-skel-hero" aria-hidden>
      <Bar w="88%" h={44} />
      <Bar w="72%" h={44} />
      <span className="ads-demo-skel-rule" />
      <span>
        <Lines count={2} last="70%" />
        <Bar w={84} h={28} r={8} className="cds-skel-outline" />
      </span>
    </div>
  )
}

/** A list of posts: each a topic and date, a picture, and a bold title. */
export function SkeletonPosts({ count = 3 }: { count?: number }) {
  return (
    <div className="ads-demo-skel-posts" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span key={i}>
          <span className="cds-skel-row">
            <Bar w={84} h={10} />
            <Bar w={68} h={10} />
          </span>
          <span className="cds-skel ads-demo-skel-picture" />
          <Bar w="80%" h={14} />
          <Bar w="52%" h={14} />
        </span>
      ))}
    </div>
  )
}

/**
 * The end of the News page's list of all its posts, which is what sits over
 * the prefooter there: its last two rows (a title, a description, a topic,
 * and a date, in the research table's columns), then the button for more.
 * It wears the theme picked for the figures, in a figure that keeps to
 * Slate (`data-picked-theme`, which the pick's wave looks for), and edges
 * itself in that theme's ring color (`.ads-demo-skel-end`). It tells the
 * figure how far down the figure it reaches, as the window it is in
 * scrolls (`--skel-end`), and the figure leaves its own Slate ground and
 * ring out above that line: drawn under the page end's rounded corners,
 * they showed through them as a dark fringe.
 */
export function SkeletonListEnd() {
  const { theme } = usePreviewTheme()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    const box = el?.closest<HTMLElement>("[data-figure]")
    const scroller = el?.parentElement
    if (!el || !box || !scroller) return
    // In the figure's own measure: it is drawn scaled.
    const mark = () => {
      const frame = box.getBoundingClientRect()
      const scale = frame.height / box.offsetHeight || 1
      const end = (el.getBoundingClientRect().bottom - frame.top) / scale
      box.style.setProperty("--skel-end", `${Math.max(0, end)}px`)
    }
    mark()
    const sizes = new ResizeObserver(mark)
    sizes.observe(el)
    sizes.observe(box)
    scroller.addEventListener("scroll", mark, { passive: true })
    return () => {
      sizes.disconnect()
      scroller.removeEventListener("scroll", mark)
      box.style.removeProperty("--skel-end")
    }
  }, [])
  const rows = [
    { title: "62%", text: "84%", topic: 72 },
    { title: "48%", text: "70%", topic: 96 },
  ]
  return (
    <div
      ref={ref}
      className="ads ads-demo-skel-end"
      data-theme={theme}
      data-picked-theme
      aria-hidden
    >
      <div className="ads-demo-skel-end-rows">
        {rows.map((row) => (
          <span key={row.title} className="ads-demo-skel-end-row">
            <Bar w={row.title} h={10} />
            <Bar w={row.text} h={10} />
            <Bar w={row.topic} h={10} />
            <Bar w={64} h={10} />
          </span>
        ))}
      </div>
      <Bar w={136} h={44} r={12} className="cds-skel-outline" />
    </div>
  )
}
