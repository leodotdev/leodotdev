// Client entry: TanStack Start's default, plus a development-only log of the
// component stack for recoverable errors (hydration mismatches), which React
// otherwise reports without saying which component diverged.
import { StrictMode, startTransition } from "react"
import { hydrateRoot } from "react-dom/client"
import { StartClient } from "@tanstack/react-start/client"

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
    import.meta.env.DEV
      ? {
          onRecoverableError: (error, info) => {
            console.error("[recoverable]", error, info.componentStack)
          },
        }
      : undefined
  )
})
