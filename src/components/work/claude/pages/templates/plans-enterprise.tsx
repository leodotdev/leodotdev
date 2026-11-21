import { TbCircleCheckFilled, TbPlayerPlayFilled } from "react-icons/tb"
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
  LOGOS,
  PdfCard,
  PlanArtifact,
  PlanCarousel,
  PlanFaq,
  PlanHero,
  PlanList,
  PlanMargins,
  ProofCard,
  WebinarCard,
} from "@/components/work/claude/pages/templates/plans"
import { Button } from "@/components/work/claude/specimens"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type { PlanProof } from "@/components/work/claude/pages/templates/plans"

// The Enterprise plan's page (the "Plans: Enterprise" frame on the Figma
// file's Templates page), built from the organisms the other tabs document
// and the pieces the three plan pages share (plans.tsx). Its words are the
// file's, and the customers' logos were exported from it. What is its own:
// the figures under the hero, the list of controls, the customers' quotes,
// and the FAQ.

const STATS: Array<PlanProof> = [
  {
    logo: ["zapier", "Zapier", 104, 28],
    stat: "89%",
    note: "employee adoption, 800+ AI agents deployed, 10x app usage growth",
  },
  {
    logo: ["canva", "Canva", 96, 30],
    stat: "65%",
    note: "of team members use AI to increase productivity and effectiveness either “everyday” or “often”",
  },
  {
    logo: ["gitlab-left", "GitLab", 111, 25],
    stat: "98%",
    note: "of team members surveyed reported to be satisfied or very satisfied with Claude for Work",
  },
  {
    logo: ["quantium", "Quantium", 148, 37],
    stat: "90%",
    note: "reduction in work time for business proposals and bid responses",
  },
]

const CONTROLS = [
  "Single sign-on (SSO) and domain capture",
  "Role-based access with fine-grained permissioning",
  "System for Cross-domain Identity Management (SCIM)",
  "Protected company data",
  "Audit logs",
  "Data retention controls",
  "Compliance API",
  "Usage analytics",
  "Spend controls",
  "Self-serve seat management",
]

const QUOTES: Array<PlanProof> = [
  {
    logo: ["ig-group", "IG Group", 103, 24],
    quote:
      "Our global growth requires our marketing resources to expand in capacity and language capability. Claude’s excellent writing and transcreation capabilities have been a big enabler for us to scale globally and achieve higher ROI.",
    by: "Olga Pirog, Global Head of Data and AI transformation",
  },
  {
    logo: ["gitlab-left", "GitLab", 111, 25],
    quote:
      "Claude offers our team members a tool that feels like an extension of their work and expertise, allowing us to take on more complex tasks and deliver greater impact while ensuring GitLab’s IP remains private and protected.",
    by: "Taylor McCaslin, Product Lead for AI and ML Tech",
  },
  {
    logo: ["deloitte", "Deloitte", 125, 24],
    quote:
      "Deloitte is leading the way in the trustworthy use of Generative AI within enterprises. Our exploration of Claude for Work will help us reveal how this transformative technology can empower our workforce.",
    by: "Gina Schaefer, AI Managing Director and Alliance Leader",
  },
]

// The file answers the first question only.
const FAQ = [
  [
    "What’s the Enterprise plan?",
    "Claude is a trusted, secure, and collaborative AI expert that integrates with organizational knowledge and workflows to support high-quality work. Claude enhances productivity and creativity across various business functions within an organization. The Enterprise plan is designed for organizations that require large knowledge uploads, enhanced security and user management, and an AI solution that scales across cross-functional teams in support of deep work.",
  ],
  ["What’s included in the Enterprise plan?"],
  ["What security is in place for the Enterprise plan?"],
  ["What’s Claude for Work?"],
  ["How can I integrate Claude into my own products or services?"],
] as const

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

