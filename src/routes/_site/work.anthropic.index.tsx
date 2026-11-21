import { createFileRoute } from "@tanstack/react-router"
import { OverviewDoc } from "@/components/work/anthropic/pages/overview"

export const Route = createFileRoute("/_site/work/anthropic/")({
  component: OverviewDoc,
})
