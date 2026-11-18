import {
  TbBrandInstagram,
  TbBrandLinkedinFilled,
  TbBrandX,
  TbBrandYoutubeFilled,
} from "react-icons/tb"
import { ClaudeLogo } from "@/components/work/claude/logo"
import { Button, TextInput } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"

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

function Header({
  size,
  align = "center",
  bare = false,
}: {
  size: Size
  align?: "center" | "left"
  /** The headline and subtitle alone, without the pictogram and buttons. */
  bare?: boolean
}) {
  const [, headline, subtitle] = SIZES.find(([id]) => id === size) ?? SIZES[0]
  return (
    <div className="cds-header" data-size={size} data-align={align}>
      <div className="cds-header-body">
        {!bare && <img src={PICTOGRAM} alt="" />}
        <h3 className={headline}>{HEADLINE}</h3>
        <p className={subtitle}>{SUBTITLE}</p>
        {!bare && (
          <div className="cds-header-actions">
            <Button size="large" icon="none">
              Primary CTA
            </Button>
            <Button size="large" variant="secondary" icon="none">
              Secondary CTA
            </Button>
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

function Footer({ minimal = false }: { minimal?: boolean }) {
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
          {!minimal && (
            <div>
              <TextInput trailing="button" />
            </div>
          )}
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

export function HeadersDoc() {
  return (
    <>
      <Section title="Headers">
        <Specimen>
          <Header size="p1" />
        </Specimen>
        <Specimen>
          <Header size="p3" align="left" />
        </Specimen>
      </Section>

      <Section title="Header Sizes">
        {/* The rules take the figure's own border color, not the page's:
            the two differ once a theme is picked for the figures. */}
        <Specimen className="divide-y divide-[color:var(--cds-border-3)] [--cds-header-pad:32px]">
          {SIZES.map(([size]) => (
            <Header key={size} size={size} align="left" bare />
          ))}
        </Specimen>
      </Section>

      <Section title="Footer">
        <Specimen theme="dark-3">
          <Footer />
        </Specimen>
      </Section>

      <Section title="Minimal Footer">
        <Specimen theme="dark-3">
          <Footer minimal />
        </Specimen>
      </Section>
    </>
  )
}
