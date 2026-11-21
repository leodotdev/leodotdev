import { useMemo } from "react"
import { TemplateFigure } from "@/components/work/anthropic/template"
import {
  ResearchPage,
  TextLink,
  researchSteps,
} from "@/components/work/anthropic/pages/templates/threat-intelligence/research-page"
import { Section } from "@/components/work/claude/ui"
import type { ResearchPageData } from "@/components/work/anthropic/pages/templates/threat-intelligence/research-page"

// The Economic Futures template (the file's "Reskinned pages", frame
// "Cleaned up", 13079:18183): a research team's page, in the layout it
// shares with Threat Intelligence (./threat-intelligence/research-page.tsx).
// Its words and picture are the file's, the table's five rows as the file
// lists them (one post twice). The file's "How we investigate" carousel
// (13079:18215) is hidden in the frame, so it is left out here.

const PAGE: ResearchPageData = {
  name: "Economic Futures",
  intro:
    "The Anthropic Economic Futures Research Fund supports ambitious external research on interventions to prepare society for the economic impacts of AI.",
  columns: {
    label: "Research fund priorities",
    items: [
      {
        name: "Shaping AI’s impact on workers at the firm and workplace level",
        text: "AI’s impact on the labor market depends on the systems, workplaces, training protocols, and institutional choices that are built around it. Field experiments can help us understand which collaborative patterns develop human expertise alongside AI, how organizational design choices affect productivity, and what difference worker voice makes in those design choices.",
      },
      {
        name: "Equipping people to navigate AI-driven transitions",
        text: "The evidence on retraining and job placement is mixed, and it may not generalize to AI-induced economic disruption and rapid structural transformation. We want to find out whether promising programs could scale quickly across a broader population.",
      },
      {
        name: "Modernizing income support for AI-driven displacement",
        text: "The US system for supporting displaced workers is built almost entirely around the assumption that joblessness is temporary. AI may lead to displacement that is broader and more persistent. In that scenario, we’ll need instruments calibrated to a new equilibrium, one with no modern precedent.",
      },
      {
        name: "Building worker stakes in AI-driven growth before disruption arrives",
        text: (
          <>
            In scenarios where AI delivers large aggregate gains, those gains
            may not be broadly shared by default. In our{" "}
            <TextLink>Economic Policy Framework</TextLink> (EPF), we discuss
            universal pre-distributive capital accounts and adjacent mechanisms.
            But these have limited direct empirical precedent at scale, and they
            also need a funding source—and we lack evidence on how different
            funding designs would function in practice.
          </>
        ),
      },
      {
        name: "Generating new evidence on public investments",
        text: "The EPF calls for both modernizing the income safety net and substantially expanding public investment in human- and community-facing work. Policymakers need a consistent way to compare these instruments against one another, and against direct transfers.",
      },
    ],
  },
  featured: [
    {
      topic: "Announcement",
      date: "Jan. 30, 2026",
      title: "A research agenda for the Economic Futures Research Fund",
      summary:
        "With the research the Fund supports, we want to study what programs could make the economy more flexible and resilient, ensure the benefits of AI are shared, and minimize the harm that AI-driven disruption could cause.",
    },
  ],
  image: "/work/anthropic/templates/economic-futures/featured.webp",
  rows: [
    {
      title: "A research agenda for the Economic Futures Research Fund",
      topic: "Economics",
    },
    {
      title:
        "Launching the Anthropic Economic Futures Programme in the UK and Europe",
      topic: "Announcements",
    },
    {
      title: "A research agenda for the Economic Futures Research Fund",
      topic: "Economics",
    },
    { title: "Economic Futures Symposium proposals", topic: "Announcements" },
    { title: "Anthropic Economic Futures program", topic: "Economics" },
  ],
  padCount: true,
}

export function EconomicFuturesDoc() {
  const steps = useMemo(() => researchSteps("Symposium", "Economics"), [])
  return (
    <Section>
      <TemplateFigure steps={steps}>
        <ResearchPage page={PAGE} />
      </TemplateFigure>
    </Section>
  )
}
