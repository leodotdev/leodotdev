import type * as WaveLib from "distortion-wave";
import type { DistortionWaveOptions, WaveTransition } from "distortion-wave";

let lib: typeof WaveLib | null = null;
let loading: Promise<void> | null = null;
const active = new Map<Element, WaveTransition>();

const DEFAULTS: DistortionWaveOptions = {
  /** Time multiplier: above 1 is faster than the library's default. */
  speed: 1.35,
};

/** Loads the WebGL wave in the browser and compiles its shaders ahead of the first use. */
export function loadWave() {
  loading ??= import("distortion-wave")
    .then((m) => {
      lib = m;
      m.warmupWave();
      // The first snapshot is the slow one (it measures default styles and
      // inlines the fonts). Take a throwaway one while the page is idle so
      // the first real hover doesn't pay for it.
      const warm = () => {
        const el = document.querySelector("[data-wave]");
        if (el) void m.prepareWave(el);
      };
      if ("requestIdleCallback" in window) requestIdleCallback(warm);
      else setTimeout(warm, 500);
    })
    .catch(() => {});
  return loading;
}

/** The kind of pointer that last went down ("mouse", "touch", "pen"); set by WaveEffects. */
export const pointer = { type: "mouse" };

/**
 * Whether a click came from a finger or pen. With a mouse the wave is a hover
 * effect; on touch nothing hovers, so the tap plays it instead.
 */
export const isTap = (e: { detail: number }) =>
  e.detail > 0 && pointer.type !== "mouse";

/** Ends any wave on, inside or around `el`, so a plain DOM change isn't covered by a stale snapshot. */
export function stopWaves(el: Element | null) {
  if (!el) return;
  for (const [target, t] of active)
    if (target.contains(el) || el.contains(target)) t.skip();
}

/** Ends the wave playing on exactly this element, if any. */
export const endWave = (el: Element) => active.get(el)?.skip();

/** Whether a wave is playing on this element right now. */
export const isWaving = (el: Element) => active.has(el);

/**
 * Plays the distortion wave over `target` while `update` changes the DOM (wrap
 * React state changes in `flushSync`). `update` always runs, wave or not.
 * Resolves when the wave is over (at once if there was none).
 *
 * A wave hides its target while it plays, so a wave on an element inside or
 * around the new target is ended first; otherwise the new capture would show
 * a hole where that element is.
 */
export function wave(
  target: Element | null,
  update?: () => void,
  options?: DistortionWaveOptions,
): Promise<void> {
  const w = lib;
  if (!w || !target) {
    // Not loaded (yet): apply the change plainly, and make sure the next one waves.
    void loadWave();
    update?.();
    return Promise.resolve();
  }
  const start = () => {
    // No CSS transitions inside the target while its wave plays (see styles.css):
    // the "after" snapshot is taken a frame after the update, and anything still
    // easing toward its new colour would be captured half-way, then snap.
    target.setAttribute("data-waving", "");
    const t = w.distortionWave(target, update, { ...DEFAULTS, ...options });
    active.set(target, t);
    return t.finished.finally(() => {
      if (active.get(target) !== t) return;
      active.delete(target);
      target.removeAttribute("data-waving");
    });
  };
  const overlapping = [...active].filter(
    ([el]) => el !== target && (el.contains(target) || target.contains(el)),
  );
  if (overlapping.length === 0) return start();
  for (const [, t] of overlapping) t.skip();
  return Promise.allSettled(overlapping.map(([, t]) => t.finished)).then(start);
}
