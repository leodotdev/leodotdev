import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
  useRouter,
} from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { TbChevronLeft, TbChevronRight } from "react-icons/tb"
import { BackButton } from "@/components/BackButton"
import { Navigation } from "@/components/Navigation"
import { GROUPS, THEMES } from "@/components/work/claude/docs"
import { NavLabel, NavList } from "@/components/work/claude/nav-list"
import { SpacingOverlay, SpacingToggle } from "@/components/work/claude/spacing"
import { ThemeProvider, usePreviewTheme } from "@/components/work/claude/ui"
import { glideTo } from "@/lib/glide"
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
  // On a narrow screen the tab row scrolls sideways. The open tab is kept in
  // view, clear of the arrow buttons that sit over the row's ends.
  const tabs = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const overview = pathname.replace(/\/$/, "") === "/work/claude"
  useEffect(() => {
    const row = tabs.current
    const tab = row?.querySelector<HTMLElement>("[aria-current]")
    if (!row || !tab) return
    const start = tab.offsetLeft - 48
    const end = tab.offsetLeft + tab.offsetWidth + 48 - row.clientWidth
    if (row.scrollLeft > start) row.scrollLeft = start
    else if (row.scrollLeft < end) row.scrollLeft = end
  }, [pathname])

  // Which sides have tabs out of sight: each gets an arrow button.
  const [hidden, setHidden] = useState({ left: false, right: false })
  useEffect(() => {
    const row = tabs.current
    if (!row) return
    const measure = () => {
      const left = row.scrollLeft > 4
      const right = row.scrollLeft < row.scrollWidth - row.clientWidth - 4
      setHidden((was) =>
        was.left === left && was.right === right ? was : { left, right }
      )
    }
    // The observer also reports once when it starts watching.
    const observer = new ResizeObserver(measure)
    observer.observe(row)
    row.addEventListener("scroll", measure, { passive: true })
    return () => {
      observer.disconnect()
      row.removeEventListener("scroll", measure)
    }
  }, [])
  // The tab row stays at the top of the window while the page scrolls. Once
  // it is held there (the marker above it has gone off the top) it draws a
  // line under itself, between it and what scrolls beneath.
  const marker = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const el = marker.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) =>
      setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
    const run = () =>
      wave(
        content.current,
        async () => {
          await go()
          // A frame for the new page to be on screen before it is captured.
          await new Promise((done) => requestAnimationFrame(done))
        },
        { source: tab, focus: click }
      )
    // If the page is scrolled into the section, it first glides back to the
    // section's start, tab row at the top of the window, and the swap plays
    // there: the wave shows a picture of what is on screen where it is, so
    // the page must not move under it.
    const start = marker.current
    const top = start ? start.getBoundingClientRect().top : 0
    if (start && top < 0) void glideTo(top + window.scrollY).then(run)
    else void run()
  }

  const page = (direction: 1 | -1) => {
    const row = tabs.current
    if (!row) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    row.scrollBy({
      left: direction * row.clientWidth * 0.7,
      behavior: still ? "auto" : "smooth",
    })
  }

  return (
    <ThemeProvider>
      <Navigation className="border-b pb-12">
        <BackButton to="/work" label="Back to work" />
      </Navigation>

      {/* Below the bar nothing takes the site's hover or click wave, except
          the overview's topic rows, which ask for it with `data-wave`. */}
      <div data-no-wave className="contents">
        {/* The work's introduction, on every tab: a section of its own, a
            step darker than the page. */}
        <div className="border-b bg-gray-6">
          <header className="flex flex-col gap-6 px-6 py-12 md:px-12">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">
                Claude.com Design System &amp; Web Design
              </h1>
              <p className="max-w-cols-9 text-pretty text-muted-foreground">
                With two other designers, we crafted the design system and pages
                for the new{" "}
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
            it as loose content and play on each thing in it.) */}
        <main ref={content} className="bg-background px-6 pt-3 pb-12 md:px-12">
          {/* The tabs, at the top of the section they switch, where they
              stay while the page scrolls: a plain row of names starting on
              the text column, with the theme dots at the other end. When the
              row runs out of room (a phone) it scrolls sideways, with an
              arrow button over whichever end has tabs out of sight, and the
              dots go under it. The bar spans the page, on the page's own
              color, so what scrolls under it is covered. */}
          <div ref={marker} />
          <div
            data-stuck={stuck || undefined}
            // While a theme pick waves over the figures (ThemeProvider), the
            // bar is lifted above the wave's canvas, which would otherwise
            // paint a figure's old look over it.
            data-docs-bar
            className="sticky top-0 z-20 -mx-6 mb-9 flex justify-between gap-x-6 gap-y-3 border-b border-transparent bg-background px-6 py-3 data-[lifted]:z-[2147483001] data-[stuck]:border-border max-md:flex-col md:-mx-12 md:items-center md:px-12"
          >
            <div className="relative flex min-w-0">
              <NavList
                ref={tabs}
                label="Design system"
                orientation="horizontal"
              >
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
                {GROUPS.map((group) => (
                  <Link
                    key={group.slug}
                    to="/work/claude/$doc"
                    params={{ doc: group.slug }}
                    className="nav-link"
                    onClick={(e) =>
                      swap(e, () =>
                        router.navigate({
                          to: "/work/claude/$doc",
                          params: { doc: group.slug },
                          resetScroll: false,
                        })
                      )
                    }
                  >
                    <NavLabel>{group.name}</NavLabel>
                  </Link>
                ))}
              </NavList>
              {/* For the mouse and touch only: the keyboard reaches every tab
                  by tabbing, which scrolls it into view. */}
              {hidden.left && (
                <div className="nav-list-more -left-1 bg-linear-to-r pr-6 pl-1">
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    onClick={() => page(-1)}
                  >
                    <TbChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              )}
              {hidden.right && (
                <div className="nav-list-more -right-1 bg-linear-to-l pr-1 pl-6">
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    onClick={() => page(1)}
                  >
                    <TbChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {/* For the figures: their theme, and the spacing view. The
                overview has no figures, so there the two are left out. */}
            {!overview && (
              <div className="flex shrink-0 items-center gap-3">
                <ThemePicker />
                <SpacingToggle />
              </div>
            )}
          </div>
          <Outlet />
        </main>
        <SpacingOverlay />
      </div>
    </ThemeProvider>
  )
}
