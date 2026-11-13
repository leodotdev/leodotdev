import { useEffect } from "react";
import { endWave, isTap, isWaving, loadWave, pointer, wave } from "@/lib/wave";

/** How long the pointer must rest on an element before its hover wave starts. */
const HOVER_DWELL_MS = 70;

const INTERACTIVE = "a[href], button";

/**
 * Plays the distortion wave site-wide through document listeners. With a mouse
 * it is a hover effect; on touch, where nothing hovers, it plays on tap. The
 * wave covers the nearest `[data-wave]` ancestor (a whole list row) or else
 * the link or button itself.
 *
 * A control marked `data-wave-click` also waves on a mouse click (Contact,
 * Download PDF).
 * The theme switch always waves on click, from its own handler, and opts out
 * of the hover wave with `data-wave-hover="off"` (a ring around a 20px dot).
 * Controls marked `data-wave-manual` handle their own clicks, because theirs
 * carry a DOM change (the theme switch, the Show more buttons).
 * The admin is left alone, and so is anyone who prefers reduced motion.
 */
export function WaveEffects() {
  useEffect(() => {
    void loadWave();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const off = () =>
      reduced.matches || location.pathname.startsWith("/admin");
    // Menu items (the Contact menu) are left out: no wave on hover or tap.
    const find = (t: EventTarget | null) =>
      t instanceof Element && !t.closest("[role='menu'], [role='menuitem']")
        ? (t.closest("[data-wave]") ?? t.closest(INTERACTIVE))
        : null;

    // Until a wave hands back to the real element, the element is shown as a
    // snapshot taken on hover. If the pointer leaves before that, the wave is
    // ended, or the snapshot would keep showing the hover state (a row's
    // panel colour) for a second after the pointer has gone.
    const handedBack = new WeakSet<Element>();
    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = find(e.target);
      if (!el || !isWaving(el) || handedBack.has(el)) return;
      if (e.relatedTarget instanceof Node && el.contains(e.relatedTarget)) return;
      endWave(el);
    };

    let hoverTimer = 0;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || off()) return;
      const el = find(e.target);
      if (!el || isWaving(el) || el.matches("[data-wave-hover='off']")) return;
      // Only when the pointer comes in from outside, not on moves within.
      if (e.relatedTarget instanceof Node && el.contains(e.relatedTarget)) return;
      // Wait a beat, and only wave if the pointer is still there: sweeping
      // across the list would otherwise snapshot and animate every row.
      clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => {
        if (!el.isConnected || !el.matches(":hover") || isWaving(el)) return;
        handedBack.delete(el);
        void wave(el, undefined, {
          focus: e,
          onSettled: () => handedBack.add(el),
        });
      }, HOVER_DWELL_MS);
    };

    // A click doesn't say what made it in every browser, so remember the
    // pointer that went down just before.
    const onDown = (e: PointerEvent) => {
      pointer.type = e.pointerType;
    };

    const onClick = (e: MouseEvent) => {
      if (off() || !(e.target instanceof Element)) return;
      if (e.target.closest("[data-wave-manual]")) return;
      const el = find(e.target);
      // Mouse and keyboard: hover already played the wave, so a click adds
      // one only where asked for. Touch and pen: the tap is the trigger.
      if (!isTap(e) && !e.target.closest("[data-wave-click]")) return;
      if (!el) return;
      wave(el, undefined, { focus: e });
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("click", onClick);
    return () => {
      clearTimeout(hoverTimer);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
