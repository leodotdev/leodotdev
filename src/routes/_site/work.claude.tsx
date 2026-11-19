import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
  useRouter,
} from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { BackButton } from "@/components/BackButton"
import { Navigation } from "@/components/Navigation"
import { ChapterNav } from "@/components/work/claude/chapter-nav"
import { GROUPS, THEMES, findGroup } from "@/components/work/claude/docs"
import { NavLabel, NavRow } from "@/components/work/claude/nav-list"
import { SpacingOverlay, SpacingToggle } from "@/components/work/claude/spacing"
import { ThemeProvider, usePreviewTheme } from "@/components/work/claude/ui"
import { cn } from "@/lib/utils"
import { wave } from "@/lib/wave"

// leo.dev/work/claude: docs for the Claude.com design system. Tabs lead to an
// overview and one page per group of topics. Like /work it is unlisted, not
// private. The topics are listed in src/components/work/claude/docs.ts; the
// system's own tokens are in src/claude-ds.css. The page wears the site's own
// theme; the five dots in the tab row pick a theme for the figures alone
// (ThemeProvider in ui.tsx). Only the bar at the top and the overview's topic
// rows keep the site's hover and click waves.

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
  "underline decoration-dotted hover:text-tint hover:decoration-solid"

// Each fact's values, one per line.
const FACTS: Array<[label: string, values: Array<React.ReactNode>]> = [
  ["Role", ["Design System Designer", "Web Designer"]],
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
  ["Client", ["Design Business Company"]],
  ["Year", ["2025–26"]],
]

/** The theme the figures wear: five dots, one per theme. */
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
          onClick={(e) => setTheme(id, e)}
          className={cn(
            "cds h-5 w-5 rounded-full outline outline-1 -outline-offset-1 outline-border [corner-shape:round]",
            theme === id && "outline-2 outline-offset-1 outline-tint"
          )}
        />
      ))}
    </div>
  )
}

