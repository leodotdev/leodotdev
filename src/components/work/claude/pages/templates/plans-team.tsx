import { TbArrowUp } from "react-icons/tb"
import { PromptCard } from "@/components/work/claude/pages/artifacts"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import {
  ART,
  CHALLENGES,
  ConnectorCard,
  ENGINEERING,
  PlanArtifact,
  PlanHero,
  PlanList,
  PlanMargins,
  SAMPLE_PROMPT,
  WebinarCard,
} from "@/components/work/claude/pages/templates/plans"
import { Button } from "@/components/work/claude/specimens"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Team plan's page (the "Plans: Teams" frame on the Figma file's
// Templates page), built from the organisms the other tabs document and the
// pieces the three plan pages share (plans.tsx). Its words are the file's.
// What is its own: the banner that asks what you are up against.

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

/**
 * The page. Its sections are White and Ivory by turns under an Ivory hero,
 * over the Dark 3 footer; on the site's dark mode they are Dark 2 and Dark 3.
 */
function PlansTeam() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Plans", "Team"]} />
        <PlanHero
          title="The Team plan"
          lead="Shorten the path from idea to impact with AI that taps into your shared expertise. Built for growing teams tackling ambitious projects."
          art="hand-stack"
        >
          <Button size="large" icon="none">
            Try Claude
          </Button>
        </PlanHero>
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="Tackle your most complex challenges"
          subtitle={null}
          pictogram={`${ART}/object-blocks.svg`}
          actions={null}
        />
        <PlanMargins
          left={[
            <PromptCard>
              Our churn data doesn&rsquo;t match our assumptions. Help me figure
              out what&rsquo;s really happening and what we should do about it.
            </PromptCard>,
            <PromptCard>{SAMPLE_PROMPT}</PromptCard>,
          ]}
          right={[<ConnectorCard action="Use in Claude" />, <WebinarCard />]}
        >
          <PlanList items={CHALLENGES} />
        </PlanMargins>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Transform how your teams work"
          subtitle="Enable every employee to spark new ideas, achieve more, and collaborate better."
          pictogram={`${ART}/hand-share.svg`}
          actions={null}
        />
        <PlanArtifact
          tabs={["Projects", "Styles", "Research", "Artifacts", "Claude Code"]}
          tone="clay"
          title="Turn everyone into an expert"
        >
          <p>
            Add text, code, and files to dedicated projects as context for your
            chats. Claude can reference large amounts of information for every
            task, including the equivalent of:
          </p>
          <ul>
            <li>Ten 30-minute sales transcripts</li>
            <li>15 full financial reports</li>
            <li>100K lines of code</li>
          </ul>
        </PlanArtifact>
        {/* The banner: a question, and a field to answer it in. */}
        <div className="cds-plan-ask">
          <img src={`${ART}/hand-chain.svg`} alt="" />
          <h4>What problem are you up against?</h4>
          <label
            className="cds-input"
            data-size="larger"
            data-trailing="button"
          >
            <input
              type="text"
              placeholder="How can I help today?"
              aria-label="How can I help today?"
            />
            <button
              type="button"
              className="cds-btn"
              data-variant="clay"
              data-icon="trailing"
              {...quiet}
            >
              Ask Claude
              <TbArrowUp aria-hidden />
            </button>
          </label>
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="Critical cross-functional work starts with Claude"
          subtitle={null}
          pictogram={`${ART}/hand-bolt.svg`}
          actions={null}
        />
        <PlanArtifact
          tabs={[
            "Engineering",
            "Marketing",
            "Sales",
            "Product Management",
            "Human Resources",
            "Legal",
          ]}
          tone="cactus"
          note
        >
          <ul>
            {ENGINEERING.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </PlanArtifact>
      </TemplateSection>

      <TemplateBlock theme={["dark-3", "dark-3"]}>
        <Footer />
      </TemplateBlock>
    </>
  )
}

// The page's own things for the demo cursor, wide and again at a phone's
// width. The scrolling and resizing around them are the template figure's
// (`around` in template.tsx), which also leaves the site's header alone.
const PLANS_TEAM_DEMO: Array<DemoStep> = [
  { on: ".cds-plan-hero .cds-btn", text: "Try Claude", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-plan-hero .cds-btn", text: "Try Claude", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function PlansTeamDoc() {
  return (
    <Section>
      <TemplateFigure steps={PLANS_TEAM_DEMO}>
        <PlansTeam />
      </TemplateFigure>
    </Section>
  )
}
