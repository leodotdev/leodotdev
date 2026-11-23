// /work/amo's sample data: the contacts, lists, and cards on the screens of
// the Figma file (amo-2023), by the names the file gives them. The file
// draws each contact with a picture; here a contact is its initials on a
// color, and a card's photo or video is a plain block: the pictures are
// other people's, and are not copied into this site.

export type Action = "message" | "call" | "video" | "map" | "share" | "star"

export type Contact = {
  name: string
  /** The part of the name set heavier, as iOS sets a family name. */
  strong?: string
  /** What they are, before the degree ("Designer"). */
  role?: string
  /** Degrees of separation ("2°", "∞°"), or a business's state. */
  degree?: string
  state?: "Open" | "Closed" | "Nearby" | "Missed"
  /** What else is said after the degree ("1 hr ago", "Upcoming Meeting"). */
  aside?: string
  badge?: { count: number; tone: "red" | "blue" }
  actions: Array<Action>
  tint: string
  /** A business, drawn as a logo tile, not a person. */
  business?: boolean
}

export const C: Record<string, Contact> = {
  alf: {
    name: "Alf",
    strong: "Alf",
    degree: "∞°",
    actions: ["video"],
    tint: "#c98a4b",
  },
  tahani: {
    name: "Tahani Al-Jamil",
    strong: "Al-Jamil",
    role: "Designer",
    degree: "2°",
    badge: { count: 1, tone: "red" },
    actions: ["message", "video"],
    tint: "#d6457a",
  },
  arthur: {
    name: "Arthur",
    strong: "Arthur",
    degree: "6°",
    badge: { count: 1, tone: "blue" },
    actions: ["call", "video"],
    tint: "#5b8def",
  },
  archie: {
    name: "Archie Andrews",
    strong: "Andrews",
    role: "Student",
    degree: "2°",
    actions: ["message"],
    tint: "#f08a24",
  },
  animal: {
    name: "Animal",
    strong: "Animal",
    role: "Musician",
    degree: "1°",
    badge: { count: 3, tone: "blue" },
    actions: ["message"],
    tint: "#d6402b",
  },
  sterling: {
    name: "Sterling Archer",
    strong: "Archer",
    role: "Agent",
    degree: "2°",
    actions: ["message", "video"],
    tint: "#4a5568",
  },
  bob: {
    name: "Bob Belcher",
    strong: "Belcher",
    role: "Chef",
    degree: "4°",
    actions: ["call"],
    tint: "#6b8e4e",
  },
  lucille: {
    name: "Lucille Bluth",
    strong: "Bluth",
    degree: "1°",
    actions: ["call"],
    tint: "#8e6bbf",
  },
  george: {
    name: "George Michael Bluth",
    strong: "Bluth",
    role: "Entrepreneur",
    degree: "1°",
    actions: ["message", "star"],
    tint: "#3aa6a0",
  },
  kahuna: {
    name: "Big Kahuna Burger",
    strong: "Burger",
    role: "Burger Joint",
    state: "Open",
    actions: ["map", "share"],
    tint: "#e0a321",
    business: true,
  },
  burgers: {
    name: "Bob's Burgers",
    strong: "Burgers",
    role: "Burger Joint",
    state: "Closed",
    actions: ["map"],
    tint: "#e7c229",
    business: true,
  },
  // (The file's list repeats its rows from here on; these few are made up,
  // so the list has more to scroll.)
  casey: {
    name: "Casey Chen",
    strong: "Chen",
    role: "Engineer",
    degree: "3°",
    actions: ["message", "call"],
    tint: "#3f8f6b",
  },
  cleo: {
    name: "Cleo’s Flowers",
    strong: "Flowers",
    role: "Florist",
    state: "Open",
    actions: ["map"],
    tint: "#c9558d",
    business: true,
  },
  cyrus: {
    name: "Cyrus",
    strong: "Cyrus",
    degree: "5°",
    actions: ["message"],
    tint: "#7d6bd6",
  },
  dana: {
    name: "Dana Okafor",
    strong: "Okafor",
    role: "Photographer",
    degree: "2°",
    actions: ["message", "video"],
    tint: "#d98a2b",
  },
  dev: {
    name: "Dev",
    strong: "Dev",
    degree: "3°",
    actions: ["call"],
    tint: "#4a90a4",
  },
}

