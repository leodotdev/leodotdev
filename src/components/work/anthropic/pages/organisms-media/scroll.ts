import { useEffect, useState } from "react"

const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * A row of cards that scrolls sideways and snaps to a card (`scroll-snap` in
 * its styles). It says which card leads and how many places the row can
 * stop at, steps a card at a time (round again at either end), and goes to
 * a given card. With a mouse the row can also be dragged and thrown back
 * onto a card, as a finger moves it on a touch screen.
 */
export function useSnapRow(ref: React.RefObject<HTMLDivElement | null>) {
  const [current, setCurrent] = useState(0)
  const [stops, setStops] = useState(1)

  // How far it is from one card to the next, and how far the row scrolls.
  const reach = () => {
    const el = ref.current
    const [first, second] = el?.children ?? []
    if (!el || !(first instanceof HTMLElement)) return null
    const stride =
      second instanceof HTMLElement
        ? second.offsetLeft - first.offsetLeft
        : first.offsetWidth
    return { el, stride, max: el.scrollWidth - el.clientWidth }
  }

  const go = (stop: number, instant = false) => {
    const at = reach()
    if (!at || at.stride <= 0) return
    at.el.scrollTo({
      left: Math.min(Math.max(0, stop) * at.stride, at.max),
      behavior: instant || still() ? "auto" : "smooth",
    })
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const at = reach()
      if (!at || at.stride <= 0) return
      const count = at.max <= 1 ? 1 : Math.ceil((at.max - 1) / at.stride) + 1
      const end = at.max > 1 && at.max - el.scrollLeft <= 1
      setStops(count)
      setCurrent(
        end
          ? count - 1
          : Math.min(count - 1, Math.round(el.scrollLeft / at.stride))
      )
    }
    // The observer also reports once when it starts watching.
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    el.addEventListener("scroll", measure, { passive: true })

    // A mouse drags the row. Once it has moved a few pixels the snapping is
    // let go (`data-dragging`), and on release the row glides to the card
    // nearest where it was thrown; the click that ends a drag is swallowed,
    // so a drag that ends on a card does not press it.
    let from: { x: number; left: number; id: number } | null = null
    let moved = false
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return
      from = { x: e.clientX, left: el.scrollLeft, id: e.pointerId }
      moved = false
    }
    const move = (e: PointerEvent) => {
      if (!from || e.pointerId !== from.id) return
      const dx = e.clientX - from.x
      if (!moved && Math.abs(dx) < 4) return
      if (!moved) {
        moved = true
        el.setAttribute("data-dragging", "")
        el.setPointerCapture(e.pointerId)
      }
      // The row may be drawn scaled down; the pointer moves in the window's
      // pixels, the row scrolls in its own.
      const scale = el.getBoundingClientRect().width / (el.offsetWidth || 1)
      el.scrollLeft = from.left - dx / (scale || 1)
    }
    const up = (e: PointerEvent) => {
      if (!from || e.pointerId !== from.id) return
      from = null
      if (!moved) return
      const at = reach()
      const settle = () => el.removeAttribute("data-dragging")
      if (!at || at.stride <= 0) return settle()
      go(Math.round(el.scrollLeft / at.stride))
      el.addEventListener("scrollend", settle, { once: true })
      window.setTimeout(settle, 700)
    }
    const click = (e: MouseEvent) => {
      if (!moved) return
      moved = false
      e.preventDefault()
      e.stopPropagation()
    }
    el.addEventListener("pointerdown", down)
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerup", up)
    el.addEventListener("pointercancel", up)
    el.addEventListener("click", click, true)
    return () => {
      observer.disconnect()
      el.removeEventListener("scroll", measure)
      el.removeEventListener("pointerdown", down)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerup", up)
      el.removeEventListener("pointercancel", up)
      el.removeEventListener("click", click, true)
    }
    // `reach` and `go` read the row afresh each time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])

  const step = (by: 1 | -1) => go((current + by + stops) % stops)

  return { current, stops, step, go }
}

/** A number as the file writes it in a count: two digits ("01 / 12"). */
export const two = (n: number) => String(n).padStart(2, "0")
