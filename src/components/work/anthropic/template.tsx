import {
  TemplateFigure,
  useTemplateDark,
} from "@/components/work/claude/pages/template"
import { cn } from "@/lib/utils"
import type { ThemeId } from "@/components/work/anthropic/docs"

// What every Anthropic.com template page is built in. The figure itself is
// the Claude docs' template figure, shared as is (`TemplateFigure`: the page
// in a window of one height that scrolls inside the figure, with grips, its
// own scrollbar, the reveals, and the demo cursor's scroll and resize round
// the page's own steps). What is this system's own is the page inside it:
// its blocks wear `ads` themes, and its margin is this system's (80px on a
// wide page, 48 on a tablet, 32 on a phone). Styles: src/anthropic/templates.css.

export { TemplateFigure }

/**
 * A stretch of a page in a theme of its own: the first theme is the one it
 * wears when the figures' theme is a light one (the Templates tab's Ivory
 * dot), the second when it is dark (the Slate dot). Use it bare around the
 * header and hero, or the footer.
 */
export function PageBlock({
  theme,
  className,
  children,
  ...rest
}: {
  theme: [light: ThemeId, dark: ThemeId]
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const dark = useTemplateDark()
  return (
    <div
      {...rest}
      className={cn("ads", className)}
      data-theme={dark ? theme[1] : theme[0]}
    >
      {children}
    </div>
  )
}

/**
 * One section of a page: a `PageBlock` with the page's margins and section
 * spacing, its children in a column. `tone={2}` sets it on its theme's
 * second background; `rule` draws a line above it.
 */
export function PageSection({
  theme,
  tone,
  rule,
  className,
  children,
}: {
  theme: [light: ThemeId, dark: ThemeId]
  tone?: 2
  rule?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <PageBlock
      theme={theme}
      className={cn("ads-page-section", className)}
      data-tone={tone}
      data-rule={rule || undefined}
    >
      {children}
    </PageBlock>
  )
}
