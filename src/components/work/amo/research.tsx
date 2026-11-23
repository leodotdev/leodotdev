import { useDriftStrip } from "@/components/work/claude/media"

// /work/amo's research: the pieces of the project's FigJam board, redrawn
// in HTML, CSS, and SVG (`.amor-*` in src/amo.css), set side by side in one
// strip that scrolls sideways, at the top of the overview where the other
// projects have their clips (Leo, 2026-11-23: "research can be in overview
// where the videos would be, all one h section"; it was a tab of chapters
// for an hour). The words on the notes and beside the drawings are the
// board's own, Leo's. The board's "Inspiration" is other people's posts
// about the Contacts app; they are retold here by what each wished for,
// without their names or their words.

/** A piece of the board: a tile of the strip, on FigJam's white. */
function Board({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  return (
    <li className="amor-tile" aria-label={name}>
      <span aria-hidden className="amor-tile-name">
        {name}
      </span>
      {children}
    </li>
  )
}

// The strip's tiles, in the board's order. "Today" is the Contacts app as
// it is; "Next" is Leo's proposal (Leo, 2026-11-23).
const TILES: Array<{ id: string; Tile: () => React.ReactNode }> = [
  { id: "notes", Tile: NotesSticky },
  { id: "today", Tile: () => <AppMap /> },
  { id: "next", Tile: () => <AppMap next /> },
  { id: "degrees", Tile: Degrees },
  { id: "sketch", Tile: Sketch },
  { id: "inspiration", Tile: Wishes },
  { id: "principle", Tile: Principle },
]

/**
 * The research, in one row as wide as the window, which behaves as the
 * other projects' strips of clips do (`useDriftStrip`; Leo, 2026-11-23): it
 * drifts sideways slowly, takes a touch, a trackpad, or a drag and a throw
 * with the mouse, and is endless both ways. The drift stops under the
 * pointer, so a tile can be read.
 */
export function ResearchStrip() {
  const { strip, items } = useDriftStrip(TILES)
  return (
    <figure className="mb-12 flex flex-col gap-3">
      <ul
        ref={strip}
        aria-label="Research"
        tabIndex={0}
        className="amor-strip bleed scrollbar-hide flex cursor-grab gap-3 overflow-x-auto select-none data-[dragging]:cursor-grabbing"
      >
        {items.map(({ id, Tile }) => (
          <Tile key={id} />
        ))}
      </ul>
      <figcaption className="text-xs text-muted-foreground">
        Research, from the project’s FigJam board
      </figcaption>
    </figure>
  )
}

/** "Notes after using my iOS Contacts app". */
function NotesSticky() {
  return (
    <Board name="Notes">
      <div className="amor-sticky">
        <p>Notes after using my iOS Contacts app:</p>
        <ul>
          <li>
            More relevant, recent, fresh info here would be fun
            <ul>
              <li>
                Let people pick the flood of info: s, m, l
                <ul>
                  <li>S = same as today</li>
                  <li>M = last thread</li>
                  <li>L = recent threads</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            I wish I could quickly tap and see people close to me, like from
            nuclear/extended fam/friends → to the next degree of connections
            (work) → to the next degree → and so on
            <ul>
              <li>Slider?</li>
            </ul>
          </li>
          <li>
            Search
            <ul>
              <li>
                focus state could show most recent, suggested based on Mail,
                Calendar, Location, etc.
              </li>
              <li>search results should sort by relevancy (most contacted)</li>
              <li>going back to focus search state is nice</li>
            </ul>
          </li>
        </ul>
        <small>Leo</small>
      </div>
    </Board>
  )
}

const TONES = {
  green: "#aff4c6",
  blue: "#bde3ff",
  red: "#ffc7c2",
  orange: "#fcd19c",
  yellow: "#ffe8a3",
  violet: "#e4ccff",
  gray: "#e6e6e6",
}

const APPS: Array<[string, string]> = [
  ["Phone", TONES.green],
  ["Contacts", TONES.blue],
  ["Social", TONES.red],
  ["Productivity", TONES.orange],
  ["Games", TONES.yellow],
  ["System, Etc.", TONES.gray],
]
const CHANNELS: Array<[string, string, boolean]> = [
  ["Calls, Messages", TONES.red, false],
  ["FaceTime", TONES.violet, false],
  ["WhatsApp", TONES.blue, true],
  ["Signal, Telegram", TONES.green, true],
  ["DMs, Threads", TONES.yellow, true],
]

// The map is laid out to the pixel, so its lines can be: the apps' middles
// down the left, and the channels' down the right, a little lower.
const LEFT = [26, 92, 158, 224, 290, 356]
const RIGHT = [116, 182, 248, 314, 380]
const curve = (y1: number, y2: number, x1 = 148, x2 = 232) =>
  `M${x1} ${y1} C${x1 + 52} ${y1} ${x2 - 52} ${y2} ${x2} ${y2}`
/** A line round the left of the apps, into Contacts. */
const into = (y: number, out: number) =>
  `M0 ${y} C${-out} ${y} ${-out} ${LEFT[1]} -3 ${LEFT[1]}`

/**
 * How apps reach people: today, in the Contacts app as it is, and next, in
 * the proposal, with Contacts as the hub the others come to.
 */
function AppMap({ next }: { next?: boolean }) {
  return (
    <Board
      name={next ? "Next: my proposal" : "Today: the current Contacts app"}
    >
      <div
        className="amor-map-title"
        style={
          {
            "--amor-tone": next ? TONES.blue : TONES.violet,
          } as React.CSSProperties
        }
      >
        {next ? "Next" : "Today"}
      </div>
      <div className="amor-map" style={{ marginLeft: next ? 72 : 0 }}>
        <svg aria-hidden>
          <path d={`M148 ${LEFT[0]} H290 Q306 ${LEFT[0]} 306 42 V90`} />
          {next ? (
            <>
              <path d={curve(LEFT[1], RIGHT[0])} />
              <path d={curve(LEFT[1], RIGHT[1])} />
              <g stroke="#14ae5c">
                <path d={curve(LEFT[1], RIGHT[2])} />
                <path d={curve(LEFT[1], RIGHT[3])} />
                <path d={curve(LEFT[1], RIGHT[4])} />
              </g>
              <g stroke="#0d99ff">
                <path d={into(LEFT[0], 34)} />
                <path d={into(LEFT[2], 34)} />
                <path d={into(LEFT[3], 54)} />
                <path d={into(LEFT[4], 74)} />
                <path
                  d={`M-12 ${LEFT[1] - 8} L-2 ${LEFT[1]} L-12 ${LEFT[1] + 8}`}
                />
              </g>
              <text x="196" y={LEFT[1] + 2}>
                Same
              </text>
              <text x="186" y={RIGHT[3] - 28}>
                New
              </text>
            </>
          ) : (
            <>
              <path d={curve(LEFT[1], RIGHT[0])} />
              <path d={curve(LEFT[1], RIGHT[1])} />
              <path d={curve(LEFT[2], RIGHT[4])} />
              <path d={curve(LEFT[3], RIGHT[4])} />
            </>
          )}
          <path
            strokeDasharray="6 6"
            d={RIGHT.slice(2)
              .map((y) => `M384 ${y} H402`)
              .join(" ")}
          />
        </svg>
        <div>
          {APPS.map(([name, tone]) => (
            <span
              key={name}
              className="amor-node"
              data-hub={(next && name === "Contacts") || undefined}
              style={{ "--amor-tone": tone } as React.CSSProperties}
            >
              {name}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 90 }}>
          {CHANNELS.map(([name, tone, own]) => (
            <span
              key={name}
              className="amor-node"
              data-outline
              style={{ "--amor-tone": tone } as React.CSSProperties}
            >
              {name}
              {own && <em>{next ? "C" : "Contacts"}</em>}
            </span>
          ))}
        </div>
      </div>
    </Board>
  )
}

// People as bubbles: where each sits in its box, and how large (percent).
const BUBBLES: Array<Array<[x: number, y: number, d: number]>> = [
  [
    [2, 4, 26],
    [36, 2, 17],
    [62, 0, 9],
    [78, 2, 26],
    [22, 24, 26],
    [54, 18, 17],
    [10, 44, 9],
    [44, 58, 9],
    [70, 34, 26],
  ],
  [
    [4, 2, 17],
    [26, 12, 9],
    [40, 2, 9],
    [82, 2, 17],
    [30, 26, 17],
    [58, 26, 9],
    [8, 44, 9],
    [90, 34, 9],
  ],
  [
    [0, 20, 9],
    [8, 16, 17],
    [30, 16, 9],
    [60, 16, 9],
    [72, 6, 9],
    [64, 50, 9],
    [78, 50, 9],
    [90, 16, 9],
  ],
]
const RINGS: Array<
  [tone: string, height: number, left: string, right: string]
> = [
  [
    "#fcd19c",
    190,
    "degrees: close, fam and friends…",
    "people have gravity, matter",
  ],
  [
    "#ffc7c2",
    128,
    "…friends and work…",
    "they should also orbit each other based upon affiliation",
  ],
  [
    "#bde3ff",
    64,
    "…work and services, businesses, etc…",
    "size = amount contacted? amount profile visited?",
  ],
]

/** Degrees: the sketch of rings round the phone, and its wireframe. */
function Degrees() {
  return (
    <Board name="Degrees">
      <svg
        className="amor-sketch"
        width="280"
        height="340"
        viewBox="0 0 280 340"
        role="img"
        aria-label="A sketch: three rings spreading out from a phone full of people."
      >
        <path d="M150 6c82 4 128 62 124 138-4 70-52 122-128 124C68 270 8 222 6 150 4 76 62 2 150 6Z" />
        <path d="M148 52c54 2 84 40 82 92-2 48-34 84-84 84-52 0-90-36-90-86 0-52 36-92 92-90Z" />
        <path d="M146 96c30 0 50 22 48 50-2 28-22 44-50 44-28 0-48-18-48-46 0-28 20-48 50-48Z" />
        <path d="M112 334V124c0-8 4-10 12-10h44c8 0 12 2 12 10v210" />
        <path d="M112 132h68" />
        {[
          [126, 168, 5],
          [146, 162, 6],
          [166, 170, 4],
          [136, 184, 7],
          [158, 186, 5],
          [124, 204, 4],
          [146, 208, 6],
          [168, 206, 4],
          [132, 226, 5],
          [156, 228, 7],
          [172, 240, 4],
        ].map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} strokeWidth="2.5" />
        ))}
        <g className="amor-ink" strokeWidth="3">
          <path d="M100 176l-10-6m10 6l-4 10M192 176l10-8m-10 8l2 10" />
          <path d="M92 206l-14 2m14-2l-8 10M198 206l14-4m-14 4l10 8" />
          <path d="M84 244l-16-2m16 2l-10 8M204 244l16-6m-16 6l12 6" />
        </g>
      </svg>

      <div className="amor-wire">
        <div className="amor-labels amor-ink text-end">
          <span style={{ height: 64 }} />
          {RINGS.map(([, height, left]) => (
            <span key={left} className="justify-end" style={{ height }}>
              {left}
            </span>
          ))}
          <span className="justify-end" style={{ height: 44 }}>
            …misc…
          </span>
          <span className="justify-end" style={{ height: 40 }}>
            search
          </span>
        </div>
        <div className="amor-wire-phone">
          <div
            className="amor-box flex items-center gap-3 px-2"
            style={
              { "--amor-tone": "#ffe8a3", height: 52 } as React.CSSProperties
            }
          >
            <i className="!static h-8 w-8" />
            Me
          </div>
          {RINGS.map(([tone, height], r) => (
            <div
              key={tone}
              className="amor-box"
              style={{ "--amor-tone": tone, height } as React.CSSProperties}
            >
              {BUBBLES[r].map(([x, y, d]) => (
                <i
                  key={`${x}-${y}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${d}%`,
                    aspectRatio: "1",
                  }}
                />
              ))}
            </div>
          ))}
          <div
            className="amor-box border-0"
            style={
              { "--amor-tone": "#b3b3b3", height: 32 } as React.CSSProperties
            }
          >
            {[6, 24, 40, 54, 30, 48].map((x, i) => (
              <i
                key={i}
                style={{
                  left: `${x}%`,
                  top: i > 3 ? 16 : 0,
                  width: 14,
                  height: 14,
                }}
              />
            ))}
          </div>
          <div className="h-7 bg-[#e6e6e6]" />
        </div>
        <div className="amor-labels amor-ink">
          <span style={{ height: 64 }} />
          {RINGS.map(([, height, , right]) => (
            <span key={right} style={{ height }}>
              {right}
            </span>
          ))}
          <span style={{ height: 44 }} />
          <span style={{ height: 40 }} />
        </div>
      </div>
    </Board>
  )
}

