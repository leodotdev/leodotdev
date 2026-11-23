import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  TbAdjustmentsHorizontal,
  TbArrowBigUp,
  TbArrowsDiagonal,
  TbAsterisk,
  TbBackspace,
  TbChevronDown,
  TbChevronLeft,
  TbChevronRight,
  TbCompass,
  TbCurrencyDollar,
  TbId,
  TbList,
  TbMail,
  TbMessageCircle,
  TbMessageQuestion,
  TbMicrophone,
  TbMoodSmile,
  TbPhone,
  TbPlus,
  TbSearch,
  TbStar,
  TbStarFilled,
  TbTrash,
  TbUpload,
  TbUsers,
  TbVideo,
  TbX,
} from "react-icons/tb"
import {
  C,
  CARDS,
  LISTS,
  MEMBERS,
  REACH,
  SECTIONS,
} from "@/components/work/amo/data"
import type { Action, Card, Contact } from "@/components/work/amo/data"
import type { IconType } from "react-icons"

// /work/amo's screens, rebuilt in HTML and CSS from the Figma file
// (amo-2023): an iPhone with the Contacts app of the exploration in it, each
// screen a small working copy. The styles are `.amo-*` in src/amo.css. The
// type is the system's own (San Francisco on an Apple device), since the
// point of the exploration is to "completely lean into iOS". The pictures
// are the file's own, exported from it (Leo, 2026-11-23: "take the exact
// ones from the figma"): the device, the home screen, the contacts'
// pictures, what their cards show, the apps' icons, and the status bar's
// levels, in public/work/amo. The file's row icons are SF Symbols set as
// type, which cannot be exported as pictures: those are Tabler's.

const ASSETS = "/work/amo"

/** A phone, under the name the file gives its screen. */
export function Phone({
  id,
  lead,
  name,
  children,
}: {
  /** What a demo cursor's steps find it by (`[data-phone="…"]`). */
  id: string
  /** The light first line of a two-line name ("Landing:"). */
  lead?: string
  name: string
  children: React.ReactNode
}) {
  return (
    <div className="amo-shot" data-phone={id}>
      <div className="amo-shot-name">
        {lead && <span>{lead}</span>}
        <strong>{name}</strong>
      </div>
      <div className="amo-phone">
        <div className="amo-screen">{children}</div>
        {/* The file's device, an iPhone 15 Pro in Black Titanium, over the
            screen: its glass is clear, and the island is part of it. */}
        <img
          className="amo-bezel"
          src={`${ASSETS}/iphone-15-pro.webp`}
          alt=""
          draggable={false}
        />
      </div>
    </div>
  )
}

function StatusBar({ light }: { light?: boolean }) {
  return (
    <div className="amo-status" data-light={light || undefined}>
      <span>9:41</span>
      <img
        src={`${ASSETS}/levels-${light ? "light" : "dark"}.svg`}
        alt=""
        width={143}
        height={54}
        draggable={false}
      />
    </div>
  )
}

/**
 * The home screen, as the file has it: iOS's own, with Contacts among the
 * apps. It is one picture; the Contacts icon, which Leo fine-tuned for
 * this, has a button over it. Pressed, the app opens as an app does on iOS
 * (Leo, 2026-11-23): it grows out of its icon to fill the screen while the
 * home screen behind it pulls forward, and its contacts arrive a moment
 * after it has (placeholders stand in for them meanwhile); the home
 * indicator sends it back into the icon. The demo cursor opens it early in its script and quits it
 * at the end, before starting over.
 */
export function HomeScreen() {
  const [open, setOpen] = useState(false)
  // The app has only just opened: its contacts are still to come.
  const [loading, setLoading] = useState(true)
  const arriving = useRef(0)
  useEffect(() => () => window.clearTimeout(arriving.current), [])
  const launch = () => {
    setOpen(true)
    setLoading(true)
    window.clearTimeout(arriving.current)
    arriving.current = window.setTimeout(() => setLoading(false), 1300)
  }
  return (
    <div className="amo-home" data-open={open || undefined}>
      <img
        src={`${ASSETS}/home.webp`}
        alt="The iOS home screen, with Contacts in the fifth row of apps."
        draggable={false}
      />
      <button
        type="button"
        data-app="Contacts"
        aria-label="Open Contacts"
        aria-expanded={open}
        onClick={launch}
      />
      <div className="amo-launch" inert={!open}>
        <ContactsScreen view="card" back loading={loading} />
        {/* The icon it grows out of, and shrinks back into: cut from the
            home screen's picture, wallpaper and all, so it lies exactly
            over the icon there. */}
        <img
          aria-hidden
          className="amo-launch-icon"
          src={`${ASSETS}/contacts-icon-home.webp`}
          alt=""
          draggable={false}
        />
        <button
          type="button"
          className="amo-home-go"
          aria-label="Go to the Home Screen"
          aria-expanded={open}
          onClick={() => setOpen(false)}
        />
      </div>
    </div>
  )
}

