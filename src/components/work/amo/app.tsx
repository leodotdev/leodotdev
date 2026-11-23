import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  TbAdjustmentsHorizontal,
  TbArrowBigUp,
  TbArrowsDiagonal,
  TbAsterisk,
  TbBackspace,
  TbBrandAppstore,
  TbBrandInstagram,
  TbBrandSafari,
  TbBrandTwitter,
  TbBrandWhatsapp,
  TbBrandYoutube,
  TbBroadcast,
  TbCalendar,
  TbCamera,
  TbChecklist,
  TbChevronDown,
  TbChevronLeft,
  TbChevronRight,
  TbClock,
  TbCompass,
  TbCurrencyDollar,
  TbDeviceTv,
  TbHeartFilled,
  TbId,
  TbList,
  TbMail,
  TbMap2,
  TbMessageCircle,
  TbMessageQuestion,
  TbMicrophone,
  TbMoodSmile,
  TbMusic,
  TbNews,
  TbNotes,
  TbPhone,
  TbPhoto,
  TbPlus,
  TbSearch,
  TbSettings,
  TbStar,
  TbStarFilled,
  TbTrash,
  TbUpload,
  TbUserCircle,
  TbUsers,
  TbVideo,
  TbWallet,
  TbX,
} from "react-icons/tb"
import {
  C,
  CARDS,
  DOCK,
  HOME,
  LISTS,
  REACH,
  SECTIONS,
} from "@/components/work/amo/data"
import type { Action, Card, Contact } from "@/components/work/amo/data"
import type { IconType } from "react-icons"

// /work/amo's screens, rebuilt in HTML and CSS from the Figma file
// (amo-2023): an iPhone with the Contacts app of the exploration in it, each
// screen a small working copy. The styles are `.amo-*` in src/amo.css. The
// type is the system's own (San Francisco on an Apple device), since the
// point of the exploration is to "completely lean into iOS".

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
      </div>
    </div>
  )
}

function StatusBar({ light }: { light?: boolean }) {
  return (
    <div className="amo-status" data-light={light || undefined}>
      <span>9:41</span>
      <i aria-hidden className="amo-island" />
      <span aria-hidden className="amo-status-end">
        <i className="amo-bars" />
        <i className="amo-battery" />
      </span>
    </div>
  )
}

const GLYPHS: Record<string, IconType> = {
  video: TbVideo,
  calendar: TbCalendar,
  photos: TbPhoto,
  camera: TbCamera,
  mail: TbMail,
  notes: TbNotes,
  reminders: TbChecklist,
  clock: TbClock,
  news: TbNews,
  tv: TbDeviceTv,
  podcasts: TbBroadcast,
  store: TbBrandAppstore,
  maps: TbMap2,
  health: TbHeartFilled,
  wallet: TbWallet,
  settings: TbSettings,
  contacts: TbUserCircle,
  phone: TbPhone,
  safari: TbBrandSafari,
  messages: TbMessageCircle,
  music: TbMusic,
}

function AppTile({
  app: [name, tint, glyph],
  label = true,
}: {
  app: [string, string, string]
  label?: boolean
}) {
  const Glyph = GLYPHS[glyph]
  const pale = tint === "#ffffff" || tint === "#ffd60a"
  return (
    <span className="amo-tile" data-app={name}>
      <i style={{ background: tint, color: pale ? "#1c1c1e" : "#fff" }}>
        <Glyph aria-hidden />
      </i>
      {label && <span>{name}</span>}
    </span>
  )
}

/** The home screen: Contacts with a place of its own among the apps. */
export function HomeScreen() {
  return (
    <div className="amo-home">
      <StatusBar light />
      <div className="amo-home-grid">
        {HOME.map((app) => (
          <AppTile key={app[0]} app={app} />
        ))}
      </div>
      <span className="amo-home-search">
        <TbSearch aria-hidden /> Search
      </span>
      <div className="amo-dock">
        {DOCK.map((app) => (
          <AppTile key={app[0]} app={app} label={false} />
        ))}
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

/** Lists: iCloud's, the person's own groups, and the suggested ones. */
export function ListsScreen() {
  return (
    <div className="amo-app" data-ground>
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
                  <div key={name} className="amo-inset-row">
                    <span className="amo-inset-icon">
                      {Icon ? <Icon aria-hidden /> : icon}
                    </span>
                    <span className="amo-grow">{name}</span>
                    {count && <span className="amo-dim">{count}</span>}
                    <TbChevronRight aria-hidden className="amo-chevron" />
                  </div>
                )
              })}
            </div>
          </section>
        ))}
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

