import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    // Loader data comes from the Worker's edge cache; keep it a minute
    // client-side too so back/forward and hover-preloads don't refetch.
    defaultStaleTime: 60_000,
    defaultPreloadStaleTime: 60_000,
    defaultStructuralSharing: true,
    defaultPendingMs: 250,
    defaultPendingMinMs: 300,
  })
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
