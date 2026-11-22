import { useLayoutEffect, useRef, useState } from "react"
import type { Note, Rect, Side } from "@/components/work/plasmic/types"

/** What each kind of note is called on its card. */
const KIND: Record<Note["kind"], string> = {
  direction: "Direction",
  concept: "How it works",
  discovery: "Discovery",
}

/** A note's width, in the page's pixels. */
const CARD = 232
/** The leader from the box to its note. */
const LEAD = 28
/** In a gutter: the least a note can be wide, its gap from the browser, and
    from the window's edge; and how far down a card its line meets it. */
const MIN = 140
const GAP = 20
const EDGE = 12
const MEET = 20

type Box = { left: number; top: number; width: number; height: number }
type Placed = {
  note: Note
  box: Box
  /** In a gutter, the side it is on. */
  gutter: "left" | "right" | null
  side: Side
  x: number
  y: number
  width: number
  height: number
}

/**
 * The scene's notes, at the page's own size over a picture drawn at scale
 * `s` whose top left is at `origin` in a box of size `desk`. Each note
 * outlines its part of the picture: directions in red, as redlines are,
 * how Plasmic works in the accent blue, and discoveries in green.
 *
 * Where the window has room beside the browser, the notes are in its
 * gutters (Leo, 2026-11-22): a line runs out from a dot on the part's edge,
 * across whatever of the product lies between, to a card in the nearer
 * gutter, level with the part where it can be.
 * A gutter something else is in (`taken`: the states' window, the change
 * card) is left to it. Where neither gutter has room, a note is a card
 * beside its part, on the side asked for or the roomier one. Notes in one
 * column are kept from overlapping. In a box narrower than a tablet the
 * notes are a list under the picture, each numbered on its part.
 */
