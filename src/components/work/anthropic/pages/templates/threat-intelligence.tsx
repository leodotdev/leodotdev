import { useMemo } from "react"
import { TemplateFigure } from "@/components/work/anthropic/template"
import {
  ResearchPage,
  researchSteps,
} from "@/components/work/anthropic/pages/templates/threat-intelligence/research-page"
import { Section } from "@/components/work/claude/ui"
import type { ResearchPageData } from "@/components/work/anthropic/pages/templates/threat-intelligence/research-page"

// The Threat Intelligence template (the file's "Reskinned pages", frame
// "Cleaned up", 13079:18126): a research team's page, in the layout it
// shares with Economic Futures (./threat-intelligence/research-page.tsx).
// Its words and picture are the file's. The file's "How we work" carousel
// (13079:18152) is hidden in the frame, so it is left out here.

const DESCRIPTION = "Est totam sit sunt minus sed tempore ut est."

const PAGE: ResearchPageData = {
  name: "Threat Intelligence",
  intro:
    "The Threat Intelligence team investigates real-world cases of misuse of Claude, and works with the broader Safeguards team to improve our defenses. To improve the safety and security of frontier AI models, we publish regular reports detailing the methods malicious actors use to exploit them.",
  columns: {
    label: "How we work",
    items: [
      {
        name: "Detect",
        text: "We identify concerning activity on Claude via detection tools, our enforcement team, intelligence partners, and from the open source.",
      },
      {
        name: "Investigate",
        text: "Our investigators review the activity to understand what the actor was doing and the methods they used.",
      },
      {
        name: "Attribute",
        text: "Where the evidence allows, we work out who is behind the activity.",
      },
      {
        name: "Disrupt",
        text: "We ban the accounts involved in the activity to cut off access to Claude.",
      },
      {
        name: "Strengthen",
        text: "We turn our findings into improvements to our classifiers, policies, and product safeguards to help prevent similar misuse.",
      },
      {
        name: "Share",
        text: "When relevant, we share what we’ve learned with governments, threat intelligence partners, and the public.",
      },
    ],
  },
  // The file's carousel counts three posts and shows the first; the other
  // two are the reports in its table, as the table writes them.
  featured: [
    {
      topic: "Announcement",
      date: "Jan. 30, 2026",
      title: "Detecting and countering misuse of AI: September 2026",
      summary:
        "Over the past eight months, our Threat Intelligence team identified and disrupted operations in which threat actors tried to use Claude for malicious activity. In this report, we share case studies from those operations and describe how malicious use of Claude has evolved since our previous threat reports in 2025.",
    },
    {
      topic: "Announcement",
      date: "Mon. DD, YYYY",
      title: "Detecting and countering misuse of AI: August 2025",
      summary: DESCRIPTION,
    },
    {
      topic: "Announcement",
      date: "Mon. DD, YYYY",
      title: "Detecting and countering malicious uses of Claude: March 2025",
      summary: DESCRIPTION,
    },
  ],
  image: "/work/anthropic/templates/threat-intelligence/featured.webp",
  rows: [
    {
      title:
        "What we learned mapping a year’s worth of AI-enabled cyber threats",
      topic: "Alignment & Safety",
    },
    {
      title: "Detecting and countering misuse of AI: August 2025",
      topic: "Policy and Product",
    },
    {
      title: "Detecting and countering malicious uses of Claude: March 2025",
      topic: "Alignment & Safety",
    },
  ],
  more: true,
}

export function ThreatIntelligenceDoc() {
  const steps = useMemo(() => researchSteps("August", "Alignment"), [])
  return (
    <Section>
      <TemplateFigure steps={steps}>
        <ResearchPage page={PAGE} />
      </TemplateFigure>
    </Section>
  )
}
