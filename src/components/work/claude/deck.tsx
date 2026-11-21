import { useEffect, useRef, useState } from "react"
import { CarouselUi } from "@/components/work/claude/specimens"
import { cn } from "@/lib/utils"

/**
 * A deck of marginalia: several cards in one place, the current one on top,
 * over the carousel's controls. It is claude.com's own (its `AsideRails`
 * slider, read from the site on 2026-11-19; Leo: "these aren't working as
 * expected/designed"): the cards to come lean out to the right from behind
 * the top one, each a little further back and turned a little more; a card
 * gone past tucks behind on the left the same way; the arrows sit at the
 * deck's two edges with the bullets between them, and stop at the ends
 * (the deck does not come round again). The styles are `.cds-deck*` in
 * src/claude-ds.css.
 *
 * Where a page's styles lay the cards out in a row that scrolls sideways
 * instead (a phone), the controls scroll the row and follow it.
 */
// Whether a page's styles have laid the cards out as a row that scrolls.
// (Asked of the styles, not of the sizes: a deck's leaning cards also reach
// past its box.)
const scrolls = (el: HTMLElement) => {
  const overflow = getComputedStyle(el).overflowX
  return (
    (overflow === "auto" || overflow === "scroll") &&
    el.scrollWidth > el.clientWidth + 1
  )
}

export function Deck({
  cards,
  className,
}: {
  cards: Array<React.ReactNode>
  className?: string
}) {
  const row = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const count = cards.length

  // As a row that scrolls, the current card is the one scrolled to.
  useEffect(() => {
    const el = row.current
    if (!el) return
    const onScroll = () => {
      if (!scrolls(el)) return
      const most = el.scrollWidth - el.clientWidth
      const first = el.firstElementChild
      if (!(first instanceof HTMLElement)) return
      let nearest = 0
      let least = Infinity
      Array.from(el.children).forEach((card, i) => {
        if (!(card instanceof HTMLElement)) return
        const away = Math.abs(
          card.offsetLeft - first.offsetLeft - el.scrollLeft
        )
        if (away < least) {
          least = away
          nearest = i
        }
      })
      setCurrent(most - el.scrollLeft <= 1 ? el.children.length - 1 : nearest)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  const go = (to: number) => {
    const next = Math.max(0, Math.min(count - 1, to))
    const el = row.current
    const first = el?.firstElementChild
    const card = el?.children[next]
    if (
      el &&
      first instanceof HTMLElement &&
      card instanceof HTMLElement &&
      scrolls(el)
    ) {
      const still = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      el.scrollTo({
        left: card.offsetLeft - first.offsetLeft,
        behavior: still ? "auto" : "smooth",
      })
    } else setCurrent(next)
  }

  return (
    <div
      className={cn("cds-deck", className)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Carousel"
    >
      <div ref={row} className="cds-deck-cards">
        {cards.map((card, i) => {
          // How far the card is from the top of the deck, and which way:
          // ahead of the current card (to come) or behind it (gone past).
          const offset = i - current
          return (
            <div
              key={i}
              className="cds-deck-slide"
              data-active={offset === 0 ? "" : undefined}
              data-hidden={Math.abs(offset) > 2 ? "" : undefined}
              style={
                {
                  "--deck-offset": offset,
                  "--deck-distance": Math.abs(offset),
                } as React.CSSProperties
              }
            >
              {card}
            </div>
          )
        })}
      </div>
      {count > 1 && (
        <CarouselUi
          spread
          ends
          count={count}
          current={current}
          onStep={(by) => go(current + by)}
          onPick={go}
        />
      )}
    </div>
  )
}
