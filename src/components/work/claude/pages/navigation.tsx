import { useEffect, useRef, useState } from "react"
import {
  TbChevronDown,
  TbCopy,
  TbDownload,
  TbExternalLink,
  TbMenu2,
  TbMinus,
  TbPlus,
  TbSparkles,
  TbX,
} from "react-icons/tb"
import { ClaudeLogo } from "@/components/work/claude/logo"
import { Button } from "@/components/work/claude/specimens"
import { DocHeader, Section, Spec, Specimen } from "@/components/work/claude/ui"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

type Group = { heading?: string; external?: boolean; links: Array<string> }

// The site's five menus, as in the Figma file.
const MENUS: Array<[label: string, groups: Array<Group>]> = [
  [
    "Meet Claude",
    [
      { heading: "Products", links: ["Claude", "Claude Code"] },
      { heading: "Models", external: true, links: ["Opus", "Sonnet", "Haiku"] },
    ],
  ],
  [
    "Platform",
    [
      {
        links: ["API overview", "Developer docs", "Pricing", "Console login"],
      },
    ],
  ],
  [
    "Solutions",
    [
      {
        heading: "Use cases",
        links: ["AI agents", "Coding", "Code modernization"],
      },
      {
        heading: "Industries",
        links: [
          "Customer support",
          "Education",
          "Financial services",
          "Government",
        ],
      },
    ],
  ],
  [
    "Pricing",
    [{ links: ["Overview", "Max plan", "Team plan", "Enterprise plan"] }],
  ],
  [
    "Learn",
    [{ links: ["Courses", "Customer stories", "Events", "Anthropic news"] }],
  ],
]

function Links({ groups }: { groups: Array<Group> }) {
  return groups.map((group, i) => [
    i > 0 && <div key={`rule-${i}`} className="cds-menu-rule" />,
    group.heading && (
      <div key={group.heading} className="cds-menu-header">
        {group.heading}
      </div>
    ),
    ...group.links.map((link) => (
      <button key={link} type="button" className="cds-menu-item" {...quiet}>
        <span>{link}</span>
        {group.external && <TbExternalLink aria-hidden />}
      </button>
    )),
  ])
}

function SiteNavigation() {
  // Which menu is open: a menu's label, "explore", or the folded "panel".
  const [open, setOpen] = useState<string | null>(null)
  const [group, setGroup] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const toggle = (name: string) => setOpen(open === name ? null : name)

  useEffect(() => {
    if (!open || open === "panel") return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="cds-nav">
      <div className="cds-nav-bar">
        <ClaudeLogo className="h-6 w-auto shrink-0" />
        <div className="cds-nav-links">
          {MENUS.map(([label, groups]) => (
            <div key={label} className="cds-nav-item">
              <button
                type="button"
                className="cds-nav-link"
                aria-expanded={open === label}
                onClick={() => toggle(label)}
                {...quiet}
              >
                {label}
                <TbChevronDown aria-hidden />
              </button>
              {open === label && (
                <div className="cds-menu">
                  <Links groups={groups} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="cds-nav-actions">
          <Button variant="tertiary" icon="none">
            Contact sales
          </Button>
          <Button icon="none">Try Claude</Button>
          <button
            type="button"
            className="cds-btn cds-nav-toggle"
            data-variant="tertiary"
            data-icon="only"
            aria-label="Menu"
            aria-expanded={open === "panel"}
            onClick={() => toggle("panel")}
            {...quiet}
          >
            {open === "panel" ? <TbX aria-hidden /> : <TbMenu2 aria-hidden />}
          </button>
        </div>
      </div>

      <div
        className="cds-nav-panel"
        data-open={open === "panel" ? "" : undefined}
      >
        {MENUS.map(([label, groups]) => (
          <div key={label}>
            <button
              type="button"
              className="cds-nav-group"
              aria-expanded={group === label}
              onClick={() => setGroup(group === label ? null : label)}
              {...quiet}
            >
              {label}
              {group === label ? (
                <TbMinus aria-hidden />
              ) : (
                <TbPlus aria-hidden />
              )}
            </button>
            {group === label && (
              <div className="pb-4">
                <Links groups={groups} />
              </div>
            )}
          </div>
        ))}
        <div className="cds-nav-panel-actions">
          <button
            type="button"
            className="cds-btn"
            data-variant="tertiary"
            {...quiet}
          >
            Contact sales
          </button>
          <button
            type="button"
            className="cds-btn"
            data-variant="primary"
            {...quiet}
          >
            Try Claude
          </button>
        </div>
      </div>

      <div className="cds-nav-sub">
        <span>
          Solutions<i>/</i>For individuals
        </span>
        <div className="cds-nav-item" data-align="end">
          <button
            type="button"
            className="cds-nav-link"
            aria-expanded={open === "explore"}
            onClick={() => toggle("explore")}
            {...quiet}
          >
            Explore here
            <TbChevronDown aria-hidden />
          </button>
          {open === "explore" && (
            <div className="cds-menu" data-type="list">
              <button type="button" className="cds-menu-item" {...quiet}>
                <TbCopy aria-hidden />
                <span>Copy as markdown for LLMs</span>
              </button>
              <button type="button" className="cds-menu-item" {...quiet}>
                <TbDownload aria-hidden />
                <span>Download pitch-worthy PDF</span>
              </button>
              <button type="button" className="cds-menu-item" {...quiet}>
                <TbSparkles aria-hidden />
                <span>Ask questions about this page</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function NavigationDoc() {
  return (
    <>
      <DocHeader group="Patterns" title="Navigation">
        The site header: a comprehensive site-wide wayfinding component that
        provides hierarchical access to all major sections. It works here, and
        folds into a menu button when its box gets narrow.
      </DocHeader>

      <Section
        title="Header and sub-navigation"
        description="The logo, five menus and two buttons, over a breadcrumb bar whose Explore here menu offers the page as markdown or a PDF. Each menu opens the navigation menu from Components; below 760px they collapse into one panel of rows that open in turn."
      >
        <Specimen className="min-h-[30rem]">
          <SiteNavigation />
        </Specimen>
        <Spec>
          Bar: 24px above and below, logo 24px tall, menu buttons 28px tall with
          15/24 text and a 16px chevron, 8px apart; Contact sales and Try Claude
          are medium buttons 12px apart. Sub-navigation: 12/18 text between two
          rules.
        </Spec>
      </Section>
    </>
  )
}
