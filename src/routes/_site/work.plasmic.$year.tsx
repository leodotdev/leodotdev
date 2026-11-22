import { createFileRoute, notFound } from "@tanstack/react-router"
import { Stage } from "@/components/work/plasmic/stage"
import { findYear } from "@/components/work/plasmic/years"

// A year of /work/plasmic: its dives, played on the stage as the page
// scrolls (src/components/work/plasmic/stage.tsx).
export const Route = createFileRoute("/_site/work/plasmic/$year")({
  loader: ({ params }) => {
    const year = findYear(params.year)
    if (!year?.dives.length) throw notFound()
    return year.slug
  },
  component: YearPage,
})

function YearPage() {
  const slug = Route.useLoaderData()
  const year = findYear(slug)
  if (!year) return null
  return <Stage key={year.slug} year={year} />
}
