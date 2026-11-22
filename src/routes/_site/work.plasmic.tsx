import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
  useRouter,
} from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { BackButton } from "@/components/BackButton"
import { Navigation } from "@/components/Navigation"
import { ChapterNav } from "@/components/work/claude/chapter-nav"
import { NavLabel, NavRow } from "@/components/work/claude/nav-list"
import { YEARS, findYear } from "@/components/work/plasmic/years"
import { PK_THEMES, PkThemeContext } from "@/components/work/plasmic/theme"
import type { PkTheme } from "@/components/work/plasmic/theme"
import { notify } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { wave } from "@/lib/wave"

// leo.dev/work/plasmic: the design of Plasmic, a visual tool for building
// React apps, year by year (Leo, 2026-11-21). Unlisted, like /work. Built on
// the docs' shell (/work/claude): the introduction, then a bar held at the
// top of the window with a tab per year and the year's dives in the
// chapter bar under them; a year's page is the stage (stage.tsx), the app
// on a desktop, played as the page scrolls. The years are listed in
// src/components/work/plasmic/years.ts.

export const Route = createFileRoute("/_site/work/plasmic")({
  head: () => ({
    meta: [
      { title: "Plasmic · Leo Succar" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlasmicWork,
})

const LINK =
  "underline decoration-dotted hover:text-tint hover:decoration-solid"

const FACTS: Array<[label: string, values: Array<React.ReactNode>]> = [
  ["My Role", ["Founding Designer"]],
  [
    "Company",
    [
      <a
        key="plasmic"
        className={LINK}
        href="https://plasmic.app/"
        target="_blank"
      >
        Plasmic
      </a>,
    ],
  ],
  ["Location", ["Remote"]],
  ["Years", ["2020–'24"]],
]

/**
 * The product theme's dots: the studio and its browser, dark (as Plasmic
 * was meant to be) or light (as it shipped), each dot in its own color.
 */
function ThemeDots({
  theme,
  onPick,
}: {
  theme: PkTheme
  onPick: (t: PkTheme, from: HTMLElement) => void
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="group"
      aria-label="Studio theme"
    >
      {PK_THEMES.map(({ id, name, swatch }) => (
        <button
          key={id}
          type="button"
          aria-label={`${name} studio`}
          aria-pressed={theme === id}
          title={name}
          onClick={(e) => onPick(id, e.currentTarget)}
          className={cn(
            "h-5 w-5 rounded-full outline outline-1 -outline-offset-1 outline-[color:var(--color-border)] [corner-shape:round]",
            theme === id && "outline-2 outline-offset-1 outline-tint"
          )}
          style={{ background: swatch }}
        />
      ))}
    </div>
  )
}

function PlasmicWork() {
  const { pathname } = useLocation()
  const open = pathname.replace(/\/$/, "").split("/")[3] ?? ""
  const year = findYear(open)

  // The product theme (./theme.tsx): a pick waves over the stage.
  const [theme, setThemeNow] = useState<PkTheme>("dark")
  const setTheme = (t: PkTheme, from?: HTMLElement) => {
    if (t === theme) return
    notify(`Studio switched to ${t === "dark" ? "Dark" : "Light"}`)
    void wave(
      document.querySelector(".pl-browser"),
      () => flushSync(() => setThemeNow(t)),
      {
        source: from,
      }
    )
  }

  // The bar's place and height, as on the docs: once held at the top of the
  // window it draws a line under itself, and its height is handed down as
  // `--docs-bar`, which the stage is held under.
  const marker = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const [barHeight, setBarHeight] = useState<number | null>(null)
  useEffect(() => {
    const el = bar.current
    if (!el) return
    const measure = () => setBarHeight(Math.round(el.offsetHeight))
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const el = marker.current
    if (!el) return
    let frame = 0
    const measure = () => {
      frame = 0
      setStuck(el.getBoundingClientRect().top < 0.5)
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

  // A tab swaps the page under the bar, carried by the wave, as the docs'
  // tabs do; scrolled into the section, the next page starts from its top.
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
    move(go, e.currentTarget, e.nativeEvent)
  }
  const move = (
    go: () => Promise<void>,
    source: Element,
    focus?: MouseEvent | KeyboardEvent
  ) => {
    // From one year to another, the page lands as far through the next
    // year as it was through this one, so time can be scrubbed from a tab
    // to the next (Leo, 2026-11-21: "bounce through time").
    const through = () => {
      const t = document.querySelector<HTMLElement>(".pl-track")
      if (!t) return null
      const r = t.getBoundingClientRect()
      const line =
        document.querySelector("[data-docs-bar]")?.getBoundingClientRect()
          .bottom ?? 0
      return {
        r,
        p: (line - r.top) / Math.max(1, r.height - window.innerHeight),
      }
    }
    const was = through()
    void wave(
      content.current,
      async () => {
        await go()
        await new Promise((done) => requestAnimationFrame(done))
        const now = through()
        if (was && now && was.p > 0) {
          const line =
            document.querySelector("[data-docs-bar]")?.getBoundingClientRect()
              .bottom ?? 0
          const target =
            now.r.top +
            window.scrollY -
            line +
            was.p * Math.max(1, now.r.height - window.innerHeight)
          window.scrollTo({ top: Math.max(0, target), behavior: "instant" })
          return
        }
        const top = marker.current?.getBoundingClientRect().top ?? 0
        if (top < 0)
          window.scrollTo({ top: top + window.scrollY, behavior: "instant" })
      },
      { source, focus }
    )
  }

  // ← and → step from year to year as the tabs do, keeping the place
  // through the year, so time can be scrubbed from the keyboard too.
  const moveRef = useRef(move)
  useEffect(() => {
    moveRef.current = move
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.shiftKey ||
        e.defaultPrevented
      )
        return
      const t = e.target as HTMLElement | null
      if (t?.closest("input, textarea, select, [contenteditable], dialog"))
        return
      const tabs = [
        ...document.querySelectorAll<HTMLAnchorElement>(
          "[data-docs-bar] .nav-link"
        ),
      ]
      const at = tabs.findIndex((a) => a.hasAttribute("aria-current"))
      const next = tabs.at(at + (e.key === "ArrowRight" ? 1 : -1))
      if (at < 0 || !next || (at === 0 && e.key === "ArrowLeft")) return
      e.preventDefault()
      const href = next.getAttribute("href") ?? ""
      moveRef.current(
        () => router.navigate({ to: href, resetScroll: false }),
        next,
        e
      )
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [router])

  return (
    <PkThemeContext.Provider value={{ theme, setTheme }}>
      <Navigation className="rule-b pb-12">
        <BackButton to="/work" label="Back to work" />
      </Navigation>

      <div data-no-wave className="contents">
        <div className="bleed border-b bg-gray-6">
          <header className="flex flex-col gap-6 px-6 py-12 md:px-12">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">Plasmic</h1>
              <p className="max-w-cols-9 text-pretty text-muted-foreground">
                I was Plasmic’s founding designer, from 2020 to 2024. This is
                the work, year by year, rebuilt from my design files: scroll
                through the app as it was designed, with the directions taken,
                how it works, and what was learned. Move into the app to try it
                yourself, follow one part of it across the years, or step
                through them with ← and →.
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

        <main
          ref={content}
          className="bleed bg-background pb-12 [--bleed-pad:24px] [--docs-bar:226px] md:[--bleed-pad:48px] md:[--docs-bar:182px]"
          style={
            barHeight === null
              ? undefined
              : ({ "--docs-bar": `${barHeight}px` } as React.CSSProperties)
          }
        >
          <div ref={marker} />
          <div
            ref={bar}
            data-docs-bar
            data-stuck={stuck || undefined}
            className="sticky top-0 z-20 bleed grid gap-x-6 gap-y-6 border-b border-transparent bg-background py-12 data-[stuck]:border-border md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
          >
            <NavRow label="Plasmic" current={pathname}>
              <Link
                to="/work/plasmic"
                activeOptions={{ exact: true }}
                className="nav-link"
                onClick={(e) =>
                  swap(e, () =>
                    router.navigate({ to: "/work/plasmic", resetScroll: false })
                  )
                }
              >
                <NavLabel>Overview</NavLabel>
              </Link>
              {YEARS.filter((y) => y.dives.length).map((y) => (
                <Link
                  key={y.slug}
                  to="/work/plasmic/$year"
                  params={{ year: y.slug }}
                  className="nav-link"
                  onClick={(e) =>
                    swap(e, () =>
                      router.navigate({
                        to: "/work/plasmic/$year",
                        params: { year: y.slug },
                        resetScroll: false,
                      })
                    )
                  }
                >
                  <NavLabel>{y.name}</NavLabel>
                </Link>
              ))}
            </NavRow>
            {year && (
              <div className="flex shrink-0 items-center gap-3 max-md:order-last">
                <ThemeDots theme={theme} onPick={setTheme} />
              </div>
            )}
            {year && (
              <ChapterNav
                className="max-md:order-last md:col-span-2"
                group={{
                  slug: year.slug,
                  name: year.name,
                  docs: year.dives.map((d) => ({
                    slug: d.slug,
                    title: d.title,
                  })),
                }}
              />
            )}
          </div>
          <Outlet />
        </main>
      </div>
    </PkThemeContext.Provider>
  )
}
