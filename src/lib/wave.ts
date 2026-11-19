import type * as WaveLib from "distortion-wave"
import type { DistortionWaveOptions, WaveTransition } from "distortion-wave"

let lib: typeof WaveLib | null = null
let loading: Promise<void> | null = null
const active = new Map<Element, WaveTransition>()
/** Targets whose wave is carrying a DOM change (the theme switch's page wave). */
const changing = new Set<Element>()

/** Time multiplier: above 1 is faster than the library's default. */
const SPEED = 1.6

// The library draws the glow along an element's edge at a thickness that
// swells and thins around the outline (`uneven`), in a pattern that starts
// the same way on every wave: thinnest halfway down the left edge, thickest
// at the corners. On a row or a card that thin stretch reads as a round bite
// out of the glow, always in the same place. Here the glow is one thickness
// all the way round.
const DEFAULTS: DistortionWaveOptions = {
  speed: SPEED,
  uneven: 0,
}

/**
 * The outline a wave leaves on its element, at the library's own pace. Once
 * the wave has passed, a soft glow and a thin line stay on the element's edge
 * and clear slowly, so an element with no border of its own wears one for a
 * moment. `speed` shortens every timing, these three included; multiplying
 * them by it first leaves them as long as in the original.
 *
 * The library draws the line almost white, which is right on a dark page and
 * invisible on a light one. There the line keeps more of the palette's color
 * and leans to black instead. And where the library wipes the outline away in
 * a circle growing from the wave's origin, so the side the wave started from
 * loses its outline well before the far side, here the whole outline fades
 * out together.
 * (`hairTone`, `hairLean` and `evenFade` come from the local patch of the
 * library.)
 */
export function linger(): DistortionWaveOptions {
  const dark = document.documentElement.classList.contains("dark")
  return {
    rimFade: 2.8 * SPEED,
    hairDelay: 0.45 * SPEED,
    hairFade: 2.8 * SPEED,
    evenFade: true,
    ...(!dark && { hairTone: 0, hairLean: 0.35 }),
  }
}

/**
 * The wave's colors are the site's own: Clay and its lighter peach,
 * then the three saturated secondary colors of the Claude palette
 * (src/claude-ds.css), in hue order so the band runs from clay through
 * purple, blue and green and back. The pale secondaries (heather, cactus) are
 * left out: in a band of light they wash the others to grey. The colors are
 * read from the page once; the library wants plain hex colors, which is
 * what those tokens hold.
 */
const PALETTE_TOKENS = ["clay", "peach", "plum", "sky", "mineral"]
let palette: Array<string> | null = null
function sitePalette() {
  if (palette) return palette
  const root = getComputedStyle(document.documentElement)
  const colors = PALETTE_TOKENS.map((name) =>
    root.getPropertyValue(`--cds-${name}`).trim()
  )
  // Anything else (a token that became a mix, say) leaves the library's own palette.
  if (!colors.every((c) => /^#[0-9a-f]{6}$/i.test(c))) return null
  palette = colors
  return palette
}

/** Loads the WebGL wave in the browser and compiles its shaders ahead of the first use. */
export function loadWave() {
  loading ??= import("distortion-wave")
    .then((m) => {
      lib = m
      m.warmupWave()
      // The first snapshot is the slow one (it measures default styles and
      // inlines the fonts). Take a throwaway one while the page is idle so
      // the first real hover doesn't pay for it.
      const warm = () => {
        const el = document.querySelector("[data-wave]")
        if (el) void m.prepareWave(el)
      }
      if ("requestIdleCallback" in window) requestIdleCallback(warm)
      else setTimeout(warm, 500)
    })
    .catch(() => {})
  return loading
}

/** The kind of pointer that last went down ("mouse", "touch", "pen"); set by WaveEffects. */
export const pointer = { type: "mouse" }

/**
 * Whether a click came from a finger or pen. With a mouse the wave is a hover
 * effect; on touch nothing hovers, so the tap plays it instead.
 */
export const isTap = (e: { detail: number }) =>
  e.detail > 0 && pointer.type !== "mouse"

/** Ends any wave on, inside or around `el`, so a plain DOM change isn't covered by a stale snapshot. */
export function stopWaves(el: Element | null) {
  if (!el) return
  for (const [target, t] of active)
    if (target.contains(el) || el.contains(target)) t.skip()
}

/**
 * Ends every wave that is playing. A wave shows a snapshot of its element
 * where the element was; once the page has changed, that snapshot would sit
 * on top of whatever the new page has there.
 */
export function endAllWaves() {
  // A wave that is carrying a change stays: the docs' tabs go to their page
  // inside one, and it is that wave's job to show the new page.
  for (const [el, t] of [...active]) if (!changing.has(el)) t.skip()
}

/** Ends the wave playing on exactly this element, if any. */
export const endWave = (el: Element) => active.get(el)?.skip()

/** Whether a wave is playing on this element right now. */
export const isWaving = (el: Element) => active.has(el)

/**
 * Plays the distortion wave over `target` while `update` changes the DOM (wrap
 * React state changes in `flushSync`; an update that returns a promise is
 * waited for). `update` always runs, wave or not.
 * Resolves when the wave is over (at once if there was none).
 *
 * The page can be scrolled while a wave plays. The wave shows a picture of
 * the part of its target that was in the window, and the picture lies in the
 * page and scrolls with it; the target is hidden only where the picture is,
 * so what scrolls into view is the real page (both from the local patch of
 * the library).
 *
 * A wave hides its target while it plays, so a wave on an element inside or
 * around the new target is ended first; otherwise the new capture would show
 * a hole where that element is. The exception is a wave carrying a change,
 * which is never ended by a hover inside it.
 */
export function wave(
  target: Element | null,
  update?: () => void | Promise<void>,
  options?: DistortionWaveOptions
): Promise<void> {
  const w = lib
  if (!w || !target) {
    // Not loaded (yet): apply the change plainly, and make sure the next one waves.
    void loadWave()
    update?.()
    return Promise.resolve()
  }
  const start = () => {
    // No CSS transitions inside the target while its wave plays (see styles.css):
    // the "after" snapshot is taken a frame after the update, and anything still
    // easing toward its new color would be captured half-way, then snap.
    target.setAttribute("data-waving", "")
    const colors = sitePalette()
    const t = w.distortionWave(target, update, {
      ...DEFAULTS,
      ...(colors && { palette: colors }),
      ...options,
    })
    active.set(target, t)
    if (update) changing.add(target)
    return t.finished.finally(() => {
      if (active.get(target) !== t) return
      active.delete(target)
      changing.delete(target)
      target.removeAttribute("data-waving")
    })
  }
  // A wave that is carrying a change plays to the end: a plain hover or tap
  // wave on something inside it is dropped instead of cutting it short.
  if (!update)
    for (const el of changing)
      if (el !== target && el.contains(target)) return Promise.resolve()
  const overlapping = [...active].filter(
    ([el]) => el !== target && (el.contains(target) || target.contains(el))
  )
  if (overlapping.length === 0) return start()
  for (const [, t] of overlapping) t.skip()
  return Promise.allSettled(overlapping.map(([, t]) => t.finished)).then(start)
}
