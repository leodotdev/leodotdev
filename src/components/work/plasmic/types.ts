// The shape of /work/plasmic's story: years (the tabs), each a run of dives
// (the chapter bar), each a run of scenes the stage plays as the page
// scrolls. Every place on a frame is in the app's own pixels: a frame is the
// Plasmic app as designed, 1440 wide, under the browser's bar.

/** A box on a frame: left, top, width, height. */
export type Rect = [x: number, y: number, w: number, h: number]

/** A point on a frame. */
export type Point = [x: number, y: number]

export type Side = "left" | "right" | "top" | "bottom"

/**
 * An annotation pinned to a part of the frame. A `decision` is a redline:
 * what was being weighed there, in the file's own words where it has them.
 * A `concept` says how Plasmic works, so the story of the product reads
 * alongside the story of its design.
 */
export type Note = {
  kind: "decision" | "concept"
  at: Rect
  text: string
  /** Which side of the box the note sits on; by default the roomier one. */
  side?: Side
  /** Shows from this beat of the scene's script on (from the start if unset). */
  from?: number
}

/** One move of the demo cursor. */
export type Beat = {
  to: Point
  shape?: "arrow" | "pointer" | "text"
  /** Presses where it lands. */
  click?: boolean
  /** The frame the app shows once the cursor gets there (after a click). */
  frame?: string
  /** How long it stays, in ms, before the next beat. */
  wait?: number
}

/** A place the visitor's own pointer can hover, to see the frame for it. */
export type Hot = { at: Rect; frame: string }

/** A design shown on its own: a panel's state, a version of a part. */
export type Shot = {
  /** An image in the year's folder, without its extension. */
  src: string
  label: string
  /** Its size as designed. */
  w: number
  h: number
  notes?: Array<Note>
}

/** Versions of one thing, highlighted in place and opened in a lightbox. */
export type Explore = {
  /** On the badge, e.g. "13 top bars". */
  label: string
  at: Rect
  title: string
  items: Array<Shot>
}

/**
 * A deep look at a whole feature, shown inline: a window on the desktop
 * beside the browser, its states passing as the page scrolls.
 */
export type Sheet = { title: string; items: Array<Shot> }

/** A big change, called out: the app before, and what changed. */
export type Change = {
  /** The frame the browser shows before the change plays. */
  from: string
  title: string
  items: Array<string>
}

export type Scene = {
  /** The app's frame: an image in the year's folder, without its extension. */
  frame: string
  /** The frame's height as designed, if taller than the window (945). */
  height?: number
  /** The browser's address. */
  url?: string
  /** A line for the scene, shown with it: what the file calls this state. */
  caption?: string
  notes?: Array<Note>
  script?: Array<Beat>
  hot?: Array<Hot>
  explore?: Explore
  sheet?: Sheet
  change?: Change
  /** How many steps of scrolling the scene takes (1 unless it has a sheet). */
  span?: number
}

export type Dive = {
  slug: string
  title: string
  /** A line on what the dive covers. */
  summary: string
  scenes: Array<Scene>
}

export type Year = {
  slug: string
  name: string
  summary: string
  dives: Array<Dive>
}
