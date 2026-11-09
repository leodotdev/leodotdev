// Server functions for the public pages. They always run on the Worker
// (route loaders call them during SSR, and over /_serverfn on client
// navigation) and read D1, so edits made at /admin show up on the next request.
import { createServerFn } from "@tanstack/react-start"
import { asc, desc } from "drizzle-orm"
import type { Project } from "./db/schema"

const projectOrder = async () => {
  const { db } = await import("./db")
  const { projects } = await import("./db/schema")
  return db()
    .select()
    .from(projects)
    .orderBy(desc(projects.year), asc(projects.sort))
}

export const getProjectsPage = createServerFn({ method: "GET" }).handler(
  async () => {
    const { db } = await import("./db")
    const { experiences, references } = await import("./db/schema")
    const [projects, exp, refs] = await Promise.all([
      projectOrder(),
      db().select().from(experiences).orderBy(asc(experiences.sort)),
      db().select().from(references).orderBy(asc(references.sort)),
    ])
    return { projects, experiences: exp, references: refs }
  }
)

export type ProjectLink = Pick<Project, "slug" | "name" | "client" | "image">

const link = (p: Project | undefined): ProjectLink | null =>
  p ? { slug: p.slug, name: p.name, client: p.client, image: p.image } : null

/** A project plus its neighbors in the year-ordered list, or null for an unknown slug. */
export const getProjectPage = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const all = await projectOrder()
    const index = all.findIndex((p) => p.slug === slug)
    if (index < 0) return null
    return {
      project: all[index],
      prevProject: link(all[index - 1]),
      nextProject: link(all[index + 1]),
    }
  })
