import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import { useNavigate } from "@tanstack/react-router"
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
import { diveOf, explain } from "@/components/work/plasmic/explain"
import type { Target } from "@/components/work/plasmic/explain"
import { glideTo } from "@/lib/glide"
import { NoteLayer } from "@/components/work/plasmic/notes"
import { usePkTheme } from "@/components/work/plasmic/theme"
import type { PkTheme } from "@/components/work/plasmic/theme"
import type {
  Anchor,
  Beat,
  Dive,
  Note,
  Peer,
  Point,
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
/** The room beside the browser the change card needs to sit there. */
const CHANGE_ROOM = 276
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
 * step said as it happens). The script is the presentation, so a visitor's
 * pointer does not stop it (Leo, 2026-11-22; before, moving into the
 * browser took over), but they can tinker as it plays: the parts the
 * scripts press open and close under a real press too. The browser is laid
 * out at the app's true size and drawn at 80%, whole, scaled further only
 * where the window is too small; the app does not reflow (it was a desktop
 * app). The browser and the studio wear the product theme picked in the
 * bar (./theme.tsx).
 *
 * Nothing on the stage cuts (Leo, 2026-11-22: "better motion graphics
 * throughout, without being too hard to keep up with"): a scene dissolves
 * into the next, two versions of one thing wipe across, the cursor carries
 * on from where the last scene left it, a lens closes in on what a beat is
 * about, and what leaves the desk fades out.
 */
export function Stage({ year }: { year: Year }) {
  const track = useRef<HTMLDivElement>(null)
  const desk = useRef<HTMLDivElement>(null)
  // What the scene being left looked like, for the next to come in over.
  const memory = useRef<Memory | null>(null)
  const leave = useCallback((forward: boolean, quick: boolean) => {
    const app = desk.current?.querySelector<HTMLElement>(
      ".pl-browser > .pl-app:not(.pl-app-out)"
    )
    const frame = app?.closest<HTMLElement>(".pl-browser-box")
    // Scrubbed through quickly, scenes cut: a dissolve each would smear.
    memory.current =
      app && frame && !quick
        ? {
            node: app.cloneNode(true) as HTMLElement,
            left: frame.offsetLeft,
            forward,
          }
        : null
  }, [])
  // The scene coming in takes it, once.
  const take = useCallback(() => {
    const old = memory.current
    memory.current = null
    return old
  }, [])
  const at = useScrollScene(track, year.dives, leave)
  const dive = year.dives.at(at.dive) ?? year.dives[0]
  const scene = dive.scenes.at(at.scene) ?? dive.scenes[0]
  const key = `${dive.slug}:${at.scene}`

  const { theme, full, setFull } = usePkTheme()
  // What a visitor's click on a part does: what the scripts' own clicks do.
  const live = useMemo(() => clicksOf(year.dives), [year])

  // Where the demo cursor last rested, in the app's pixels as drawn: the
  // next scene's cursor sets out from there.
  const [carry, setCarry] = useState<Point | null>(null)
  const rest = useCallback(
    (x: number, y: number) =>
      setCarry((was) => (was?.[0] === x && was[1] === y ? was : [x, y])),
    []
  )
  useExits(desk)

  const [box, setBox] = useState({ w: 0, h: 0, s: SCALE })
  useLayoutEffect(() => {
    const el = desk.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      // At 100% the browser is its true size, to the window's edges where
      // the window is no larger than it.
      const pad = full ? 0 : w < 768 ? 12 : 32
      const s = Math.min(
        full ? 1 : SCALE,
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
  }, [full])

  // Esc leaves the 100% view.
  useEffect(() => {
    if (!full) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [full, setFull])

  // The versions card stays for the whole of its set, so the version
  // showing is picked out as the page goes through them.
  const frame = frameOf(box, Boolean(scene.sheet))
  const [versionsFoot, setVersionsFoot] = useState(0)

  return (
    <div ref={track} className="pl-track">
      <div
        className="pl-desk"
        data-pk-theme={theme}
        data-full={full || undefined}
        data-no-wave
      >
        <div ref={desk} className="pl-screen">
          <div
            aria-hidden
            className="pl-wallpaper"
            data-year={year.slug || undefined}
          />
          {box.w > 0 && (
            <Player
              key={key}
              scene={scene}
              progress={at.progress}
              box={box}
              live={live.get(scene.view)}
              here={{ year: year.slug, slug: dive.slug }}
              from={carry}
              onRest={rest}
              take={take}
              versionsFoot={versionsFoot}
            />
          )}
          {box.w > 0 && scene.versions && (
            <VersionsCard
              key={scene.versions.title}
              versions={scene.versions}
              room={frame.narrow ? panned(box, frame, APP_W / 2) : frame.left}
              top={frame.top}
              height={frame.bh}
              onFoot={setVersionsFoot}
            />
          )}
          {full && (
            <button
              type="button"
              className="pl-esc"
              onClick={() => setFull(false)}
            >
              <kbd>Esc</kbd> to leave 100%
            </button>
          )}
        </div>
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
 * takes. `progress` is how far through the scene, for the sheets. Just
 * before the scene changes, `onLeave` is told (which way the page is going,
 * and whether the last change was only a moment ago).
 */
function useScrollScene(
  track: React.RefObject<HTMLDivElement | null>,
  dives: Array<Dive>,
  onLeave: (forward: boolean, quick: boolean) => void
) {
  const [at, setAt] = useState({ dive: 0, scene: 0, progress: 0 })
  useEffect(() => {
    let frame = 0
    let last: { d: number; s: number; when: number } | null = null
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
      const now = performance.now()
      if (last && (last.d !== d || last.s !== s))
        onLeave(
          d > last.d || (d === last.d && s > last.s),
          now - last.when < 260
        )
      if (last?.d !== d || last.s !== s) last = { d, s, when: now }
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
  }, [track, dives, onLeave])
  return at
}

/**
 * What leaves the desk fades out, where it would otherwise only be gone: a
 * menu or a dialog the script closes, a note whose beat is over, the
 * states' window. React takes the element out at once; a copy is put back
 * in its place for as long as the fade takes (`[data-leaving]` in
 * src/plasmic.css). Something only moved, or taken out along with what it
 * is in, is left alone.
 */
const EXITS =
  ".pl-notes, .pl-note, .pl-note-box, .pl-ink g, .pl-sheet, .pl-change, .pk-pop, .pk-dialog, .pk-scrim, .pk-toast"
function useExits(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const parent = record.target
        if (!(parent instanceof Element) || !parent.isConnected) continue
        if (parent.closest("[data-leaving], .pl-app-out")) continue
        for (const node of record.removedNodes) {
          if (!(node instanceof Element) || node.isConnected) continue
          if (node.hasAttribute("data-leaving") || !node.matches(EXITS))
            continue
          const ghost = node.cloneNode(true) as Element
          ghost.setAttribute("data-leaving", "")
          ghost.setAttribute("aria-hidden", "true")
          // A copy is not the part: nothing measures or presses it.
          for (const part of [
            ghost,
            ...Array.from(ghost.querySelectorAll("[data-pk]")),
          ])
            part.removeAttribute("data-pk")
          ghost.removeAttribute("data-note")
          const next = record.nextSibling
          parent.insertBefore(ghost, next?.parentNode === parent ? next : null)
          window.setTimeout(() => ghost.remove(), 240)
        }
      }
    })
    observer.observe(el, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [root])
}

type Box = { w: number; h: number; s: number }

/** Where the browser sits on the desk, and at what scale it is drawn. */
function frameOf(box: Box, sheet: boolean) {
  // On a phone the browser is drawn larger than the window is wide (a
  // whole desktop app at a quarter of its size cannot be read), and pans
  // sideways to keep the demo cursor in view.
  const narrow = box.w < 768
  const s = narrow ? Math.min(0.5, (box.h * 0.6) / (APP_H + CHROME)) : box.s
  const bw = Math.round(APP_W * s)
  const bh = Math.round((APP_H + CHROME) * s)
  const shift = sheet ? Math.min(160, Math.max(0, box.w - bw) / 2) : 0
  return {
    narrow,
    s,
    bw,
    bh,
    left: Math.round((box.w - bw) / 2 - shift),
    top: narrow ? 16 : Math.round((box.h - bh) / 2),
    chrome: Math.round(CHROME * s),
  }
}
type Frame = ReturnType<typeof frameOf>

/** On a phone: the browser's left edge with the app's `x` in view. */
const panned = (box: Box, frame: Frame, x: number) =>
  Math.round(
    Math.min(8, Math.max(box.w - frame.bw - 8, box.w / 2 - x * frame.s))
  )

/** The scene just left, as it looked, and where its browser was. */
type Memory = { node: HTMLElement; left: number; forward: boolean }

/**
 * One picture of the app gives way to the next: the old one, a copy laid
 * over the app, fades out (a scene change, or a script starting over), or,
 * between two versions of one thing, is wiped away sideways behind a line,
 * the way the page is going, so the two can be compared as it passes.
 */
function dissolve(
  app: HTMLElement | null,
  old: HTMLElement,
  how: "fade" | "wipe" | "wipe-back"
) {
  const host = app?.parentElement
  if (!host) return
  for (const was of host.querySelectorAll(".pl-app-out, .pl-wipe")) was.remove()
  old.classList.add("pl-app-out")
  old.dataset.out = how
  old.setAttribute("aria-hidden", "true")
  old.removeAttribute("data-go")
  old.inert = true
  const made: Array<HTMLElement> = [old]
  if (how !== "fade") {
    const line = document.createElement("i")
    line.className = "pl-wipe"
    line.dataset.out = how
    made.push(line)
  }
  for (const el of made) host.appendChild(el)
  old.addEventListener("animationend", (e) => {
    if (e.target === old) for (const el of made) el.remove()
  })
}

/**
 * The lens over the app (Leo, 2026-11-22: "better motion graphics… without
 * being too hard to keep up with"): what of the app the browser shows, and
 * how close. `x` and `y` are the corner of what shows, in the app's pixels,
 * `z` how much larger it is drawn, and `ms` how long the lens took to get
 * there. It closes in on what a beat is about and holds while the next
 * beats stay in the frame, so most of the time nothing moves but the
 * cursor.
 */
type Lens = { x: number; y: number; z: number; ms: number }
const WIDE: Lens = { x: 0, y: 0, z: 1, ms: 0 }
/** Off, the app is always shown whole. */
const LENS = true as boolean

/** A box of the app as the lens shows it. */
const through = (r: Rect, l: Lens): Rect => [
  (r[0] - l.x) * l.z,
  (r[1] - l.y) * l.z,
  r[2] * l.z,
  r[3] * l.z,
]
const union = (a: Rect | null, b: Rect | null): Rect | null => {
  if (!a || !b) return a ?? b
  const x = Math.min(a[0], b[0])
  const y = Math.min(a[1], b[1])
  return [
    x,
    y,
    Math.max(a[0] + a[2], b[0] + b[2]) - x,
    Math.max(a[1] + a[3], b[1] + b[3]) - y,
  ]
}

/**
 * Where the lens goes for what a beat is about (`focus`: the part the
 * cursor is after, and every part with a note showing). Something that
 * takes up more than half the app either way is shown whole. Something
 * smaller is shown closer, by `zoom`, if the beat stays long enough to be
 * worth the move (`linger`); a passing beat leaves the lens where it is
 * while its part is in the frame, and pulls it back where it is not.
 * `k` is the page's pixels to one of the app's: the lens stops on a whole
 * pixel, so what it shows is drawn sharp.
 */
function aim(
  was: Lens,
  focus: Rect | null,
  linger: boolean,
  zoom: number,
  k: number
): Lens {
  if (!focus) return was
  const [fx, fy, fw, fh] = focus
  const small = fw <= APP_W * 0.5 && fh <= APP_H * 0.5
  if (was.z > 1 && small) {
    const m = 16 / was.z
    const inFrame =
      fx >= was.x + m &&
      fy >= was.y + m &&
      fx + fw <= was.x + APP_W / was.z - m &&
      fy + fh <= was.y + APP_H / was.z - m
    if (inFrame) return was
  }
  if (!small || !linger) return was.z === 1 ? was : { ...WIDE, ms: 800 }
  const snap = (v: number) => Math.round(v * zoom * k) / (zoom * k)
  const vw = APP_W / zoom
  const vh = APP_H / zoom
  const x = snap(Math.min(Math.max(fx + fw / 2 - vw / 2, 0), APP_W - vw))
  const y = snap(Math.min(Math.max(fy + fh / 2 - vh / 2, 0), APP_H - vh))
  const far =
    Math.hypot((x - was.x) * zoom, (y - was.y) * zoom) +
    Math.abs(zoom - was.z) * 900
  return {
    x,
    y,
    z: zoom,
    ms: Math.round(Math.min(1100, Math.max(650, 480 + far * 0.55))),
  }
}

type Cursor = {
  /** The beat it is on (-1 before the first), and the one it came from. */
  index: number
  from: number
  /** Where it is, in the app's own pixels. */
  x: number
  y: number
  shape: NonNullable<Beat["shape"]>
  pressed: boolean
  shown: boolean
  /** It has arrived, and what its press did is drawn: the notes come in. */
  settled: boolean
  /** How long the move it is making takes. */
  ms: number
  /** It is only keeping its place while the lens moves under it. */
  ride: boolean
}

/** What pressing each part does to the state, by the part's name. */
type Patches = Map<string, Array<State>>

/**
 * For every view the dives' scenes draw, what its scripts' clicks do: each
 * part a beat presses, with the changes those beats make, in the order the
 * scripts make them (so a part pressed to open and again to close does
 * both).
 */
function clicksOf(dives: Array<Dive>) {
  const views = new Map<Scene["view"], Patches>()
  for (const dive of dives) {
    for (const scene of dive.scenes) {
      for (const beat of scene.script ?? []) {
        if (!beat.click || !beat.on || !beat.set) continue
        const patches = views.get(scene.view) ?? new Map<string, Array<State>>()
        views.set(scene.view, patches)
        const list = patches.get(beat.on) ?? []
        patches.set(beat.on, list)
        const key = JSON.stringify(beat.set)
        if (!list.some((p) => JSON.stringify(p) === key)) list.push(beat.set)
      }
    }
  }
  return views
}

const beatsOf = (n: Note) =>
  n.beat === undefined ? null : Array.isArray(n.beat) ? n.beat : [n.beat]

/**
 * One scene, played: the browser with the studio in it, the notes, the
 * cursor running the scene's script, and whatever else the scene has.
 * Remounted for every scene, so a script always starts from its first beat;
 * what carries over from the scene before is the cursor's place (`from`)
 * and the look of the app (`take`), which this one comes in over.
 */
function Player({
  scene,
  progress,
  box,
  live,
  here,
  from,
  onRest,
  take,
  versionsFoot,
}: {
  scene: Scene
  progress: number
  box: Box
  live?: Patches
  /** The year and dive on the stage. */
  here: { year: string; slug: string }
  /** Where the last scene's cursor rested. */
  from: Point | null
  onRest: (x: number, y: number) => void
  /** Hands over how the scene before looked, once. */
  take: () => Memory | null
  /** Where the versions card ends, in the desk's pixels. */
  versionsFoot: number
}) {
  const { theme } = usePkTheme()
  const frame = frameOf(box, Boolean(scene.sheet))
  const { narrow, s, bw, bh, top, chrome } = frame

  const [initial] = useState<State>(() => scene.state ?? {})
  const [state, setState] = useState<State>(initial)
  const [still] = useState(
    () =>
      typeof window !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  // A change scene starts on what came before and waves into itself.
  const [before, setBefore] = useState(Boolean(scene.change))
  const app = useRef<HTMLDivElement>(null)
  const glass = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!scene.change) return
    const t = window.setTimeout(() => {
      void wave(app.current, () => flushSync(() => setBefore(false)))
    }, 900)
    return () => clearTimeout(t)
  }, [scene])

  // Coming in: the scene before dissolves away over this one (two versions
  // of one thing are wiped across), and the browser glides over from where
  // that scene had it (one with a states' window sits further left).
  const set = scene.versions?.title ?? ""
  useLayoutEffect(() => {
    const old = take()
    const el = app.current
    const boxEl = el?.closest<HTMLElement>(".pl-browser-box")
    if (!old || !el || !boxEl || still) return
    dissolve(
      el,
      old.node,
      set && old.node.dataset.set === set
        ? old.forward
          ? "wipe"
          : "wipe-back"
        : "fade"
    )
    const dx = old.left - boxEl.offsetLeft
    if (dx)
      boxEl.animate([{ translate: `${dx}px 0` }, { translate: "0 0" }], {
        duration: 600,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      })
  }, [take, set, still])
  // And a script starting over dissolves back to where it began.
  const rewind = useCallback(() => {
    const el = app.current
    if (el) dissolve(el, el.cloneNode(true) as HTMLElement, "fade")
  }, [])

  // Where a part is, in the app's own pixels, whatever the lens is doing
  // (it is measured as drawn, then taken back through the lens as it is
  // this instant, which may be mid-move).
  const measure = useCallback((a: Anchor): Rect | null => {
    if (typeof a !== "string") return a
    const root = app.current
    const el = root?.querySelector(`[data-pk="${a}"]`)
    return root && el ? rawRect(root, glass.current, el) : null
  }, [])
  // The menus, popovers, and dialogs open now.
  const overlays = useCallback((): Rect | null => {
    const root = app.current
    if (!root) return null
    let all: Rect | null = null
    for (const el of root.querySelectorAll(".pk-pop, .pk-dialog"))
      all = union(all, rawRect(root, glass.current, el))
    return all
  }, [])

  // Tinkering (Leo, 2026-11-22): while the cursor presents, a visitor can
  // press the parts the scripts press (a menu, a popover, a panel's tab) and
  // they open and close; pressing anywhere else puts back what they changed.
  // The script goes on regardless and sets what it needs as it comes to it,
  // and every round starts from the scene's own state.
  const touched = useRef(new Set<string>())

  // Asking (Leo, 2026-11-22): the pointer on a part there is something to
  // say of holds the show where it is and brings up that part's note, a
  // child's own before its parent's (./explain.ts). Where another dive has
  // more on the part, the note says so, and a press goes there.
  const [asked, setAsked] = useState<{
    part: string
    note: Note
    rect: Rect
    go?: Target
  } | null>(null)
  const paused = useRef(false)
  useEffect(() => {
    paused.current = asked !== null
  }, [asked])
  const ask = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    let found: typeof asked = null
    let go: Target | undefined
    let goPart = ""
    for (
      let el = e.target as Element | null;
      el && el !== e.currentTarget;
      el = el.parentElement
    ) {
      const part = el.getAttribute("data-pk")
      if (!part) continue
      if (!go) {
        go = diveOf(part, here)
        if (go) goPart = part
      }
      if (found) continue
      const note =
        scene.notes?.find((n) => n.on === part) ??
        explain(scene.view, here.year, part)
      const rect = note && measure(part)
      if (note && rect) found = { part, note: { ...note, on: part }, rect }
    }
    // A part with a dive but no note of its own is told by the dive's line.
    const rect = !found && go ? measure(goPart) : null
    if (go && rect)
      found = {
        part: goPart,
        note: {
          kind: "direction",
          title: go.title,
          on: goPart,
          text: go.summary,
        },
        rect,
      }
    const next = found && { ...found, go }
    setAsked((was) =>
      was?.part === next?.part && was?.go?.slug === next?.go?.slug ? was : next
    )
  }
  const navigate = useNavigate()
  const visit = (to: Target) => {
    setAsked(null)
    if (to.year === here.year) {
      // A dive of this year: glide to it, its top on the bar's line.
      const dive = document.getElementById(to.slug)
      const line =
        document.querySelector("[data-docs-bar]")?.getBoundingClientRect()
          .bottom ?? 0
      if (dive)
        void glideTo(
          window.scrollY + dive.getBoundingClientRect().top - line + 1
        )
      return
    }
    void (to.year
      ? navigate({
          to: "/work/plasmic/$year",
          params: { year: to.year },
          hash: to.slug,
        })
      : navigate({ to: "/work/plasmic", hash: to.slug }))
  }

  const tinker = (e: React.MouseEvent<HTMLElement>) => {
    if (asked?.go) {
      visit(asked.go)
      return
    }
    let el = e.target as Element | null
    while (el && el !== e.currentTarget) {
      const patches = live?.get(el.getAttribute("data-pk") ?? "")
      if (patches) {
        setState((was) => {
          const on = (p: State) =>
            Object.entries(p).every(([k, v]) => was[k] === v)
          const next = patches.find((p) => !on(p))
          const keys = Object.keys(next ?? patches[0])
          for (const k of keys) touched.current.add(k)
          return next
            ? { ...was, ...next }
            : {
                ...was,
                ...Object.fromEntries(keys.map((k) => [k, initial[k]])),
              }
        })
        return
      }
      el = el.parentElement
    }
    if (!touched.current.size) return
    const keys = [...touched.current]
    touched.current.clear()
    setState((was) => ({
      ...was,
      ...Object.fromEntries(keys.map((k) => [k, initial[k]])),
    }))
  }

  const { cursor, lens, say, ghost } = useScript({
    script: scene.script,
    notes: scene.notes,
    paused,
    running: !before && !still,
    initial,
    from,
    // Closer by enough to draw the app at its true size (it is drawn at
    // 80%), and no closer on a phone, where the browser pans instead.
    zoom: LENS && !narrow ? Math.min(1.5, Math.max(1.25, 1 / s)) : 1,
    k: s,
    setState,
    measure,
    overlays,
    rewind,
  })
  // The cursor as the lens shows it, in the app's pixels as drawn.
  const cx = (cursor.x - lens.x) * lens.z
  const cy = (cursor.y - lens.y) * lens.z
  const shown = cursor.shown
  useEffect(() => {
    if (shown) onRest(cx, cy)
  }, [shown, cx, cy, onRest])
  const left = narrow ? panned(box, frame, shown ? cx : APP_W / 2) : frame.left
  const peers = usePeers(scene.peers, !before && !still, setState, measure)

  // The notes showing: those for the whole scene, and those of the beat
  // the cursor is on, once it is there (with reduced motion, all of them).
  const notes = scene.notes
  const [rects, setRects] = useState<Array<Rect | null>>([])
  const { index, settled } = cursor
  useLayoutEffect(() => {
    // Measured as drawn, and again once a pan or zoom has settled.
    const update = () => setRects((notes ?? []).map((n) => measure(n.on)))
    const f = requestAnimationFrame(update)
    const t = window.setTimeout(update, 900)
    return () => {
      cancelAnimationFrame(f)
      clearTimeout(t)
    }
  }, [state, before, s, notes, measure, index, settled])
  // A part as the lens shows it, cut to what of it is in the browser.
  const seen = (r: Rect): Rect | null => {
    const [x, y, w, h] = through(r, lens)
    const l = Math.max(0, x)
    const t = Math.max(0, y)
    const r2 = Math.min(APP_W, x + w)
    const b = Math.min(APP_H, y + h)
    return r2 - l < 4 || b - t < 4 ? null : [l, t, r2 - l, b - t]
  }
  const playing = (notes ?? [])
    .map((note, i) => {
      const rect = rects.at(i)
      return { note, rect: rect ? seen(rect) : null }
    })
    .filter((n): n is { note: Note; rect: Rect } => {
      if (!n.rect) return false
      const only = beatsOf(n.note)
      if (!only || still) return true
      // A note that stays from the beat before does not wait again.
      return only.includes(index) && (settled || only.includes(cursor.from))
    })
  // The part asked of takes the notes' place while it is asked of.
  const askedRect = asked && seen(asked.rect)
  const showing =
    asked && askedRect
      ? [
          {
            note: asked.note,
            rect: askedRect,
            more:
              asked.go &&
              `${asked.go.name === "Overview" ? "Research" : asked.go.name} · ${asked.go.title}`,
          },
        ]
      : playing

  // Where the change card ends, in the desk's pixels.
  const [changeFoot, setChangeFoot] = useState(0)
  const cardFoot = scene.versions ? versionsFoot : scene.change ? changeFoot : 0

  const px = (v: number) => Math.round(v * s)

  return (
    <>
      <div
        className="pl-browser-box"
        style={
          {
            left,
            top,
            width: bw,
            height: bh,
            "--pl-s": s,
          } as React.CSSProperties
        }
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
            data-set={set || undefined}
            style={{ width: APP_W, height: APP_H }}
            data-go={asked?.go ? "" : undefined}
            onClick={tinker}
            onPointerMove={ask}
            onPointerLeave={() => setAsked(null)}
          >
            <div
              ref={glass}
              className="pl-lens"
              style={{
                transform: `translate(${-lens.x * lens.z}px, ${-lens.y * lens.z}px) scale(${lens.z})`,
                transitionDuration: `${lens.ms}ms`,
              }}
            >
              {before && scene.change
                ? scene.change.from(state)
                : scene.view(state)}
            </div>
          </div>
        </div>
        <div className="pl-over" style={{ top: chrome }}>
          {peers.map((p) => (
            <PeerView
              key={p.name}
              peer={p}
              at={[px((p.x - lens.x) * lens.z), px((p.y - lens.y) * lens.z)]}
              sel={p.sel && seen(p.sel)}
              // Someone outside what the lens shows is out of sight.
              away={!seen([p.x, p.y, 4, 4])}
              s={s}
            />
          ))}
          <div
            className="pl-point"
            data-shown={shown ? "" : undefined}
            data-ride={cursor.ride ? "" : undefined}
            style={
              {
                translate: `${px(cx)}px 0`,
                "--pl-move": `${cursor.ms}ms`,
              } as React.CSSProperties
            }
          >
            <div style={{ translate: `0 ${px(cy)}px` }}>
              {ghost && <span className="pl-ghost">{ghost}</span>}
              <CursorView cursor={cursor} />
              {say && (
                <span
                  className="pl-say"
                  // Near the browser's right edge, the step is said to
                  // the cursor's left.
                  data-flip={cx * s > bw - 240 ? "" : undefined}
                  // And near its foot, above it.
                  data-up={cy * s > bh - chrome - 56 ? "" : undefined}
                >
                  <span key={say.n}>
                    <b>{say.n}</b>
                    {say.text}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <NoteLayer
        notes={showing}
        s={s}
        origin={[left, top + chrome]}
        desk={[box.w, box.h]}
        browser={{ left, width: bw }}
        taken={{ right: Boolean(scene.sheet) }}
        // While the lens is moving, what stays up moves with it.
        fly={settled ? 0 : lens.ms}
        view={`${lens.x},${lens.y},${lens.z}`}
        quick={Boolean(asked)}
        // The change card is at the top of the left gutter: notes there
        // start under it.
        under={
          cardFoot && left >= CHANGE_ROOM ? { left: cardFoot + 12 } : undefined
        }
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
      {scene.change && (
        <ChangeCard
          change={scene.change}
          room={left}
          top={top}
          height={bh}
          onFoot={setChangeFoot}
        />
      )}
    </>
  )
}

/** A part's box in the app's own pixels, taken back through the lens. */
function rawRect(root: Element, glass: Element | null, el: Element): Rect {
  const r = el.getBoundingClientRect()
  const o = root.getBoundingClientRect()
  const k = o.width / APP_W || 1
  const m = glass
    ? new DOMMatrixReadOnly(getComputedStyle(glass).transform)
    : null
  const z = m?.a || 1
  return [
    ((r.left - o.left) / k - (m?.e ?? 0)) / z,
    ((r.top - o.top) / k - (m?.f ?? 0)) / z,
    r.width / k / z,
    r.height / k / z,
  ]
}

/**
 * Runs a scene's script: the cursor goes to each beat in turn (measuring
 * the part it is after where it is drawn now), presses, drags, or types
 * where a beat says, and the state changes; after the last it rests, the
 * app dissolves back to the scene's own state, and it starts over.
 *
 * The motion is paced to be followed (Leo, 2026-11-22): a move takes as
 * long as it is far, short hops quick and a crossing slow; the lens closes
 * in on what a beat is about as the cursor goes there, and holds while the
 * next beats stay in its frame; and a beat's notes come up only once the
 * cursor has arrived and what its press did is on screen.
 */
function useScript({
  script,
  notes,
  paused,
  running,
  initial,
  from,
  zoom,
  k,
  setState,
  measure,
  overlays,
  rewind,
}: {
  script: Array<Beat> | undefined
  notes: Array<Note> | undefined
  /** Held where it is while this is set (the visitor is asking of a part). */
  paused: React.RefObject<boolean>
  running: boolean
  initial: State
  /** Where the cursor sets out from. */
  from: Point | null
  /** How close the lens goes (1: it stays wide). */
  zoom: number
  /** The page's pixels to one of the app's. */
  k: number
  setState: React.Dispatch<React.SetStateAction<State>>
  measure: (a: Anchor) => Rect | null
  overlays: () => Rect | null
  rewind: () => void
}) {
  const [start] = useState(from)
  const [cursor, setCursor] = useState<Cursor>(() => ({
    index: -1,
    from: -1,
    // With nowhere to set out from, it comes in from the middle.
    x: start?.[0] ?? APP_W * 0.54,
    y: start?.[1] ?? APP_H * 0.6,
    shape: "arrow",
    pressed: false,
    shown: Boolean(start && script?.length && running),
    settled: false,
    ms: 0,
    ride: false,
  }))
  const [lens, setLens] = useState<Lens>(WIDE)
  const [say, setSay] = useState<{ n: number; text: string } | null>(null)
  const [ghost, setGhost] = useState<string | null>(null)
  useEffect(() => {
    if (!script?.length || !running) return
    // Every wait is a timer; clearing them ends the script where it is.
    const timers: Array<number> = []
    const wait = (ms: number) =>
      new Promise<void>((done) => {
        timers.push(window.setTimeout(done, ms))
      })
    // A wait, and then for as long as the show is held.
    const after = async (ms: number) => {
      await wait(ms)
      while (paused.current) await wait(200)
    }
    // How long a beat rests at the least: long enough to read what it
    // brings up (Leo, 2026-11-22: the notes went too quickly to read), its
    // step and its notes at an easy reading pace, a note that stays for
    // several beats read across them.
    const read = (i: number, b: Beat) => {
      let letters = b.say?.length ?? 0
      for (const n of notes ?? []) {
        const on = beatsOf(n)
        if (on?.includes(i)) letters += n.text.length / on.length
      }
      return letters ? 900 + letters * 42 : 0
    }
    // What a beat is about: the part the cursor is after (and where it
    // drags to), every part with a note showing, and, once it has pressed,
    // whatever that opened.
    const about = (i: number, b: Beat, part: Rect | null, opened: boolean) => {
      let all = union(part, b.drag ? measure(b.drag) : null)
      for (const n of notes ?? []) {
        const on = beatsOf(n)
        if (!on || on.includes(i)) all = union(all, measure(n.on))
      }
      return opened ? union(all, overlays()) : all
    }
    // The script's own copies of where the cursor and the lens are.
    let at: Point = start ?? [APP_W * 0.54, APP_H * 0.6]
    let glass = WIDE
    const fly = (to: Lens) => {
      if (to === glass) return 0
      glass = to
      setLens(to)
      return to.ms
    }
    void (async () => {
      await after(450)
      for (;;) {
        let step = 0
        for (const [i, b] of script.entries()) {
          const part = b.on
            ? measure(b.on)
            : b.to
              ? ([b.to[0] - 100, b.to[1] - 70, 200, 140] as Rect)
              : null
          const to: Point | null =
            b.to ??
            (b.on && part
              ? [
                  part[0] + part[2] * (b.at?.[0] ?? 0.5),
                  part[1] + part[3] * (b.at?.[1] ?? 0.5),
                ]
              : null)
          const shape = b.shape ?? (b.click || b.drag ? "pointer" : "arrow")
          const rest = Math.max(b.wait ?? 1300, read(i, b))
          const linger = rest >= 2000
          let travel = 120
          if (to) {
            const was = glass
            const flight = fly(
              aim(glass, about(i, b, part, false), linger, zoom, k)
            )
            // As far as it is on the page, from where it shows now to
            // where it will.
            const far =
              Math.hypot(
                (to[0] - glass.x) * glass.z - (at[0] - was.x) * was.z,
                (to[1] - glass.y) * glass.z - (at[1] - was.y) * was.z
              ) * k
            travel = Math.max(
              flight,
              Math.round(Math.min(900, Math.max(360, 260 + far * 0.6)))
            )
            at = to
          }
          const ms = travel
          setCursor((c) => ({
            ...c,
            index: i,
            from: c.index,
            x: at[0],
            y: at[1],
            shape: to ? shape : c.shape,
            pressed: false,
            shown: c.shown || Boolean(to),
            settled: false,
            ms: to ? ms : c.ms,
            ride: false,
          }))
          if (b.say) setSay({ n: ++step, text: b.say })
          await after(travel + 80)
          if (b.click) {
            setCursor((c) => ({ ...c, pressed: true }))
            await after(140)
            setCursor((c) => ({ ...c, pressed: false }))
          }
          if (b.drag) {
            const end = measure(b.drag)
            setCursor((c) => ({ ...c, pressed: true, shape: "grab" }))
            setGhost(b.ghost ?? null)
            await after(220)
            if (end) {
              at = [end[0] + end[2] / 2, end[1] + end[3] / 2]
              setCursor((c) => ({ ...c, x: at[0], y: at[1], ms: 1000 }))
            }
            await after(1000)
            setCursor((c) => ({ ...c, pressed: false }))
            setGhost(null)
          }
          if (b.type) {
            const { key, text } = b.type
            setCursor((c) => ({ ...c, shape: "text" }))
            for (let n = 1; n <= text.length; n++) {
              setState((was) => ({ ...was, [key]: text.slice(0, n) }))
              await after(55)
            }
          }
          if (b.set) {
            const patch = b.set
            setState((was) => ({ ...was, ...patch }))
          }
          if (b.set || b.type || b.drag) {
            // Once what that did is drawn, the lens takes it in.
            await after(80)
            const again = about(i, b, b.on ? measure(b.on) : part, true)
            const flight = fly(aim(glass, again, linger, zoom, k))
            if (flight) {
              setCursor((c) => ({ ...c, ms: flight, ride: true }))
              await after(flight + 80)
            }
          }
          setCursor((c) => ({ ...c, settled: true }))
          await after(rest)
        }
        await after(1500)
        rewind()
        glass = WIDE
        setLens(WIDE)
        setState(initial)
        setSay(null)
        setCursor((c) => ({
          ...c,
          index: -1,
          from: -1,
          settled: false,
          ms: 500,
          ride: true,
        }))
        await after(900)
      }
    })()
    return () => timers.forEach(clearTimeout)
  }, [
    script,
    notes,
    paused,
    running,
    initial,
    start,
    zoom,
    k,
    setState,
    measure,
    overlays,
    rewind,
  ])
  return { cursor, lens, say, ghost }
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

/**
 * Someone else's cursor: an arrow in their color, with their name, at a
 * place in the page's pixels (theirs in the app, as the lens shows it).
 */
function PeerView({
  peer,
  at,
  sel,
  away,
  s,
}: {
  peer: PeerAt
  at: [number, number]
  sel: Rect | null
  away: boolean
  s: number
}) {
  if (!peer.shown) return null
  return (
    <>
      {sel && (
        <span
          className="pk-peer-sel"
          style={
            {
              "--peer": peer.color,
              left: Math.round(sel[0] * s),
              top: Math.round(sel[1] * s),
              width: Math.round(sel[2] * s),
              height: Math.round(sel[3] * s),
            } as React.CSSProperties
          }
        >
          <b>{peer.name}</b>
        </span>
      )}
      <span
        aria-hidden
        className="pk-peer"
        data-away={away || undefined}
        style={{ translate: `${at[0]}px ${at[1]}px` }}
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
 * The demo cursor's picture: one of the macOS cursors (public/cursors),
 * with a ring that opens where it presses. Where it is, and how it gets
 * there, is its holder's (`.pl-point`): across on one curve and down on
 * another, so it travels in a slight arc as a hand does.
 */
function CursorView({ cursor }: { cursor: Cursor }) {
  const shape = cursor.shape === "grab" ? "pointer" : cursor.shape
  return (
    <div
      aria-hidden
      className="pl-cursor"
      data-pressed={cursor.pressed ? "" : undefined}
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
          {sheet.items.map((shot, i) => {
            const k = Math.min(1, 220 / shot.w)
            return (
              <figure
                key={shot.label}
                className="pl-sheet-item"
                style={
                  {
                    width: Math.round(shot.w * k),
                    "--pl-n": Math.min(i, 8),
                  } as React.CSSProperties
                }
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

/**
 * A big change, called out on the desktop: what changed, in a list. It sits
 * in the margin beside the browser where there is room for it, and over
 * the browser's lower left corner where there is not.
 */
function ChangeCard({
  change,
  room,
  top,
  height,
  onFoot,
}: {
  change: NonNullable<Scene["change"]>
  room: number
  top: number
  height: number
  /** Told where the card's foot is, as it is drawn. */
  onFoot: (y: number) => void
}) {
  const fits = room >= CHANGE_ROOM
  const card = useRef<HTMLElement>(null)
  // It opens the scene and then leaves (Leo, 2026-11-22: "maybe it doesnt
  // need to stick around for the show, it's shown as the start"): there
  // for as long as it takes to read, then faded out and gone, the gutter
  // left to the notes.
  const letters =
    change.title.length + change.items.reduce((n, item) => n + item.length, 0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const read = window.setTimeout(() => setLeaving(true), 2400 + letters * 42)
    const out = window.setTimeout(
      () => {
        setGone(true)
        onFoot(0)
      },
      2400 + letters * 42 + 450
    )
    return () => {
      clearTimeout(read)
      clearTimeout(out)
    }
  }, [letters, onFoot])
  useLayoutEffect(() => {
    const el = card.current
    if (!el) return
    const observer = new ResizeObserver(() =>
      onFoot(el.offsetTop + el.offsetHeight)
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onFoot, top])
  if (gone) return null
  return (
    <aside
      ref={card}
      className="pl-change"
      style={
        fits
          ? {
              left: 16,
              top,
              width: Math.min(300, room - 32),
              opacity: leaving ? 0 : 1,
            }
          : // With no room beside the browser, it sits over the canvas's
            // foot, clear of the rail.
            {
              left: room + 72,
              top: top + height - 24,
              width: 280,
              translate: "0 -100%",
              zIndex: 6,
              opacity: leaving ? 0 : 1,
            }
      }
    >
      <p className="pl-change-title">{change.title}</p>
      <ul>
        {change.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  )
}

/**
 * Which version of a thing the scene shows, of the set it belongs to: the
 * set's name and every version's label, the one showing picked out. It
 * sits where the change card does, and stays for the whole of its set (the
 * stage draws it, not the scene), so the pick moves down the list as the
 * page goes through the versions.
 */
function VersionsCard({
  versions,
  room,
  top,
  height,
  onFoot,
}: {
  versions: NonNullable<Scene["versions"]>
  room: number
  top: number
  height: number
  onFoot: (y: number) => void
}) {
  const fits = room >= CHANGE_ROOM
  const card = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const el = card.current
    if (!el) return
    const observer = new ResizeObserver(() =>
      onFoot(el.offsetTop + el.offsetHeight)
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      onFoot(0)
    }
  }, [onFoot, top])
  return (
    <aside
      ref={card}
      className="pl-change pl-versions"
      style={
        fits
          ? { left: 16, top, width: Math.min(300, room - 32) }
          : {
              left: room + 72,
              top: top + height - 24,
              width: 280,
              translate: "0 -100%",
              zIndex: 6,
            }
      }
    >
      <p className="pl-change-title">{versions.title}</p>
      <ol>
        {versions.labels.map((label, i) => (
          <li
            key={label}
            aria-current={i === versions.at ? "true" : undefined}
            data-dim={
              versions.at !== undefined && i !== versions.at ? "" : undefined
            }
          >
            {label}
          </li>
        ))}
      </ol>
    </aside>
  )
}
