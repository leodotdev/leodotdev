import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "@/components/projects/home-page"
import { ProjectsSkeleton } from "@/components/projects/projects-skeleton"
import { getHomePage } from "@/server/content"

// The home page at leo.dev/.
export const Route = createFileRoute("/_site/")({
  loader: () => getHomePage(),
  pendingComponent: ProjectsSkeleton,
  component: Home,
})

function Home() {
  const { experiences, references } = Route.useLoaderData()
  return <HomePage experiences={experiences} references={references} />
}
