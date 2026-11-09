// Attach to every admin server function: `.middleware([requireAdmin])`.
import { createMiddleware } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"

export const requireAdmin = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    // Imported lazily so the verifier (and cloudflare:workers) never reach the client bundle.
    const { accessToken, verifyAccessJwt } = await import("./access")
    const token = accessToken({
      jwt: getRequestHeader("cf-access-jwt-assertion"),
      cookie: getRequestHeader("cookie"),
    })
    const admin = await verifyAccessJwt(token, getRequestHeader("host"))
    if (!admin) throw new Error("Admin access required")
    return next({ context: { admin } })
  }
)
