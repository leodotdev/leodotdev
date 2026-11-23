import { createFileRoute } from "@tanstack/react-router"
import { Chapters } from "@/components/work/amo/chapters"

// /work/amo: the Research tab.
export const Route = createFileRoute("/_site/work/amo/")({
  component: () => <Chapters tab="" />,
})
