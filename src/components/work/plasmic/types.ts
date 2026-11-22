// The shape of /work/plasmic's story: years (the tabs), each a run of dives
// (the chapter bar), each a run of scenes the stage plays as the page
// scrolls. A scene is the studio rebuilt in HTML (the kit), drawn from a
// small state its script changes. Places are the app's own pixels (1440
// wide), or the name of a part (`data-pk`), measured where it is drawn.

/** A box in the app: left, top, width, height. */
export type Rect = [x: number, y: number, w: number, h: number]

/** A point in the app. */
export type Point = [x: number, y: number]

/** A part of the app by its `data-pk` name, or a box. */
export type Anchor = string | Rect

export type Side = "left" | "right" | "top" | "bottom"

export type State = Record<string, string | number | boolean | undefined>

/**
 * An annotation pinned to a part. A `direction` is a path the design took,
 * branched, revisited, or left (a north star shelved like a concept car).
 * A `concept` says how Plasmic works. A `discovery` is what was learned.
 */
export type Note = {
  kind: "direction" | "concept" | "discovery"
  /**
   * What the note is of, in a few words: its part or its subject ("Base
   * variant", "Recording pill"). The card's title (Leo, 2026-11-22: a
   * title says what the note is about, not which kind it is; the kind is
   * its color).
   */
  title: string
  on: Anchor
  text: string
  side?: Side
  /**
   * The beats of the script it shows during (the cursor pointing at its
   * part); without one it shows for the whole scene.
   */
  beat?: number | Array<number>
}

/** One move of the demo cursor. */
export type Beat = {
  /** The part to go to (its middle, or `at`, a fraction of its box). */
  on?: string
  at?: [number, number]
  /** Or a point in the app. */
  to?: Point
  shape?: "arrow" | "pointer" | "text" | "grab"
  /** Presses where it lands. */
  click?: boolean
  /** Drags from where it is to this part, carrying `ghost`. */
  drag?: string
  ghost?: string
  /** Types `text` into the state's `key`, a letter at a time. */
  type?: { key: string; text: string }
  /** What changes once it gets there (after a click, a drop, or typing). */
  set?: State
  /** A step of a workflow, said as it happens. */
  say?: string
  /** How long it stays, in ms, before the next beat. */
  wait?: number
}

/** A design shown on its own (a version, a state), at its own size. */
export type Shot = {
  label: string
  w: number
  h: number
  view: () => React.ReactNode
  notes?: Array<Note>
}

/**
 * Versions of one thing, set out inline after the scene that names them
 * (./inline.tsx): whole-app versions a scene each, strips stacked in one,
 * smaller pieces in the scene's sheet. `label` and `on` name the set and
 * its part.
 */
export type Explore = {
  label: string
  on: Anchor
  title: string
  items: Array<Shot>
}

/** One of a set of versions (or, with no `at`, all of them at once). */
export type Versions = { title: string; labels: Array<string>; at?: number }

/** A whole feature's states, inline: a window beside the browser. */
export type Sheet = { title: string; items: Array<Shot> }

/** A big change, called out: what was there before, and what changed. */
export type Change = {
  from: (s: State) => React.ReactNode
  title: string
  items: Array<string>
}

/**
 * Someone else in the project (Plasmic was multiplayer): their own cursor,
 * named in their color, going through their own beats alongside the demo
 * cursor; a beat's `on` part shows as selected by them while they are on it.
 */
export type Peer = {
  name: string
  color: string
  script: Array<Beat & { select?: boolean }>
}

export type Scene = {
  view: (s: State) => React.ReactNode
  state?: State
  url?: string
  notes?: Array<Note>
  script?: Array<Beat>
  explore?: Explore
  versions?: Versions
  sheet?: Sheet
  change?: Change
  peers?: Array<Peer>
  /** How many steps of scrolling the scene takes (1 by default). */
  span?: number
}

export type Dive = {
  slug: string
  title: string
  summary: string
  scenes: Array<Scene>
}

export type Year = {
  slug: string
  name: string
  summary: string
  dives: Array<Dive>
}
