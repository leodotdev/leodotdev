import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import {
  TbChevronLeft,
  TbChevronRight,
  TbLayoutSidebar,
  TbLock,
  TbPlus,
  TbShare2,
  TbSquares,
} from "react-icons/tb"
import { wave } from "@/lib/wave"
import { Lightbox } from "@/components/work/plasmic/lightbox"
import { NoteLayer } from "@/components/work/plasmic/notes"
import { usePkTheme } from "@/components/work/plasmic/theme"
import type { PkTheme } from "@/components/work/plasmic/theme"
import type {
  Anchor,
  Beat,
  Dive,
  Explore,
  Note,
  Peer,
  Rect,
  Scene,
  Sheet,
  Shot,
  State,
  Year,
} from "@/components/work/plasmic/types"

/** The app's size as laid out, under the browser's bar. */
export const APP_W = 1440
export const APP_H = 868
/** The browser's own bar, as laid out. */
export const CHROME = 52
/** The scale the browser is drawn at, as the docs' figures are (80%). */
const SCALE = 0.8

/**
 * The stage: one figure as wide as the window, a desktop with the Plasmic
 * studio open in a browser on it, held under the bar while the year's
 * dives scroll past (Leo, 2026-11-21). Each dive is an `article[data-chapter]`
 * as long as its scenes (so the chapter bar sizes and follows it); the
 * stage plays whichever scene the page has scrolled to. A scene is the
 * studio rebuilt in HTML (the kit in ./kit/, styles in src/plasmic-kit.css),
 * drawn from a small state its script changes as the demo cursor points
 * at parts (bringing up their notes) and works through a workflow (each
 * step said as it happens). Moving into the browser takes over: the script
 * stops and its cursor leaves, the studio answers the visitor's pointer,
 * and a part's note shows while the pointer is on it. The browser is laid
 * out at the app's true size and drawn at 80%, whole, scaled further only
 * where the window is too small; the app does not reflow (it was a desktop
 * app). The browser and the studio wear the product theme picked in the
 * bar (./theme.tsx).
 */
