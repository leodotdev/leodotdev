// Server functions behind /admin. Every one runs `requireAdmin`, which
// verifies the Cloudflare Access token on the call itself.
import { createServerFn } from "@tanstack/react-start"
import { asc, desc, eq, max } from "drizzle-orm"
import { z } from "zod"
import { requireAdmin } from "./auth/require-admin"

const db = async () => (await import("./db")).db()
const tables = async () => import("./db/schema")

// ---- Validation ------------------------------------------------------------

const nullableText = z
  .string()
  .trim()
  .transform((s) => (s === "" ? null : s))
  .nullable()

const img = z.object({
  src: z.string().regex(/^\/images\/[\w./-]+-\d+\.(webp|gif|png|jpe?g)$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  widths: z.array(z.number().int().positive()).min(1),
})

const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")

const projectInput = z.object({
  id: z.string(),
  slug,
  name: z.string().trim().min(1, "Name is required"),
  client: z.string().trim(),
  year: z.string().trim(),
  categories: z.array(z.string().trim()).transform((a) => a.filter(Boolean)),
  description: nullableText,
  image: img.nullable(),
  url: nullableText,
  embed: nullableText,
  images: z.array(
    z.object({ key: z.string(), image: img, alt: z.string().trim().optional() })
  ),
  paragraphs: z.array(z.string().trim()).transform((a) => a.filter(Boolean)),
  sort: z.number().int(),
})

const experienceInput = z.object({
  id: z.string(),
  logo: z.string().trim(),
  company: z.string().trim().min(1, "Company is required"),
  companyUrl: nullableText,
  position: z.string().trim(),
  location: z.string().trim(),
  duration: z.string().trim(),
  displayName: nullableText,
  altCompany: nullableText,
  altCompanyUrl: nullableText,
  team: nullableText,
  contract: z.boolean(),
  project: nullableText,
  projectUrl: nullableText,
  projectCompany: nullableText,
  projectCompanyUrl: nullableText,
  roundLogo: z.boolean(),
})

const referenceInput = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Name is required"),
  title: z.string().trim(),
  company: z.string().trim(),
  linkedinUrl: z.string().trim(),
  initials: z.string().trim(),
  quote: z.string().trim(),
})

const kind = z.enum(["experiences", "references"])
export type RowKind = z.infer<typeof kind>

// ---- Session ---------------------------------------------------------------

export const adminWhoami = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(({ context }) => context.admin)

// ---- Projects --------------------------------------------------------------

export const adminListProjects = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { projects } = await tables()
    return (await db())
      .select({
        id: projects.id,
        slug: projects.slug,
        name: projects.name,
        client: projects.client,
        year: projects.year,
        image: projects.image,
        images: projects.images,
      })
      .from(projects)
      .orderBy(desc(projects.year), asc(projects.sort))
  })

export const adminGetProject = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((id: string) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    const { projects } = await tables()
    const rows = await (await db()).select().from(projects).where(eq(projects.id, id))
    return rows.length ? rows[0] : null
  })

export const adminCreateProject = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((d: { name: string; slug: string }) =>
    z.object({ name: z.string().trim().min(1), slug }).parse(d)
  )
  .handler(async ({ data }) => {
    const { projects } = await tables()
    const id = crypto.randomUUID()
    try {
      await (await db())
        .insert(projects)
        .values({ id, name: data.name, slug: data.slug, year: String(new Date().getFullYear()) })
    } catch {
      throw new Error(`A project with the slug "${data.slug}" already exists`)
    }
    return { id }
  })

export const adminSaveProject = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((d: z.input<typeof projectInput>) => projectInput.parse(d))
  .handler(async ({ data }) => {
    const { projects } = await tables()
    const { id, ...fields } = data
    try {
      await (await db())
        .update(projects)
        .set({ ...fields, updatedAt: new Date() })
        .where(eq(projects.id, id))
    } catch {
      throw new Error(`A project with the slug "${data.slug}" already exists`)
    }
    return { ok: true }
  })

export const adminDeleteProject = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((id: string) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    const { projects } = await tables()
    await (await db()).delete(projects).where(eq(projects.id, id))
    return { ok: true }
  })

// ---- Experiences and references --------------------------------------------

async function rowTable(k: RowKind) {
  const t = await tables()
  return k === "experiences" ? t.experiences : t.references
}

export const adminListRows = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((k: RowKind) => kind.parse(k))
  .handler(async ({ data: k }) => {
    const t = await tables()
    const d = await db()
    return k === "experiences"
      ? { kind: k, rows: await d.select().from(t.experiences).orderBy(asc(t.experiences.sort)) }
      : { kind: k, rows: await d.select().from(t.references).orderBy(asc(t.references.sort)) }
  })