/** A scribbled line of writing: `n` humps from a point. */
const squiggle = (x: number, y: number, n = 4) =>
  `M${x} ${y}${"q5 -12 9 0t9 0".repeat(n)}`

/** The first sketch of the list, with the board's notes round it. */
function Sketch() {
  return (
    <Board name="Sketch">
      <svg
        className="amor-sketch"
        width="860"
        viewBox="0 0 900 470"
        role="img"
        aria-label="A sketch of the contacts list: a search field, a slider of degrees, contacts with their recent cards, and notes on each part."
      >
        {/* The phone. */}
        <path d="M262 28h204M258 24v390M470 24v390M256 52h216M256 414h216" />
        <path d="M446 62v22M435 73h22" />
        <text
          x="276"
          y="118"
          style={{ fill: "#1e1e1e", font: "700 34px var(--font-sans)" }}
        >
          Contacts
        </text>
        <path d="M278 134c60-4 110-2 156-2 8 0 8 22 0 22-48 2-104 4-156 2-8 0-8-22 0-22Z" />
        <circle cx="290" cy="145" r="4" />
        <circle cx="454" cy="143" r="9" />
        <path d="M449 141h10M449 146h10" strokeWidth="2.5" />
        {/* The slider of degrees. */}
        <path d="M286 182h64M394 180h60" />
        <circle cx="286" cy="182" r="5" fill="#1e1e1e" />
        <circle cx="424" cy="180" r="6" fill="#1e1e1e" />
        {/* A contact with cards. */}
        <circle cx="296" cy="226" r="16" />
        <circle cx="296" cy="221" r="5" />
        <path d="M286 236c4-8 16-8 20 0" />
        <path d={squiggle(324, 222)} />
        <path d="M324 236h30" />
        <path
          d="M416 212h8v8h-8zM434 212h8v8h-8zM452 212h8v8h-8z"
          strokeWidth="3"
        />
        <path d="M318 252h40v36h-40zM372 250l34-4 2 38-34 2zM418 250h52M418 250v36h52" />
        <path d="M380 262h18M380 270h18M380 278h12" strokeWidth="2.5" />
        <circle cx="456" cy="260" r="5" />
        <path d="M422 284l18-18 12 10 18-14" />
        <path d="M288 314c60-2 120-4 180-6" />
        {/* A plain contact. */}
        <circle cx="300" cy="344" r="14" />
        <circle cx="300" cy="340" r="4" />
        <path d="M292 353c3-6 13-6 16 0" />
        <path d={squiggle(322, 336, 3)} />
        <path d="M322 350h14M444 330h8v8h-8z" />
        <path d="M290 372c60-2 124-6 180-10" />
        {/* The next, cut off. */}
        <path d="M286 414c0-22 34-22 36 0" />
        <circle cx="304" cy="400" r="5" />
        <path d={squiggle(330, 392)} />
        <path d="M420 386h8v8h-8zM446 386h8v8h-8z" />

        {/* The notes. */}
        <g className="amor-ink" strokeWidth="3">
          <path d="M482 72c50 0 50-58 96-58M568 6l12 8-12 8" />
          <path d="M478 124c16-14 28-20 40-22M508 96l12 6-8 10" />
          <path d="M484 172c30-14 46-22 64-26M538 140l12 6-8 10" />
          <path d="M480 212c26-8 44-12 64-14M534 192l12 6-8 10" />
          <path d="M486 258h30M508 250l10 8-10 8" />
          <path d="M482 330c56 0 50 86 100 86M572 408l12 8-12 8" />
          <path d="M244 180h-22M232 172l-10 8 10 8" />
        </g>
        <text x="596" y="20">
          new…
        </text>
        <text x="532" y="104">
          filter
        </text>
        <text x="562" y="150">
          views: list, card, feed?
        </text>
        <text x="560" y="200">
          most used
        </text>
        <text x="532" y="264">
          scroll?
          <tspan x="560" dy="28">
            (no… should only be
          </tspan>
          <tspan x="574" dy="26">
            1 item @ this level)
          </tspan>
        </text>
        <text x="600" y="412">
          some contacts are plain, meaning
          <tspan x="600" dy="26">
            maybe only 1 suggested action, no
          </tspan>
          <tspan x="600" dy="26">
            recent threads, no integrations per se
          </tspan>
        </text>
        <text x="210" y="160" textAnchor="end">
          degrees of
          <tspan x="210" dy="26">
            separation
          </tspan>
          <tspan x="210" dy="38">
            default: All
          </tspan>
        </text>
      </svg>
    </Board>
  )
}

