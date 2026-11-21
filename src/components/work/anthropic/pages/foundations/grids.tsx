import { useState } from "react"
import { BREAKPOINTS } from "@/components/work/anthropic/pages/foundations/typography"
import { quiet } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Grids & Spacing page of the Anthropic.com file: its grid (the
// "Responsive" collection's Layout/Grid values), its five breakpoints, its
// section spacers, and its scale of space (the "Primitives" collection).

// The grid's specs as the file writes them in the middle of each frame, one
// set per layout; the figure's container queries show the one in force.
const SPECS = [
  ["sm", "04", "32PX"],
  ["md", "12", "48PX"],
  ["lg", "12", "80PX"],
] as const

// The cursor narrows the page from a laptop's width to a phone's, through
// the tablet, and lets it out again.
const GRID_DEMO: Array<DemoStep> = [
  { on: ".cds-resize-grip", nth: 1, drag: 900, rest: 1000 },
  { on: ".cds-resize-grip", nth: 1, drag: 600, rest: 1200 },
  { on: ".cds-resize-grip", nth: 1, drag: 390, rest: 1200 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000, rest: 1400 },
]

/** The grid as a page that resizes through the breakpoints. */
function GridFigure() {
  return (
    <Specimen figure>
      {/* No padding: the page fills the figure. */}
      <DemoCursor steps={GRID_DEMO}>
        <Resizable
          label="Page width"
          min={390}
          bleed
          sizes={BREAKPOINTS}
          className="h-[360px]"
        >
          <div className="ads-grid-page">
            <div className="ads-grid" aria-hidden>
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} />
              ))}
              <div className="ads-grid-specs ads-caption-2-mono">
                {SPECS.map(([at, columns, margin]) => (
                  <span key={at} data-at={at} className="space-x-4">
                    <span>
                      <b>Columns:</b> {columns}
                    </span>
                    <span>
                      <b>Gutter:</b> 16PX
                    </span>
                    <span>
                      <b>Margin:</b> {margin}
                    </span>
                    {at === "lg" && (
                      <span>
                        <b>Max-width:</b> 1920PX
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Resizable>
      </DemoCursor>
    </Specimen>
  )
}

// The file's breakpoint frames: name, size, and the tiles it lays out in
// each (columns and rows).
const FRAMES = [
  ["Mobile SM", 390, 844, 2, 3],
  ["Tablet MD - 768", 768, 1024, 3, 2],
  ["Laptop LG - 1280", 1280, 832, 4, 1],
  ["Desktop XL - 1512", 1512, 982, 6, 1],
  ["Desktop XXL - 1920", 1920, 1080, 6, 1],
] as const
const TOTAL = FRAMES.reduce((sum, [, w]) => sum + w, 0)

// The section spacers of the "Responsive" collection, per breakpoint from
// Desktop XXL to Mobile SM.
const SPACERS = [
  ["Hero Spacer Loose", [80, 80, 80, 64, 48]],
  ["Hero Spacer Condensed", [48, 48, 48, 32, 24]],
  ["Section Spacer LG", [96, 96, 96, 64, 48]],
  ["Section Spacer MD", [64, 64, 64, 48, 32]],
  ["Section Spacer SM", [48, 48, 48, 32, 24]],
] as const

const BREAKPOINT_DEMO: Array<DemoStep> = [
  { on: ".ads-breakpoint", nth: 3, click: true, rest: 1000 },
  { on: ".ads-breakpoint", nth: 2, click: true, rest: 1000 },
  { on: ".ads-breakpoint", nth: 1, click: true, rest: 1200 },
  { on: ".ads-breakpoint", nth: 0, click: true, rest: 1200 },
  { on: ".ads-breakpoint", nth: 4, click: true, rest: 1200 },
]

/**
 * The five device frames side by side at one scale. Picking one shows its
 * section spacers, each drawn as a band of its height.
 */
function Breakpoints() {
  // Index into FRAMES; the spacers list runs the other way.
  const [picked, setPicked] = useState(4)
  const column = FRAMES.length - 1 - picked
  return (
    <Specimen figure>
      <DemoCursor
        steps={BREAKPOINT_DEMO}
        className="flex flex-col gap-10 p-6 md:p-8"
      >
        <div className="ads-breakpoints">
          {FRAMES.map(([name, w, h, cols, rows], i) => (
            <button
              key={name}
              type="button"
              className="ads-breakpoint"
              style={{ width: `${(w / TOTAL) * 90}%` }}
              aria-pressed={i === picked}
              onClick={() => setPicked(i)}
              {...quiet}
            >
              <span className="ads-caption-2">{name}</span>
              <div style={{ aspectRatio: `${w} / ${h}` }}>
                <span
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${rows}, auto)`,
                  }}
                >
                  {Array.from({ length: cols * rows }, (_, n) => (
                    <i key={n} />
                  ))}
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {SPACERS.map(([name, values]) => (
            <div
              key={name}
              className="grid grid-cols-[9rem_3rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[12rem_3rem_minmax(0,1fr)]"
            >
              <span className="ads-caption-1">{name}</span>
              <span
                className="ads-caption-2-mono"
                style={{ color: "var(--ads-fg-3)" }}
              >
                {values[column]}
              </span>
              <span
                className="block rounded-[2px] transition-[height] duration-300"
                style={{
                  height: values[column],
                  background: "var(--ads-bg-3)",
                  border: "1px dashed var(--ads-border)",
                }}
              />
            </div>
          ))}
        </div>
      </DemoCursor>
    </Specimen>
  )
}

// The units of the file's "Space" boards, as it lays them out across three.
const SPACE = [
  [2, 4, 8, 12, 16, 24],
  [32, 48, 64],
  [96, 128, 200],
] as const

export function GridsDoc() {
  return (
    <>
      <Section
        title="Grids"
        caption="Twelve columns, four on mobile, with one gutter throughout. The margins narrow on tablet and again on mobile."
      >
        <GridFigure />
      </Section>

      <Section
        title="Breakpoints & Section Spacing"
        caption="Mobile SM, Tablet MD, Laptop LG, Desktop XL, and Desktop XXL. Hero and section spacers hold from Laptop LG up and close in below it."
      >
        <Breakpoints />
      </Section>

      <Section title="Space" caption="One scale of space, from 2 to 200.">
        <Specimen
          figure
          className="grid items-end gap-x-8 gap-y-6 p-6 sm:grid-cols-3 md:p-8"
        >
          {SPACE.map((units) => (
            <div key={units[0]} className="flex flex-col gap-4">
              {units.map((n) => (
                <div key={n} className="flex flex-col gap-2">
                  <span
                    className="ads-caption-2-mono"
                    style={{ color: "var(--ads-fg-2)" }}
                  >
                    Space {n}
                  </span>
                  <span className="ads-space-bar" style={{ height: n }} />
                </div>
              ))}
            </div>
          ))}
        </Specimen>
      </Section>
    </>
  )
}
