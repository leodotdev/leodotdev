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
import { TABS } from "@/components/work/amo/docs"
import { ChapterNav } from "@/components/work/claude/chapter-nav"
import { NavLabel, NavRow } from "@/components/work/claude/nav-list"
import { wave } from "@/lib/wave"

// leo.dev/work/amo: an exploration for Amo that reimagines the iOS Contacts
// app as the social networking app (Leo, 2026-11-23; Figma file amo-2023 and
// its FigJam board). Unlisted, like /work. Built on the docs' shell
// (/work/claude): the introduction, then a bar held at the top of the window
// with two tabs, Research and Design, and the open tab's chapters in the
// chapter bar under them. The research is the board's pieces redrawn; the
// design is the file's ten screens as working phones, their stories told by
// the demo cursor in Leo's own notes (src/components/work/amo/).

export const Route = createFileRoute("/_site/work/amo")({
  head: () => ({
    meta: [
      { title: "Amo · Leo Succar" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AmoWork,
})

// (Only what is known of it: who it was for, what it was, and the year in
// the file's name.)
const FACTS: Array<[label: string, value: string]> = [
  ["For", "Amo"],
  ["Kind", "Exploration"],
  ["Platform", "iOS"],
  ["Year", "2023"],
]

function AmoWork() {
  const { pathname } = useLocation()
  const open = pathname.replace(/\/$/, "").split("/")[3] ?? ""
  const tab = TABS.find((t) => t.slug === open) ?? TABS[0]

  // The bar's place and height, as on the docs: held at the top of the
  // window it draws a line under itself, and its height is handed down as
  // `--docs-bar`, which a chapter gone to stops under.
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
  const swap = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    e.preventDefault()
    if (e.currentTarget.hasAttribute("aria-current")) return
    void wave(
      content.current,
      async () => {
        await router.navigate({ to, resetScroll: false })
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
              <h1 className="font-semibold">Amo</h1>
              <p className="max-w-cols-9 text-pretty text-muted-foreground">
                An exploration for Amo: the iOS Contacts app, reimagined as the
                social networking app. It starts from notes on the app as it is
                today, and ends in ten screens that follow one rule: make it the
                new native iOS Contacts app.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
              {FACTS.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd>{value}</dd>
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
            className="sticky top-0 z-20 bleed grid gap-x-6 gap-y-6 border-b border-transparent bg-background py-12 data-[stuck]:border-border"
          >
            <NavRow label="Amo" current={pathname}>
              <Link
                to="/work/amo"
                activeOptions={{ exact: true }}
                className="nav-link"
                onClick={(e) => swap(e, "/work/amo")}
              >
                <NavLabel>Research</NavLabel>
              </Link>
              <Link
                to="/work/amo/design"
                className="nav-link"
                onClick={(e) => swap(e, "/work/amo/design")}
              >
                <NavLabel>Design</NavLabel>
              </Link>
            </NavRow>
            <ChapterNav
              group={{
                slug: tab.slug || "research",
                name: tab.name,
                docs: tab.docs,
              }}
            />
          </div>
          <Outlet />
        </main>
      </div>
    </>
  )
}
