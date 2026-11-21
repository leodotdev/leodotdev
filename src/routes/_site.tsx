import { Outlet, createFileRoute } from "@tanstack/react-router"
import { BackToTop } from "@/components/BackToTop"

// Pathless layout for the site's pages (the Next app's `(site)` group), with
// the back-to-top button every long page gets.
export const Route = createFileRoute("/_site")({
  component: () => (
    <>
      <Outlet />
      <BackToTop />
    </>
  ),
})
