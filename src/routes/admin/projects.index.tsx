import { useState } from "react"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { Thumb } from "@/components/admin/fields"
import { Button } from "@/components/ui/button"
import { adminCreateProject, adminListProjects } from "@/server/admin"

export const Route = createFileRoute("/admin/projects/")({
  loader: () => adminListProjects(),
  component: ProjectsAdmin,
})

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

function ProjectsAdmin() {
  const projects = Route.useLoaderData()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = toSlug(name)
    if (!name.trim() || !slug) return
    setBusy(true)
    setError(null)
    try {
      const { id } = await adminCreateProject({ data: { name: name.trim(), slug } })
      await navigate({ to: "/admin/projects/$id", params: { id } })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the project")
      setBusy(false)
    }
  }

  return (
    <>
      <form onSubmit={create} className="flex flex-wrap items-center gap-3">
        <input
          className="min-w-0 flex-1 rounded-md border bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" disabled={busy || !toSlug(name)}>
          {busy ? "Creating…" : "New project"}
        </Button>
        {error && <p className="w-full text-xs text-red-500">{error}</p>}
      </form>

      <ul className="flex flex-col divide-y border-y">
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              to="/admin/projects/$id"
              params={{ id: p.id }}
              className="flex items-center gap-4 py-3 hover:bg-secondary/50"
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-secondary">
                <Thumb image={p.image ?? p.images[0]?.image} alt="" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate">{p.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {[p.client, p.year, `${p.images.length} images`].filter(Boolean).join(" · ")}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
