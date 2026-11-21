// The site's links as the Figma file has them: the header's menus, and the
// footer's nine groups (one open in each of the Footer's "… Open" variants),
// which the expanded navigation's own list reuses.

export type MenuColumn = { heading?: string; links: Array<string> }

/** The header's pills, left of the logo then right of it, and their menus,
 *  as anthropic.com has them (read from the site on 2026-11-19). */
export const LEFT_MENUS: Array<[label: string, columns?: Array<MenuColumn>]> = [
  ["News"],
  [
    "Research",
    [
      {
        links: [
          "Overview",
          "Alignment",
          "Interpretability",
          "Engineering",
          "Science",
        ],
      },
      {
        links: [
          "The Anthropic Institute",
          "Economics",
          "Frontier Red Team",
          "Societal Impacts",
        ],
      },
    ],
  ],
  ["Policy", [{ links: ["Overview", "Policy on the AI Exponential"] }]],
  [
    "Commitments",
    [
      {
        links: [
          "Claude’s Constitution",
          "Beneficial Deployments",
          "Responsible Scaling Policy",
          "Frontier Safety Roadmap",
        ],
      },
      { links: ["Transparency", "Threat Intelligence"] },
    ],
  ],
]

export const RIGHT_MENUS: Array<[label: string, columns: Array<MenuColumn>]> = [
  [
    "Company",
    [
      {
        heading: "Who we are",
        links: ["About us", "Leadership", "Public benefit report", "Customers"],
      },
      { heading: "Join us", links: ["Careers", "Events"] },
      { heading: "Programs", links: ["Claude Corps", "Economic Futures"] },
    ],
  ],
  ["Try Claude", [{ links: ["Claude AI", "Console"] }]],
]

/** The footer's link groups, in order, each with its links. */
export const FOOTER_GROUPS: Array<[title: string, links: Array<string>]> = [
  [
    "Research",
    [
      "Overview",
      "Alignment",
      "Economics",
      "Engineering",
      "Frontier Red Team",
      "Interpretability",
      "Societal Impacts",
      "Science",
    ],
  ],
  [
    "Company",
    [
      "About",
      "News",
      "Careers",
      "Policy",
      "Economic Futures",
      "Claude’s Constitution",
      "Policy on the AI Exponential",
      "Responsible Scaling Policy",
      "Security and compliance",
      "Transparency",
    ],
  ],
  [
    "Programs",
    ["The Anthropic Institute", "Claude Corps", "Startups", "Research Labs"],
  ],
  ["Models", ["Mythos", "Fable", "Opus", "Sonnet", "Haiku"]],
  [
    "Product",
    [
      "Claude",
      "Claude Code",
      "Claude Code Enterprise",
      "Claude Cowork",
      "@Claude",
      "Claude Design",
      "Claude Science",
      "Claude Security",
      "Claude for Chrome",
      "Claude for Microsoft 365",
      "Skills",
      "Download app",
      "Pricing",
      "Claude Platform",
    ],
  ],
  [
    "Resources",
    [
      "Blog",
      "Customer stories",
      "Anthropic Academy",
      "Courses",
      "Tutorials",
      "Use cases",
      "Inside Claude Code",
      "Inside Claude Cowork",
      "Inside Claude Enterprise",
      "Inside Claude Security",
      "Developer Docs",
      "Connectors",
      "Plugins",
      "Events",
      "Community",
    ],
  ],
  [
    "Solutions",
    [
      "AI agents",
      "Code modernization",
      "Coding",
      "Customer support",
      "Education",
      "Enterprise",
      "Financial services",
      "Government",
      "Healthcare",
      "Legal",
      "Life sciences",
      "Nonprofits",
      "Security",
      "Small business",
    ],
  ],
  ["Help and security", ["Availability", "Status", "Support center"]],
  [
    "Terms and policies",
    [
      "Privacy choices",
      "Legal center",
      "Privacy policy",
      "Consumer health data privacy policy",
      "Responsible disclosure policy",
      "Terms of service: Commercial",
      "Terms of service: Consumer",
      "Usage policy",
    ],
  ],
]

export const groupLinks = (title: string) =>
  FOOTER_GROUPS.find(([name]) => name === title)?.[1] ?? []

/** The press, support, and media cards (the prefooter and the menu). */
export const CONTACTS = [
  ["Press", "press@anthropic.com"],
  ["Support", "support@anthropic.com"],
  ["Media assets", "Download press kit"],
] as const
