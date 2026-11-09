// Cloudflare Access JWT verification (server only). Access gates /admin at
// the edge; this re-checks the token in the Worker, because server-function
// RPCs all share /_serverfn and a path rule alone can't protect them.
import { env } from "cloudflare:workers"
import { createRemoteJWKSet, jwtVerify } from "jose"

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null
let jwksDomain = ""

export type AdminIdentity = { email: string }

const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/

/**
 * The Access token for a request: the header Access adds on protected paths
 * (/admin*), else the CF_Authorization cookie it sets for the whole host, which
 * is what /_serverfn calls made from the admin carry.
 */
export function accessToken(headers: {
  jwt: string | null | undefined
  cookie: string | null | undefined
}): string | null {
  if (headers.jwt) return headers.jwt
  const match = /(?:^|;\s*)CF_Authorization=([^;]+)/.exec(headers.cookie ?? "")
  return match ? decodeURIComponent(match[1]) : null
}

export async function verifyAccessJwt(
  token: string | null | undefined,
  host: string | null | undefined
): Promise<AdminIdentity | null> {
  // `vite dev` only: a production build compiles this branch away.
  if (import.meta.env.DEV && host && LOCAL.test(host))
    return { email: "dev@localhost" }
  const team = env.ACCESS_TEAM_DOMAIN
  const aud = env.ACCESS_AUD
  if (!token || !team || !aud) return null
  if (!jwks || jwksDomain !== team) {
    jwks = createRemoteJWKSet(new URL(`${team}/cdn-cgi/access/certs`))
    jwksDomain = team
  }
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer: team, audience: aud })
    return typeof payload.email === "string" ? { email: payload.email } : null
  } catch {
    return null
  }
}
