import { createFileRoute, notFound } from "@tanstack/react-router"
import { useEffect } from "react"
import { Stage } from "@/components/work/plasmic/stage"
import { findYear } from "@/components/work/plasmic/years"

// A year of /work/plasmic: its dives, played on the stage as the page
// scrolls (src/components/work/plasmic/stage.tsx).
export const Route = createFileRoute("/_site/work/plasmic/$year")({
  loader: ({ params }) => {
    const year = findYear(params.year)
    if (!year?.dives.length) throw notFound()
    return year.slug
  },
  component: YearPage,
})

function YearPage() {
  const slug = Route.useLoaderData()
  const year = findYear(slug)
  useArrival(slug)
  if (!year) return null
  return <Stage key={year.slug} year={year} />
}

/**
 * Arriving at a dive by its address (a thread on the overview, a link from
 * elsewhere, a reload) starts it: its top on the bar's bottom line. The
 * page is still settling when the router scrolls, so the dive is put back
 * there each time the page changes size, for a moment, or until the
 * visitor scrolls for themselves.
 */
function useArrival(slug: string) {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    const dive = id ? document.getElementById(id) : null
    if (!dive) return
    const align = () => {
      const line =
        document.querySelector("[data-docs-bar]")?.getBoundingClientRect()
          .bottom ?? 0
      const off = dive.getBoundingClientRect().top - line + 1
      if (Math.abs(off) > 0.5)
        window.scrollTo({ top: window.scrollY + off, behavior: "instant" })
    }
    const observer = new ResizeObserver(align)
    observer.observe(document.body)
    const bar = document.querySelector("[data-docs-bar]")
    if (bar) observer.observe(bar)
    const stop = () => {
      observer.disconnect()
      window.clearTimeout(timer)
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"])
        window.removeEventListener(type, stop)
    }
    const timer = window.setTimeout(stop, 2500)
    for (const type of ["wheel", "touchstart", "keydown", "pointerdown"])
      window.addEventListener(type, stop, { passive: true })
    return stop
  }, [slug])
}
