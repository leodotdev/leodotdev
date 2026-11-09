import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "@/components/projects/home-page"
import { ProjectsSkeleton } from "@/components/projects/projects-skeleton"
import { getProjectsPage } from "@/server/content"

// /projects used to be the home page (/ redirected here with a permanent 308,
// which browsers cache). It keeps rendering the same page, rather than
// redirecting back to /, so a cached 308 can't cause a redirect loop.
// Search engines are pointed at / through the canonical link.
export const Route = createFileRoute("/_site/projects/")({
  loader: () => getProjectsPage(),
  head: () => ({ links: [{ rel: "canonical", href: "https://leo.dev/" }] }),
  pendingComponent: ProjectsSkeleton,
  component: ProjectsPage,
})

function ProjectsPage() {
  // The loader also returns `projects`, for the hidden projects section.
  const { experiences, references } = Route.useLoaderData()
  return <HomePage experiences={experiences} references={references} />
}