function ClaudeDocs() {
  const { pathname } = useLocation()
  // The tabs with live figures: the theme dots and the spacing switch are
  // for those. The Overview has none, and the Templates are pictures.
  const figures = /^\/work\/claude\/(atoms|molecules|organisms)\/?$/.test(
    pathname
  )
  // The group whose page is open, if any: its chapters are the second row.
  const group = findGroup(pathname.replace(/\/$/, "").split("/")[3] ?? "")

  // The tab row stays at the top of the window while the page scrolls. Once
  // it is held there (the marker above it has gone off the top) it draws a
  // line under itself, between it and what scrolls beneath. The marker is
  // measured, once a frame while the page scrolls or changes size and again
  // when the tab changes, not watched with an IntersectionObserver: that
  // only reports crossings, and it counts the marker as out of sight while a
  // wave has the section cut away (the wave library's patch hides a target
  // with a `clip-path`), so its last word could be wrong either way.
  const marker = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const el = marker.current
    if (!el) return
    let frame = 0
    const measure = () => {
      frame = 0
      setStuck(el.getBoundingClientRect().top < -0.5)
    }
    const queue = () => {
      frame ||= requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", queue)
      window.removeEventListener("resize", queue)
    }
  }, [pathname])

  // A tab swaps the page under the tab row, and the site's distortion wave
  // carries the swap: it plays over the whole section (the tab row and the
  // content, starting from the tab) while the router goes to the tab's page
  // inside it. The content changes in place, and the page does not jump
  // back to its top. A click with a modifier key keeps its browser meaning
  // (a new tab, a new window).
  const router = useRouter()
  const content = useRef<HTMLElement>(null)
  const swap = (
    e: React.MouseEvent<HTMLAnchorElement>,
    go: () => Promise<void>
  ) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    e.preventDefault()
    if (e.currentTarget.hasAttribute("aria-current")) return
    const tab = e.currentTarget
    const click = e.nativeEvent
    // Scrolled into the section, the next page is taken from its start: the
    // update ends by putting the section's top, tab row first, at the top
    // of the window, with no glide back first. The wave's picture of the
    // old page stays where it is in the window (the wave library's patch
    // moves it by as much as the page scrolled during the update), so the
    // wave carries what was on screen straight into the top of the new page.
    void wave(
      content.current,
      async () => {
        await go()
        // A frame for the new page to be on screen before it is captured.
        await new Promise((done) => requestAnimationFrame(done))
        const top = marker.current?.getBoundingClientRect().top ?? 0
        if (top < 0)
          window.scrollTo({ top: top + window.scrollY, behavior: "instant" })
      },
      { source: tab, focus: click }
    )
  }

  return (
    <ThemeProvider>
      <Navigation className="rule-b pb-12">
        <BackButton to="/work" label="Back to work" />
      </Navigation>

      {/* Below the bar nothing takes the site's hover or click wave, except
          the overview's topic rows, which ask for it with `data-wave`. */}
      <div data-no-wave className="contents">
        {/* The work's introduction, on every tab: a section of its own, a
            step darker than the page, in a band as wide as the window. */}
        <div className="bleed border-b bg-gray-6">
          <header className="flex flex-col gap-6 px-6 py-12 md:px-12">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">
                Claude.com Design System &amp; Web Design
              </h1>
              <p className="max-w-cols-9 text-pretty text-muted-foreground">
                As a team of 3 designers, we designed the pages and atomic
                design system for the new{" "}
                <a
                  className={PERSON}
                  href="https://claude.com/"
                  target="_blank"
                >
                  Claude.com
                </a>{" "}
                marketing website. These pages follow the system's own
                structure: atoms, the molecules made from them, the organisms
                those build, and the page templates.
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
          </header>
        </div>

        {/* What a tab swaps, and what the wave plays over: the whole section
            under the introduction, tab row included, as one sheet on the
            page's color. (With no background of its own the wave would treat
            it as loose content and play on each thing in it.) The sheet is
            as wide as the window (`bleed` in src/styles.css), so the wave
            crosses the whole window, and what is in it keeps to the page's
            column. */}
        <main
          ref={content}
          className="bleed bg-background pb-12 [--bleed-pad:24px] md:[--bleed-pad:48px]"
        >
          {/* The bar at the top of the section it switches, where it stays
              while the page scrolls. Its first row is the tabs: a plain row
              of names starting on the text column, with the theme dots at
              the other end. Under it, exactly like it, is the row of the
              open page's chapters. Neither row wraps: one that runs out of
              room scrolls sideways, with an arrow button over whichever end
              has names out of sight. On a phone the dots go under both. The
              bar spans the window, on the page's own color, so what scrolls
              under it is covered, the overview's strip of clips included. Its padding is the sections' own, 48px
              above and below its rows, and is the same whether the bar is
              resting at the top of the section or held at the top of the
              window (Leo, 2026-11-19): the section has no top padding of
              its own, and the content starts right under the bar's bottom
              edge, where it draws its line once it is stuck. */}
          <div ref={marker} />
          <div
            data-stuck={stuck || undefined}
            // While a theme pick waves over the figures (ThemeProvider), the
            // bar is lifted above the wave's canvas, which would otherwise
            // paint a figure's old look over it.
            data-docs-bar
            className="sticky top-0 z-20 bleed grid gap-x-6 gap-y-3 border-b border-transparent bg-background py-12 data-[lifted]:z-[2147483001] data-[stuck]:border-border md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
          >
            <NavRow label="Design system" current={pathname}>
              <Link
                to="/work/claude"
                activeOptions={{ exact: true }}
                className="nav-link"
                onClick={(e) =>
                  swap(e, () =>
                    router.navigate({
                      to: "/work/claude",
                      resetScroll: false,
                    })
                  )
                }
              >
                <NavLabel>Overview</NavLabel>
              </Link>
              {GROUPS.map((tab) => (
                <Link
                  key={tab.slug}
                  to="/work/claude/$doc"
                  params={{ doc: tab.slug }}
                  className="nav-link"
                  onClick={(e) =>
                    swap(e, () =>
                      router.navigate({
                        to: "/work/claude/$doc",
                        params: { doc: tab.slug },
                        resetScroll: false,
                      })
                    )
                  }
                >
                  <NavLabel>{tab.name}</NavLabel>
                </Link>
              ))}
            </NavRow>
            {/* For the figures: their theme, and the spacing view. Where a
                tab has no live figures (Overview, Templates) the two are
                left out. */}
            {figures && (
              <div className="flex shrink-0 items-center gap-3 max-md:order-last">
                <ThemePicker />
                <SpacingToggle />
              </div>
            )}
            {group && <ChapterNav group={group} className="md:col-span-2" />}
          </div>
          <Outlet />
        </main>
        <SpacingOverlay />
      </div>
    </ThemeProvider>
  )
}
