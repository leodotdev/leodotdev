import { Link, createFileRoute, useHydrated } from "@tanstack/react-router"
import { APP_H, APP_W, ShotView, Stage } from "@/components/work/plasmic/stage"
import { usePkTheme } from "@/components/work/plasmic/theme"
import { BEFORE, YEARS } from "@/components/work/plasmic/years"

// /work/plasmic's overview: the research before 2020, played on the stage
// like a year, then the years, a row each with a small live picture of its
// first scene, linking to theirs (a year still to come is listed as Soon).
export const Route = createFileRoute("/_site/work/plasmic/")({
  component: Overview,
})

function Overview() {
  return (
    <>
      <Stage year={BEFORE} />
      <YearList />
    </>
  )
}

function YearList() {
  const { theme } = usePkTheme()
  const hydrated = useHydrated()
  return (
    <div className="flex flex-col pt-12">
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