function Avatar({ contact, size }: { contact: Contact; size?: number }) {
  return (
    <span
      className="amo-avatar"
      data-business={contact.business || undefined}
      style={
        {
          background: contact.tint,
          "--amo-avatar": size ? `${size}px` : undefined,
        } as React.CSSProperties
      }
    >
      {initials(contact.name)}
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

const APPS: Record<Card["app"], [IconType, string]> = {
  instagram: [TbBrandInstagram, "#e1306c"],
  youtube: [TbBrandYoutube, "#ff0000"],
  facetime: [TbVideo, "#34c759"],
  twitter: [TbBrandTwitter, "#1d9bf0"],
  whatsapp: [TbBrandWhatsapp, "#25d366"],
  music: [TbMusic, "#ff375f"],
}

/** What was last shared with a contact, under their row in the card view. */
function MediaCard({ card }: { card: Card }) {
  const [Icon, tint] = APPS[card.app]
  return (
    <div className="amo-card" data-kind={card.kind}>
      {card.kind === "photo" && card.more && (
        <i aria-hidden className="amo-card-more" />
      )}
      <div className="amo-card-face">
        {(card.kind === "photo" || card.kind === "video") && (
          <i aria-hidden className="amo-card-picture" data-kind={card.kind} />
        )}
        <span className="amo-card-text">{card.text}</span>
        {card.kind === "music" && (
          <span className="amo-card-text">{card.sub}</span>
        )}
        <span className="amo-card-foot">
          <i style={{ background: tint }}>
            <Icon aria-hidden />
          </i>
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
}: {
  view: "card" | "list"
  /** Arrived from Lists: the bar leads back to it. */
  back?: boolean
  /** How far down it starts, in pixels. */
  start?: number
}) {
  const [view, setView] = useState(first)
  const [degree, setDegree] = useState<(typeof DEGREES)[number]>("All")
  const [mini, setMini] = useState(start > 0)
  const list = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (list.current) list.current.scrollTop = start
  }, [start])
  const shown = (id: string) => degree === "All" || C[id].degree === degree
  return (
    <div className="amo-app" data-view={view} data-mini={mini || undefined}>
      <StatusBar />
      <header className="amo-head">
        <div className="amo-bar">
          <span className="amo-link">
            {back && !mini && (
              <>
                <TbChevronLeft aria-hidden /> Lists
              </>
            )}
          </span>
          <span className="amo-bar-title">Contacts</span>
          <TbPlus aria-label="New contact" className="amo-link" />
        </div>
        <h4 className="amo-large">Contacts</h4>
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
      <div
        ref={list}
        className="amo-list"
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

// What a search goes through: everyone in the list, and a few more names
// for "And" to find, as on the file's Search screen.
const MORE: Array<Contact> = [
  {
    name: "Andy",
    strong: "Andy",
    degree: "3°",
    badge: { count: 1, tone: "blue" },
    actions: ["call", "video"],
    tint: "#c0392b",
  },
  {
    name: "Andrew Bernard",
    strong: "Bernard",
    degree: "∞°",
    actions: ["video"],
    tint: "#7a8b99",
  },
  {
    name: "Andes Coffee",
    strong: "Coffee",
    role: "Coffee Shop",
    state: "Nearby",
    actions: ["map"],
    tint: "#8a5a3c",
    business: true,
  },
  {
    name: "Anders",
    strong: "Anders",
    degree: "6°",
    actions: ["message"],
    tint: "#2d6cdf",
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
          <TbX aria-hidden className="amo-clear" />
        </label>
        <span className="amo-link">Cancel</span>
      </div>
      <div className="amo-list" data-results>
        {q ? (
          <section>
            <h5>{matches.length ? "Top Name Matches" : "No Results"}</h5>
            {matches.slice(0, 6).map((c) => (
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
      <Keyboard />
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

// A contact's pictures, as tints of their own color (the file's are
// drawings of the character).
const FACES = ["#f08a24", "#3a8fd6", "#b05cc9"]

/**
 * A contact, as a sheet over the list. Each action lists the apps it can
 * go through, and the starred ones are the person's pick, kept first. With
 * `carousel`, the contact's other pictures show beside the first.
 */
export function ContactSheet({ carousel }: { carousel?: boolean }) {
  const contact = C.archie
  const [face, setFace] = useState(carousel ? 1 : 0)
  const [starred, setStarred] = useState<Array<string>>(
    carousel ? ["Messages", "Signal"] : ["Messages"]
  )
  const apps = [
    ...REACH.filter(([app]) => starred.includes(app)),
    ...REACH.filter(([app]) => !starred.includes(app)),
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
            {FACES.map((tint, i) => (
              <button
                key={tint}
                type="button"
                aria-label={`Picture ${i + 1} of ${FACES.length}`}
                aria-pressed={face === i}
                data-at={i - face}
                style={{ background: tint }}
                onClick={() => setFace(i)}
              >
                {initials(contact.name)}
              </button>
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
              {apps.map(([app, tint]) => {
                const on = starred.includes(app)
                return (
                  <div key={app} className="amo-inset-row">
                    <i className="amo-app-dot" style={{ background: tint }} />
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
                <i className="amo-app-dot" style={{ background: "#34c759" }} />
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
