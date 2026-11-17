import { Link, Outlet, createFileRoute } from "@tanstack/react-router"
import { BackButton } from "@/components/BackButton"
import { Navigation } from "@/components/Navigation"
import { GROUPS, THEMES } from "@/components/work/claude/docs"
import { ThemeProvider, usePreviewTheme } from "@/components/work/claude/ui"
import { cn } from "@/lib/utils"

// leo.dev/work/claude: docs for the Claude.com design system. Tabs lead to an
// overview and one page per group of topics. Like /work it is unlisted, not
// private. The topics are listed in src/components/work/claude/docs.ts; the
// system's own tokens are in src/claude-ds.css. While these pages are open the
// whole page wears one of the system's five themes (ThemeProvider in ui.tsx),
// and only the bar at the top keeps the site's hover and click waves.

export const Route = createFileRoute("/_site/work/claude")({
  head: () => ({
    meta: [
      { title: "Claude.com Design System & Web Design · Leo Succar" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClaudeDocs,
})

const PERSON =
  "underline decoration-dotted hover:text-blue hover:decoration-solid"

// Each fact's values, one per line.
const FACTS: Array<[label: string, values: Array<React.ReactNode>]> = [
  ["Role", ["Design System Designer", "Web Design Designer"]],
  [
    "Team",
    [
      <a
        key="jordan"
        className={PERSON}
        href="https://x.com/jordanegstad"
        target="_blank"
      >
        Jordan Egstad
      </a>,
      <a
        key="stewart"
        className={PERSON}
        href="https://x.com/stewartsc"
        target="_blank"
      >
        Stewart Scott-Curran
      </a>,
      "Leo Succar",
    ],
  ],
  ["Client", ["Anthropic"]],
  ["Year", ["2025–26"]],
]

// Plain text tabs; the open one is heavier. Each reserves the width of its
// heavier label (the hidden ::after), so the row does not shift on a switch.
const TAB =
  "inline-flex flex-col py-2 whitespace-nowrap text-muted-foreground after:invisible after:h-0 after:overflow-hidden after:font-semibold after:content-[attr(data-label)] hover:text-foreground"
const ACTIVE = { className: "font-semibold !text-foreground" }

/** The theme the pages wear: five dots, one per theme. */
function ThemePicker() {
  const { theme, setTheme } = usePreviewTheme()
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Theme">
      {THEMES.map(({ id, name }) => (
        <button
          key={id}
          type="button"
          data-theme={id}
          aria-label={`${name} theme`}
          aria-pressed={theme === id}
          title={name}
          onClick={() => setTheme(id)}
          className={cn(
            "cds h-5 w-5 rounded-full outline outline-1 -outline-offset-1 outline-border [corner-shape:round]",
            theme === id && "outline-2 outline-offset-1 outline-blue"
          )}
        />
      ))}
    </div>
  )
}

function ClaudeDocs() {
  return (
    <ThemeProvider>
      <Navigation>
        <BackButton to="/work" label="Back" />
      </Navigation>

      {/* Below the bar nothing takes the site's hover or click wave. */}
      <div data-no-wave className="contents">
        {/* The work's introduction, on every tab, with the tabs under its facts. */}
        <header className="flex flex-col gap-6 border-b px-6 pt-12 pb-6 md:px-12">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold">
              Claude.com Design System &amp; Web Design
            </h1>
            <p className="max-w-cols-9 text-pretty text-muted-foreground">
              With two other designers, we crafted the design system and pages
              for the new{" "}
              <a className={PERSON} href="https://claude.com/" target="_blank">
                Claude.com
              </a>{" "}
              marketing website. These pages document the system the way its
              Figma file does, from color and type up to finished pages.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
            {FACTS.map(([label, values]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                {values.map((value, i) => (
                  <dd key={i}>{value}</dd>
                ))}
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-6">
            {/* The first tab starts on the text column's left edge, like the
              Back pill in the bar above and the clips below. The row scrolls
              sideways, so it keeps 4px of padding for a tab's focus outline. */}
            <nav
              aria-label="Design system"
              className="-mx-1 -my-3 scrollbar-hide flex max-w-full items-center gap-6 overflow-x-auto p-1"
            >
              <Link
                to="/work/claude"
                activeOptions={{ exact: true }}
                activeProps={ACTIVE}
                className={TAB}
                data-label="Overview"
              >
                Overview
              </Link>
              {GROUPS.map((group) => (
                <Link
                  key={group.slug}
                  to="/work/claude/$doc"
                  params={{ doc: group.slug }}
                  activeProps={ACTIVE}
                  className={TAB}
                  data-label={group.name}
                >
                  {group.name}
                </Link>
              ))}
            </nav>
            <ThemePicker />
          </div>
        </header>

        <main className="px-6 pt-6 pb-12 md:px-12">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  )
}