export function NoteLayer({
  notes,
  s,
  origin,
  desk,
  browser,
  taken,
  under,
}: {
  /** Each note with the box its part takes up, in the app's pixels. */
  notes: Array<{ note: Note; rect: Rect }>
  s: number
  origin: [number, number]
  desk: [number, number]
  /** The browser's left edge and width, in the desk's pixels; without
      it (a picture with no gutters, as in the lightbox) notes are cards. */
  browser?: { left: number; width: number }
  taken?: { left?: boolean; right?: boolean }
  /** A gutter whose top is something else's: its notes start under this. */
  under?: { left?: number; right?: number }
}) {
  // A note's height as drawn, by its words and width (an estimate until
  // it has been drawn once).
  const [heights, setHeights] = useState<Record<string, number>>({})
  const layer = useRef<HTMLDivElement>(null)
  const keys = notes.map((n) => n.note.text).join("\n")
  const deskWidth = desk[0]
  const browserLeft = browser?.left
  useLayoutEffect(() => {
    const els = layer.current?.querySelectorAll<HTMLElement>("[data-note]")
    if (!els?.length) return
    const observer = new ResizeObserver((entries) => {
      setHeights((was) => {
        let next = was
        for (const { target } of entries) {
          const el = target as HTMLElement
          const key = el.dataset.note ?? ""
          if (next[key] === el.offsetHeight) continue
          if (next === was) next = { ...was }
          next[key] = el.offsetHeight
        }
        return next
      })
    })
    for (const el of els) observer.observe(el)
    return () => observer.disconnect()
  }, [keys, deskWidth, browserLeft])

  if (!notes.length) return null
  const [ox, oy] = origin
  const [dw, dh] = desk
  const narrow = dw < 768

  const room = {
    left: !browser || taken?.left ? 0 : browser.left,
    right: !browser || taken?.right ? 0 : dw - browser.left - browser.width,
  }
  const fits = {
    left: room.left >= MIN + GAP + EDGE,
    right: room.right >= MIN + GAP + EDGE,
  }
  const edges = browser ?? { left: 0, width: dw }
  const middle = edges.left + edges.width / 2

  const placed: Array<Placed> = notes.map(({ note, rect }) => {
    const [x, y, w, h] = rect
    const box = {
      left: Math.round(ox + x * s),
      top: Math.round(oy + y * s),
      width: Math.round(w * s),
      height: Math.round(h * s),
    }
    const near = box.left + box.width / 2 < middle ? "left" : "right"
    const far = near === "left" ? "right" : "left"
    const gutter = narrow ? null : fits[near] ? near : fits[far] ? far : null
    const width = gutter ? Math.min(CARD, room[gutter] - GAP - EDGE) : CARD

    const roomLeft = box.left
    const roomRight = dw - (box.left + box.width)
    const beside = CARD + LEAD + 8
    const want: Side =
      note.side ??
      (roomRight >= CARD + LEAD + 16 || roomRight >= roomLeft
        ? "right"
        : "left")
    // A side asked for that has no room (a narrower window) gives way to
    // the other, where there is.
    const side: Side =
      want === "right" && roomRight < beside && roomLeft >= beside
        ? "left"
        : want === "left" && roomLeft < beside && roomRight >= beside
          ? "right"
          : want
    const chars = Math.max(8, Math.floor((width - 22) / 7.2))
    const guess = 16 + 24 + Math.ceil(note.text.length / chars) * 17
    const height = heights[keyOf(note, width)] ?? guess
    return { note, box, gutter, side, width, height, x: 0, y: 0 }
  })

  // In a gutter: each card's title level with its part's middle, then the
  // column pushed apart, and back up from the desk's foot.
  for (const side of ["left", "right"] as const) {
    const column = placed
      .filter((p) => p.gutter === side)
      .sort(
        (a, b) => a.box.top + a.box.height / 2 - (b.box.top + b.box.height / 2)
      )
    for (const [i, p] of column.entries()) {
      p.x =
        side === "left"
          ? edges.left - GAP - p.width
          : edges.left + edges.width + GAP
      p.y = Math.round(
        Math.max(under?.[side] ?? EDGE, p.box.top + p.box.height / 2 - MEET)
      )
      const prev = i > 0 ? column[i - 1] : null
      if (prev) p.y = Math.max(p.y, prev.y + prev.height + 8)
    }
    let floor = dh - EDGE
    for (const p of column.reverse()) {
      p.y = Math.min(p.y, floor - p.height)
      floor = p.y - 8
    }
  }

  // Beside its part: where each card goes, then pushed apart where they
  // would overlap.
  for (const p of placed) {
    if (p.gutter) continue
    const { box, side, height } = p
    const midY = box.top + box.height / 2
    const midX = box.left + box.width / 2
    if (side === "right") {
      p.x = box.left + box.width + LEAD
      p.y = midY - height / 2
    } else if (side === "left") {
      p.x = box.left - LEAD - CARD
      p.y = midY - height / 2
    } else if (side === "top") {
      p.x = midX - CARD / 2
      p.y = box.top - LEAD - height
    } else {
      p.x = midX - CARD / 2
      p.y = box.top + box.height + LEAD
    }
    p.x = Math.round(Math.min(Math.max(8, p.x), dw - CARD - 8))
    p.y = Math.round(Math.min(Math.max(8, p.y), dh - height - 8))
  }
  for (const side of ["left", "right"] as const) {
    const column = placed
      .filter((p) => !p.gutter && p.side === side)
      .sort((a, b) => a.y - b.y)
    for (let i = 1; i < column.length; i++) {
      const prev = column[i - 1]
      column[i].y = Math.max(column[i].y, prev.y + prev.height + 8)
    }
  }

  return (
    <div ref={layer} className="pl-notes" data-narrow={narrow || undefined}>
      {placed.map(({ note, box }, i) => (
        <div
          key={i}
          aria-hidden
          className="pl-note-box"
          data-kind={note.kind}
          style={box}
        >
          {narrow && <span className="pl-note-num">{i + 1}</span>}
        </div>
      ))}
      {!narrow &&
        placed.map((p, i) => (
          <Leader key={i} kind={p.note.kind} points={path(p, edges)} />
        ))}
      {narrow ? (
        <ol className="pl-note-list">
          {placed.map(({ note }, i) => (
            <li key={i} className="pl-note" data-kind={note.kind}>
              <span className="pl-note-kind">
                {i + 1}. {KIND[note.kind]}
              </span>
              {note.text}
            </li>
          ))}
        </ol>
      ) : (
        placed.map(({ note, gutter, x, y, width }, i) => (
          <p
            key={i}
            className="pl-note"
            data-kind={note.kind}
            data-gutter={gutter ?? undefined}
            data-note={keyOf(note, width)}
            style={{ left: x, top: y, width }}
          >
            <span className="pl-note-kind">{KIND[note.kind]}</span>
            {note.text}
          </p>
        ))
      )}
    </div>
  )
}