/** A contact's card in the card view: what was last shared with them. */
export type Card =
  | {
      kind: "photo"
      app: "instagram"
      text: string
      when: string
      more?: boolean
    }
  | { kind: "video"; app: "youtube"; text: string; when: string }
  | {
      kind: "line"
      app: "facetime" | "twitter" | "whatsapp"
      text: string
      when: string
    }
  | { kind: "music"; app: "music"; text: string; sub: string; when: string }

export const CARDS: Record<string, Card> = {
  alf: {
    kind: "photo",
    app: "instagram",
    text: "wish you were here 🕶",
    when: "1w ago",
    more: true,
  },
  tahani: {
    kind: "line",
    app: "facetime",
    text: "Missed FaceTime call",
    when: "10m ago",
  },
  arthur: {
    kind: "line",
    app: "twitter",
    text: "I’ve never been more in my mind!",
    when: "2d ago",
  },
  archie: {
    kind: "music",
    app: "music",
    text: "Frankie Valli & The Four Seasons",
    sub: "December, 1963 (Oh, What a Night)",
    when: "12s ago",
  },
  animal: {
    kind: "video",
    app: "youtube",
    text: "Dave Grohl and Animal Drum Battle",
    when: "1d ago",
  },
  sterling: {
    kind: "line",
    app: "whatsapp",
    text: "you know what’s crazier than a cyborg spy ninja? Trying to find my car keys in the Danger Zone!",
    when: "1d ago",
  },
}

/** The contacts list, in its sections. */
export const SECTIONS: Array<[letter: string, ids: Array<string>]> = [
  ["A", ["alf", "tahani", "arthur", "archie", "animal", "sterling"]],
  ["B", ["bob", "lucille", "george", "kahuna", "burgers"]],
  ["C", ["casey", "cleo", "cyrus"]],
  ["D", ["dana", "dev"]],
]

/** The Lists screen, in its groups of rows. */
export const LISTS: Array<{
  title?: string
  rows: Array<[icon: string, name: string, count?: string]>
}> = [
  { rows: [["people", "All Contacts", "1,234"]] },
  {
    title: "iCloud",
    rows: [
      ["people", "All iCloud", "1,234"],
      ["star", "Favorites", "23"],
    ],
  },
  {
    title: "Groups",
    rows: [
      ["❤️", "Top Friends", "34"],
      ["👷", "Founders", "56"],
      ["💪", "Mentors", "7"],
      ["🌁", "SF Designers", "67"],
      ["🗽", "NYC Designers", "45"],
    ],
  },
  { rows: [["✨", "Suggested Groups"]] },
  {
    rows: [
      ["unknown", "Unkown Senders", "2"],
      ["unread", "Unread Messages", "1"],
    ],
  },
  { rows: [["trash", "Recently Deleted"]] },
]

/** The home screen's apps, by row, and its dock. */
export const HOME: Array<[name: string, tint: string, glyph: string]> = [
  ["FaceTime", "#34c759", "video"],
  ["Calendar", "#ffffff", "calendar"],
  ["Photos", "#ffffff", "photos"],
  ["Camera", "#8e8e93", "camera"],
  ["Mail", "#1e90ff", "mail"],
  ["Notes", "#ffd60a", "notes"],
  ["Reminders", "#ffffff", "reminders"],
  ["Clock", "#1c1c1e", "clock"],
  ["News", "#ff375f", "news"],
  ["TV", "#1c1c1e", "tv"],
  ["Podcasts", "#b150e2", "podcasts"],
  ["App Store", "#0a84ff", "store"],
  ["Maps", "#63d17a", "maps"],
  ["Health", "#ffffff", "health"],
  ["Wallet", "#1c1c1e", "wallet"],
  ["Settings", "#8e8e93", "settings"],
  ["Contacts", "#34c759", "contacts"],
]
export const DOCK: Array<[name: string, tint: string, glyph: string]> = [
  ["Phone", "#34c759", "phone"],
  ["Safari", "#ffffff", "safari"],
  ["Messages", "#34c759", "messages"],
  ["Music", "#ff375f", "music"],
]

/** The apps a contact can be reached through, per action (the View sheet). */
export const REACH: Array<[app: string, tint: string]> = [
  ["Messages", "#34c759"],
  ["WhatsApp", "#25d366"],
  ["Discord", "#5865f2"],
  ["Signal", "#3a76f0"],
  ["Instagram", "#e1306c"],
]
