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
import { NavLabel, NavRow } from "@/components/work/claude/nav-list"
import { YEARS, findYear } from "@/components/work/plasmic/years"
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

function PlasmicWork() {
  const { pathname } = useLocation()
  const open = pathname.replace(/\/$/, "").split("/")[3] ?? ""
  const year = findYear(open)

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
    void wave(
      content.current,
      async () => {
        await go()
        await new Promise((done) => requestAnimationFrame(done))
        const top = marker.current?.getBoundingClientRect().top ?? 0
        if (top < 0)
          window.scrollTo({ top: top + window.scrollY, behavior: "instant" })
      },
      { source: e.currentTarget, focus: e.nativeEvent }
    )
  }

  return (
    <>
      <Navigation className="rule-b pb-12">
        <BackButton to="/work" label="Back to work" />
      </Navigation>

      <div data-no-wave className="contents">
        <div className="bleed border-b bg-gray-6">
          <header className="flex flex-col gap-6 px-6 py-12 md:px-12">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">Plasmic</h1>
              <p className="max-w-cols-9 text-pretty text-muted-foreground">
                As Plasmic's founding designer, I led the design of every
                interface, component, and flow of a visual tool for building
                React apps. This is that work, year by year: scroll through the
                app as it was designed, with the decisions behind it and how it
                works. Move into the app to try it yourself.
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
            className="sticky top-0 z-20 bleed grid gap-6 border-b border-transparent bg-background py-12 data-[stuck]:border-border"
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
              <ChapterNav
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
    </>
  )
}
