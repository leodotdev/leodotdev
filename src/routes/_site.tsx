import { Outlet, createFileRoute } from "@tanstack/react-router"

// Pathless layout for the site's pages (the Next app's `(site)` group).
export const Route = createFileRoute("/_site")({
  component: Outlet,
})
