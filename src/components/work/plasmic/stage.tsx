import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { wave } from "@/lib/wave"
import { cn } from "@/lib/utils"
import { Lightbox } from "@/components/work/plasmic/lightbox"
import { NoteLayer } from "@/components/work/plasmic/notes"
import type {
  Beat,
  Dive,
  Explore,
  Scene,
  Sheet,
  Year,
} from "@/components/work/plasmic/types"

/** The app's width as designed, and its window's height under the bar. */
export const APP_W = 1440
export const APP_H = 945
/** The browser's own bar (tabs and address), as designed. */
export const CHROME = 79
/** The scale the browser is drawn at, as the docs' figures are (80%). */
const SCALE = 0.8

/** Where a year's frames are. */
export const frameSrc = (year: string, name: string) =>
  `/work/plasmic/${year}/${name}.webp`

/**
 * The stage: one figure as wide as the window, a desktop with the Plasmic
 * app open in a browser on it, held under the bar while the year's dives
 * scroll past (Leo, 2026-11-21). Each dive is an `article[data-chapter]`
 * as long as its scenes (so the chapter bar sizes and follows it); the
 * stage plays whichever scene the page has scrolled to: its frame, its
 * redlines and concept notes, and its demo cursor's script, which the
 * visitor can take over by moving into the browser. The browser is laid
 * out at the app's true size and drawn at 80%, whole, scaled down further
 * only where the window is too small to show all of it; the app does not
 * reflow (it was a desktop app).
 */
export function Stage({ year }: { year: Year }) {
  const track = useRef<HTMLDivElement>(null)
  const desk = useRef<HTMLDivElement>(null)
  const at = useScrollScene(track, year.dives)
  const dive = year.dives.at(at.dive) ?? year.dives[0]
  const scene = dive.scenes.at(at.scene) ?? dive.scenes[0]
  const key = `${dive.slug}:${at.scene}`

  // The browser's scale and the desktop's size.
  const [box, setBox] = useState({ w: 0, h: 0, s: SCALE })
  useLayoutEffect(() => {
    const el = desk.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const pad = w < 768 ? 12 : 32
      const s = Math.min(
        SCALE,
        (w - pad * 2) / APP_W,
        (h - pad * 2) / (APP_H + CHROME)
      )
      setBox((was) =>
        was.w === w && was.h === h && was.s === s ? was : { w, h, s }
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // The frames ahead are fetched before they are needed.
  useEffect(() => {
    const next = [
      ...dive.scenes.slice(at.scene, at.scene + 3),
      ...(year.dives.at(at.dive + 1)?.scenes.slice(0, 1) ?? []),
    ]
    for (const s of next) {
      for (const name of [
        s.frame,
        s.change?.from,
        ...(s.script ?? []).map((b) => b.frame),
        ...(s.hot ?? []).map((h) => h.frame),
      ]) {
        if (name) new Image().src = frameSrc(year.slug, name)
      }
    }
  }, [dive, at.scene, at.dive, year])

  return (
    <div ref={track} className="pl-track">
      <div ref={desk} className="pl-desk" data-no-wave>
        <div aria-hidden className="pl-wallpaper" />
        {box.w > 0 && (
          <Player
            key={key}
            year={year.slug}
            scene={scene}
            progress={at.progress}
            box={box}
          />
        )}
      </div>
      <div className="pl-dives">
        {year.dives.map((d) => (
          <DiveArticle key={d.slug} dive={d} />
        ))}
      </div>
    </div>
  )
}

/**
 * A dive's place on the page: as long as its scenes take to scroll past,
 * with its story in words for screen readers (the stage is a picture).
 */
function DiveArticle({ dive }: { dive: Dive }) {
  const steps = dive.scenes.reduce((n, s) => n + (s.span ?? 1), 0)
  return (
    <article
      id={dive.slug}
      data-chapter
      className="pl-dive"
      style={{ "--steps": steps } as React.CSSProperties}
    >
      <h2 className="sr-only">{dive.title}</h2>
      <p className="sr-only">{dive.summary}</p>
      <ul className="sr-only">
        {dive.scenes.flatMap((s, i) =>
          (s.notes ?? []).map((n, j) => <li key={`${i}-${j}`}>{n.text}</li>)
        )}
      </ul>
    </article>
  )
}

/**
 * Which scene the page is on: the dive whose top has reached the bottom of
 * the bar, and how far into it the page has scrolled, laid along its
 * scenes by the steps each takes. `progress` is how far through the scene,
 * from 0 to 1, for the sheets that pass as the page scrolls.
 */
function useScrollScene(
  track: React.RefObject<HTMLDivElement | null>,
  dives: Array<Dive>
) {
  const [at, setAt] = useState({ dive: 0, scene: 0, progress: 0 })
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const el = track.current
      if (!el) return
      const line =
        document.querySelector("[data-docs-bar]")?.getBoundingClientRect()
          .bottom ?? 0
      const articles = el.querySelectorAll<HTMLElement>("article[data-chapter]")
      let d = 0
      let p = 0
      articles.forEach((a, i) => {
        const r = a.getBoundingClientRect()
        if (i === 0 || r.top <= line + 1) {
          d = i
          p = (line - r.top) / Math.max(1, r.height)
        }
      })
      const spans = (dives.at(d)?.scenes ?? []).map((s) => s.span ?? 1)
      const total = spans.reduce((a, b) => a + b, 0)
      let x = Math.min(Math.max(p, 0), 0.9999) * total
      let s = 0
      while (s < spans.length - 1 && x >= spans[s]) {
        x -= spans[s]
        s++
      }
      const progress = Math.round((x / (spans.at(s) ?? 1)) * 200) / 200
      setAt((was) =>
        was.dive === d && was.scene === s && was.progress === progress
          ? was
          : { dive: d, scene: s, progress }
      )
    }
    const queue = () => {
      frame ||= requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", queue)
      window.removeEventListener("resize", queue)
    }
  }, [track, dives])
  return at
}

