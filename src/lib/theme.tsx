import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react"

// The site is dark unless the visitor has switched it to light. The system's
// light or dark setting plays no part: the pick is stored, and with none
// stored the theme is DEFAULT.

export type ThemePref = "light" | "dark"

const KEY = "theme"
const CHANGE = "theme-change"
export const DEFAULT: ThemePref = "dark"

/**
 * Browser chrome color (status bar, tab strip) for each theme: the computed
 * --background. The meta gets the color of the theme in use.
 */
export const THEME_COLOR = { light: "#ffffff", dark: "#141413" } as const

/** Inline in <head> before CSS so the first paint has the right theme. */
export const THEME_SCRIPT = `(function(){try{var d=localStorage.getItem("${KEY}")!=="light";var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",d?"${THEME_COLOR.dark}":"${THEME_COLOR.light}")})}catch(_){}})()`

function readPref(): ThemePref {
  try {
    const p = localStorage.getItem(KEY)
    return p === "light" || p === "dark" ? p : DEFAULT
  } catch {
    return DEFAULT
  }
}

function subscribePref(cb: () => void) {
  window.addEventListener(CHANGE, cb)
  window.addEventListener("storage", cb)
  return () => {
    window.removeEventListener(CHANGE, cb)
    window.removeEventListener("storage", cb)
  }
}

type ThemeContext = {
  /** The theme in use. */
  resolved: ThemePref
  setPref: (p: ThemePref) => void
}
const Ctx = createContext<ThemeContext | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The server renders the default; the inline script already painted the
  // real theme, and this store picks up the stored value on hydration.
  const resolved = useSyncExternalStore(subscribePref, readPref, () => DEFAULT)

  // Keep <html> in sync when the pick changes, here or in another tab.
  useEffect(() => {
    const el = document.documentElement
    el.classList.toggle("dark", resolved === "dark")
    el.style.colorScheme = resolved
    for (const m of document.querySelectorAll('meta[name="theme-color"]'))
      m.setAttribute("content", THEME_COLOR[resolved])
  }, [resolved])

  const setPref = useCallback((p: ThemePref) => {
    try {
      localStorage.setItem(KEY, p)
    } catch {
      // storage unavailable: theme still applies for this page view via the event below
    }
    window.dispatchEvent(new Event(CHANGE))
  }, [])

  return <Ctx.Provider value={{ resolved, setPref }}>{children}</Ctx.Provider>
}

export function useTheme(): ThemeContext {
  const v = useContext(Ctx)
  if (!v) throw new Error("useTheme must be used inside ThemeProvider")
  return v
}
