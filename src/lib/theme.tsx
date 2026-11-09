import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react"

export type ThemePref = "light" | "dark" | "system"
type Resolved = "light" | "dark"

const KEY = "theme"
const CHANGE = "theme-change"
const DARK = "(prefers-color-scheme: dark)"

/**
 * Browser chrome color (status bar, tab strip) for each theme: the computed
 * --background. Both media-scoped metas get the chosen theme's color, so a
 * user's pick wins over the system setting.
 */
export const THEME_COLOR = { light: "#ffffff", dark: "#09090b" } as const

/** Inline in <head> before CSS so the first paint has the right theme. */
export const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem("${KEY}");var d=p==="dark"||((!p||p==="system")&&matchMedia("${DARK}").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",d?"${THEME_COLOR.dark}":"${THEME_COLOR.light}")})}catch(_){}})()`

function readPref(): ThemePref {
  try {
    const p = localStorage.getItem(KEY)
    return p === "light" || p === "dark" ? p : "system"
  } catch {
    return "system"
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

function subscribeSystem(cb: () => void) {
  const mq = matchMedia(DARK)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}

type ThemeContext = {
  pref: ThemePref
  resolved: Resolved
  setPref: (p: ThemePref) => void
}
const Ctx = createContext<ThemeContext | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Server snapshot is "system/light"; the inline script already painted the
  // real theme, and these stores pick up the stored value on hydration.
  const pref = useSyncExternalStore(
    subscribePref,
    readPref,
    () => "system" as const
  )
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => matchMedia(DARK).matches,
    () => false
  )
  const resolved: Resolved =
    pref === "system" ? (systemDark ? "dark" : "light") : pref

  // Keep <html> in sync when the system theme flips or another tab changes it.
  useEffect(() => {
    const el = document.documentElement
    el.classList.toggle("dark", resolved === "dark")
    el.style.colorScheme = resolved
    for (const m of document.querySelectorAll('meta[name="theme-color"]'))
      m.setAttribute("content", THEME_COLOR[resolved])
  }, [resolved])

  const setPref = useCallback((p: ThemePref) => {
    try {
      if (p === "system") localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, p)
    } catch {
      // storage unavailable: theme still applies for this page view via the event below
    }
    window.dispatchEvent(new Event(CHANGE))
  }, [])

  return (
    <Ctx.Provider value={{ pref, resolved, setPref }}>{children}</Ctx.Provider>
  )
}

export function useTheme(): ThemeContext {
  const v = useContext(Ctx)
  if (!v) throw new Error("useTheme must be used inside ThemeProvider")
  return v
}
