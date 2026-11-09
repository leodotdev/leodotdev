import handler, { createServerEntry } from "@tanstack/react-start/server-entry"
import { env } from "cloudflare:workers"

// Paths served from a static file under another name (the old Next.js
// rewrites). Static assets normally answer before the Worker runs; this
// covers the extensionless form explicitly, in dev and production alike.
const REWRITES: Record<string, string> = {
  "/resume": "/resume.html",
}

/**
 * /images/<key> → the `leodotdev-media` R2 object <key>. Keys are never
 * overwritten (uploads get a fresh name), so responses are immutable and
 * kept in the edge cache.
 */
async function serveImage(request: Request, url: URL): Promise<Response> {
  // Workers expose the default cache here; the DOM typings do not know it.
  const cache = (caches as unknown as { default: Cache }).default
  const hit = await cache.match(request)
  if (hit) return hit
  const key = decodeURIComponent(url.pathname.slice("/images/".length))
  const obj = key ? await env.MEDIA.get(key) : null
  if (!obj) return new Response("Not found", { status: 404 })
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set("etag", obj.httpEtag)
  headers.set("cache-control", "public, max-age=31536000, immutable")
  const res = new Response(obj.body, { headers })
  if (request.method === "GET") await cache.put(request, res.clone())
  return request.method === "HEAD" ? new Response(null, { headers }) : res
}

const entry = createServerEntry({
  fetch: async (request, opts) => {
    const url = new URL(request.url)
    if (
      url.pathname.startsWith("/images/") &&
      (request.method === "GET" || request.method === "HEAD")
    )
      return serveImage(request, url)
    const target = REWRITES[url.pathname]
    if (target && (request.method === "GET" || request.method === "HEAD")) {
      const res = await env.ASSETS.fetch(new URL(target, url))
      if (res.ok) return res
    }
    // /admin pages: Cloudflare Access gates them at the edge; check the token
    // here too, so a missing or misconfigured Access app can't expose them.
    // (Admin server functions check it themselves: src/server/auth.)
    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
      const { accessToken, verifyAccessJwt } = await import("./server/auth/access")
      const who = await verifyAccessJwt(
        accessToken({
          jwt: request.headers.get("cf-access-jwt-assertion"),
          cookie: request.headers.get("cookie"),
        }),
        url.host
      )
      if (!who)
        return new Response("Forbidden", {
          status: 403,
          headers: { "content-type": "text/plain", "x-robots-tag": "noindex" },
        })
      const res = await handler.fetch(request, opts)
      const out = new Response(res.body, res)
      out.headers.set("x-robots-tag", "noindex")
      out.headers.set("cache-control", "private, no-store")
      return out
    }
    return handler.fetch(request, opts)
  },
})

export default { fetch: entry.fetch }
