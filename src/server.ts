import handler, { createServerEntry } from "@tanstack/react-start/server-entry"
import { env } from "cloudflare:workers"

// Paths served from a static file under another name (the old Next.js
// rewrites). Static assets normally answer before the Worker runs; this
// covers the extensionless form explicitly, in dev and production alike.
const REWRITES: Record<string, string> = {
  "/resume": "/resume.html",
}

const entry = createServerEntry({
  fetch: async (request, opts) => {
    const url = new URL(request.url)
    const target = REWRITES[url.pathname]
    if (target && (request.method === "GET" || request.method === "HEAD")) {
      const res = await env.ASSETS.fetch(new URL(target, url))
      if (res.ok) return res
    }
    return handler.fetch(request, opts)
  },
})

export default { fetch: entry.fetch }
