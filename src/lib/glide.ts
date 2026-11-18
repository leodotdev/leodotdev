// A quick, sprung scroll of the window to a place on the page: fast enough to
// feel like a jump, slow enough to see which way the page went, with a small
// overshoot as it lands. The browser's own smooth scrolling takes its time
// over a long distance; this one settles in about half a second however far
// it goes.

let stop: (() => void) | null = null

/**
 * Scrolls the window to `top` (a distance from the top of the page). Resolves
 * when it gets there, or as soon as the visitor scrolls for themselves, which
 * ends it where it is. With reduced motion it simply goes there.
 */
export function glideTo(top: number): Promise<void> {
  stop?.()
  const from = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  const to = Math.max(0, Math.min(top, max))
  const distance = Math.abs(to - from)
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (distance < 1 || still) {
    window.scrollTo({ top: to, behavior: "instant" })
    return Promise.resolve()
  }
  // A spring: the page runs a little past the place and settles back. How
  // far past is set in pixels (a few for a short hop, 28 at most), not as a
  // share of the distance, so a long trip does not swing wide. From that
  // comes the spring's damping; its stiffness puts the furthest point of
  // every trip at the same moment, a third of a second in, whatever the
  // distance, so it arrives a little before that and has settled by about
  // two thirds of a second.
  const past = Math.min(28, Math.max(6, distance * 0.06), distance / 2)
  const log = Math.log(past / distance)
  const damping = -log / Math.sqrt(Math.PI ** 2 + log ** 2)
  const furthest = 0.34
  const swing = Math.PI / furthest
  const speed = swing / Math.sqrt(1 - damping ** 2)
  return new Promise((done) => {
    let frame = 0
    const start = performance.now()
    const end = () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("wheel", end)
      window.removeEventListener("touchstart", end)
      window.removeEventListener("keydown", end)
      stop = null
      done()
    }
    const step = (now: number) => {
      const t = (now - start) / 1000
      // How much of the way is still to go; it dips below zero while the
      // page is past the place.
      const left =
        Math.exp(-damping * speed * t) *
        (Math.cos(swing * t) +
          ((damping * speed) / swing) * Math.sin(swing * t))
      // Done once it is back from its furthest point and within half a
      // pixel, or after a second at the latest.
      const settled = t > furthest && Math.abs(left * distance) < 0.5
      if (settled || t > 1) {
        window.scrollTo({ top: to, behavior: "instant" })
        return end()
      }
      window.scrollTo({ top: to - (to - from) * left, behavior: "instant" })
      frame = requestAnimationFrame(step)
    }
    window.addEventListener("wheel", end, { passive: true })
    window.addEventListener("touchstart", end, { passive: true })
    window.addEventListener("keydown", end)
    stop = end
    frame = requestAnimationFrame(step)
  })
}