// What people asked of the Contacts app, in the posts the board collects:
// each retold by its wish, with where it was posted.
const WISHES: Array<[wish: string, where: string]> = [
  ["A list of the numbers saved most recently.", "Twitter"],
  ["Contacts sorted by when each was last used.", "Twitter"],
  ["An easy way to add a note to a contact.", "Twitter"],
  ["Making a contact by pasting in all of its details at once.", "Twitter"],
  ["Profile pictures in the list itself.", "Mastodon"],
  ["Links from a contact to all of their other accounts.", "Twitter"],
  ["Help with texting people back, and keeping up relationships.", "Twitter"],
  ["Products that stop assuming every contact is a friend.", "Mastodon"],
]

/** Inspiration: what people wished the Contacts app did. */
function Wishes() {
  return (
    <Board name="Inspiration">
      <div className="amor-wishes">
        {WISHES.map(([wish, where]) => (
          <div key={wish} className="amor-wish">
            {wish}
            <small>A wish posted on {where}</small>
          </div>
        ))}
      </div>
    </Board>
  )
}

/** The principle: "Follow Apple's HIG." */
function Principle() {
  return (
    <Board name="Principle">
      <div className="amor-sticky" data-tone="yellow">
        <p>Follow Apple’s HIG.</p>
        <p>
          Instead of new interface everyone has to learn and remember nuances
          and quirks, completely lean into iOS.
        </p>
        <p style={{ margin: 0 }}>Make it the new native iOS Contacts app.</p>
        <small>Leo</small>
      </div>
    </Board>
  )
}
