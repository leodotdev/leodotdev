import { Link, createFileRoute } from "@tanstack/react-router"
import { Stage } from "@/components/work/plasmic/stage"
import { BEFORE, YEARS } from "@/components/work/plasmic/years"

// /work/plasmic's overview: the research before 2020, played on the stage
// like a year, then the years, a row each, linking to theirs.
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
  return (
    <div className="flex flex-col pt-12">
      {YEARS.map((year) => {
        const row = (
          <>
            <span className="w-24 shrink-0 font-semibold">{year.name}</span>
            <span className="text-pretty text-muted-foreground">
              {year.summary}
            </span>
            {!year.dives.length && (
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                Soon
              </span>
            )}
          </>
        )
        return year.dives.length ? (
          <Link
            key={year.slug}
            to="/work/plasmic/$year"
            params={{ year: year.slug }}
            data-wave
            className="rule-t flex gap-6 py-6 hover:bg-card"
          >
            {row}
          </Link>
        ) : (
          <div key={year.slug} className="rule-t flex gap-6 py-6">
            {row}
          </div>
        )
      })}
    </div>
  )
}