export function Stage({ year }: { year: Year }) {
  const track = useRef<HTMLDivElement>(null)
  const desk = useRef<HTMLDivElement>(null)
  const at = useScrollScene(track, year.dives)
  const dive = year.dives.at(at.dive) ?? year.dives[0]
  const scene = dive.scenes.at(at.scene) ?? dive.scenes[0]
  const key = `${dive.slug}:${at.scene}`

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
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={track} className="pl-track">
      <div ref={desk} className="pl-desk" data-no-wave>
        <div aria-hidden className="pl-wallpaper" />
        {box.w > 0 && (
          <Player key={key} scene={scene} progress={at.progress} box={box} />
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
 * the bar, and how far into it, laid along its scenes by the steps each
 * takes. `progress` is how far through the scene, for the sheets.
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
    queue()
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
type Cursor = {
  index: number
  x: number
  y: number
  shape: NonNullable<Beat["shape"]>
  pressed: boolean
  slow: boolean
}

const beatsOf = (n: Note) =>
  n.beat === undefined ? null : Array.isArray(n.beat) ? n.beat : [n.beat]

/** Whether a point (in the app's pixels) is inside a box. */
const inside = ([x, y]: [number, number], [l, t, w, h]: Rect) =>
  x >= l && x <= l + w && y >= t && y <= t + h

/**
 * One scene, played: the browser with the studio in it, the notes, the
 * cursor running the scene's script, and whatever else the scene has.
 * Remounted for every scene, so a script always starts from its first beat.
 */
function Player({
  scene,
  progress,
  box,
}: {
  scene: Scene
  progress: number
  box: Box
}) {
  const { theme } = usePkTheme()
  const { s } = box
  const bw = Math.round(APP_W * s)
  const bh = Math.round((APP_H + CHROME) * s)
  const shift = scene.sheet ? Math.min(160, Math.max(0, box.w - bw) / 2) : 0
  const left = Math.round((box.w - bw) / 2 - shift)
  const top = box.w < 768 ? 16 : Math.round((box.h - bh) / 2)
  const chrome = Math.round(CHROME * s)

  const [initial] = useState<State>(() => scene.state ?? {})
  const [state, setState] = useState<State>(initial)

  // A change scene starts on what came before and waves into itself.
  const [before, setBefore] = useState(Boolean(scene.change))
  const app = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!scene.change) return
    const t = window.setTimeout(() => {
      void wave(app.current, () => flushSync(() => setBefore(false)))
    }, 900)
    return () => clearTimeout(t)
  }, [scene])

  // Where a part is, in the app's pixels (measured as drawn).
  const measure = useCallback((a: Anchor): Rect | null => {
    if (typeof a !== "string") return a
    const root = app.current
    const el = root?.querySelector(`[data-pk="${a}"]`)
    if (!root || !el) return null
    const r = el.getBoundingClientRect()
    const o = root.getBoundingClientRect()
    const k = o.width / APP_W || 1
    return [
      (r.left - o.left) / k,
      (r.top - o.top) / k,
      r.width / k,
      r.height / k,
    ]
  }, [])

  // Taking over: in the browser, the script stops and the visitor's pointer
  // brings up the note of the part it is on; it starts again a moment
  // after the pointer goes. A tap holds it for a few seconds.
  const [held, setHeld] = useState(false)
  const [pointer, setPointer] = useState<[number, number] | null>(null)
  const release = useRef(0)
  const hold = (ms?: number) => {
    clearTimeout(release.current)
    setHeld(true)
    if (ms) release.current = window.setTimeout(() => setHeld(false), ms)
  }
  const letGo = () => {
    clearTimeout(release.current)
    release.current = window.setTimeout(() => {
      setHeld(false)
      setPointer(null)
    }, 700)
  }
  useEffect(() => () => clearTimeout(release.current), [])

  const [still] = useState(
    () =>
      typeof window !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
  )
  const { cursor, say, ghost } = useScript(
    scene.script,
    !held && !before && !still,
    initial,
    setState,
    measure
  )
  const peers = usePeers(scene.peers, !before && !still, setState, measure)

  // The notes showing: those for the whole scene, and those of the beat
  // the cursor is on (or, taken over, of the part under the pointer; with
  // reduced motion, all of them).
  const notes = scene.notes
  const [rects, setRects] = useState<Array<Rect | null>>([])
  const beatIndex = cursor?.index
  useLayoutEffect(() => {
    // Measured as drawn, and again once a pan or zoom has settled.
    const update = () => setRects((notes ?? []).map((n) => measure(n.on)))
    const f = requestAnimationFrame(update)
    const t = window.setTimeout(update, 900)
    return () => {
      cancelAnimationFrame(f)
      clearTimeout(t)
    }
  }, [state, before, s, notes, measure, beatIndex])
  const shown = (notes ?? [])
    .map((note, i) => ({ note, rect: rects.at(i) ?? null }))
    .filter((n): n is { note: Note; rect: Rect } => {
      if (!n.rect) return false
      const only = beatsOf(n.note)
      if (!only || still) return true
      if (held) return pointer ? inside(pointer, n.rect) : false
      return beatIndex !== undefined && only.includes(beatIndex)
    })

  const [open, setOpen] = useState<Explore | null>(null)
  const [exploreRect, setExploreRect] = useState<Rect | null>(null)
  useLayoutEffect(() => {
    const on = scene.explore?.on
    if (on === undefined) return
    const f = requestAnimationFrame(() => setExploreRect(measure(on)))
    return () => cancelAnimationFrame(f)
  }, [scene, measure, s, state])

  const at = (x: number, y: number) =>
    `${Math.round(x * s)}px ${Math.round(y * s)}px`

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
        onPointerMove={(e) => {
          const o = app.current?.getBoundingClientRect()
          if (!o || !held) return
          const k = o.width / APP_W
          setPointer([(e.clientX - o.left) / k, (e.clientY - o.top) / k])
        }}
      >
        <div
          className="pl-browser"
          data-pk-theme={theme}
          style={{ width: APP_W, height: APP_H + CHROME, scale: s }}
        >
          <SafariBar url={scene.url ?? "studio.plasmic.app"} />
          <div
            ref={app}
            className="pk pl-app"
            data-pk-theme={theme}
            style={{ width: APP_W, height: APP_H }}
          >
            {before && scene.change
              ? scene.change.from(state)
              : scene.view(state)}
          </div>
        </div>
        <div className="pl-over" style={{ top: chrome }}>
          {scene.explore && exploreRect && (
            <ExploreBadge
              explore={scene.explore}
              rect={exploreRect}
              s={s}
              onOpen={() => setOpen(scene.explore ?? null)}
            />
          )}
          {ghost && cursor && (
            <span
              className="pl-ghost"
              data-slow={cursor.slow ? "" : undefined}
              style={{ translate: at(cursor.x, cursor.y) }}
            >
              {ghost}
            </span>
          )}
          {peers.map((p) => (
            <PeerView key={p.name} peer={p} s={s} />
          ))}
          <CursorView cursor={held ? null : cursor} s={s} />
          {say && cursor && !held && (
            <span
              className="pl-say"
              data-slow={cursor.slow ? "" : undefined}
              style={{ translate: at(cursor.x, cursor.y) }}
            >
              <b>{say.n}</b>
              {say.text}
            </span>
          )}
        </div>
      </div>
      <NoteLayer
        notes={shown}
        s={s}
        origin={[left, top + chrome]}
        desk={[box.w, box.h]}
      />
      {scene.sheet && (
        <SheetWindow
          sheet={scene.sheet}
          progress={progress}
          box={box}
          theme={theme}
          browser={{ left, top, width: bw, height: bh }}
        />
      )}
      {scene.change && <ChangeCard change={scene.change} />}
      {open && (
        <Lightbox explore={open} theme={theme} onClose={() => setOpen(null)} />
      )}
    </>
  )
}

