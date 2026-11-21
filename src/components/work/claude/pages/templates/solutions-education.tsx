import {
  TbArrowUp,
  TbBook2,
  TbEye,
  TbLock,
  TbMessageCircle,
  TbPencil,
  TbSchool,
  TbUsersGroup,
  TbWorld,
} from "react-icons/tb"
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
  Features,
  Gutters,
  LinkRows,
  LogoWall,
  Segments,
  quiet,
} from "@/components/work/claude/pages/templates/solutions-b"
import { Button } from "@/components/work/claude/specimens"
import { Section } from "@/components/work/claude/ui"
import type { IconType } from "react-icons"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import type {
  Feature,
  Logo,
} from "@/components/work/claude/pages/templates/solutions-b"

// The Solutions: Education template (the frame of that name on the Figma
// file's Templates page). Its hero is the staggered one the Heroes topic
// draws, and it is the page whose marginalia sit in the gutters: a batch of
// prompts on the left, a report on the right. The words are the file's.

const UNIVERSITIES: Array<Logo> = [
  ["usf", "University of San Francisco"],
  ["lse", "LSE"],
  ["northeastern", "Northeastern University"],
  ["champlain", "Champlain College"],
  ["northumbria", "Northumbria University"],
]

const COMMITMENTS: Array<Feature> = [
  [
    TbSchool,
    "Design for true learning",
    "We build tools that foster critical thinking through guided exploration, prioritizing deep conceptual understanding over convenient shortcuts.",
  ],
  [
    TbWorld,
    "Ensure equitable access",
    "We partner with institutions to make AI-enhanced education accessible to all students, regardless of background.",
  ],
  [
    TbLock,
    "Protect privacy and ensure security",
    "We only use data to train our generative models when given permission, and we maintain security standards that meet your compliance needs.",
  ],
  [
    TbEye,
    "Provide transparency",
    "We share what Claude can (and can't) do honestly, empowering you to make informed decisions about how AI fits into your educational environment.",
  ],
]

const AUDIENCES: Array<Feature> = [
  [
    TbSchool,
    "For students",
    "Claude’s learning mode works like a tutor—it asks the questions that help you find the answers yourself.",
  ],
  [
    TbBook2,
    "For educators",
    "Anthropic provides training resources and ongoing support for practical implementation.",
  ],
  [
    TbUsersGroup,
    "For administrators",
    "Claude helps you scale personalized support across thousands of students.",
  ],
]

// The batch in the left gutter. The file's stack holds three cards, two of
// them the same prompt; each prompt is here once.
const BATCH = [
  "I’m writing an essay. After each paragraph I write, analyze it for 1) clarity, 2) evidence quality, 3) logic.",
  "Hey Claude, help me forecast the upcoming year so I can make some informed plans.",
]

const RESOURCES: Array<[title: string, kind: string]> = [
  ["AI Fluency for students", "Anthropic Academy"],
  ["AI Fluency for educators", "Anthropic Academy"],
  ["Teaching AI Fluency", "Anthropic Academy"],
  ["AI Fluency: Framework & Foundations", "Anthropic Academy"],
]

type Way = {
  title: string
  text: string
  points?: Array<string>
  more?: boolean
  art?: string
}

const WAYS: Array<Way> = [
  {
    title: "A thinking partner—not answer machine",
    text: "Claude’s learning mode represents our commitment to education's true purpose: developing capable, independent thinkers.",
    points: [
      "Guides discovery rather than answering directly",
      "Develops thinking through Socratic questioning",
      "Focuses on principles instead of solutions",
      "Provides templates for research, study guides, and more",
    ],
  },
  {
    title: "Claude Code: Where students learn to code",
    text: "Students across disciplines need coding literacy. Claude Code works like a scaled apprenticeship, pairing with students in development environments to show how professional programmers think through real problems.",
    more: true,
  },
  {
    title: "Claude API for research and tools",
    text: "Faculty use the Claude API to accelerate research—analyzing datasets, exploring theoretical questions, and processing volumes of text. The same API enables building learning tools that ask better questions and create adaptive assignments.",
    more: true,
    art: "object-code-globe",
  },
]

const ECOSYSTEM: Array<Logo> = [
  ["canvas", "Canvas"],
  ["wiley", "Wiley"],
  ["panopto", "Panopto"],
]

const TABS: Array<[name: string, Icon: IconType]> = [
  ["Students", TbMessageCircle],
  ["Educators", TbPencil],
  ["Administrators", TbPencil],
  ["Session", TbPencil],
]

const PROMPTS = [
  "I’m interested in translation. What questions should I be asking myself about this career path?",
  "I’m writing an essay. After each paragraph I write, analyze it for: 1) clarity, 2) evidence quality, 3) logic.",
  "Help me discover non-obvious connections between ecosystems in biology and market systems in economics.",
]

/** A section's opening in two columns: a pictogram and headline, and a paragraph. */
function SplitHead({
  pictogram,
  title,
  text,
}: {
  pictogram: string
  title: string
  text: string
}) {
  return (
    <div className="cds-solb-split">
      <div>
        <img src={`${ART}/${pictogram}.svg`} alt="" />
        <h3 className="cds-headline-3">{title}</h3>
      </div>
      <p className="cds-body-1">{text}</p>
    </div>
  )
}

