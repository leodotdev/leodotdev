import { TbArrowLeft } from "react-icons/tb"
import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Whether the page on screen has the Back button. It outlives the page: the
// next one reads it to know there is a pill to see off (BackButtonExit).
let shown = false

const BOX =
  "-m-1 shrink-0 overflow-hidden p-1 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
const OPEN = "max-w-xs opacity-100"
const CLOSED = "-mr-3 max-w-0 opacity-0 md:-mr-5"

/**
 * The pill to the left of the name on a page under the home page; goes home
 * by default. It slides in, moving the name over. On a phone it is the same
 * pill without its label (a 40px circle), so the name and title, Contact and
 * the switchers still fit on one line; the label is then its accessible name.
 */
export function BackButton({
  to = "/",
  label = "Back to home",
}: {
  to?: "/" | "/work"
  label?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    shown = true
  }, [])

  useEffect(() => {
    // Check sessionStorage for navigation context
    const navigationSource = sessionStorage.getItem("navigation-source")
    const isFromProjectPage = navigationSource === "project-page"

    // Clear the flag
    sessionStorage.removeItem("navigation-source")

    if (isFromProjectPage) {
      // Show immediately without animation
      setIsVisible(true)
    } else {
      // Show with animation after delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    // The box clips the pill while it slides in, so it keeps 4px of padding
    // (and the same negative margin) for the pill's focus outline. While it is
    // closed it also gives back the gap that follows it, so the name starts
    // on the page's left edge and moves over as the pill arrives.
    <div className={cn(BOX, "hover:!opacity-100", isVisible ? OPEN : CLOSED)}>
      <Button
        variant="pill"
        className="max-md:w-10 max-md:px-0"
        render={
          <Link
            to={to}
            aria-label={label}
            onClick={() => {
              // Set flag when navigating back to projects
              sessionStorage.setItem("navigation-source", "back-button")
            }}
          />
        }
      >
        <TbArrowLeft className="h-4 w-4 text-muted-foreground md:mr-1 md:-ml-1" />
        <span className="max-md:hidden">Back</span>
      </Button>
    </div>
  )
}

/**
 * On a page without the Back button, the pill of the page just left: it
 * starts where that one stood and slides shut, so the name travels back to
 * the page's left edge the way it was moved over on the way in. It is only
 * a picture of the button (hidden from assistive technology, not focusable),
 * and is gone once it has closed. On a first visit there is nothing to show.
 */
export function BackButtonExit() {
  const [stage, setStage] = useState<"open" | "closing" | "gone">(() =>
    shown ? "open" : "gone"
  )

  useEffect(() => {
    shown = false
    if (stage !== "open") return
    // A moment open, so the closing has something to move from.
    const start = window.setTimeout(() => setStage("closing"), 30)
    const end = window.setTimeout(() => setStage("gone"), 830)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(end)
    }
    // Runs once, for the page it mounted on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (stage === "gone") return null
  return (
    <div
      aria-hidden
      inert
      className={cn(
        BOX,
        "pointer-events-none",
        stage === "open" ? OPEN : CLOSED
      )}
    >
      <Button variant="pill" tabIndex={-1} className="max-md:w-10 max-md:px-0">
        <TbArrowLeft className="h-4 w-4 text-muted-foreground md:mr-1 md:-ml-1" />
        <span className="max-md:hidden">Back</span>
      </Button>
    </div>
  )
}