/**
 * Runs a scene's script: the cursor goes to each beat in turn (measuring
 * the part it is after where it is drawn now), presses, drags, or types
 * where a beat says, and the state changes; after the last it rests, the
 * state goes back to the scene's own, and it starts over.
 */
function useScript(
  script: Array<Beat> | undefined,
  running: boolean,
  initial: State,
  setState: React.Dispatch<React.SetStateAction<State>>,
  measure: (a: Anchor) => Rect | null
) {
  const [cursor, setCursor] = useState<Cursor | null>(null)
  const [say, setSay] = useState<{ n: number; text: string } | null>(null)
  const [ghost, setGhost] = useState<string | null>(null)
  useEffect(() => {
    if (!script?.length || !running) return
    // Every wait is a timer; clearing them ends the script where it is.
    const timers: Array<number> = []
    const after = (ms: number) =>
      new Promise<void>((done) => {
        timers.push(window.setTimeout(done, ms))
      })
    const point = (on: string, at: [number, number] = [0.5, 0.5]) => {
      const r = measure(on)
      return r ? ([r[0] + r[2] * at[0], r[1] + r[3] * at[1]] as const) : null
    }
    void (async () => {
      await after(450)
      for (;;) {
        let step = 0
        for (const [i, b] of script.entries()) {
          const to = b.to ?? (b.on ? point(b.on, b.at) : null)
          const shape = b.shape ?? (b.click || b.drag ? "pointer" : "arrow")
          setCursor((c) =>
            to
              ? {
                  index: i,
                  x: to[0],
                  y: to[1],
                  shape,
                  pressed: false,
                  slow: false,
                }
              : c && { ...c, index: i }
          )
          if (b.say) setSay({ n: ++step, text: b.say })
          await after(to ? 680 : 120)
          if (b.click) {
            setCursor((c) => c && { ...c, pressed: true })
            await after(140)
            setCursor((c) => c && { ...c, pressed: false })
          }
          if (b.drag) {
            const end = point(b.drag)
            setCursor((c) => c && { ...c, pressed: true, shape: "grab" })
            setGhost(b.ghost ?? null)
            await after(220)
            if (end)
              setCursor((c) => c && { ...c, x: end[0], y: end[1], slow: true })
            await after(1000)
            setCursor((c) => c && { ...c, pressed: false, slow: false })
            setGhost(null)
          }
          if (b.type) {
            const { key, text } = b.type
            setCursor((c) => c && { ...c, shape: "text" })
            for (let k = 1; k <= text.length; k++) {
              setState((was) => ({ ...was, [key]: text.slice(0, k) }))
              await after(55)
            }
          }
          if (b.set) {
            const patch = b.set
            setState((was) => ({ ...was, ...patch }))
          }
          await after(b.wait ?? 1300)
        }
        await after(1500)
        setState(initial)
        setSay(null)
        await after(700)
      }
    })()
    return () => timers.forEach(clearTimeout)
  }, [script, running, initial, setState, measure])
  return { cursor, say, ghost }
}

