// Server functions for Sanity content. They always run on the Worker (route
// loaders call them during SSR, and over /_serverfn on client navigation),
// so the browser never needs Sanity CORS for reads.
import { createServerFn } from "@tanstack/react-start"
import { apiVersion, dataset, projectId } from "@/sanity/config"
import { EXPERIENCES, PROJECTS, REFERENCES } from "@/sanity/queries"
import { swr } from "./cache"
import type { Experience } from "@/types/Experience"
import type { Project } from "@/types/Project"
import type { Reference } from "@/types/Reference"

/** Serve cached content for a minute, then refresh in the background for up to a day. */
const TTL = { fresh: 60, stale: 60 * 60 * 24 }

async function query<T>(groq: string): Promise<T> {
  return swr(`groq:${groq}`, TTL, async () => {
    const url = new URL(
      `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`
    )
    url.searchParams.set("query", groq)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
    const body: { result: T } = await res.json()
    return body.result
  })
}

export const getProjectsPage = createServerFn({ method: "GET" }).handler(
  async () => {
    const [projects, experiences, references] = await Promise.all([
      query<Array<Project>>(PROJECTS),
      query<Array<Experience>>(EXPERIENCES),
      query<Array<Reference>>(REFERENCES),
    ])
    return { projects, experiences, references }
  }
)

export type ProjectLink = Pick<Project, "slug" | "name" | "client" | "image">

const link = (p: Project | undefined): ProjectLink | null =>
  p ? { slug: p.slug, name: p.name, client: p.client, image: p.image } : null

/** A project plus its neighbors in the year-ordered list, or null for an unknown slug. */
export const getProjectPage = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const all = await query<Array<Project>>(PROJECTS)
    const index = all.findIndex((p) => p.slug === slug)
    if (index < 0) return null
    return {
      project: all[index],
      prevProject: link(all[index - 1]),
      nextProject: link(all[index + 1]),
    }
  })
