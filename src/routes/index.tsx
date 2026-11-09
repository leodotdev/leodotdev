import { createFileRoute, redirect } from "@tanstack/react-router"

// The site has no home page of its own: / is the projects page.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/projects", statusCode: 301 })
  },
})
