import { useEffect } from "react"

// anthropic.com's reveals, for the Anthropic.com docs' figures (Leo,
// 2026-11-20: "make sure we're showing all the same reveal animations that
// went to prod in our figures"). Read from the site that day, by scrolling
// its home, research, news, company, and research-post pages: the site
// reveals whole components, not each heading or paragraph. Each fades in
// from nothing, without moving, over about 1.4s on a cubic ease-out (a
// fifth of the way in after 0.1s, half after 0.3s), as soon as its top
// comes into the window; a grid's cards come in one by one as each comes
// into view, with no stagger of their own. The components it does this to,
// as they are named here: the hero carousel, the filters and table, the
// post cards, the related-articles panel, and the closing call above the
// footer.
//
// In the docs a component waits, hidden, until its figure is well in view
// (lying across a line a little under the middle of the window), so its
// reveal plays in front of whoever scrolled down to it, and plays again once
// the figure has been scrolled wholly out of the window and back (Leo,
// 2026-11-20). The styles are `[data-reveal="fade"]` in src/claude-ds.css.

const BLOCKS = [
  ".ads-hero-carousel",
  ".ads-table",
  ".ads-grid-item",
  ".ads-asset",
  ".ads-case",
  ".ads-related",
  ".ads-prefooter",
].join(", ")

/** Fades in the components of every figure on a docs page, as the site does. */
export function useFadeIns(
  page: React.RefObject<HTMLElement | null>,
  /** What the page shows (its tab): the components are found anew for each. */
  key: string
) {
  useEffect(() => {
    const root = page.current
    if (!root) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const stops: Array<() => void> = []
    // A frame for the page's figures to be there.
    const frame = requestAnimationFrame(() => {
      for (const figure of root.querySelectorAll("[data-figure]")) {
        const items = Array.from(
          figure.querySelectorAll<HTMLElement>(BLOCKS)
        ).filter((el) => !el.parentElement?.closest(BLOCKS))
        if (items.length) stops.push(watch(figure, items))
      }
    })
    return () => {
      cancelAnimationFrame(frame)
      stops.forEach((stop) => stop())
    }
  }, [page, key])
}

/**
 * Reveals each of a figure's components once it and the figure are in view,
 * and again after the figure has been out of the window.
 */
function watch(figure: Element, items: Array<HTMLElement>) {
  items.forEach((el) => el.setAttribute("data-reveal", "fade"))
  let open = false
  let played = false
  const inView = new Set<HTMLElement>()
  const timers: Array<number> = []
  const show = () => {
    if (!open) return
    for (const el of inView) {
      observer.unobserve(el)
      played = true
      el.setAttribute("data-revealed", "")
      // Once in, it is let go of, back to its own styles.
      timers.push(window.setTimeout(() => release(el), 1600))
    }
    inView.clear()
  }
  // In view as soon as its top is above the window's bottom edge.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement
      if (entry.isIntersecting) inView.add(el)
      else inView.delete(el)
    }
    show()
  })
  items.forEach((el) => observer.observe(el))
  const gate = new IntersectionObserver(
    (entries) => {
      open = entries.some((entry) => entry.isIntersecting)
      show()
    },
    { rootMargin: "-55% 0px -45% 0px" }
  )
  gate.observe(figure)
  // Wholly out of the window, the figure's components wait again, unseen.
  const away = new IntersectionObserver((entries) => {
    if (!played || entries.some((entry) => entry.isIntersecting)) return
    played = false
    timers.forEach((timer) => window.clearTimeout(timer))
    timers.length = 0
    inView.clear()
    for (const el of items) {
      el.removeAttribute("data-revealed")
      el.setAttribute("data-reveal", "fade")
      observer.observe(el)
    }
  })
  away.observe(figure)
  return () => {
    away.disconnect()
    gate.disconnect()
    observer.disconnect()
    timers.forEach((timer) => window.clearTimeout(timer))
    items.forEach(release)
  }
}

function release(el: HTMLElement) {
  el.removeAttribute("data-reveal")
  el.removeAttribute("data-revealed")
}