// The marginalia card for a customer's story: its logo over a video.
function StoryCard() {
  return (
    <div className="cds-margin">
      <div className="cds-margin-card">
        <img
          className="cds-margin-logo cds-plan-logo-intercom"
          src={`${LOGOS}/intercom-left.svg`}
          alt="Intercom"
        />
        <div className="cds-margin-media" data-type="video">
          <button
            type="button"
            className="cds-play"
            aria-label="Play"
            {...quiet}
          >
            <TbPlayerPlayFilled aria-hidden />
          </button>
        </div>
        <p>
          Intercom provides customer service tech that delivers up to 86%
          resolution rates with Claude
        </p>
      </div>
    </div>
  )
}

/**
 * The page. Its sections are White and Ivory by turns under an Ivory hero,
 * over the Dark 3 footer; on the site's dark mode they are Dark 2 and Dark 3.
 */
function PlansEnterprise() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Plans", "Enterprise"]} />
        <PlanHero
          title="The Enterprise plan"
          lead="Securely connect Claude to your company knowledge and give every team access to trusted AI. Designed for large organizations and enterprise-scale challenges."
          art="hand-city"
        >
          <Button size="large" icon="none">
            Contact sales
          </Button>
        </PlanHero>
        <div className="cds-plan-hero-more">
          <PlanCarousel kind="proofs" className="cds-plan-stats">
            {STATS.map((proof) => (
              <ProofCard key={proof.logo[0]} proof={proof} />
            ))}
          </PlanCarousel>
        </div>
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="Tackle your most complex challenges"
          subtitle={null}
          pictogram={`${ART}/hand-link.svg`}
          actions={null}
        />
        <PlanMargins left={[<StoryCard />]} right={[<PdfCard />]}>
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
          tabs={[
            "Projects",
            "Connectors",
            "Research",
            "Artifacts",
            "Claude Code",
          ]}
          tone="sky"
          note
          title="Bring your documents and data into any chat"
        >
          <p>
            Add text, code, and files to dedicated Projects as context for your
            chats. Claude can reference large amounts of information for every
            task, including the equivalent of:
          </p>
          <ul>
            <li>Ten 30-minute sales transcripts</li>
            <li>15 full financial reports</li>
            <li>100K lines of code</li>
          </ul>
        </PlanArtifact>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="Deploy with confidence"
          subtitle="Manage access with enterprise-grade controls, and rest assured that we don’t train our models on your Claude for Work data."
          pictogram={`${ART}/node-pie-chart.svg`}
          actions={null}
        />
        <PlanMargins
          left={[<ConnectorCard action="Learn more" />, <WebinarCard />]}
        >
          <div className="cds-plan-checks">
            {CONTROLS.map((control) => (
              <div key={control}>
                <TbCircleCheckFilled aria-hidden />
                {control}
              </div>
            ))}
          </div>
        </PlanMargins>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
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
          ]}
          tone="rose"
          note
        >
          <ul>
            {ENGINEERING.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </PlanArtifact>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p3"
          title="What customers are saying"
          subtitle={null}
          pictogram={null}
          actions={null}
        />
        <PlanCarousel kind="proofs">
          {QUOTES.map((proof) => (
            <ProofCard key={proof.logo[0]} proof={proof} />
          ))}
        </PlanCarousel>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <div className="cds-plan-faq">
          <Header
            size="p1"
            title="FAQ"
            subtitle={null}
            pictogram={null}
            actions={null}
          />
          <PlanFaq items={FAQ} />
        </div>
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
const PLANS_ENTERPRISE_DEMO: Array<DemoStep> = [
  { on: ".cds-plan-hero .cds-btn", text: "Contact sales", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-plan-hero .cds-btn", text: "Contact sales", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function PlansEnterpriseDoc() {
  return (
    <Section>
      <TemplateFigure steps={PLANS_ENTERPRISE_DEMO}>
        <PlansEnterprise />
      </TemplateFigure>
    </Section>
  )
}
