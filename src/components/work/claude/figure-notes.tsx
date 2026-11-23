import { useEffect, useState } from "react"
import { NoteLayer } from "@/components/work/plasmic/notes"
import type { Note, Rect } from "@/components/work/plasmic/types"

/**
 * A note on a docs figure: what a step of its demo cursor is showing, said
 * beside the figure as the cursor gets there (Leo, 2026-11-23: "bring
 * annotations and story telling to my other work projects… as the figures
 * come into view"). The kinds, the card, the outline round its part, and
 * the arrow are /work/plasmic's (`NoteLayer`): a direction in red, how it
 * works in blue, a discovery in green, and a title that names its part.
 * Like every caption on these pages, it says only what the system's Figma
 * file bears out.
 */
export type FigureNote = {
  kind: Note["kind"]
  title: string
  text: string
  /**
   * What it is of, as a selector in the figure, where that is not the
   * step's own element (something the step's press opened).
   */
  on?: string
}

/** The notes showing on a figure, each with the element it is of. */
export type Noted = {
  /** The `<figure>` they are drawn in. */
  host: HTMLElement
  items: Array<{ note: FigureNote; el: Element }>
  /** Fading out, about to be taken away. */
  leaving?: boolean
}

/** A gutter this wide beside the figure takes the notes' cards. */
const ROOM = 196
/** How far under its figure a gutter's column of cards may run. */
const SLACK = 480

type Geometry = {
  left: number
  width: number
  height: number
  /** The figure's own edges in the layer, where the layer has gutters. */
  figure?: { left: number; width: number }
  rects: Array<Rect | null>
}

/**
 * The notes' layer, drawn in the figure's element at the page's own size
 * (the figure itself is scaled). Where the window has room beside the
 * figure, the layer is as wide as the window and the cards go in the
 * gutter, with an arrow to the part; where it has not, a card is set
 * beside its part, inside the figure. Each part is measured every frame
 * while its note is up, since a figure moves under its notes: it narrows,
 * its menus open, its page scrolls. A part that has left the figure's
 * sight takes its note with it.
 */
export function FigureNotes({ noted }: { noted: Noted }) {
  const { host, items } = noted
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  useEffect(() => {
    let frame = 0
    let last = ""
    // What cuts each part off inside the figure (a phone's screen, a list
    // that scrolls): its outline is drawn only where the part shows, and a
    // part scrolled out of such a box takes its note with it.
    const clips = items.map(({ el }) => {
      const list: Array<Element> = []
      for (
        let box = el.parentElement;
        box && box !== host && host.contains(box);
        box = box.parentElement
      ) {
        const style = getComputedStyle(box)
        if (style.overflowX !== "visible" || style.overflowY !== "visible")
          list.push(box)
      }
      return list
    })
    const measure = () => {
      frame = requestAnimationFrame(measure)
      const h = host.getBoundingClientRect()
      const window_ = document.documentElement.clientWidth
      const gutters = Math.max(h.left, window_ - h.right) >= ROOM
      // The layer's own left edge and top, in the window.
      const x0 = gutters ? 0 : h.left
      const rects = items.map(({ el }, i): Rect | null => {
        const p = el.getBoundingClientRect()
        let l = Math.max(p.left, h.left)
        let t = Math.max(p.top, h.top)
        let r = Math.min(p.right, h.right)
        let b = Math.min(p.bottom, h.bottom)
        for (const box of clips[i]) {
          const c = box.getBoundingClientRect()
          l = Math.max(l, c.left)
          t = Math.max(t, c.top)
          r = Math.min(r, c.right)
          b = Math.min(b, c.bottom)
        }
        if (!el.isConnected || r - l < 4 || b - t < 4) return null
        return [
          Math.round(l - x0),
          Math.round(t - h.top),
          Math.round(r - l),
          Math.round(b - t),
        ]
      })
      const next: Geometry = gutters
        ? {
            left: -Math.round(h.left),
            width: window_,
            height: Math.round(h.height) + SLACK,
            figure: { left: Math.round(h.left), width: Math.round(h.width) },
            rects,
          }
        : {
            left: 0,
            width: Math.round(h.width),
            height: Math.round(h.height),
            rects,
          }
      const key = JSON.stringify(next)
      if (key === last) return
      last = key
      setGeometry(next)
    }
    frame = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(frame)
  }, [host, items])

  if (!geometry) return null
  const notes = items.flatMap(({ note }, i) => {
    const rect = geometry.rects.at(i)
    return rect ? [{ note: { ...note, on: rect }, rect }] : []
  })
  return (
    <div
      className="fig-notes"
      data-leaving={noted.leaving || undefined}
      style={{
        left: geometry.left,
        width: geometry.width,
        height: geometry.height,
      }}
    >
      <NoteLayer
        notes={notes}
        s={1}
        origin={[0, 0]}
        desk={[geometry.width, geometry.height]}
        browser={geometry.figure}
        list={false}
      />
    </div>
  )
}
