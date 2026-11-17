import { TbArrowLeft } from "react-icons/tb"
import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

/** The pill at the start of a sub-page's navigation; goes home by default. */
export function BackButton({
  to = "/",
  label = "Back to home",
}: {
  to?: "/" | "/work"
  label?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

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
    // (and the same negative margin) for the pill's focus outline.
    <div
      className={`-m-1 overflow-hidden p-1 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:!opacity-100 ${
        isVisible ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
      }`}
    >
      <Button
        variant="pill"
        render={
          <Link
            to={to}
            onClick={() => {
              // Set flag when navigating back to projects
              sessionStorage.setItem("navigation-source", "back-button")
            }}
          />
        }
      >
        <TbArrowLeft className="mr-1 -ml-1 h-4 w-4 text-muted-foreground" />
        {label}
      </Button>
    </div>
  )
}
