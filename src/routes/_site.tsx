import { Outlet, createFileRoute } from "@tanstack/react-router"
import { BackToTop } from "@/components/BackToTop"
import { Toaster } from "@/components/ui/toast"

// Pathless layout for the site's pages (the Next app's `(site)` group), with
// the back-to-top button every long page gets, and the toasts that say what
// a switch just did.
export const Route = createFileRoute("/_site")({
  component: () => (
    <Toaster>
      <Outlet />
      <BackToTop />
    </Toaster>
  ),
})
