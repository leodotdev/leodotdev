import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { TbChevronLeft, TbChevronRight, TbX } from "react-icons/tb"
import { NoteLayer } from "@/components/work/plasmic/notes"
import { frameSrc } from "@/components/work/plasmic/stage"
import type { Explore } from "@/components/work/plasmic/types"

/**
 * Versions of one part, opened from the badge on it: one large, with its
 * own notes, and a row of the rest under it. The arrow keys step through
 * them, and Escape, the close button, or a press outside closes it (a
 * modal `<dialog>`, which keeps the keyboard inside while open).
 */
export function Lightbox({
  year,
  explore,
  onClose,
}: {
  year: string
  explore: Explore
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [i, setI] = useState(0)
  const shot = explore.items[i]
  const count = explore.items.length
  const step = (by: number) => setI((was) => (was + by + count) % count)

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    el.showModal()
    return () => el.close()
  }, [])

  // The large picture's scale, for its notes.
  const stage = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ w: 0, h: 0, s: 1 })
  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const s = Math.min(1, w / shot.w, h / shot.h)
      setFit({ w, h, s })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [shot])
  const iw = Math.round(shot.w * fit.s)
  const ih = Math.round(shot.h * fit.s)
  const ox = Math.round((fit.w - iw) / 2)
  const oy = Math.round((fit.h - ih) / 2)

  return (
    <dialog
      ref={dialog}
      className="pl-lightbox"
      aria-label={explore.title}
      // A close the dialog itself reports (Escape) ends it. One left over
      // from a close and reopen (React's development double effects) comes
      // in while it is open again, and is let go.
      onClose={() => {
        if (!dialog.current?.open) onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1)
        else if (e.key === "ArrowLeft") step(-1)
      }}
    >
      <header className="pl-lightbox-bar">
        <p className="flex min-w-0 items-baseline gap-3">
          <span className="shrink-0 font-semibold">{explore.title}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <span className="truncate text-xs">{shot.label}</span>
        </p>
        <span className="flex gap-1">
          <button type="button" aria-label="Previous" onClick={() => step(-1)}>
            <TbChevronLeft aria-hidden className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Next" onClick={() => step(1)}>
            <TbChevronRight aria-hidden className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Close" onClick={onClose}>
            <TbX aria-hidden className="h-4 w-4" />
          </button>
        </span>
      </header>
      <div ref={stage} className="pl-lightbox-stage">
        {fit.w > 0 && (
          <>
            <img
              src={frameSrc(year, shot.src)}
              alt={shot.label}
              width={iw}
              height={ih}
              style={{ left: ox, top: oy }}
            />
            <NoteLayer
              notes={shot.notes ?? []}
              s={fit.s}
              origin={[ox, oy]}
              desk={[fit.w, fit.h]}
            />
          </>
        )}
      </div>
      <div className="pl-lightbox-row">
        {explore.items.map((item, j) => (
          <button
            key={item.src}
            type="button"
            aria-label={item.label}
            aria-current={j === i || undefined}
            onClick={() => setI(j)}
          >
            <img
              src={frameSrc(year, item.src)}
              alt=""
              loading="lazy"
              style={{ aspectRatio: `${item.w} / ${item.h}` }}
            />
          </button>
        ))}
      </div>
    </dialog>
  )
}
