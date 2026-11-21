import { useEffect, useRef, useState } from "react"
import {
  TbChevronDown,
  TbCopy,
  TbDownload,
  TbExternalLink,
  TbSparkles,
} from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import {
  SkeletonFeatures,
  SkeletonHeader,
  SkeletonHero,
} from "@/components/work/claude/skeleton"
import { ClaudeLogo } from "@/components/work/claude/logo"
import type { DemoStep } from "@/components/work/claude/demo-cursor"
import { Button } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"

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

// What the demo cursor does, in order: look around, resize, look around
// again, and so on. Wide, it rests on each menu's link, which opens the menu
// (they open on hover), and looks down its rows. Then it takes the
// right-hand grip and narrows the figure until the header folds, opens the
// folded menu and its groups, narrows it to a phone and does the same, and
// lets it out again. A step whose control is hidden at the current width is
// skipped, so each stretch only uses what is showing.
const DEMO: Array<DemoStep> = [
  // Close a folded menu or group left open.
  { on: ".cds-nav-toggle, .cds-nav-group", click: "close", rest: 200 },
  // Wide: the menus open under the cursor, as they do under a pointer.
  { on: ".cds-nav-link", text: "Meet Claude", rest: 600 },
  { on: ".cds-menu-item", text: "Claude Code" },
  { on: ".cds-menu-item", text: "Sonnet" },
  { on: ".cds-nav-link", text: "Platform", rest: 600 },
  { on: ".cds-menu-item", text: "Developer docs" },
  { on: ".cds-nav-link", text: "Solutions", rest: 600 },
  { on: ".cds-menu-item", text: "Coding" },
  { on: ".cds-menu-item", text: "Education" },
  { on: ".cds-nav-sub .cds-nav-link", rest: 600 },
  { on: ".cds-menu-item", text: "Download pitch-worthy PDF" },
  { on: ".cds-nav-sub a", rest: 600 },
  // Narrower: the header folds into a menu button.
  { on: ".cds-resize-grip", nth: 1, drag: 600 },
  { on: ".cds-nav-toggle", click: "open" },
  { on: ".cds-nav-group", text: "Meet Claude", click: "open" },
  { on: ".cds-nav-panel .cds-menu-item", text: "Claude Code" },
  { on: ".cds-nav-group", text: "Solutions", click: "open" },
  { on: ".cds-nav-panel .cds-menu-item", text: "Customer support" },
  { on: ".cds-nav-group", text: "Solutions", click: "close" },
  { on: ".cds-nav-toggle", click: "close", rest: 500 },
  // A phone.
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-nav-toggle", click: "open" },
  { on: ".cds-nav-group", text: "Pricing", click: "open" },
  { on: ".cds-nav-panel .cds-menu-item", text: "Max plan" },
  { on: ".cds-nav-group", text: "Pricing", click: "close" },
  { on: ".cds-nav-panel-actions .cds-btn", text: "Try Claude", click: true },
  { on: ".cds-nav-toggle", click: "close", rest: 500 },
  // And back out.
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
  { on: ".cds-nav-link", text: "Learn", rest: 600 },
  { on: ".cds-menu-item", text: "Customer stories" },
  {
    on: ".cds-nav-actions .cds-btn",
    text: "Try Claude",
    click: true,
    rest: 700,
  },
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

export function SiteNavigation({
  crumbs = ["Solutions", "For individuals"],
  more = "Explore here",
  children,
}: {
  /**
   * The breadcrumb bar's words for the page the header is on: the section,
   * and perhaps the page under it.
   */
  crumbs?: [section: string, page?: string]
  /** The label of the menu at the bar's right. */
  more?: string
  /** The page under the header, where a figure shows one. */
  children?: React.ReactNode
} = {}) {
  // Which menu is open: a menu's label, "explore", or the folded "panel".
  const [open, setOpen] = useState<string | null>(null)
  const [group, setGroup] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const toggle = (name: string) => setOpen(open === name ? null : name)

  // As on claude.com, a menu opens while the pointer is on its link or on
  // the menu itself, and closes when it leaves both. A mouse click on the
  // link therefore only keeps it open; a tap or the keyboard, which do not
  // hover, toggle it.
  const hover = (name: string) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setOpen(name)
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse")
        setOpen((now) => (now === name ? null : now))
    },
  })
  const press = (e: React.MouseEvent, name: string) => {
    const pointer = (e.nativeEvent as PointerEvent).pointerType
    if (e.detail > 0 && pointer === "mouse") setOpen(name)
    else toggle(name)
  }

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
            <div key={label} className="cds-nav-item" {...hover(label)}>
              <button
                type="button"
                className="cds-nav-link"
                aria-expanded={open === label}
                onClick={(e) => press(e, label)}
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
            className="cds-nav-toggle"
            aria-label="Menu"
            aria-expanded={open === "panel"}
            onClick={() => toggle("panel")}
            {...quiet}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </div>

      {/* Under the bar: the breadcrumb bar, and over it, when the header is
          folded and its menu open, the menu's sheet. */}
      <div className="cds-nav-body">
        <div
          className="cds-nav-panel"
          data-open={open === "panel" ? "" : undefined}
        >
          {MENUS.map(([label, groups], i) => (
            // `--i` staggers the groups as the sheet opens.
            <div key={label} style={{ "--i": i } as React.CSSProperties}>
              <button
                type="button"
                className="cds-nav-group"
                aria-expanded={group === label}
                onClick={() => setGroup(group === label ? null : label)}
                {...quiet}
              >
                {label}
                <b aria-hidden />
              </button>
              {group === label && (
                <div>
                  <Links groups={groups} />
                </div>
              )}
            </div>
          ))}
          <div
            className="cds-nav-panel-actions"
            style={{ "--i": MENUS.length + 1 } as React.CSSProperties}
          >
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
            {/* The breadcrumb's first step is a link back up; the last is
                the page itself. The link is for show. */}
            <a
              href="#navigation"
              onClick={(e) => e.preventDefault()}
              {...quiet}
            >
              {crumbs[0]}
            </a>
            {crumbs[1] && (
              <>
                <i>/</i>
                {crumbs[1]}
              </>
            )}
          </span>
          <div className="cds-nav-item" data-align="end" {...hover("explore")}>
            <button
              type="button"
              className="cds-nav-link"
              aria-expanded={open === "explore"}
              onClick={(e) => press(e, "explore")}
              {...quiet}
            >
              {more}
              <TbChevronDown aria-hidden />
            </button>
            {open === "explore" && (
              <div className="cds-menu">
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
        {children}
      </div>
    </div>
  )
}

export function NavigationDoc() {
  return (
    <>
      <Section
        title="Header & Sub-navigation"
        caption="19 variants, across its open menus, on desktop and mobile."
      >
        <Specimen figure>
          {/* The header sits at the top of its page, and the page fills the
              figure, so there is no padding round it. */}
          <DemoCursor steps={DEMO}>
            {/* As tall as the phone the folded menu was drawn for. */}
            <Resizable
              label="Header width"
              min={360}
              bleed
              // One button goes first; then the header folds.
              sizes={[["Desktop"], ["Tablet", 1000], ["Mobile", 760]]}
              className="flex min-h-[812px] flex-col sm:h-[812px]"
            >
              {/* The page under the header, as a skeleton: its menus open
                  over it, and the folded menu's sheet covers it. */}
              <SiteNavigation>
                <div className="cds-skel-under">
                  {/* The home page: its hero, then its first section's
                      header and download buttons, and what is under them. */}
                  <SkeletonHero />
                  <div className="cds-skel-rest">
                    <SkeletonHeader buttons={3} />
                    <SkeletonFeatures />
                  </div>
                </div>
              </SiteNavigation>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