/**
 * The page. Ivory and White by turns, as in the file, over the Dark 3
 * footer; on the site's dark mode, Dark 3 and Dark 2.
 */
function SolutionsEducation() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation crumbs={["Solutions", "Education"]} />
        <div className="cds-hero cds-hero-stagger cds-solb-hero">
          <h3>
            <span>Navigating AI in</span>
            <span>education together</span>
          </h3>
          <div>
            <img src={`${ART}/hand-abacus.svg`} alt="" />
            <div className="cds-hero-copy">
              <p className="cds-hero-lead">
                Claude helps universities maintain academic integrity while
                incorporating AI tools in education, with Anthropic’s commitment
                to safety.
              </p>
              <Button size="large" icon="none">
                Contact our Education team
              </Button>
            </div>
          </div>
        </div>
        <div className="cds-solb-under-hero">
          <LogoWall logos={UNIVERSITIES} />
        </div>
      </TemplateBlock>

      <TemplateSection theme={["white", "dark-2"]}>
        <SplitHead
          pictogram="object-shield"
          title="Our commitment to responsible AI in education"
          text="At Anthropic, we believe AI has the power to fundamentally transform education for the better, but only if educators and universities lead the charge. We develop Claude with powerful safeguards to ensure it remains a beneficial tool for students, faculty, and administrators."
        />
        <Features items={COMMITMENTS} />
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Claude for education"
          subtitle="A comprehensive university-wide plan for institutions, including its students, faculty, and staff."
          pictogram={`${ART}/object-book-apple.svg`}
          actions={
            <Button size="large" icon="none">
              Contact our Education team
            </Button>
          }
        />
        <Gutters
          rows={AUDIENCES}
          size="p1"
          batch={BATCH.map((prompt) => (
            <PromptCard key={prompt}>{prompt}</PromptCard>
          ))}
          cards={
            // The report: a pictogram on a tile of the file's Sky.
            <div className="cds-margin" data-gutter="right">
              <div className="cds-margin-card">
                <div className="cds-margin-head">Report</div>
                <div
                  className="cds-margin-media cds-solb-sky"
                  data-type="pictogram"
                >
                  <img src={`${ART}/object-lamp-paper.svg`} alt="" />
                </div>
                <p>How university students use Claude</p>
                <div>
                  <Button size="small" variant="tertiary" icon="none">
                    Read more
                  </Button>
                </div>
              </div>
            </div>
          }
        />
        <div className="cds-solb-resources">
          <div>
            <img src={`${ART}/object-document-magnifier.svg`} alt="" />
            <h4 className="cds-headline-4">
              Resources for students, educators, and administrators
            </h4>
            <p>
              Everything you need to integrate AI thoughtfully into your
              educational environment.
            </p>
          </div>
          <LinkRows items={RESOURCES} />
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-2"]}>
        <SplitHead
          pictogram="object-gears"
          title="How Claude works for education"
          text="Built to strengthen thinking, not replace it. Claude helps students and faculty develop transferable skills through guided discovery and real-world application."
        />
        <div className="cds-solb-ways">
          {WAYS.map(({ title, text, points, more, art }) => (
            <div key={title} className="cds-solb-way">
              {/* A picture of the product in the file's first two; here, as
                  on the Home template, a plain tile. */}
              <div
                className="cds-solb-tile"
                data-art={art ? "" : undefined}
                aria-hidden
              >
                {art && <img src={`${ART}/${art}.svg`} alt="" />}
              </div>
              <h4>{title}</h4>
              <p>{text}</p>
              {points && (
                <ul>
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
              {more && (
                <Button size="small" variant="tertiary">
                  Learn more
                </Button>
              )}
            </div>
          ))}
        </div>
        <LogoWall
          logos={ECOSYSTEM}
          title="Connected to your educational ecosystem"
        />
        <div className="cds-solb-banner">
          <img src={`${ART}/hand-signature.svg`} alt="" />
          <h4 className="cds-headline-4">
            Apply for our fall 2025 student programs
          </h4>
          <Button size="large" variant="clay" icon="none">
            Apply now
          </Button>
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]}>
        <Header
          size="p1"
          title="Try Claude"
          subtitle="Get to know Claude by trying a few sample prompts."
          pictogram={`${ART}/hand-link.svg`}
          actions={null}
        />
        <div className="cds-solb-try">
          <Segments label="Who is asking" tabs={TABS} />
          <div className="cds-prompts">
            {PROMPTS.map((prompt) => (
              <label key={prompt} className="cds-prompt">
                <textarea
                  defaultValue={prompt}
                  aria-label="Prompt"
                  spellCheck={false}
                />
                <span className="cds-prompt-controls">
                  <button
                    type="button"
                    className="cds-btn"
                    data-variant="clay"
                    data-icon="only"
                    {...quiet}
                  >
                    <span>Ask Claude</span>
                    <TbArrowUp aria-hidden />
                  </button>
                </span>
              </label>
            ))}
          </div>
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
const SOLUTIONS_EDUCATION_DEMO: Array<DemoStep> = [
  { on: ".cds-solb-hero .cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-solb-hero .cds-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function SolutionsEducationDoc() {
  return (
    <Section>
      <TemplateFigure steps={SOLUTIONS_EDUCATION_DEMO}>
        <SolutionsEducation />
      </TemplateFigure>
    </Section>
  )
}
