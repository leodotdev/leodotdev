import { Link, Outlet, createFileRoute } from "@tanstack/react-router"
import { adminWhoami } from "@/server/admin"

// The admin: Cloudflare Access gates /admin at the edge, the Worker re-checks
// the token for /admin pages (src/server.ts), and every admin server function
// checks it again (requireAdmin).
export const Route = createFileRoute("/admin")({
  beforeLoad: async () => ({ admin: await adminWhoami() }),
  head: () => ({
    meta: [{ title: "Admin · leo.dev" }, { name: "robots", content: "noindex" }],
  }),
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="font-semibold">Admin</h1>
      <p className="text-muted-foreground">
        {error instanceof Error ? error.message : "Something went wrong"}
      </p>
    </main>
  ),
  component: AdminLayout,
})

const NAV = [
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/experience", label: "Experience" },
  { to: "/admin/references", label: "References" },
] as const

function AdminLayout() {
  const { admin } = Route.useRouteContext()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b bg-background/90 px-6 py-3 backdrop-blur md:px-12">
        <span className="font-semibold">Admin</span>
        <nav className="flex gap-4">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-muted-foreground hover:text-foreground"
              activeProps={{ className: "!text-foreground underline" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <span className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          {admin.email}
          <a href="/" className="underline decoration-dotted hover:text-blue-500">
            View site
          </a>
        </span>
      </header>
      <main className="flex flex-col gap-8 px-6 py-8 md:px-12">
        <Outlet />
      </main>
    </div>
  )
}