type Box = { w: number; h: number; s: number }

/**
 * One scene, played: the browser with its frame, the notes, the cursor
 * running the scene's script, and whatever else the scene has (a sheet, a
 * change card, versions to open). Remounted for every scene, so a script
 * always starts from its first beat.
 */
function Player({
  year,
  scene,
  progress,
  box,
}: {
  year: string
  scene: Scene
  progress: number
  box: Box
}) {
  const { s } = box
  const bw = Math.round(APP_W * s)
  const bh = Math.round((APP_H + CHROME) * s)
  // The browser sits in the middle of the desktop, or a little to the left
  // while a sheet is open beside it.
  const shift = scene.sheet ? Math.min(160, Math.max(0, box.w - bw) / 2) : 0
  const left = Math.round((box.w - bw) / 2 - shift)
  // In the middle of the desktop; on a phone at its top, with the notes
  // listed under it.
  const top = box.w < 768 ? 16 : Math.round((box.h - bh) / 2)

  // The frame shown: the scene's, or a beat's, or the one under the
  // visitor's pointer. A change scene starts on the frame before the change
  // and waves into its own.
  const [frame, setFrame] = useState(scene.change?.from ?? scene.frame)
  const app = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!scene.change) return
    const t = window.setTimeout(() => {
      void wave(app.current, () => flushSync(() => setFrame(scene.frame)))
    }, 900)
    return () => clearTimeout(t)
  }, [scene])

  // The visitor takes over by moving into the browser: the script stops and
  // its cursor leaves, the hot places answer the visitor's pointer, and the
  // script starts again a moment after the pointer goes. A tap on a touch
  // screen holds it for a few seconds.
  const [held, setHeld] = useState(false)
  const release = useRef(0)
  const hold = (ms?: number) => {
    clearTimeout(release.current)
    setHeld(true)
    if (ms) release.current = window.setTimeout(() => setHeld(false), ms)
  }
  const letGo = () => {
    clearTimeout(release.current)
    release.current = window.setTimeout(() => {
      setFrame(scene.frame)
      setHeld(false)
    }, 700)
  }
  useEffect(() => () => clearTimeout(release.current), [])

  const beat = useScript(scene.script, !held && !scene.change, setFrame, scene)

  const [open, setOpen] = useState<Explore | null>(null)

  return (
    <>
      <div
        className="pl-browser-box"
        style={{ left, top, width: bw, height: bh }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") hold()
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") letGo()
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") hold(4000)
        }}
      >
        <div
          className="pl-browser"
          style={{ width: APP_W, height: APP_H + CHROME, scale: s }}
        >
          <BrowserBar url={scene.url ?? "plasmic.app/projects"} />
          <div ref={app} className="pl-app">
            <Frames year={year} frame={frame} height={scene.height} />
          </div>
        </div>
        {/* What is drawn over the browser at the page's own size. */}
        <div className="pl-over" style={{ top: Math.round(CHROME * s) }}>
          {(scene.hot ?? []).map((h, i) => (
            <div
              key={i}
              className="pl-hot"
              style={rect(h.at, s)}
              onPointerEnter={() => setFrame(h.frame)}
              onPointerLeave={() => setFrame(scene.frame)}
            />
          ))}
          {scene.explore && (
            <ExploreBadge
              explore={scene.explore}
              s={s}
              onOpen={() => setOpen(scene.explore ?? null)}
            />
          )}
          <Cursor beat={held ? null : beat} s={s} />
        </div>
      </div>
      <NoteLayer
        notes={(scene.notes ?? []).filter(
          (n) => n.from === undefined || (beat ? beat.index >= n.from : false)
        )}
        s={s}
        origin={[left, top + Math.round(CHROME * s)]}
        desk={[box.w, box.h]}
      />
      {scene.caption && (
        <p className="pl-caption" style={{ left, top: top + bh + 12 }}>
          {scene.caption}
        </p>
      )}
      {scene.sheet && (
        <SheetWindow
          year={year}
          sheet={scene.sheet}
          progress={progress}
          box={box}
          browser={{ left, top, width: bw, height: bh }}
        />
      )}
      {scene.change && <ChangeCard change={scene.change} />}
      {open && (
        <Lightbox year={year} explore={open} onClose={() => setOpen(null)} />
      )}
    </>
  )
}