const keyOf = (note: Note, width: number) => `${width}:${note.text}`

/**
 * The corners of a note's line, from its part to its card. To a gutter:
 * out from the part's edge at its middle, a turn in the gap beside the
 * browser where the card has been pushed up or down, and in to the card's
 * near edge. To a card beside the part: an elbow halfway between them.
 */
function path(
  p: Placed,
  browser: { left: number; width: number }
): Array<[number, number]> {
  const { box, gutter, side, x, y, width, height } = p
  if (gutter) {
    const y1 = Math.round(box.top + box.height / 2)
    const x1 = gutter === "left" ? box.left : box.left + box.width
    const turn =
      gutter === "left"
        ? browser.left - GAP / 2
        : browser.left + browser.width + GAP / 2
    const end = gutter === "left" ? x + width : x
    const y2 = Math.min(Math.max(y1, y + 12), y + height - 12)
    return [
      [x1, y1],
      [turn, y1],
      [turn, y2],
      [end, y2],
    ]
  }
  if (side === "right" || side === "left") {
    const x1 = side === "right" ? box.left + box.width : box.left
    const y1 = box.top + box.height / 2
    const x2 = side === "right" ? x : x + CARD
    const y2 = Math.min(Math.max(y1, y + 10), y + height - 10)
    return [
      [x1, y1],
      [(x1 + x2) / 2, y1],
      [(x1 + x2) / 2, y2],
      [x2, y2],
    ]
  }
  const x1 = box.left + box.width / 2
  const y1 = side === "top" ? box.top : box.top + box.height
  const x2 = Math.min(Math.max(x1, x + 10), x + CARD - 10)
  const y2 = side === "top" ? y + height : y
  return [
    [x1, y1],
    [x1, (y1 + y2) / 2],
    [x2, (y1 + y2) / 2],
    [x2, y2],
  ]
}

/** A note's line, starting in a dot on its part. */
function Leader({
  kind,
  points,
}: {
  kind: Note["kind"]
  points: Array<[number, number]>
}) {
  const left = Math.min(...points.map((q) => q[0]))
  const top = Math.min(...points.map((q) => q[1]))
  const w = Math.max(1, Math.max(...points.map((q) => q[0])) - left)
  const h = Math.max(1, Math.max(...points.map((q) => q[1])) - top)
  // Half a pixel in, so a 1px line falls on whole pixels.
  const at = ([px, py]: [number, number]) =>
    `${Math.round(px - left) + 4.5},${Math.round(py - top) + 4.5}`
  const [first] = points
  return (
    <svg
      aria-hidden
      className="pl-leader"
      data-kind={kind}
      style={{
        left: Math.round(left) - 4,
        top: Math.round(top) - 4,
        width: w + 9,
        height: h + 9,
      }}
    >
      <polyline points={points.map(at).join(" ")} />
      <circle
        cx={Math.round(first[0] - left) + 4.5}
        cy={Math.round(first[1] - top) + 4.5}
        r="2.5"
      />
    </svg>
  )
}
