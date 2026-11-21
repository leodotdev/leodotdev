import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Text cut off at its cell's edge, as anthropic.com's research table has it
// (its "panning text", read from the site on 2026-11-19): what does not fit
// fades out under the cell's edge, and under the pointer the text slides
// along at 100px a second, linear, until its end is in sight, then back
// when the pointer leaves. The fade at the start shows only once the text
// has moved, the fade at the end goes once the end is in sight, and neither
// shows when the text fits.

/** How fast the text slides, in px a second. */
const SPEED = 100

type Progress = "init" | "in-progress" | "complete"

/** The text's offset now, mid-slide or at rest. */
const offset = (el: HTMLElement) => {
  const t = getComputedStyle(el).transform
  return t === "none" ? 0 : new DOMMatrixReadOnly(t).m41
}

export function Panning({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const box = useRef<HTMLSpanElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  const [progress, setProgress] = useState<Progress>("init")

  // Clipped or not, as the cell or the text changes size.
  useEffect(() => {
    const el = box.current
    const t = text.current
    if (!el || !t) return
    const check = () =>
      el.toggleAttribute("data-clipped", t.offsetWidth > el.offsetWidth + 0.5)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    observer.observe(t)
    return () => observer.disconnect()
  }, [])

  const slide = (toEnd: boolean) => {
    const el = box.current
    const t = text.current
    if (!el || !t) return
    const far = Math.max(0, t.offsetWidth - el.offsetWidth)
    const target = toEnd ? -far : 0
    const now = offset(t)
    const distance = Math.abs(target - now)
    if (distance < 1) return
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    t.style.transitionDuration = still ? "0s" : `${distance / SPEED}s`
    t.style.transform = target ? `translateX(${target}px)` : ""
    setProgress(still ? (target ? "complete" : "init") : "in-progress")
  }

  return (
    <span
      ref={box}
      className={cn("ads-pan", className)}
      data-progress={progress}
      onPointerEnter={() => slide(true)}
      onPointerLeave={() => slide(false)}
    >
      <span
        ref={text}
        className="ads-pan-text"
        onTransitionEnd={(e) => {
          if (e.propertyName === "transform")
            setProgress(offset(e.currentTarget) < -0.5 ? "complete" : "init")
        }}
      >
        {children}
      </span>
    </span>
  )
}