export const adminSaveRow = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((d: { kind: RowKind; row: unknown }) => {
    const k = kind.parse(d.kind)
    return k === "experiences"
      ? { kind: k, row: experienceInput.parse(d.row) }
      : { kind: k, row: referenceInput.parse(d.row) }
  })
  .handler(async ({ data }) => {
    const t = await tables()
    const d = await db()
    const { id, ...fields } = data.row
    if (data.kind === "experiences")
      await d
        .update(t.experiences)
        .set({ ...(fields as z.infer<typeof experienceInput>), updatedAt: new Date() })
        .where(eq(t.experiences.id, id))
    else
      await d
        .update(t.references)
        .set({ ...(fields as z.infer<typeof referenceInput>), updatedAt: new Date() })
        .where(eq(t.references.id, id))
    return { ok: true }
  })

export const adminCreateRow = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((k: RowKind) => kind.parse(k))
  .handler(async ({ data: k }) => {
    const t = await tables()
    const d = await db()
    const table = await rowTable(k)
    const [{ last }] = await d.select({ last: max(table.sort) }).from(table)
    const values = { id: crypto.randomUUID(), sort: (last ?? -1) + 1 }
    if (k === "experiences")
      await d.insert(t.experiences).values({ ...values, company: "New company" })
    else await d.insert(t.references).values({ ...values, name: "New reference" })
    return { id: values.id }
  })

export const adminDeleteRow = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((d: { kind: RowKind; id: string }) =>
    z.object({ kind, id: z.string() }).parse(d)
  )
  .handler(async ({ data }) => {
    const table = await rowTable(data.kind)
    await (await db()).delete(table).where(eq(table.id, data.id))
    return { ok: true }
  })

/** Rewrite `sort` to match the given id order. */
export const adminReorderRows = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((d: { kind: RowKind; ids: Array<string> }) =>
    z.object({ kind, ids: z.array(z.string()).min(1) }).parse(d)
  )
  .handler(async ({ data }) => {
    const table = await rowTable(data.kind)
    const d = await db()
    const [first, ...rest] = data.ids.map((id, i) =>
      d.update(table).set({ sort: i }).where(eq(table.id, id))
    )
    await d.batch([first, ...rest])
    return { ok: true }
  })

// ---- Images ----------------------------------------------------------------

const UPLOAD_TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/gif": "gif",
  "image/png": "png",
  "image/jpeg": "jpg",
}
const MAX_BYTES = 15 * 1024 * 1024

/**
 * Store one image in R2. The browser has already resized it: the form holds
 * `prefix` (e.g. projects/hacker), the original `width`/`height`, and one file
 * per stored width, named `w<width>`. SVG is refused: served from leo.dev, an
 * SVG could run script in the site's origin.
 */
export const adminUploadImage = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((form: FormData) => {
    if (!(form instanceof FormData)) throw new Error("Expected form data")
    const prefix = z
      .string()
      .regex(/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/)
      .parse(form.get("prefix"))
    const width = z.coerce.number().int().positive().parse(form.get("width"))
    const height = z.coerce.number().int().positive().parse(form.get("height"))
    const files: Array<{ w: number; file: File }> = []
    for (const [name, value] of form.entries()) {
      const m = /^w(\d+)$/.exec(name)
      if (!m) continue
      if (!(value instanceof File)) throw new Error("Bad upload")
      if (!UPLOAD_TYPES[value.type]) throw new Error(`Unsupported image type: ${value.type || "unknown"}`)
      if (value.size > MAX_BYTES) throw new Error("Image is larger than 15 MB")
      files.push({ w: Number(m[1]), file: value })
    }
    if (!files.length) throw new Error("No image in upload")
    return { prefix, width, height, files: files.sort((a, b) => a.w - b.w) }
  })
  .handler(async ({ data }) => {
    const { env } = await import("cloudflare:workers")
    const id = crypto.randomUUID().slice(0, 8)
    const keyFor = (w: number, type: string) =>
      `${data.prefix}/${id}-${w}.${UPLOAD_TYPES[type]}`
    await Promise.all(
      data.files.map(({ w, file }) =>
        env.MEDIA.put(keyFor(w, file.type), file.stream(), {
          httpMetadata: {
            contentType: file.type,
            cacheControl: "public, max-age=31536000, immutable",
          },
        })
      )
    )
    const largest = data.files[data.files.length - 1]
    return {
      src: `/images/${keyFor(largest.w, largest.file.type)}`,
      width: data.width,
      height: data.height,
      widths: data.files.map((f) => f.w),
    }
  })
