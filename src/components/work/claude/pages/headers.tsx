import { Fragment, useContext, useRef, useState } from "react"
import {
  TbArrowUp,
  TbBrandInstagram,
  TbBrandLinkedinFilled,
  TbBrandX,
  TbBrandYoutubeFilled,
  TbChevronRight,
  TbCode,
  TbFileText,
  TbPencil,
  TbX,
} from "react-icons/tb"
import { cn } from "@/lib/utils"
import { RevealContext } from "@/components/work/claude/reveal"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { ClaudeLogo } from "@/components/work/claude/logo"
import { Resizable } from "@/components/work/claude/resizable"
import { Button } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// A pictogram from the system's set, exported from the Figma file as an SVG.
const PICTOGRAM = "/work/claude/illustrations/hand-link.svg"
const HEADLINE = "Where problems meet their match"
const SUBTITLE = "An optional subtitle, for a little more context."

// The five sizes: the headline's style and the subtitle's.
const SIZES = [
  ["p1", "cds-headline-1", "cds-body-large-2"],
  ["p2", "cds-headline-2", "cds-body-1"],
  ["p3", "cds-headline-3", "cds-body-1"],
  ["p4", "cds-headline-4", "cds-body-1"],
  ["p5", "cds-headline-5", "cds-body-2"],
] as const

type Size = (typeof SIZES)[number][0]

