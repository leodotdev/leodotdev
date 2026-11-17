import { createFileRoute } from "@tanstack/react-router"
import { OverviewDoc } from "@/components/work/claude/pages/overview"

export const Route = createFileRoute("/_site/work/claude/")({
  component: OverviewDoc,
})
