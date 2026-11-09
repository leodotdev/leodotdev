import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "@/components/projects/home-page"
import { ProjectsSkeleton } from "@/components/projects/projects-skeleton"
import { getProjectsPage } from "@/server/content"

// The home page at leo.dev/.
export const Route = createFileRoute("/_site/")({
  loader: () => getProjectsPage(),
  pendingComponent: ProjectsSkeleton,
  component: Home,
})

function Home() {
  // The loader also returns `projects`, for the hidden projects section.
  const { experiences, references } = Route.useLoaderData()
  return <HomePage experiences={experiences} references={references} />
}
