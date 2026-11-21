import { useState } from "react"
import { TbArrowRight, TbCircleArrowDown, TbX } from "react-icons/tb"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { cn } from "@/lib/utils"

// The tooltip (the file's "Tooltip", 1121:8791): a card that opens over the
// text from a word or a mark, in five kinds. "Max" lists related articles
// round a small diagram of connections; "Min" is a heading, a summary and a
// link; "Citation" lists the passages a mark cites; "Footnote" is a
// numbered note; "Type3" is the small dark label of an icon button. All
// but the label have a close button (the "Show Close Button" property).

export type TooltipType = "max" | "min" | "citation" | "footnote" | "label"

function Close({ onClose }: { onClose: () => void }) {
  return (
    <Button
      variant="tertiary"
      size="small"
      icon="only"
      glyph={<TbX aria-hidden />}
      aria-label="Close"
      className="ads-tip-close"
      onClick={onClose}
    />
  )
}

const SUMMARY =
  "The potential harms AI could cause—from misalignment and misuse to unintended failures and societal disruption."

const CITATIONS = [
  "“What AI agents can help humans accomplish today, they can frequently do alone tomorrow...”",
  "“Team Claude was an eight-agent team, with each person using their own instance...”",
  "“Claude is designed for single-person partnership, not team-level agent coordination...”",
]

// The diagram of the "Max" tooltip: four articles on a line, their
// pictures exported from the file.
function Connections() {
  const nodes: Array<[x: number, y: number]> = [
    [34, 77],
    [107, 67],
    [172, 34],
    [247, 28],
  ]
  return (
    <div className="ads-tip-diagram" aria-hidden>
      <svg viewBox="0 0 280 105" fill="none">
        <path
          d="M34 77 L107 67 L172 34 L247 28"
          stroke="currentColor"
          strokeWidth="1.24"
        />
      </svg>
      {nodes.map(([x, y], i) => (
        <img
          key={i}
          src={`/work/anthropic/organisms-site/tooltip-node-${i + 1}.webp`}
          alt=""
          style={{ left: x, top: y }}
        />
      ))}
    </div>
  )
}

/** A tooltip's card, of one of the file's kinds. */
export function TooltipCard({
  type,
  onClose = () => {},
}: {
  type: TooltipType
  onClose?: () => void
}) {
  if (type === "label")
    return (
      <span className="ads-tip ads-tip-label" role="tooltip">
        Label
      </span>
    )
  if (type === "footnote")
    return (
      <div className="ads-tip ads-tip-footnote" role="dialog" aria-label="01">
        <span className="ads-caption-2-mono">01</span>
        <p className="ads-caption-1">
          We started work with Claude Sonnet 3.6 because it was
          Anthropic&rsquo;s most advanced model at the time we began this
          research.
        </p>
        <Close onClose={onClose} />
      </div>
    )
  const title =
    type === "max"
      ? "Related articles"
      : type === "min"
        ? "More about “risks”…"
        : "Jump to citation"
  return (
    <div
      className="ads-tip ads-tip-card"
      data-type={type}
      role="dialog"
      aria-label={title}
    >
      <div className="ads-tip-head">
        {type === "citation" && <TbCircleArrowDown aria-hidden />}
        <h3 className="ads-heading-6">{title}</h3>
        <Close onClose={onClose} />
      </div>
      {type === "citation" ? (
        <div className="ads-tip-citations">
          {CITATIONS.map((quote) => (
            <button
              key={quote}
              type="button"
              className="ads-tip-citation ads-caption-1"
              {...quiet}
            >
              {quote}
            </button>
          ))}
        </div>
      ) : (
        <div className="ads-tip-body">
          <p className="ads-caption-1">{SUMMARY}</p>
          {type === "max" && (
            <>
              <Connections />
              <div className="ads-tip-article">
                <span className="ads-caption-2">Research</span>
                <span className="ads-caption-1">
                  Preparing for AI&rsquo;s Economics impact: exploring policy
                  responses
                </span>
              </div>
            </>
          )}
          <div className="ads-tip-foot">
            <Button
              variant="secondary"
              size="small"
              icon="trailing"
              glyph={<TbArrowRight aria-hidden />}
              className="ads-tip-more"
            >
              {type === "max" ? "See all 4 connections" : "View more"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * A word or a mark with its tooltip: the card opens while the pointer is on
 * either (a bridge spans the gap between them), and on a press, for touch
 * and the keyboard; its close button, or Escape, shuts it.
 */
export function TooltipAnchor({
  type,
  align = "start",
  children,
}: {
  type: TooltipType
  align?: "start" | "end"
  /** The trigger's own contents. */
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pointer = {
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setOpen(true)
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setOpen(false)
    },
  }
  const trigger =
    type === "label" ? (
      <Button
        variant="tertiary"
        size="small"
        icon="only"
        glyph={children}
        aria-label="Label"
        className="ads-tip-trigger"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      />
    ) : (
      <button
        type="button"
        className={cn(
          "ads-tip-trigger",
          type === "footnote" || type === "citation"
            ? "ads-tip-mark"
            : "ads-tip-term"
        )}
        aria-expanded={open}
        onClick={(e) => {
          // A mouse has opened it already by hovering.
          const by = (e.nativeEvent as PointerEvent).pointerType
          if (!(e.detail > 0 && by === "mouse")) setOpen(!open)
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false)
        }}
        {...quiet}
      >
        {children}
      </button>
    )
  return (
    <span
      className="ads-tip-anchor"
      data-align={align}
      data-type={type}
      {...pointer}
    >
      {trigger}
      {open && (
        <span className="ads-tip-pop">
          <TooltipCard type={type} onClose={() => setOpen(false)} />
        </span>
      )}
    </span>
  )
}
