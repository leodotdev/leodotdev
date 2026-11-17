import { createContext, useContext, useState } from "react"
import { THEMES } from "@/components/work/claude/docs"
import { useTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"
import type { ThemeId } from "@/components/work/claude/docs"

// Shared pieces of the design system docs: the theme the pages wear, and the
// page furniture (header, block, specimen box, captions).

const ThemeContext = createContext<{
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
}>({ theme: "white", setTheme: () => {} })

const isDark = (id: ThemeId) => id.startsWith("dark")

/**
 * The docs wear the project's colours instead of the site's. With nothing
 * picked the page is the first theme (White) or, when the site is in dark
 * mode, the last (Dark 3), so the site's light switch in the header moves
 * between those two. Picking one of the five sets the site's light or dark
 * mode to match it; using the light switch afterwards drops the pick.
 *
 * The wrapper's `data-claude-page` is what themes the page (claude-ds.css).
 * "auto" is resolved in CSS from the site's own dark class, so the server's
 * HTML is right before any script runs.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolved, setPref } = useTheme()
  const dark = resolved === "dark"
  const [picked, setPicked] = useState<ThemeId | null>(null)

  // The light switch was used (or the system changed): back to the two ends.
  const [wasDark, setWasDark] = useState(dark)
  if (wasDark !== dark) {
    setWasDark(dark)
    if (picked && isDark(picked) !== dark) setPicked(null)
  }

  const current = picked && isDark(picked) === dark ? picked : null
  const theme = current ?? (dark ? "dark-3" : "white")
  const setTheme = (id: ThemeId) => {
    setPicked(id)
    setPref(isDark(id) ? "dark" : "light")
  }

  return (
    <ThemeContext value={{ theme, setTheme }}>
      <div data-claude-page={current ?? "auto"} className="contents">
        {children}
      </div>
    </ThemeContext>
  )
}

export const usePreviewTheme = () => useContext(ThemeContext)

/** The start of one topic on a group page: its name and a sentence or two. */
export function DocHeader({
  title,
  children,
}: {
  /** Which group the topic is in; the page already says so. */
  group?: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-1 pb-10">
      <h2 className="font-semibold">{title}</h2>
      {children && (
        <p className="max-w-cols-9 text-pretty text-muted-foreground">
          {children}
        </p>
      )}
    </header>
  )
}

/** One block of a topic: a title, a sentence or two, then the specimens. */
export function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 pb-12">
      <div>
        <h3 className="font-medium">{title}</h3>
        {description && (
          <p className="max-w-cols-9 text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

/**
 * A box of the real thing: its contents use the design system's own tokens,
 * in the theme the page is wearing (or a fixed `theme`).
 */
export function Specimen({
  theme,
  className,
  children,
}: {
  theme?: ThemeId
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-theme={theme}
      className={cn(
        "cds overflow-hidden rounded-[20px] outline outline-1 -outline-offset-1 outline-border",
        className
      )}
    >
      {children}
    </div>
  )
}

/** The same contents once per theme, side by side in one strip. */
export function ThemeStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-[20px] outline outline-1 -outline-offset-1 outline-border sm:grid-cols-3 md:grid-cols-5">
      {THEMES.map(({ id, name }) => (
        <div
          key={id}
          data-theme={id}
          className="cds flex min-w-0 flex-col items-center gap-4 p-4"
        >
          <span
            className="cds-micro self-start"
            style={{ color: "var(--cds-fg-3)" }}
          >
            {name}
          </span>
          {children}
        </div>
      ))}
    </div>
  )
}

/** A labelled cell inside a specimen: what is shown, then the thing itself. */
export function Cell({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="cds-caption" style={{ color: "var(--cds-fg-3)" }}>
        {label}
      </div>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {children}
      </div>
    </div>
  )
}

/** The measurements behind a specimen, as one quiet line under it. */
export function Spec({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-cols-9 text-xs text-pretty text-muted-foreground">
      {children}
    </p>
  )
}
