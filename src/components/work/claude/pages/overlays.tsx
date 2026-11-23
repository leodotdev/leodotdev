import { useEffect, useRef, useState } from "react"
import {
  TbCopy,
  TbDownload,
  TbExternalLink,
  TbFileText,
  TbPencil,
  TbSparkles,
  TbX,
} from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

function Item({
  icon,
  external,
  children,
}: {
  icon?: React.ReactNode
  external?: boolean
  children: string
}) {
  return (
    <button type="button" className="cds-menu-item" {...quiet}>
      {icon}
      <span>{children}</span>
      {external && <TbExternalLink aria-hidden />}
    </button>
  )
}

/** A term that explains itself: hover, focus or tap the dotted word. */
function Tooltip() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  // Tapping elsewhere or pressing Escape puts it away.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <p ref={ref} className="cds-tip-text" data-open={open ? "" : undefined}>
      Learn anything through conversation. Upload docs or{" "}
      <span
        className="relative inline-block"
        // Pointer events, not mouse ones: the docs' demo cursor sends these.
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setOpen(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setOpen(false)
        }}
      >
        <button
          type="button"
          className="cds-tip"
          aria-expanded={open}
          aria-describedby="cds-tooltip-demo"
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen(true)}
          {...quiet}
        >
          images
        </button>
        <span
          id="cds-tooltip-demo"
          role="tooltip"
          className="cds-tooltip left-0"
          hidden={!open}
        >
          <strong>Uploading docs &amp; images</strong>
          Upload any file (PDF, Word, Excel) or image and Claude analyzes it to
          answer your questions.
        </span>
      </span>{" "}
      for deeper insights or create visual study aids with artifacts. Voice
      makes complex topics easier to digest, while projects keeps your learning
      organized.
    </p>
  )
}

// What the demo cursor tries: it looks down each of the three menus in turn
// (the rows it is not on dim) and picks one. As it comes to each it names
// the menu's type, as the file's Menu component has them, with the file's
// description of the component and what its three variants draw.
const MENU_DEMO: Array<DemoStep> = [
  {
    on: ".cds-menu-item",
    text: "Claude Code",
    note: {
      kind: "concept",
      title: "Navigation Menu",
      text: "One of the Menu’s three types: “grouped lists of clickable options.”",
      on: '[aria-label="Navigation menu"]',
    },
  },
  { on: ".cds-menu-item", text: "Sonnet" },
  { on: ".cds-menu-item", text: "Haiku", click: true },
  {
    on: ".cds-menu-item",
    text: "Write grant proposals",
    note: {
      kind: "concept",
      title: "Prompt Suggestion Menu",
      text: "The second type lists prompts under a header.",
      on: '[aria-label="Prompt suggestions"]',
    },
  },
  { on: ".cds-menu-item", text: "Write video scripts", click: true },
  {
    on: ".cds-menu-item",
    text: "Download pitch-worthy PDF",
    note: {
      kind: "concept",
      title: "List Menu",
      text: "The third type: each option leads with an icon.",
      on: '[aria-label="Page actions"]',
    },
  },
  { on: ".cds-menu-item", text: "View as markdown" },
  {
    on: ".cds-menu-item",
    text: "Ask questions about this page",
    click: true,
    rest: 700,
  },
]

// It rests on the dotted word, which opens the tooltip, reads it, and moves
// off down the paragraph, which closes it. Its notes are from the Tooltip's
// three boards in the file: the component's description, "Tooltips on
// mobile", and "Using tooltips in Webflow".
const TOOLTIP_DEMO: Array<DemoStep> = [
  {
    on: ".cds-tip",
    rest: 2800,
    note: {
      kind: "concept",
      title: "Tooltip",
      text: "“They appear on demand and disappear when no longer needed.”",
      on: ".cds-tooltip",
    },
  },
  {
    on: ".cds-tip-text",
    at: [0.8, 0.9],
    rest: 1600,
    note: {
      kind: "concept",
      title: "On mobile",
      text: "No hover there: “users tap the highlighted word or phrase.”",
      on: ".cds-tip",
    },
  },
  {
    on: ".cds-tip-text",
    at: [0.8, 0.9],
    idle: true,
    note: {
      kind: "concept",
      title: "Webflow token",
      text: "The token “[[ url | tooltip headline | paragraph]]” writes one in Webflow.",
      on: ".cds-tip",
    },
  },
]

export function MenuDoc() {
  return (
    <>
      <Section>
        <Specimen figure>
          <DemoCursor
            steps={MENU_DEMO}
            className="flex flex-wrap items-start justify-center gap-6 p-6 md:p-8"
          >
            <div className="cds-menu" role="group" aria-label="Navigation menu">
              <div className="cds-menu-header">Products</div>
              <Item>Claude</Item>
              <Item>Claude Code</Item>
              <div className="cds-menu-rule" />
              <div className="cds-menu-header">Models</div>
              <Item external>Opus</Item>
              <Item external>Sonnet</Item>
              <Item external>Haiku</Item>
            </div>

            <div
              className="cds-menu"
              data-type="list"
              role="group"
              aria-label="Prompt suggestions"
            >
              <div className="cds-menu-header !px-0">
                <span className="flex items-center gap-1 px-2 font-medium">
                  <TbPencil aria-hidden className="h-4 w-4" />
                  Write
                </span>
                <button
                  type="button"
                  className="cds-btn"
                  data-variant="tertiary"
                  data-size="small"
                  data-icon="only"
                  style={{ borderColor: "transparent" }}
                  aria-label="Close"
                  {...quiet}
                >
                  <TbX aria-hidden />
                </button>
              </div>
              <Item>Write case studies</Item>
              <Item>Write grant proposals</Item>
              <Item>Write video scripts</Item>
            </div>

            <div
              className="cds-menu"
              data-type="list"
              role="group"
              aria-label="Page actions"
            >
              <Item icon={<TbCopy aria-hidden />}>
                Copy as markdown for LLMs
              </Item>
              <Item icon={<TbDownload aria-hidden />}>
                Download pitch-worthy PDF
              </Item>
              <Item icon={<TbFileText aria-hidden />}>View as markdown</Item>
              <Item icon={<TbSparkles aria-hidden />}>
                Ask questions about this page
              </Item>
            </div>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}

export function TooltipDoc() {
  return (
    <>
      <Section>
        <Specimen figure>
          <DemoCursor
            steps={TOOLTIP_DEMO}
            className="flex min-h-96 items-center justify-center p-6 md:p-8"
          >
            <Tooltip />
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
