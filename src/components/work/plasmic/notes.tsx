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

/**
 * The scene's notes, at the page's own size over a picture drawn at scale
 * `s` whose top left is at `origin` in a box of size `desk`. Each note
 * outlines its part of the picture and sits beside it on a leader, on the
 * side asked for or the roomier one: directions in red, as redlines are,
 * how Plasmic works in the accent blue, and discoveries in green. Notes on the same side
 * are kept from overlapping. In a box narrower than a tablet the notes are
 * a list under the picture, each numbered on its part.
 */
export function NoteLayer({
  notes,
  s,
  origin,
  desk,
}: {
  /** Each note with the box its part takes up, in the app's pixels. */
  notes: Array<{ note: Note; rect: Rect }>
  s: number
  origin: [number, number]
  desk: [number, number]
}) {
  if (!notes.length) return null
  const [ox, oy] = origin
  const [dw, dh] = desk
  const narrow = dw < 768

  const placed = notes.map(({ note, rect }) => {
    const [x, y, w, h] = rect
    const box = {
      left: Math.round(ox + x * s),
      top: Math.round(oy + y * s),
      width: Math.round(w * s),
      height: Math.round(h * s),
    }
    const roomLeft = box.left
    const roomRight = dw - (box.left + box.width)
    const side: Side =
      note.side ??
      (roomRight >= CARD + LEAD + 16 || roomRight >= roomLeft
        ? "right"
        : "left")
    const lines = Math.ceil(note.text.length / 34) + 1
    const height = 16 + lines * 17
    return { note, box, side, height, y: 0, x: 0 }
  })

  // Where each card goes, then pushed apart where they would overlap.
  for (const p of placed) {
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
      .filter((p) => p.side === side)
      .sort((a, b) => a.y - b.y)
    for (let i = 1; i < column.length; i++) {
      const prev = column[i - 1]
      column[i].y = Math.max(column[i].y, prev.y + prev.height + 8)
    }
  }

  return (
    <div className="pl-notes" data-narrow={narrow || undefined}>
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
        placed.map(({ note, box, side, x, y, height }, i) => (
          <Leader
            key={i}
            kind={note.kind}
            box={box}
            side={side}
            card={{ x, y, height }}
          />
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
        placed.map(({ note, x, y }, i) => (
          <p
            key={i}
            className="pl-note"
            data-kind={note.kind}
            style={{ left: x, top: y, width: CARD }}
          >
            <span className="pl-note-kind">{KIND[note.kind]}</span>
            {note.text}
          </p>
        ))
      )}
    </div>
  )
}

/** The line from a box's edge to its note, ending in a dot on the box. */
function Leader({
  kind,
  box,
  side,
  card,
}: {
  kind: Note["kind"]
  box: { left: number; top: number; width: number; height: number }
  side: Side
  card: { x: number; y: number; height: number }
}) {
  let x1: number
  let y1: number
  let x2: number
  let y2: number
  if (side === "right" || side === "left") {
    x1 = side === "right" ? box.left + box.width : box.left
    y1 = box.top + box.height / 2
    x2 = side === "right" ? card.x : card.x + CARD
    y2 = Math.min(Math.max(y1, card.y + 10), card.y + card.height - 10)
  } else {
    x1 = box.left + box.width / 2
    y1 = side === "top" ? box.top : box.top + box.height
    x2 = Math.min(Math.max(x1, card.x + 10), card.x + CARD - 10)
    y2 = side === "top" ? card.y + card.height : card.y
  }
  const left = Math.min(x1, x2)
  const top = Math.min(y1, y2)
  const w = Math.max(1, Math.abs(x2 - x1))
  const h = Math.max(1, Math.abs(y2 - y1))
  return (
    <svg
      aria-hidden
      className="pl-leader"
      data-kind={kind}
      style={{ left: left - 4, top: top - 4, width: w + 8, height: h + 8 }}
    >
      <polyline
        points={`${x1 - left + 4},${y1 - top + 4} ${
          side === "left" || side === "right"
            ? `${(x1 + x2) / 2 - left + 4},${y1 - top + 4} ${(x1 + x2) / 2 - left + 4},${y2 - top + 4}`
            : `${x1 - left + 4},${(y1 + y2) / 2 - top + 4} ${x2 - left + 4},${(y1 + y2) / 2 - top + 4}`
        } ${x2 - left + 4},${y2 - top + 4}`}
      />
      <circle cx={x1 - left + 4} cy={y1 - top + 4} r="2.5" />
    </svg>
  )
}
