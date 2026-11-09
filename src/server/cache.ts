// Stale-while-revalidate cache on the Workers Cache API for Sanity reads.
// Keys are synthetic URLs; values are JSON. A hit younger than `fresh`
// seconds is served as is; an older one (up to `stale` seconds) is served
// immediately while a background refresh replaces it. Bypassed in dev and
// wherever the Cache API is a no-op (workers.dev), which just means every
// request reads Sanity's own CDN.
import { waitUntil } from "cloudflare:workers"

const ORIGIN = "https://cache.leo.dev/"
const STORED_AT = "x-stored-at"

export async function swr<T>(
  key: string,
  opts: { fresh: number; stale: number },
  load: () => Promise<T>
): Promise<T> {
  if (import.meta.env.DEV || typeof caches === "undefined") return load()
  const cache = (caches as unknown as { default: Cache }).default
  const req = new Request(ORIGIN + encodeURIComponent(key))

  const store = async (value: T) => {
    await cache.put(
      req,
      new Response(JSON.stringify(value), {
        headers: {
          "content-type": "application/json",
          "cache-control": `public, max-age=${opts.fresh + opts.stale}`,
          [STORED_AT]: String(Date.now()),
        },
      })
    )
  }

  const hit = await cache.match(req)
  if (hit) {
    const age = (Date.now() - Number(hit.headers.get(STORED_AT) ?? 0)) / 1000
    if (age > opts.fresh)
      waitUntil(
        load()
          .then(store)
          .catch(() => {})
      )
    return hit.json<T>()
  }
  const value = await load()
  waitUntil(store(value).catch(() => {}))
  return value
}