export function Header({
  size,
  align = "center",
  bare = false,
  title = HEADLINE,
  subtitle = SUBTITLE,
  pictogram = PICTOGRAM,
  actions,
}: {
  size: Size
  align?: "center" | "left"
  /** The headline and subtitle alone, without the pictogram and buttons. */
  bare?: boolean
  /** A page's own words and picture (the docs' figures use the file's). */
  title?: string
  subtitle?: string | null
  pictogram?: string | null
  /** A page's own buttons; null for none. The file's two by default. */
  actions?: React.ReactNode
}) {
  const [, headline, body] = SIZES.find(([id]) => id === size) ?? SIZES[0]
  // On a template page the headline is written a word at a time, so it can
  // come in by its words as the site's do (reveal.ts).
  const words = useContext(RevealContext) ? title.split(/\s+/) : null
  return (
    <div className="cds-header" data-size={size} data-align={align}>
      <div className="cds-header-body">
        {!bare && pictogram && <img src={pictogram} alt="" />}
        {words ? (
          <h3
            className={cn(headline, "cds-words")}
            aria-label={title}
            style={
              {
                // The words are spread over a fifth of a second.
                "--word-stagger": `${words.length > 1 ? 0.2 / (words.length - 1) : 0}s`,
              } as React.CSSProperties
            }
          >
            {words.map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span
                  aria-hidden
                  style={{ "--word-index": i } as React.CSSProperties}
                >
                  {word}
                </span>
              </Fragment>
            ))}
          </h3>
        ) : (
          <h3 className={headline}>{title}</h3>
        )}
        {subtitle && <p className={body}>{subtitle}</p>}
        {!bare && actions !== null && (
          <div className="cds-header-actions">
            {actions ?? (
              <>
                <Button size="large" icon="none">
                  Primary CTA
                </Button>
                <Button size="large" variant="secondary" icon="none">
                  Secondary CTA
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

type Block = [title: string, links: Array<string>]

// The footer's links, in its four columns, as in the Figma file.
const COLUMNS: Array<Array<Block>> = [
  [
    [
      "Products",
      [
        "Claude",
        "Claude Code",
        "Max plan",
        "Team plan",
        "Enterprise plan",
        "Download app",
        "Pricing",
        "Log in",
      ],
    ],
    ["Models", ["Opus", "Sonnet", "Haiku"]],
  ],
  [
    [
      "Solutions",
      [
        "AI agents",
        "Coding",
        "Code modernization",
        "Customer support",
        "Education",
        "Financial services",
        "Government",
      ],
    ],
    [
      "Claude Developer Platform",
      [
        "Overview",
        "Developer docs",
        "Pricing",
        "Amazon Bedrock",
        "Google Cloud’s Vertex AI",
        "Console login",
      ],
    ],
  ],
  [
    [
      "Learn",
      [
        "Courses",
        "Connectors",
        "Customer stories",
        "Engineering at Anthropic",
        "Events",
        "Powered by Claude",
        "Service partners",
        "Startups program",
      ],
    ],
    [
      "Company",
      [
        "Anthropic",
        "Careers",
        "Economic Futures",
        "Research",
        "News",
        "Responsible Scaling Policy",
        "Security and compliance",
        "Transparency",
      ],
    ],
  ],
  [
    ["Help and security", ["Availability", "Status", "Support center"]],
    [
      "Terms and policies",
      [
        "Privacy choices",
        "Privacy policy",
        "Responsible disclosure policy",
        "Terms of service: Commercial",
        "Terms of service: Consumer",
        "Usage policy",
      ],
    ],
  ],
]

const MINIMAL: Array<Array<Block>> = [
  [
    [
      "Terms and policies",
      [
        "Privacy choices",
        "Privacy policy",
        "Responsible disclosure policy",
        "Terms of service",
        "Usage policy",
      ],
    ],
  ],
]

const SOCIAL = [
  ["X", TbBrandX],
  ["LinkedIn", TbBrandLinkedinFilled],
  ["YouTube", TbBrandYoutubeFilled],
  ["Instagram", TbBrandInstagram],
] as const

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

// The footer's prompt input and its examples, as the file has them: three
// kinds of thing to ask for, each with three prompts.
const EXAMPLES = [
  [
    "Write",
    TbPencil,
    ["Write case studies", "Write grant proposals", "Write video scripts"],
  ],
  [
    "Learn",
    TbFileText,
    [
      "Compare learning resources",
      "Develop learning frameworks",
      "Develop discussion prompts",
    ],
  ],
  [
    "Code",
    TbCode,
    [
      "Design a software architecture",
      "Design logging systems",
      "Develop technical debt analysis",
    ],
  ],
] as const

/**
 * The footer's prompt input: a field that sends what is typed to Claude,
 * over three chips. A chip opens its examples in the chips' place; picking
 * one writes it in the field, ready to send. Here sending only clears the
 * field: the figure goes nowhere.
 */
export function FooterPrompt({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  // The field keeps its own text, so the demo cursor can type in it too.
  const field = useRef<HTMLInputElement>(null)
  const write = (text: string) => {
    if (field.current) field.current.value = text
  }
  return (
    <div className="cds-footer-prompt" data-overlay={overlay ? "" : undefined}>
      <label className="cds-input" data-trailing="button">
        <input
          ref={field}
          type="text"
          placeholder="How can I help you today?"
          aria-label="How can I help you today?"
        />
        <button
          type="button"
          className="cds-btn"
          data-variant="clay"
          data-size="small"
          data-icon="only"
          aria-label="Send"
          onClick={() => write("")}
          {...quiet}
        >
          <TbArrowUp aria-hidden />
        </button>
      </label>
      {/* The examples take the chips' place. In the footer they push what is
          under them down; with `overlay` (the figure of the input alone)
          the chips keep their room, out of sight, and the list lies over
          it, so the input does not move when a list opens. */}
      {open === null || overlay ? (
        <div
          className="cds-chips"
          style={open === null ? undefined : { visibility: "hidden" }}
        >
          {EXAMPLES.map(([label, Icon], i) => (
            <button
              key={label}
              type="button"
              className="cds-chip"
              onClick={() => setOpen(i)}
              {...quiet}
            >
              <Icon aria-hidden />
              {label}
            </button>
          ))}
        </div>
      ) : null}
      {open !== null && (
        <Examples
          kind={open}
          close={() => setOpen(null)}
          pick={(text) => {
            write(text)
            setOpen(null)
          }}
        />
      )}
    </div>
  )
}

function Examples({
  kind,
  close,
  pick,
}: {
  kind: number
  close: () => void
  pick: (text: string) => void
}) {
  const [label, Icon, prompts] = EXAMPLES[kind]
  return (
    <div
      className="cds-menu"
      data-type="list"
      role="group"
      aria-label={`${label} examples`}
    >
      <div className="cds-menu-header !px-0">
        <span className="flex items-center gap-1 px-2 font-medium">
          <Icon aria-hidden className="h-4 w-4" />
          {label}
        </span>
        <button
          type="button"
          className="cds-btn"
          data-variant="tertiary"
          data-size="small"
          data-icon="only"
          aria-label="Close"
          onClick={close}
          {...quiet}
        >
          <TbX aria-hidden />
        </button>
      </div>
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="cds-menu-item"
          onClick={() => pick(prompt)}
          {...quiet}
        >
          <span>{prompt}</span>
          <TbChevronRight aria-hidden />
        </button>
      ))}
    </div>
  )
}

export function Footer({ minimal = false }: { minimal?: boolean }) {
  return (
    // The links are for show: none of them goes anywhere.
    <div
      className="cds-footer"
      data-variant={minimal ? "minimal" : undefined}
      onClick={(e) => {
        if ((e.target as Element).closest("a")) e.preventDefault()
      }}
    >
      <div className="cds-footer-grid">
        <div className="cds-footer-top">
          <ClaudeLogo />
          {!minimal && <FooterPrompt />}
        </div>
        <div className="cds-footer-links">
          {(minimal ? MINIMAL : COLUMNS).map((column, i) => (
            <div key={i}>
              {column.map(([title, links]) => (
                <div key={title} className="cds-footer-block">
                  <h4>{title}</h4>
                  <ul>
                    {links.map((link) => (
                      <li key={link}>
                        <a href="#headers">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="cds-footer-meta">
          <div className="cds-footer-by" role="img" aria-label="By Anthropic" />
          © 2026 Anthropic PBC
          <div className="cds-footer-social">
            {SOCIAL.map(([name, Icon]) => (
              <a key={name} href="#headers" aria-label={name}>
                <Icon aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// What the demo cursor tries on a header: its two buttons, with a rest on
// the pictogram between rounds.
const HEADER_DEMO: Array<DemoStep> = [
  { on: ".cds-btn", text: "Primary", click: true, rest: 600 },
  { on: ".cds-btn", text: "Secondary", rest: 900 },
  { on: "img", rest: 1800 },
]

const link = ".cds-footer-block a"

// On the prompt input it opens each kind of example, looks down the list
// (the others dim), picks one, which is written in the field, and sends it.
const PROMPT_DEMO: Array<DemoStep> = [
  { on: ".cds-menu-header .cds-btn", click: true, rest: 200 },
  { on: ".cds-chip", text: "Write", click: true },
  { on: ".cds-menu-item", nth: 0 },
  { on: ".cds-menu-item", nth: 1, click: true, rest: 600 },
  { on: ".cds-input .cds-btn", click: true },
  { on: ".cds-chip", text: "Learn", click: true },
  { on: ".cds-menu-item", nth: 2, rest: 700 },
  { on: ".cds-menu-header .cds-btn", click: true },
  { on: ".cds-chip", text: "Code", click: true },
  { on: ".cds-menu-item", nth: 0, click: true, rest: 600 },
  { on: ".cds-input .cds-btn", click: true, rest: 700 },
]

// On the footer it writes in the field and sends it, then looks over a link
// in each column (the others dim) and the social icons. Then it narrows the
// footer until its links fold into two columns under the logo, looks at one
// there, scrolls down the footer and back (narrow, it is longer than its
// figure), and lets it out again.
const FOOTER_DEMO: Array<DemoStep> = [
  { on: ".cds-input", type: "What can Claude do?" },
  { on: ".cds-input .cds-btn", click: true },
  { on: link, text: "Claude Code", rest: 600 },
  { on: link, text: "Customer stories", rest: 600 },
  { on: link, text: "Support center", rest: 600 },
  { on: ".cds-footer-social a", nth: 1, rest: 800 },
  { on: ".cds-resize-grip", nth: 1, drag: 600 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  // Narrow, the footer is longer than its figure: down it, and back up.
  { on: ".cds-footer-window", scroll: 60 },
  { on: link, rest: 700 },
  { on: ".cds-footer-window", scroll: 100 },
  { on: ".cds-footer-social a", nth: 1, rest: 700 },
  { on: ".cds-footer-window", scroll: 0 },
  { on: ".cds-chip", text: "Write", click: true },
  { on: ".cds-menu-header .cds-btn", click: true, rest: 400 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

const MINIMAL_DEMO: Array<DemoStep> = [
  { on: link, text: "Privacy policy", rest: 700 },
  { on: link, text: "Terms of service", rest: 700 },
  { on: link, text: "Usage policy", rest: 700 },
  { on: ".cds-footer-social a", nth: 0, rest: 700 },
  { on: ".cds-footer-social a", nth: 3, rest: 900 },
]

export function HeadersDoc() {
  return (
    <>
      <Section
        title="Headers"
        caption="One header in five sizes; these are the largest, P1, centered, and P3, aligned left. The buttons and the pictogram can be turned off."
      >
        <Specimen figure>
          <DemoCursor steps={HEADER_DEMO}>
            <Header size="p1" />
          </DemoCursor>
        </Specimen>
        <Specimen figure>
          <DemoCursor steps={HEADER_DEMO}>
            <Header size="p3" align="left" />
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Header Sizes"
        caption="Five sizes, two alignments, and two devices: 20 variants."
      >
        {/* The rules take the figure's own border color, not the page's:
            the two differ once a theme is picked for the figures. */}
        <Specimen
          figure
          className="divide-y divide-[color:var(--cds-border-3)] [--cds-header-pad:32px]"
        >
          {SIZES.map(([size]) => (
            <Header key={size} size={size} align="left" bare />
          ))}
        </Specimen>
      </Section>

      <Section
        title="Footer Prompt Input"
        caption="A glimpse of Claude from any page: example prompts guide people into other ways to start."
      >
        <Specimen theme="dark-3" figure>
          {/* Room under the field for the open list, so the figure keeps
              its height. */}
          <DemoCursor
            steps={PROMPT_DEMO}
            className="flex min-h-[460px] items-center justify-center p-6 md:p-8"
          >
            <FooterPrompt overlay />
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Footer"
        caption="Prompt input sends text to Claude, starting a session in the web app."
      >
        <Specimen theme="dark-3" figure>
          {/* Room all round, as on the other resizable figures: at the
              sides for the grips, and above and below so the footer's own
              background does not cover the figure's border. */}
          <DemoCursor steps={FOOTER_DEMO} className="p-6 md:p-8">
            {/* As tall as the wide footer. Narrow, the footer is about
                twice that, and scrolls as it would on a phone, so the
                figure keeps one height while it is resized. The scrolling
                box is inside the resized one: the grips hang outside that
                one's edges and would be cut off by its own scrolling. */}
            <Resizable
              label="Footer width"
              min={390}
              sizes={[["Desktop"], ["Mobile", 759]]}
              className="h-[744px]"
            >
              <div className="cds-footer-window h-full [scrollbar-width:none] overflow-y-auto">
                <Footer />
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Minimal Footer"
        caption="A second footer, Minimal, for desktop and mobile."
      >
        <Specimen figure theme="dark-3">
          <DemoCursor steps={MINIMAL_DEMO} className="p-6 md:p-8">
            <Footer minimal />
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
