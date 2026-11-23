import { createFileRoute } from "@tanstack/react-router"
import { Overview } from "@/components/work/amo/chapters"

// /work/amo: the overview, the research strip over the Design tab's chapters.
export const Route = createFileRoute("/_site/work/amo/")({
  component: Overview,
})
