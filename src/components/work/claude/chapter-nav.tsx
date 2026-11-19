import { useEffect, useState } from "react"
import { NavLabel, NavRow } from "@/components/work/claude/nav-list"
import { glideTo } from "@/lib/glide"
import type { GROUPS } from "@/components/work/claude/docs"

/**
 * The chapters of a group's page, as a row under the tabs and exactly like
 * them: it does not wrap, and scrolls sideways when it runs out of room. A
 * name glides the page to its chapter, and the chapter being read is the
 * current one.
 */
export function ChapterNav({
  group,
  className,
}: {
  group: (typeof GROUPS)[number]
  className?: string
}) {
  // The chapter being read: the last one whose top has passed a line a little
  // below the bar the rows sit in, or the last chapter once the page is at
  // its end (a short one never gets that high). Measured once a frame while
  // scrolling.
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

  // A chapter's name glides the page to its chapter: quickly, but so the way
  // there shows. The address gets the chapter's hash once it has arrived
  // (set first, the router would jump there at once). A click with a
  // modifier key keeps its browser meaning.
  const visit = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    const chapter = document.getElementById(id)
    if (!chapter) return
    e.preventDefault()
    const margin = parseFloat(getComputedStyle(chapter).scrollMarginTop) || 0
    const top = chapter.getBoundingClientRect().top + window.scrollY - margin
    void glideTo(top).then(() =>
      window.history.replaceState(window.history.state, "", `#${id}`)
    )
  }

  const current =
    group.docs.find((doc) => doc.slug === reading) ?? group.docs.at(0)

  return (
    <NavRow
      label={`${group.name} chapters`}
      current={current?.slug ?? ""}
      className={className}
    >
      {group.docs.map((doc) => (
        <a
          key={doc.slug}
          href={`#${doc.slug}`}
          className="nav-link"
          aria-current={doc === current ? "location" : undefined}
          onClick={(e) => visit(e, doc.slug)}
        >
          <NavLabel>{doc.title}</NavLabel>
        </a>
      ))}
    </NavRow>
  )
}