/** A box on the frame, in the page's pixels over the browser. */
export const rect = (
  [x, y, w, h]: [number, number, number, number],
  s: number
) => ({
  left: Math.round(x * s),
  top: Math.round(y * s),
  width: Math.round(w * s),
  height: Math.round(h * s),
})

/**
 * The browser's own bar, drawn here (the file's screens had Chrome's, on
 * Apple's wallpapers; neither is ours to publish): a row with a tab, and
 * the address under it, as designed (79px).
 */
function BrowserBar({ url }: { url: string }) {
  return (
    <div className="pl-bar">
      <div className="pl-tabs">
        <span aria-hidden className="pl-lights">
          <i />
          <i />
          <i />
        </span>
        <span className="pl-tab">
          <span aria-hidden className="pl-favicon" />
          Plasmic
        </span>
      </div>
      <div className="pl-address">
        <span aria-hidden className="pl-nav-arrows">
          ‹ ›
        </span>
        <span className="pl-url">{url}</span>
      </div>
    </div>
  )
}

/**
 * The app's frame, crossfading from the last one as a new one comes in (the
 * old one stays until the new one has loaded, so nothing flashes blank).
 */
function Frames({
  year,
  frame,
  height,
}: {
  year: string
  frame: string
  height?: number
}) {
  const [shown, setShown] = useState([frame])
  // A new frame joins over the last one (set while rendering, as React
  // recommends for state that follows a prop).
  if (shown.at(-1) !== frame) setShown([...shown.slice(-1), frame])
  return (
    <>
      {shown.map((name, i) => (
        <img
          key={name}
          src={frameSrc(year, name)}
          alt=""
          width={APP_W}
          height={height ?? APP_H}
          decoding="async"
          className={cn("pl-frame", i < shown.length - 1 && "pl-frame-old")}
          onLoad={() => {
            if (i === shown.length - 1)
              setShown((was) => (was.length > 1 ? was.slice(-1) : was))
          }}
        />
      ))}
    </>
  )
}

/**
 * Runs a scene's script: the cursor goes to each beat in turn, presses
 * where a beat says, and the app shows the beat's frame; after the last it
 * rests, the app goes back to the scene's frame, and it starts over.
 * Under reduced motion it does not run.
 */
