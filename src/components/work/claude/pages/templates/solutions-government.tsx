import {
  TbCircleCheckFilled,
  TbFileDownload,
  TbListCheck,
  TbPlayerPlayFilled,
  TbRobot,
  TbShieldCheck,
  TbX,
} from "react-icons/tb"
import { LinkCard } from "@/components/work/claude/pages/cards"
import { Footer, Header } from "@/components/work/claude/pages/headers"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import {
  ART,
  Features,
  Gutters,
  Hero,
  LOGOS,
  LinkRows,
  quiet,
} from "@/components/work/claude/pages/templates/solutions-b"
import { Button } from "@/components/work/claude/specimens"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type { Feature } from "@/components/work/claude/pages/templates/solutions-b"

// The Solutions: Government template (the frame of that name on the Figma
// file's Templates page): a two-column hero, the ways to deploy with
// marginalia in the gutters, three reasons, a table of where each product is
// authorized, three link cards, and the latest announcements. The words are
// the file's.

const DEPLOYMENTS: Array<Feature> = [
  [
    TbCircleCheckFilled,
    "API",
    "Available on AWS and Google Cloud with authorizations up to FedRAMP High and IL5",
  ],
  [
    TbCircleCheckFilled,
    "Claude Gov models",
    "Claude Gov models for classified environments on AWS—built for national security missions",
  ],
  [
    TbCircleCheckFilled,
    "Claude for Government",
    "Claude for Government application at FedRAMP High",
  ],
]

const REASONS: Array<Feature> = [
  [
    TbRobot,
    "Intelligence for government complexity",
    "Enhanced performance made for government workflows, from document analysis to regulatory review. Claude understands context and automates complex tasks while maintaining accuracy.",
  ],
  [
    TbShieldCheck,
    "Built with safety at its core",
    "Designed with safety and responsible deployment as foundational principles. Claude provides transparent reasoning you can trust in high-stakes decisions.",
  ],
  [
    TbListCheck,
    "Secure, compliant, and accessible",
    "Deploy using the security frameworks your agency already relies on. Access advanced AI capabilities without compromising compliance requirements.",
  ],
]

// The table: a product, and whether it is available at each level. A cell
// is yes, no, or a word of its own.
const LEVELS = ["FedRAMP High", "IL5", "Classified"]
const AVAILABILITY: Array<
  [product: string, ...cells: Array<boolean | string>]
> = [
  ["Claude in Amazon Bedrock", true, true, false],
  ["Claude on Google Cloud’s Vertex AI", true, false, false],
  ["Gov models in Amazon Bedrock", false, false, true],
  ["Claude for Government", true, false, "In pilot"],
]

const LINKS = [
  ["See the latest updates to Claude for Government", "Update"],
  ["Get started with Claude for Government", "User guide"],
  ["Learn more about Anthropic’s security and compliance", "Trust center"],
]

const NEWS: Array<[title: string, kind: string]> = [
  [
    "Lawrence Livermore National Laboratory expands Claude for Enterprise use to empower scientists and researchers",
    "Announcements",
  ],
  ["Claude Gov models for U.S. national security customers", "Announcements"],
  [
    "Claude in Amazon Bedrock: Approved for use in FedRAMP High and DoD IL4/5 workloads",
    "Announcements",
  ],
]

/**
 * The page. Ivory and White by turns, as in the file, over the Dark 3
 * footer; on the site's dark mode, Dark 3 and Dark 2.
 */
function SolutionsGovernment() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Solutions", "Government"]} />
        <Hero
          title="Responsible AI that meets government needs"
          lead="Claude helps government organizations deploy advanced AI capabilities with rigorous security controls. Available with authorizations up to FedRAMP High and IL5 using established procurement channels."
          action="Contact sales"
          art="hero-government"
        />
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <Header
          size="p1"
          title="Flexible deployment for any environment"
          subtitle={null}
          pictogram={`${ART}/node-web.svg`}
          actions={null}
        />
        <Gutters
          rows={DEPLOYMENTS}
          cards={
            <>
              <div className="cds-margin" data-gutter="left">
                <div className="cds-margin-card">
                  <img
                    className="cds-margin-logo"
                    src={`${LOGOS}/european-parliament-left.svg`}
                    alt="European Parliament"
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
                    European Parliament expands access to their archives with
                    Claude
                  </p>
                  <div>
                    <Button size="small" variant="tertiary" icon="none">
                      Read story
                    </Button>
                  </div>
                </div>
              </div>
              <div className="cds-margin" data-gutter="right">
                <div className="cds-margin-card">
                  <div className="cds-margin-head">
                    <TbFileDownload aria-hidden />
                    Download a PDF
                  </div>
                  <div className="cds-margin-media">
                    <div className="cds-margin-file">
                      <i>PDF</i>
                      <div>
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                    <div className="cds-margin-page" />
                  </div>
                  <p>Ready to bring Claude to your company? Take this PDF.</p>
                </div>
              </div>
            </>
          }
        />
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p2"
          title="Why agencies choose Claude"
          subtitle={null}
          pictogram={`${ART}/object-institution.svg`}
          actions={null}
        />
        <Features items={REASONS} />
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        {/* The headline is spelled as the file spells it. */}
        <Header
          size="p2"
          title="Availability"
          subtitle={null}
          pictogram={`${ART}/object-checkmark.svg`}
          actions={null}
        />
        <table className="cds-solb-table">
          <thead>
            <tr>
              <td />
              {LEVELS.map((level) => (
                <th key={level} scope="col">
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AVAILABILITY.map(([product, ...cells]) => (
              <tr key={product}>
                <th scope="row">{product}</th>
                {cells.map((cell, i) => (
                  <td key={LEVELS[i]}>
                    {cell === true ? (
                      <TbCircleCheckFilled aria-label="Available" />
                    ) : cell === false ? (
                      <TbX aria-label="Not available" data-off />
                    ) : (
                      <span>{cell}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p2"
          title="Everything you need to succeed with Claude"
          subtitle={null}
          pictogram={`${ART}/node-line-chart.svg`}
          actions={
            <Button size="large" icon="none">
              Contact sales
            </Button>
          }
        />
        <div className="cds-card-links cds-solb-links">
          {LINKS.map(([title, kind]) => (
            <LinkCard key={title} title={title} kind={kind} />
          ))}
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <div className="cds-solb-news">
          <h4>
            <img src={`${ART}/object-book.svg`} alt="" />
            See what’s new
          </h4>
          <LinkRows items={NEWS} plain />
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
const SOLUTIONS_GOVERNMENT_DEMO: Array<DemoStep> = [
  { on: ".cds-solb-hero .cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-solb-hero .cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function SolutionsGovernmentDoc() {
  return (
    <Section>
      <TemplateFigure steps={SOLUTIONS_GOVERNMENT_DEMO}>
        <SolutionsGovernment />
      </TemplateFigure>
    </Section>
  )
}
