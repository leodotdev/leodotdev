import { useState } from "react"
import { Link, createFileRoute, notFound, useNavigate, useRouter } from "@tanstack/react-router"
import { TbArrowLeft, TbArrowRight, TbTrash } from "react-icons/tb"
import {
  Checkbox,
  SaveBar,
  TextArea,
  TextField,
  Thumb,
  UploadButton,
  useSaver,
} from "@/components/admin/fields"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/categories"
import { adminDeleteProject, adminGetProject, adminSaveProject } from "@/server/admin"
import type { Project } from "@/server/db/schema"

export const Route = createFileRoute("/admin/projects/$id")({
  loader: async ({ params }) => {
    const project = await adminGetProject({ data: params.id })
    if (!project) throw notFound()
    return project
  },
  component: ProjectEditor,
})

type Draft = Omit<Project, "updatedAt">

function ProjectEditor() {
  const loaded = Route.useLoaderData()
  // Fresh editor state whenever another project loads.
  return <Editor key={loaded.id} initial={loaded} />
}

function move<T>(list: Array<T>, from: number, to: number): Array<T> {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function Editor({ initial }: { initial: Project }) {
  const router = useRouter()
  const navigate = useNavigate()
  const { updatedAt: _ignored, ...start } = initial
  const [draft, setDraft] = useState<Draft>(start)
  const [saved, setSaved] = useState<Draft>(start)
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const set = <TKey extends keyof Draft>(k: TKey, v: Draft[TKey]) => setDraft((d) => ({ ...d, [k]: v }))
  const saver = useSaver(async (d: Draft) => {
    await adminSaveProject({ data: d })
    setSaved(d)
    await router.invalidate()
  })
  const prefix = `projects/${draft.slug || "untitled"}`
  const known = new Set(categories.map((c) => c.value))
  const extraCategories = draft.categories.filter((c) => !known.has(c))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link to="/admin/projects" className="text-muted-foreground hover:text-foreground">
          ← Projects
        </Link>
        <h1 className="font-semibold">{saved.name}</h1>
        <a
          href={`/projects/${saved.slug}`}
          target="_blank"
          className="text-xs text-muted-foreground underline decoration-dotted hover:text-blue-500"
        >
          View on site
        </a>
      </div>

      <SaveBar
        dirty={dirty}
        saving={saver.saving}
        error={saver.error}
        savedAt={saver.savedAt}
        onSave={() => void saver.run(draft)}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <TextField label="Name" value={draft.name} onChange={(v) => set("name", v)} />
        <TextField
          label="Slug"
          hint="The URL: leo.dev/projects/<slug>"
          value={draft.slug}
          onChange={(v) => set("slug", v)}
        />
        <TextField label="Client" value={draft.client} onChange={(v) => set("client", v)} />
        <TextField label="Year" value={draft.year} onChange={(v) => set("year", v)} />
        <TextField label="Link" value={draft.url} onChange={(v) => set("url", v)} />
        <TextField
          label="Embed URL"
          hint="Figma, YouTube, Vimeo, Loom or CodePen; shown after the cover"
          value={draft.embed}
          onChange={(v) => set("embed", v)}
        />
        <TextField
          label="Order within the year"
          hint="Lower comes first"
          value={String(draft.sort)}
          onChange={(v) => set("sort", Number.parseInt(v, 10) || 0)}
        />
      </section>

      <TextArea
        label="Description"
        value={draft.description}
        onChange={(v) => set("description", v)}
      />

      <section className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Categories</span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {categories
            .filter((c) => c.value !== "all")
            .map((c) => (
              <Checkbox
                key={c.value}
                label={c.title}
                checked={draft.categories.includes(c.value)}
                onChange={(on) =>
                  set(
                    "categories",
                    on
                      ? [...draft.categories, c.value]
                      : draft.categories.filter((x) => x !== c.value)
                  )
                }
              />
            ))}
          {extraCategories.map((c) => (
            <Checkbox
              key={c}
              label={c}
              checked
              onChange={() => set("categories", draft.categories.filter((x) => x !== c))}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">Cover image</span>
        <div className="flex flex-wrap items-end gap-4">
          {draft.image && (
            <div className="h-32 w-48 overflow-hidden rounded-md bg-secondary">
              <Thumb image={draft.image} alt="Cover" />
            </div>
          )}
          <UploadButton
            prefix={prefix}
            label={draft.image ? "Replace cover" : "Upload cover"}
            onUploaded={([img]) => set("image", img)}
          />
          {draft.image && (
            <Button type="button" variant="ghost" onClick={() => set("image", null)}>
              Remove cover
            </Button>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Gallery ({draft.images.length})
          </span>
          <UploadButton
            prefix={prefix}
            multiple
            label="Add images"
            onUploaded={(imgs) =>
              set("images", [
                ...draft.images,
                ...imgs.map((image) => ({ key: crypto.randomUUID().slice(0, 12), image })),
              ])
            }
          />
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {draft.images.map((item, i) => (
            <li key={item.key} className="flex flex-col gap-2">
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-secondary">
                <Thumb image={item.image} alt={item.alt ?? ""} />
              </div>
              <input
                className="rounded-md border bg-transparent px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Alt text"
                value={item.alt ?? ""}
                onChange={(e) =>
                  set(
                    "images",
                    draft.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x))
                  )
                }
              />
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Move earlier"
                  disabled={i === 0}
                  onClick={() => set("images", move(draft.images, i, i - 1))}
                >
                  <TbArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Move later"
                  disabled={i === draft.images.length - 1}
                  onClick={() => set("images", move(draft.images, i, i + 1))}
                >
                  <TbArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Remove image"
                  className="ml-auto"
                  onClick={() => set("images", draft.images.filter((_, j) => j !== i))}
                >
                  <TbTrash className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">Text, shown under the gallery</span>
        {draft.paragraphs.map((p, i) => (
          <div key={i} className="flex items-start gap-2">
            <textarea
              rows={3}
              className="w-full resize-y rounded-md border bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={p}
              onChange={(e) =>
                set(
                  "paragraphs",
                  draft.paragraphs.map((x, j) => (j === i ? e.target.value : x))
                )
              }
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Remove paragraph"
              onClick={() => set("paragraphs", draft.paragraphs.filter((_, j) => j !== i))}
            >
              <TbTrash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          className="w-fit"
          onClick={() => set("paragraphs", [...draft.paragraphs, ""])}
        >
          Add paragraph
        </Button>
      </section>

      <SaveBar
        dirty={dirty}
        saving={saver.saving}
        error={saver.error}
        savedAt={saver.savedAt}
        onSave={() => void saver.run(draft)}
      >
        <Button
          type="button"
          variant="ghost"
          className="ml-auto text-red-500 hover:text-red-500"
          onClick={async () => {
            if (!window.confirm(`Delete "${saved.name}"? This can't be undone.`)) return
            await adminDeleteProject({ data: saved.id })
            await navigate({ to: "/admin/projects" })
          }}
        >
          Delete project
        </Button>
      </SaveBar>
    </div>
  )
}