function useScript(
  script: Array<Beat> | undefined,
  running: boolean,
  setFrame: (f: string) => void,
  scene: Scene
) {
  const [beat, setBeat] = useState<{
    index: number
    beat: Beat
    pressed: boolean
  } | null>(null)
  useEffect(() => {
    if (!script?.length || !running) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Every wait is a timer; clearing them ends the script where it is (its
    // next wait never finishes).
    const timers: Array<number> = []
    const after = (ms: number) =>
      new Promise<void>((done) => {
        timers.push(window.setTimeout(done, ms))
      })
    void (async () => {
      await after(500)
      for (;;) {
        for (const [i, b] of script.entries()) {
          setBeat({ index: i, beat: b, pressed: false })
          await after(700)
          if (b.click) {
            setBeat({ index: i, beat: b, pressed: true })
            await after(140)
            setBeat({ index: i, beat: b, pressed: false })
          }
          if (b.frame) setFrame(b.frame)
          await after(b.wait ?? 1100)
        }
        await after(1400)
        setFrame(scene.frame)
        await after(600)
      }
    })()
    return () => timers.forEach(clearTimeout)
  }, [script, running, setFrame, scene])
  return beat
}

/**
 * The demo cursor, in the page's own pixels over the browser: one of the
 * macOS cursors (public/cursors), gliding between beats, with a ring where
 * it presses.
 */
function Cursor({
  beat,
  s,
}: {
  beat: { beat: Beat; pressed: boolean } | null
  s: number
}) {
  const [x, y] = beat?.beat.to ?? [0, 0]
  const shape = beat?.beat.shape ?? "arrow"
  return (
    <div
      aria-hidden
      className="pl-cursor"
      data-shown={beat ? "" : undefined}
      data-pressed={beat?.pressed ? "" : undefined}
      style={{ translate: `${Math.round(x * s)}px ${Math.round(y * s)}px` }}
    >
      {(["arrow", "pointer", "text"] as const).map((k) => (
        <img
          key={k}
          src={`/cursors/${k}.svg`}
          alt=""
          data-shape={k}
          hidden={k !== shape}
        />
      ))}
    </div>
  )
}

/**
 * Versions of the part under a highlight: a badge on it opens them in the
 * lightbox.
 */
function ExploreBadge({
  explore,
  s,
  onOpen,
}: {
  explore: Explore
  s: number
  onOpen: () => void
}) {
  const r = rect(explore.at, s)
  return (
    <>
      <div aria-hidden className="pl-explore-ring" style={r} />
      <button
        type="button"
        className="pl-explore-badge"
        style={{ left: r.left + r.width, top: r.top }}
        onClick={onOpen}
      >
        {explore.label}
      </button>
    </>
  )
}

/**
 * A feature's states, inline: a window on the desktop beside the browser,
 * its states in a row that passes as the page scrolls through the scene.
 */
function SheetWindow({
  year,
  sheet,
  progress,
  box,
  browser,
}: {
  year: string
  sheet: Sheet
  progress: number
  box: Box
  browser: { left: number; top: number; width: number; height: number }
}) {
  const row = useRef<HTMLDivElement>(null)
  const view = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  useLayoutEffect(() => {
    const r = row.current
    const v = view.current
    if (!r || !v) return
    const measure = () => setRoom(Math.max(0, r.scrollWidth - v.clientWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(r)
    observer.observe(v)
    return () => observer.disconnect()
  }, [sheet])
  const width = Math.min(560, Math.round(box.w * 0.44))
  const height = Math.round(browser.height * 0.78)
  const left = Math.min(
    box.w - width - 24,
    browser.left + browser.width - Math.round(width * 0.45)
  )
  const top = browser.top + Math.round(browser.height * 0.14)
  // Each state is drawn at most 200px wide, and cut off at the window's
  // height, less its caption (a tall panel's top is what matters).
  const tall = height - 40 - 32 - 64
  return (
    <section
      aria-label={sheet.title}
      className="pl-sheet"
      style={{ left, top, width, height }}
    >
      <header className="pl-sheet-bar">
        <span aria-hidden className="pl-lights">
          <i />
          <i />
          <i />
        </span>
        <span>{sheet.title}</span>
        <span className="pl-sheet-count">{sheet.items.length} states</span>
      </header>
      <div ref={view} className="pl-sheet-view">
        <div
          ref={row}
          className="pl-sheet-row"
          style={{ translate: `${-Math.round(progress * room)}px 0` }}
        >
          {sheet.items.map((shot) => {
            const k = Math.min(1, 200 / shot.w)
            const w = Math.round(shot.w * k)
            return (
              <figure
                key={shot.src}
                className="pl-sheet-item"
                style={{ width: w }}
              >
                <span
                  className="pl-sheet-shot"
                  style={{ height: Math.min(tall, Math.round(shot.h * k)) }}
                >
                  <img
                    src={frameSrc(year, shot.src)}
                    alt=""
                    width={w}
                    height={Math.round(shot.h * k)}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <figcaption>{shot.label}</figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** A big change, called out on the desktop: what changed, in a list. */
function ChangeCard({ change }: { change: NonNullable<Scene["change"]> }) {
  return (
    <aside className="pl-change">
      <p className="pl-change-title">{change.title}</p>
      <ul>
        {change.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  )
}