type PeerAt = {
  name: string
  color: string
  x: number
  y: number
  sel: Rect | null
  shown: boolean
}

/**
 * Runs the scene's other people: each goes through their own beats on a
 * loop, at their own pace, alongside the demo cursor (and, unlike it, not
 * stopped by the visitor taking over: they are someone else).
 */
function usePeers(
  peers: Array<Peer> | undefined,
  running: boolean,
  setState: React.Dispatch<React.SetStateAction<State>>,
  measure: (a: Anchor) => Rect | null
) {
  // (The Player is made anew for each scene, so its people start here.)
  const [at, setAt] = useState<Array<PeerAt>>(() =>
    (peers ?? []).map((p) => ({
      name: p.name,
      color: p.color,
      x: 0,
      y: 0,
      sel: null,
      shown: false,
    }))
  )
  useEffect(() => {
    if (!peers?.length || !running) return
    const timers: Array<number> = []
    const after = (ms: number) =>
      new Promise<void>((done) => {
        timers.push(window.setTimeout(done, ms))
      })
    const put = (i: number, patch: Partial<PeerAt>) =>
      setAt((was) => was.map((p, j) => (j === i ? { ...p, ...patch } : p)))
    peers.forEach((peer, i) => {
      void (async () => {
        await after(900 + i * 700)
        for (;;) {
          for (const b of peer.script) {
            const r = b.on ? measure(b.on) : null
            const to =
              b.to ??
              (r
                ? ([
                    r[0] + r[2] * (b.at?.[0] ?? 0.5),
                    r[1] + r[3] * (b.at?.[1] ?? 0.5),
                  ] as const)
                : null)
            if (to)
              put(i, {
                x: to[0],
                y: to[1],
                shown: true,
                sel: b.select ? r : null,
              })
            await after(950)
            if (b.set) {
              const patch = b.set
              setState((was) => ({ ...was, ...patch }))
            }
            await after(b.wait ?? 1400)
          }
        }
      })()
    })
    return () => timers.forEach(clearTimeout)
  }, [peers, running, setState, measure])
  return at
}

/** Someone else's cursor: an arrow in their color, with their name. */
function PeerView({ peer, s }: { peer: PeerAt; s: number }) {
  if (!peer.shown) return null
  return (
    <>
      {peer.sel && (
        <span
          className="pk-peer-sel"
          style={
            {
              "--peer": peer.color,
              left: Math.round(peer.sel[0] * s),
              top: Math.round(peer.sel[1] * s),
              width: Math.round(peer.sel[2] * s),
              height: Math.round(peer.sel[3] * s),
            } as React.CSSProperties
          }
        >
          <b>{peer.name}</b>
        </span>
      )}
      <span
        aria-hidden
        className="pk-peer"
        style={{
          translate: `${Math.round(peer.x * s)}px ${Math.round(peer.y * s)}px`,
        }}
      >
        <svg viewBox="0 0 18 18">
          <path
            d="M2 1.5 15.5 7l-6 1.8L7 15z"
            fill={peer.color}
            stroke="#fff"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
        <span style={{ background: peer.color }}>{peer.name}</span>
      </span>
    </>
  )
}

/**
 * The demo cursor, in the page's own pixels over the browser: one of the
 * macOS cursors (public/cursors), gliding between beats, slower while it
 * drags, with a ring where it presses.
 */
