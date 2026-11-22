import { Link, createFileRoute } from "@tanstack/react-router"
import { YEARS } from "@/components/work/plasmic/years"

// /work/plasmic's overview: the years, a row each, the built ones linking to
// their stage.
export const Route = createFileRoute("/_site/work/plasmic/")({
  component: Overview,
})

function Overview() {
  return (
    <div className="flex flex-col pt-0">
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