const LIST_ICONS: Record<string, IconType> = {
  people: TbUsers,
  star: TbStar,
  unknown: TbMessageQuestion,
  unread: TbMessageCircle,
  trash: TbTrash,
}

/**
 * Lists: iCloud's, the person's own groups, and the suggested ones. A list
 * pressed pushes its contacts in from the right, as iOS does, over the
 * lists sliding a little way off; "Lists" in its bar goes back (Leo,
 * 2026-11-23: the cursor opens a few lists briefly, one after another).
 */
export function ListsScreen() {
  // The list open, and the one drawn: the last stays drawn while it slides
  // back out, then is taken away.
  const [open, setOpen] = useState<string | null>(null)
  const [drawn, setDrawn] = useState<string | null>(null)
  const turn = useRef(0)
  const push = (name: string) => {
    turn.current++
    setDrawn(name)
    setOpen(name)
  }
  const pop = () => {
    const mine = ++turn.current
    setOpen(null)
    window.setTimeout(() => {
      if (turn.current === mine) setDrawn(null)
    }, 450)
  }
  return (
    <div className="amo-stack" data-pushed={open ? "" : undefined}>
      <div className="amo-app amo-stack-root" data-ground inert={Boolean(open)}>
        <StatusBar />
        <div className="amo-bar">
          <span className="amo-link">Edit</span>
          <span className="amo-link">Add List</span>
        </div>
        <h4 className="amo-large">Lists</h4>
        <div className="amo-groups">
          {LISTS.map((group, g) => (
            <section key={g} data-group={group.title ?? group.rows[0][1]}>
              {group.title && <h5>{group.title}</h5>}
              <div className="amo-inset">
                {group.rows.map(([icon, name, count]) => {
                  const Icon = LIST_ICONS[icon] as IconType | undefined
                  return (
                    <button
                      key={name}
                      type="button"
                      className="amo-inset-row"
                      data-list={name}
                      onClick={() => push(name)}
                    >
                      <span className="amo-inset-icon">
                        {Icon ? <Icon aria-hidden /> : icon}
                      </span>
                      <span className="amo-grow">{name}</span>
                      {count && <span className="amo-dim">{count}</span>}
                      <TbChevronRight aria-hidden className="amo-chevron" />
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="amo-stack-top" inert={!open}>
        {drawn && (
          <ContactsScreen
            key={drawn}
            view="card"
            title={drawn}
            only={MEMBERS[drawn]}
            onBack={pop}
          />
        )}
      </div>
    </div>
  )
}

const ACTIONS: Record<Action, [IconType, string]> = {
  message: [TbMessageCircle, "Message"],
  call: [TbPhone, "Call"],
  video: [TbVideo, "Video"],
  map: [TbCompass, "Directions"],
  share: [TbUpload, "Share"],
  star: [TbAsterisk, "Important"],
}

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")

function Avatar({ contact }: { contact: Contact }) {
  return (
    <span
      className="amo-avatar"
      style={contact.photo ? undefined : { background: contact.tint }}
    >
      {contact.photo ? (
        <img
          src={`${ASSETS}/avatars/${contact.photo}.webp`}
          alt=""
          draggable={false}
        />
      ) : (
        initials(contact.name)
      )}
      {contact.badge && (
        <b data-tone={contact.badge.tone}>{contact.badge.count}</b>
      )}
    </span>
  )
}

/** A contact's name, the part matching a search set heavier. */
function Name({ contact, match }: { contact: Contact; match?: string }) {
  const { name, strong } = contact
  if (match) {
    const at = name.toLowerCase().indexOf(match.toLowerCase())
    if (at >= 0)
      return (
        <span className="amo-name" data-search>
          {name.slice(0, at)}
          <b>{name.slice(at, at + match.length)}</b>
          {name.slice(at + match.length)}
        </span>
      )
  }
  const at = strong ? name.lastIndexOf(strong) : -1
  return (
    <span className="amo-name">
      {at > 0 ? name.slice(0, at) : ""}
      <b>{at >= 0 ? name.slice(at) : name}</b>
    </span>
  )
}

function Row({
  contact,
  match,
  children,
}: {
  contact: Contact
  match?: string
  children?: React.ReactNode
}) {
  const meta = [contact.role, contact.degree].filter(Boolean)
  return (
    <div
      className="amo-row"
      data-contact={contact.name}
      data-business={contact.business || undefined}
    >
      <Avatar contact={contact} />
      <div className="amo-row-main">
        <div className="amo-row-top">
          <span className="amo-grow">
            <Name contact={contact} match={match} />
            <span className="amo-meta">
              {meta.join(" · ")}
              {contact.state && (
                <>
                  {meta.length > 0 && " · "}
                  <em data-state={contact.state}>{contact.state}</em>
                </>
              )}
              {contact.aside && ` · ${contact.aside}`}
            </span>
          </span>
          {contact.actions.map((action) => {
            const [Icon, label] = ACTIONS[action]
            return (
              <Icon
                key={action}
                aria-label={label}
                className="amo-action"
                data-action={action}
              />
            )
          })}
          <TbChevronRight aria-hidden className="amo-chevron" />
        </div>
        {children}
      </div>
    </div>
  )
}

const AppIcon = ({ app }: { app: string }) => (
  <img
    className="amo-app-icon"
    src={`${ASSETS}/apps/${app}.webp`}
    alt=""
    draggable={false}
  />
)

// How far apart a fan's cards sit, in pixels: less than a card is wide, so
// the next ones show from behind the first.
const FAN_STEP = 104

/**
 * Several pictures a contact shared together, as the file draws them (Leo,
 * 2026-11-23): a fan of cards, the first straight and the rest leaning out
 * from behind it, which scrolls sideways. The card that snaps into place
 * straightens as it comes, and the ones either side lean away from it. A
 * press on a card that is leaning brings it round.
 */
function PhotoFan({ card }: { card: Extract<Card, { kind: "photo" }> }) {
  const fan = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = fan.current
    if (!el) return
    let frame = 0
    // Each card leans by how far it is from the place a card snaps to.
    const lean = () => {
      frame = 0
      // (A card's slot keeps still, so the places the row snaps to do
      // not move as the cards turn; the card inside it leans.)
      Array.from(el.children).forEach((slot, i) => {
        const d = Math.max(-2, Math.min(2, i - el.scrollLeft / FAN_STEP))
        const face = slot.firstElementChild as HTMLElement | null
        if (!face) return
        face.style.rotate = `${(d * 7).toFixed(2)}deg`
        face.style.scale = String(1 - Math.min(1, Math.abs(d)) * 0.05)
        ;(slot as HTMLElement).style.zIndex = String(
          10 - Math.round(Math.abs(d) * 2)
        )
      })
    }
    const queue = () => {
      frame ||= requestAnimationFrame(lean)
    }
    lean()
    el.addEventListener("scroll", queue, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("scroll", queue)
    }
  }, [])
  return (
    <div ref={fan} className="amo-fan" role="group" aria-label="Pictures">
      {card.pictures.map((picture, i) => (
        <span key={picture} className="amo-fan-slot">
          <button
            type="button"
            className="amo-card-face"
            aria-label={`Picture ${i + 1} of ${card.pictures.length}`}
            onClick={() =>
              fan.current?.scrollTo({ left: i * FAN_STEP, behavior: "smooth" })
            }
          >
            <img
              className="amo-card-picture"
              src={`${ASSETS}/media/${picture}.webp`}
              alt=""
              draggable={false}
            />
            <span className="amo-card-text">{card.text}</span>
            <span className="amo-card-foot">
              <AppIcon app={card.app} />
              <span>{card.when}</span>
            </span>
          </button>
        </span>
      ))}
    </div>
  )
}

/** What was last shared with a contact, under their row in the card view. */
function MediaCard({ card }: { card: Card }) {
  if (card.kind === "photo") return <PhotoFan card={card} />
  return (
    <div className="amo-card" data-kind={card.kind}>
      <div className="amo-card-face">
        {card.kind === "video" && (
          <img
            className="amo-card-picture"
            data-kind={card.kind}
            src={`${ASSETS}/media/${card.picture}.webp`}
            alt=""
            draggable={false}
          />
        )}
        <span className="amo-card-text">{card.text}</span>
        {card.kind === "music" && (
          <span className="amo-card-text">{card.sub}</span>
        )}
        <span className="amo-card-foot">
          <AppIcon app={card.app} />
          <span>{card.when}</span>
        </span>
      </div>
    </div>
  )
}

const DEGREES = ["All", "1°", "2°", "3°"] as const

/**
 * The contacts list, in its card view or its tighter list view, with the
 * degrees of separation over it. Scrolled, its header minifies: the large
 * title becomes the bar's, and the filters go.
 */
export function ContactsScreen({
  view: first,
  back,
  start = 0,
  title = "Contacts",
  only,
  onBack,
  loading,
}: {
  view: "card" | "list"
  /** Arrived from Lists: the bar leads back to it. */
  back?: boolean
  /** How far down it starts, in pixels. */
  start?: number
  /** A list's name, where it is one list's contacts. */
  title?: string
  /** That list's people; everyone without it. */
  only?: Array<string>
  /** Makes "Lists" in the bar a way back. */
  onBack?: () => void
  /**
   * Just opened: the bar, the search field, and the filters are there at
   * once, and where the contacts will be are placeholders of their shapes,
   * as iOS redacts content that has not arrived (Apple's guidance on
   * loading: show the screen at once, with placeholders where content
   * will appear, and no spinner in its way).
   */
  loading?: boolean
}) {
  const [view, setView] = useState(first)
  const [degree, setDegree] = useState<(typeof DEGREES)[number]>("All")
  const [mini, setMini] = useState(start > 0)
  const list = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (list.current) list.current.scrollTop = start
  }, [start])
  const shown = (id: string) =>
    (!only || only.includes(id)) &&
    (degree === "All" || C[id].degree === degree)
  return (
    <div className="amo-app" data-view={view} data-mini={mini || undefined}>
      <StatusBar />
      <header className="amo-head">
        <div className="amo-bar">
          {onBack ? (
            <button
              type="button"
              className="amo-link"
              data-back
              onClick={onBack}
            >
              <TbChevronLeft aria-hidden /> Lists
            </button>
          ) : (
            <span className="amo-link">
              {back && !mini && (
                <>
                  <TbChevronLeft aria-hidden /> Lists
                </>
              )}
            </span>
          )}
          <span className="amo-bar-title">{title}</span>
          <TbPlus aria-label="New contact" className="amo-link" />
        </div>
        <h4 className="amo-large">{title}</h4>
        <div className="amo-search">
          <TbSearch aria-hidden />
          <span className="amo-grow">Search</span>
          <TbMicrophone aria-hidden />
        </div>
        <div className="amo-filters">
          <div className="amo-seg" role="group" aria-label="Degrees">
            {DEGREES.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={degree === d}
                data-degree={d}
                onClick={() => setDegree(d)}
              >
                {d}
              </button>
            ))}
            <span>
              <TbChevronDown aria-hidden />
            </span>
          </div>
          <div className="amo-seg" role="group" aria-label="View">
            <button
              type="button"
              aria-pressed={view === "list"}
              aria-label="List view"
              data-view-pick="list"
              onClick={() => setView("list")}
            >
              <TbList aria-hidden />
            </button>
            <button
              type="button"
              aria-pressed={view === "card"}
              aria-label="Card view"
              data-view-pick="card"
              onClick={() => setView("card")}
            >
              <TbId aria-hidden />
            </button>
            <span data-view-pick="max">
              <TbArrowsDiagonal aria-hidden />
            </span>
          </div>
          <TbAdjustmentsHorizontal aria-label="Filter" className="amo-link" />
        </div>
      </header>
      {loading && (
        <div aria-hidden className="amo-list amo-redacted">
          <section>
            <h5>
              <i style={{ width: 10 }} />
            </h5>
            {[112, 148, 76, 130, 96].map((w, i) => (
              <div key={w} className="amo-row">
                <i className="amo-avatar" />
                <div className="amo-row-main">
                  <div className="amo-row-top">
                    <span className="amo-grow">
                      <i style={{ width: w, height: 12 }} />
                      <i style={{ width: w * 0.5, height: 9, marginTop: 7 }} />
                    </span>
                    <i style={{ width: 22, height: 16 }} />
                  </div>
                  {view === "card" && i < 2 && (
                    <i
                      className="amo-card"
                      style={{ width: i ? "100%" : 196, height: i ? 56 : 236 }}
                    />
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
      <div
        ref={list}
        className="amo-list"
        hidden={loading}
        data-arrived={loading === false || undefined}
        onScroll={(e) => setMini(e.currentTarget.scrollTop > 12)}
      >
        {SECTIONS.map(([letter, ids]) => {
          const rows = ids.filter(shown)
          if (!rows.length) return null
          return (
            <section key={letter}>
              <h5>{letter}</h5>
              {rows.map((id) => (
                <Row key={id} contact={C[id]}>
                  {view === "card" && id in CARDS && (
                    <MediaCard card={CARDS[id]} />
                  )}
                </Row>
              ))}
            </section>
          )
        })}
      </div>
      <span aria-hidden className="amo-index">
        {"#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
          <i key={l}>{l}</i>
        ))}
      </span>
      <i aria-hidden className="amo-home-bar" />
    </div>
  )
}

const KEYS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"]

function Keyboard() {
  return (
    <div aria-hidden className="amo-keys">
      <div className="amo-keys-words">
        <span>“The”</span>
        <span>the</span>
        <span>to</span>
      </div>
      {KEYS.map((row, i) => (
        <div key={row} className="amo-keys-row">
          {i === 2 && (
            <b>
              <TbArrowBigUp />
            </b>
          )}
          {row.split("").map((k) => (
            <span key={k}>{k}</span>
          ))}
          {i === 2 && (
            <b>
              <TbBackspace />
            </b>
          )}
        </div>
      ))}
      <div className="amo-keys-row">
        <b data-wide>ABC</b>
        <span data-space>space</span>
        <b data-wide>return</b>
      </div>
      <div className="amo-keys-foot">
        <TbMoodSmile />
        <TbMicrophone />
      </div>
    </div>
  )
}

// What a search goes through: everyone in the list, and the file's other
// names for "And" to find, as on its Search screen.
const MORE: Array<Contact> = [
  {
    name: "Andy",
    strong: "Andy",
    degree: "3°",
    badge: { count: 1, tone: "blue" },
    actions: ["call", "video"],
    tint: "#c0392b",
    photo: "andy",
  },
  {
    name: "Andrew Bernard",
    strong: "Bernard",
    degree: "∞°",
    actions: ["video"],
    tint: "#7a8b99",
    photo: "andrew",
  },
  {
    name: "Anderson Cooper",
    strong: "Cooper",
    degree: "∞°",
    state: "Nearby",
    actions: ["map"],
    tint: "#4a5568",
    photo: "anderson",
  },
  {
    name: "Anders",
    strong: "Anders",
    degree: "6°",
    actions: ["message"],
    tint: "#2d6cdf",
    photo: "anders",
  },
]
// The most contacted first: a search sorts by relevancy.
const EVERYONE: Array<Contact> = [
  MORE[0],
  { ...C.archie, role: undefined, aside: "1 hr ago" },
  ...MORE.slice(1),
  ...Object.values(C).filter((c) => c !== C.archie),
]

/**
 * Search. Focused and empty, it suggests: the most recent, then what the
 * moment suggests (nearby, an upcoming meeting, a missed call). Typed in,
 * it lists the names that match, the matching string set heavier.
 */
export function SearchScreen({ query: first = "" }: { query?: string }) {
  const [query, setQuery] = useState(first)
  const field = useRef<HTMLInputElement>(null)
  // The field is listened to directly: the demo cursor types by setting its
  // value and sending `input`, which React's own handler does not pass on.
  useEffect(() => {
    const el = field.current
    if (!el) return
    const onInput = () => setQuery(el.value)
    el.addEventListener("input", onInput)
    return () => el.removeEventListener("input", onInput)
  }, [])
  const q = query.trim()
  const matches = q
    ? EVERYONE.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
    : []
  return (
    <div className="amo-app" data-searching>
      <StatusBar />
      <div className="amo-searchbar">
        {/* The field as iOS has it in focus: the caret before the
            placeholder, the microphone while it is empty, and the clear
            button once there is something to clear. */}
        <label className="amo-search" data-focus>
          <TbSearch aria-hidden />
          <input
            ref={field}
            type="text"
            aria-label="Search contacts"
            placeholder="Search"
            defaultValue={first}
            autoComplete="off"
            spellCheck={false}
          />
          <i aria-hidden className="amo-caret" />
          <TbMicrophone aria-hidden className="amo-mic" />
          <button
            type="button"
            aria-label="Clear"
            className="amo-clear"
            onClick={() => {
              const el = field.current
              if (!el) return
              el.value = ""
              el.dispatchEvent(new Event("input", { bubbles: true }))
            }}
          >
            <TbX aria-hidden />
          </button>
        </label>
        <span className="amo-link">Cancel</span>
      </div>
      <div className="amo-list" data-results>
        {q ? (
          <section>
            <h5>{matches.length ? "Top Name Matches" : "No Results"}</h5>
            {matches.slice(0, 12).map((c) => (
              <Row key={c.name} contact={c} match={q} />
            ))}
          </section>
        ) : (
          <>
            <section data-part="recent">
              <h5>Recent</h5>
              <Row
                contact={{ ...C.archie, role: undefined, aside: "1 hr ago" }}
              />
            </section>
            <section data-part="suggested">
              <h5>Suggested</h5>
              <Row
                contact={{
                  ...C.burgers,
                  role: undefined,
                  state: "Nearby",
                }}
              />
              <Row contact={{ ...C.lucille, aside: "Upcoming Meeting" }} />
              <Row
                contact={{ ...C.tahani, role: undefined, state: "Missed" }}
              />
            </section>
          </>
        )}
      </div>
      {/* The keyboard is up until there are results to read (Leo,
          2026-11-23: "no keyboard here, these should be the results"). */}
      {!q && <Keyboard />}
      <i aria-hidden className="amo-home-bar" />
    </div>
  )
}

const SHEET_ACTIONS: Array<[IconType, string]> = [
  [TbMessageCircle, "message"],
  [TbPhone, "call"],
  [TbVideo, "video"],
  [TbMail, "mail"],
  [TbCurrencyDollar, "pay"],
]

// A contact's pictures, the file's own: his portrait between two cuts of a
// second picture (it is one drawing of three people). The View screen has
// the portrait with the next one peeking; the Carousel has all three.
const FACES: Array<[picture: string, at: string]> = [
  ["archie-friends", "0% 50%"],
  ["archie-large", "50% 50%"],
  ["archie-friends", "100% 50%"],
]

/**
 * A contact, as a sheet over the list. Each action lists the apps it can
 * go through, and the starred ones are the person's pick, kept first. With
 * `carousel`, the contact's other pictures show beside the first.
 */
export function ContactSheet({ carousel }: { carousel?: boolean }) {
  const contact = C.archie
  const faces = carousel ? FACES : FACES.slice(1)
  const [face, setFace] = useState(carousel ? 1 : 0)
  const [starred, setStarred] = useState<Array<string>>(
    carousel ? ["Messages", "Signal"] : ["Messages"]
  )
  const apps = [
    ...REACH.filter((app) => starred.includes(app)),
    ...REACH.filter((app) => !starred.includes(app)),
  ]
  return (
    <div className="amo-app" data-sheet>
      <StatusBar />
      <div className="amo-sheet">
        <div className="amo-sheet-head">
          <i aria-hidden className="amo-grabber" />
          <div className="amo-bar">
            <span className="amo-pill" data-round>
              <TbUpload aria-label="Share" />
            </span>
            <span className="amo-pill">Edit</span>
          </div>
          <div className="amo-faces" data-face={face}>
            {faces.map(([picture, at], i) => (
              <button
                key={at}
                type="button"
                aria-label={`Picture ${i + 1} of ${faces.length}`}
                aria-pressed={face === i}
                data-at={i - face}
                style={{
                  backgroundImage: `url(${ASSETS}/avatars/${picture}.webp)`,
                  backgroundPosition: at,
                }}
                onClick={() => setFace(i)}
              />
            ))}
          </div>
          <span className="amo-sheet-role">Student · Riverdale High</span>
          <span className="amo-sheet-name">{contact.name}</span>
          <div className="amo-sheet-actions">
            {SHEET_ACTIONS.map(([Icon, label]) => (
              <span key={label}>
                <Icon aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="amo-groups">
          <section data-group="Message">
            <h5>Message</h5>
            <div className="amo-inset">
              {apps.map((app) => {
                const on = starred.includes(app)
                return (
                  <div key={app} className="amo-inset-row">
                    <AppIcon app={app.toLowerCase()} />
                    <span className="amo-grow">{app}</span>
                    <button
                      type="button"
                      aria-label={`Use ${app} to message`}
                      aria-pressed={on}
                      data-star={app}
                      className="amo-star"
                      onClick={() =>
                        setStarred((now) =>
                          on ? now.filter((a) => a !== app) : [...now, app]
                        )
                      }
                    >
                      {on ? <TbStarFilled /> : <TbStar />}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
          <section>
            <h5>Call</h5>
            <div className="amo-inset">
              <div className="amo-inset-row">
                <AppIcon app="facetime" />
                <span className="amo-grow">FaceTime</span>
                <span className="amo-star">
                  <TbStarFilled />
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <i aria-hidden className="amo-home-bar" />
    </div>
  )
}
