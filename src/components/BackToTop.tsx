import { useEffect, useState } from "react"
import { useLocation } from "@tanstack/react-router"
import { TbArrowUp } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { useToastShowing } from "@/components/ui/toast"
import { glideTo } from "@/lib/glide"
import { cn } from "@/lib/utils"

/** How far down the page, in px, the button comes up. */
const AFTER = 2000

/**
 * A pill at the bottom center of the window that takes the page back to its
 * top (Leo, 2026-11-20): it comes up once the page is scrolled down about
 * 2000px, and goes again near the top. It glides there as the docs'
 * chapter links do (`glideTo`), and hands keyboard focus to the top of the
 * page, since the button itself goes away. While a toast is showing in the
 * same place, the button rises above it. It stays away from /work/plasmic,
 * whose stage holds the bottom of the window (the chapter bar takes
 * the page anywhere there).
 */
export function BackToTop() {
  const { pathname } = useLocation()
  const stage = /^\/work\/plasmic(\/|$)/.test(pathname)
  const [scrolled, setShown] = useState(false)
  const shown = scrolled && !stage
  const toast = useToastShowing()
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setShown(window.scrollY > AFTER)
    }
    const queue = () => {
      frame ||= requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", queue, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", queue)
    }
  }, [])

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-[max(24px,env(safe-area-inset-bottom))] z-30 flex justify-center",
        "transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-opacity",
        shown ? "opacity-100" : "translate-y-2 opacity-0",
        shown && toast && "-translate-y-[46px]"
      )}
      inert={!shown}
    >
      <Button
        variant="pill"
        className="pointer-events-auto gap-1.5 border-border pl-3.5"
        onClick={(e) => {
          const keyboard = e.detail === 0
          void glideTo(0).then(() => {
            if (!keyboard) return
            // The first thing to tab to at the top of the page.
            document
              .querySelector<HTMLElement>("#app :is(a[href], button)")
              ?.focus({ preventScroll: true })
          })
        }}
      >
        <TbArrowUp aria-hidden className="h-4 w-4" />
        Back to top
      </Button>
    </div>
  )
}
