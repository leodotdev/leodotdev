import { useEffect } from "react"
import { useLocation } from "@tanstack/react-router"

const SCROLL_POSITION_KEY = "projects-scroll-position"

/**
 * Remembers how far down the home page the visitor scrolled (localStorage) and
 * puts them back there on their next visit, including after a full reload.
 */
export function ProjectsWrapper({ children }: { children: React.ReactNode }) {
  const pathname = useLocation({ select: (l) => l.pathname })

  useEffect(() => {
    // Only save scroll position on the home page (/ or /projects)
    if (pathname !== "/" && pathname !== "/projects") return

    const handleScroll = () => {
      try {
        localStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString())
      } catch (error) {
        console.error("Error saving scroll position:", error)
      }
    }

    // Save scroll position with debounce
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }

    window.addEventListener("scroll", debouncedHandleScroll)

    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll)
      clearTimeout(timeoutId)
    }
  }, [pathname])

  useEffect(() => {
    // Only restore on the projects page
    if (pathname !== "/" && pathname !== "/projects") return

    const restoreScroll = () => {
      try {
        const savedPosition = localStorage.getItem(SCROLL_POSITION_KEY)
        if (savedPosition) window.scrollTo(0, parseInt(savedPosition, 10))
      } catch (error) {
        console.error("Error restoring scroll position:", error)
      }
    }

    // Delay restoration so hydration and the router's own scroll handling
    // have finished first
    const timeoutId = setTimeout(restoreScroll, 100)

    return () => clearTimeout(timeoutId)
  }, [pathname])

  return children
}
