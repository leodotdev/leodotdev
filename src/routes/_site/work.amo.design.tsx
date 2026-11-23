import { createFileRoute } from "@tanstack/react-router"
import { Chapters } from "@/components/work/amo/chapters"

// /work/amo/design: the Design tab.
export const Route = createFileRoute("/_site/work/amo/design")({
  component: () => <Chapters tab="design" />,
})