function CursorView({ cursor, s }: { cursor: Cursor | null; s: number }) {
  const shape = !cursor || cursor.shape === "grab" ? "pointer" : cursor.shape
  return (
    <div
      aria-hidden
      className="pl-cursor"
      data-shown={cursor ? "" : undefined}
      data-pressed={cursor?.pressed ? "" : undefined}
      data-slow={cursor?.slow ? "" : undefined}
      style={{
        translate: `${Math.round((cursor?.x ?? 0) * s)}px ${Math.round((cursor?.y ?? 0) * s)}px`,
      }}
    >
      {(["arrow", "pointer", "text"] as const).map((k) => (
        <img
          key={k}
          src={`/cursors/${k}.svg`}
          alt=""
          data-shape={k}
          hidden={k !== (cursor ? shape : "arrow")}
        />
      ))}
    </div>
  )
}

/**
 * The browser's bar, after Safari's: the window's lights, the sidebar and
 * the arrows, the address in the middle, and share, new tab, and tabs at
 * the end. It wears the product theme.
 */
function SafariBar({ url }: { url: string }) {
  return (
    <div className="pl-safari">
      <span aria-hidden className="pl-lights">
        <i />
        <i />
        <i />
      </span>
      <TbLayoutSidebar className="pl-safari-icon" />
      <TbChevronLeft className="pl-safari-icon" />
      <TbChevronRight className="pl-safari-icon pl-faded" />
      <span className="pl-safari-url">
        <TbLock />
        {url}
      </span>
      <TbShare2 className="pl-safari-icon" />
      <TbPlus className="pl-safari-icon" />
      <TbSquares className="pl-safari-icon" />
    </div>
  )
}

/** Versions of the part under a highlight; a badge on it opens them. */
function ExploreBadge({
  explore,
  rect,
  s,
  onOpen,
}: {
  explore: Explore
  rect: Rect
  s: number
  onOpen: () => void
}) {
  const [x, y, w, h] = rect.map((v) => Math.round(v * s))
  return (
    <>
      <div
        aria-hidden
        className="pl-explore-ring"
        style={{ left: x, top: y, width: w, height: h }}
      />
      <button
        type="button"
        className="pl-explore-badge"
        style={{ left: x + w, top: y }}
        onClick={onOpen}
      >
        {explore.label}
      </button>
    </>
  )
}

/** A design shown on its own, at its own size scaled by `k`. */
export function ShotView({
  shot,
  k,
  theme,
  height,
}: {
  shot: Shot
  k: number
  theme: PkTheme
  /** Cut off at this height (the shot's top is what matters). */
  height?: number
}) {
  return (
    <span
      className="pl-shot"
      style={{
        width: Math.round(shot.w * k),
        height: Math.round(height ?? shot.h * k),
      }}
    >
      <span
        className="pk"
        data-pk-theme={theme}
        style={{ width: shot.w, height: shot.h, scale: k }}
      >
        {shot.view()}
      </span>
    </span>
  )
}

/**
 * A feature's states, inline: a window on the desktop beside the browser,
 * its states in a row that passes as the page scrolls through the scene.
 */
function SheetWindow({
  sheet,
  progress,
  box,
  theme,
  browser,
}: {
  sheet: Sheet
  progress: number
  box: Box
  theme: PkTheme
  browser: { left: number; top: number; width: number; height: number }
}) {
  const row = useRef<HTMLDivElement>(null)
  const view = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  useLayoutEffect(() => {
    const r = row.current
    const v = view.current
    if (!r || !v) return
    const update = () => setRoom(Math.max(0, r.scrollWidth - v.clientWidth))
    const observer = new ResizeObserver(update)
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
            const k = Math.min(1, 220 / shot.w)
            return (
              <figure
                key={shot.label}
                className="pl-sheet-item"
                style={{ width: Math.round(shot.w * k) }}
              >
                <ShotView
                  shot={shot}
                  k={k}
                  theme={theme}
                  height={Math.min(tall, shot.h * k)}
                />
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
