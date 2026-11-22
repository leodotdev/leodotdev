import { createContext, useContext } from "react"

/**
 * The product's theme on /work/plasmic: the studio and the browser it is
 * open in, dark (as Plasmic was always meant to be, and as many of its
 * explorations were drawn) or light (as it shipped). Picked with the dots
 * in the bar; the site's own theme is separate.
 */
export type PkTheme = "dark" | "light"

export const PK_THEMES: Array<{ id: PkTheme; name: string; swatch: string }> = [
  { id: "dark", name: "Dark", swatch: "#17181b" },
  { id: "light", name: "Light", swatch: "#ffffff" },
]

export const PkThemeContext = createContext<{
  theme: PkTheme
  setTheme: (t: PkTheme, from?: HTMLElement) => void
}>({ theme: "dark", setTheme: () => {} })

export const usePkTheme = () => useContext(PkThemeContext)
