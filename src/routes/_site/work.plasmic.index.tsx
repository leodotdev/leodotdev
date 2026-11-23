import { Link, createFileRoute, useHydrated } from "@tanstack/react-router"
import { NextTab } from "@/components/work/claude/next-tab"
import { APP_H, APP_W, ShotView } from "@/components/work/plasmic/stage"
import { usePkTheme } from "@/components/work/plasmic/theme"
import { THREADS } from "@/components/work/plasmic/threads"
import { YEARS } from "@/components/work/plasmic/years"

// /work/plasmic's overview: the tabs, a row each (the research, then the
// years) with a small live picture of its first scene, linking to theirs (a
// year still to come is listed as Soon), and the threads: a part of the
// product followed from year to year, each step a link to its dive. It has
// no stage of its own: the research it used to play has its own tab.
export const Route = createFileRoute("/_site/work/plasmic/")({
  component: Overview,
})

function Overview() {
  const first = YEARS.find((year) => year.dives.length)
  return (
    <>
      <YearList />
      <Threads />
      {first && (
        <NextTab
          to="/work/plasmic/$year"
          params={{ year: first.slug }}
          name={first.name}
        />
      )}
    </>
  )
}

function YearList() {
  const { theme } = usePkTheme()
  const hydrated = useHydrated()
  return (
    <div className="flex flex-col">
      {YEARS.map((year) => {
        const first = year.dives.at(0)?.scenes.at(0)
        const row = (
          <>
            <span className="w-24 shrink-0 font-semibold">{year.name}</span>
            <span className="flex-1 text-pretty text-muted-foreground">
              {year.summary || "Soon"}
            </span>
            {first && hydrated && (
              <span aria-hidden className="shrink-0 max-md:hidden">
                <ShotView
                  shot={{
                    label: year.name,
                    w: APP_W,
                    h: APP_H,
                    view: () => first.view(first.state ?? {}),
                  }}
                  k={0.14}
                  theme={theme}
                />
              </span>
            )}
          </>
        )
        return first ? (
          <Link
            key={year.slug}
            to="/work/plasmic/$year"
            params={{ year: year.slug }}
            data-wave
            className="rule-t flex items-center gap-6 py-6 hover:bg-card"
          >
            {row}
          </Link>
        ) : (
          <div key={year.slug} className="rule-t flex items-center gap-6 py-6">
            {row}
          </div>
        )
      })}
    </div>
  )
}

function Threads() {
  return (
    <div className="flex flex-col pt-12">
      <div className="flex flex-col gap-1 pb-6">
        <h2 className="font-semibold">Threads</h2>
        <p className="max-w-cols-9 text-pretty text-muted-foreground">
          One part of the app, followed across the years.
        </p>
      </div>
      {THREADS.map((thread) => (
        <div
          key={thread.title}
          className="rule-t flex gap-6 py-6 max-md:flex-col max-md:gap-3"
        >
          <span className="w-40 shrink-0">{thread.title}</span>
          <ol className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-2">
            {thread.steps.map(([y, slug], i) => {
              const dive = YEARS.find((yr) => yr.slug === y)?.dives.find(
                (d) => d.slug === slug
              )
              if (!dive) return null
              return (
                <li key={y + slug} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-muted-foreground">
                      →
                    </span>
                  )}
                  <Link
                    to="/work/plasmic/$year"
                    params={{ year: y }}
                    hash={slug}
                    className="flex items-baseline gap-2 rounded-full bg-card px-3 py-1 hover:bg-gray-5"
                  >
                    <span className="text-xs text-muted-foreground">{y}</span>
                    {dive.title}
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}
