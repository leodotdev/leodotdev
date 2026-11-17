import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "@/components/projects/home-page"
import { ProjectsSkeleton } from "@/components/projects/projects-skeleton"
import { getHomePage } from "@/server/content"

// leo.dev/work: the home page plus the "Recent work" section, which shows
// nowhere else. The link is unlisted (nothing on the site points here and
// search engines are told not to index it), not private: anyone who has it
// sees the section.
export const Route = createFileRoute("/_site/work/")({
  loader: () => getHomePage(),
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
    links: [{ rel: "canonical", href: "https://leo.dev/" }],
  }),
  pendingComponent: ProjectsSkeleton,
  component: WorkPage,
})

function WorkPage() {
  const { experiences, references } = Route.useLoaderData()
  return (
    <HomePage experiences={experiences} references={references} recentWork />
  )
}
