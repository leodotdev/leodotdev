// /work/amo's sample data: the contacts, lists, and cards on the screens of
// the Figma file (amo-2023), by the names the file gives them, with the
// file's own pictures (public/work/amo; a contact past B is made up, so the
// list has more to scroll, and has its initials on a color).

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
  /** The file's picture of them (public/work/amo/avatars). */
  photo?: string
  /** A business, with what a business shows: open, closed, a way there. */
  business?: boolean
}

export const C: Record<string, Contact> = {
  alf: {
    photo: "alf",
    name: "Alf",
    strong: "Alf",
    degree: "∞°",
    actions: ["video"],
    tint: "#c98a4b",
  },
  tahani: {
    photo: "tahani",
    name: "Tahani Al-Jamil",
    strong: "Al-Jamil",
    role: "Designer",
    degree: "2°",
    badge: { count: 1, tone: "red" },
    actions: ["message", "video"],
    tint: "#d6457a",
  },
  arthur: {
    photo: "arthur",
    name: "Arthur",
    strong: "Arthur",
    degree: "6°",
    badge: { count: 1, tone: "blue" },
    actions: ["call", "video"],
    tint: "#5b8def",
  },
  archie: {
    photo: "archie",
    name: "Archie Andrews",
    strong: "Andrews",
    role: "Student",
    degree: "2°",
    actions: ["message"],
    tint: "#f08a24",
  },
  animal: {
    photo: "animal",
    name: "Animal",
    strong: "Animal",
    role: "Musician",
    degree: "1°",
    badge: { count: 3, tone: "blue" },
    actions: ["message"],
    tint: "#d6402b",
  },
  sterling: {
    photo: "sterling",
    name: "Sterling Archer",
    strong: "Archer",
    role: "Agent",
    degree: "2°",
    actions: ["message", "video"],
    tint: "#4a5568",
  },
  bob: {
    photo: "bob",
    name: "Bob Belcher",
    strong: "Belcher",
    role: "Chef",
    degree: "4°",
    actions: ["call"],
    tint: "#6b8e4e",
  },
  lucille: {
    photo: "lucille",
    name: "Lucille Bluth",
    strong: "Bluth",
    degree: "1°",
    actions: ["call"],
    tint: "#8e6bbf",
  },
  george: {
    photo: "george",
    name: "George Michael Bluth",
    strong: "Bluth",
    role: "Entrepreneur",
    degree: "1°",
    actions: ["message", "star"],
    tint: "#3aa6a0",
  },
  kahuna: {
    photo: "kahuna",
    name: "Big Kahuna Burger",
    strong: "Burger",
    role: "Burger Joint",
    state: "Open",
    actions: ["map", "share"],
    tint: "#e0a321",
    business: true,
  },
  burgers: {
    photo: "burgers",
    name: "Bob's Burgers",
    strong: "Burgers",
    role: "Burger Joint",
    state: "Closed",
    actions: ["map"],
    tint: "#e7c229",
    business: true,
  },
  // (The file's list repeats its rows from here on. These are added so
  // the lists have more in them, named as the file names its own, after
  // people and places in television of the 1990s and 2000s (Leo,
  // 2026-11-23). They have no picture in the file: their initials are on
  // iOS's system colors.)
  carlton: {
    name: "Carlton Banks",
    strong: "Banks",
    role: "Student",
    degree: "3°",
    actions: ["message", "call"],
    tint: "#30b0c7",
  },
  perk: {
    name: "Central Perk",
    strong: "Perk",
    role: "Coffee House",
    state: "Open",
    actions: ["map", "share"],
    tint: "#34c759",
    business: true,
  },
  chandler: {
    name: "Chandler Bing",
    strong: "Bing",
    role: "Analyst",
    degree: "2°",
    badge: { count: 2, tone: "blue" },
    actions: ["message", "video"],
    tint: "#5856d6",
  },
  kramer: {
    name: "Cosmo Kramer",
    strong: "Kramer",
    degree: "5°",
    actions: ["call"],
    tint: "#ff9500",
  },
  scully: {
    name: "Dana Scully",
    strong: "Scully",
    role: "Agent",
    degree: "2°",
    actions: ["message", "call"],
    tint: "#ff2d55",
  },
  daria: {
    name: "Daria Morgendorffer",
    strong: "Morgendorffer",
    role: "Student",
    degree: "3°",
    actions: ["message"],
    tint: "#00c7be",
  },
  dunder: {
    name: "Dunder Mifflin",
    strong: "Mifflin",
    role: "Paper Company",
    state: "Closed",
    actions: ["map"],
    tint: "#8e8e93",
    business: true,
  },
  dwight: {
    name: "Dwight Schrute",
    strong: "Schrute",
    role: "Salesman",
    degree: "4°",
    actions: ["call", "video"],
    tint: "#a2845e",
  },
  elaine: {
    name: "Elaine Benes",
    strong: "Benes",
    role: "Editor",
    degree: "1°",
    badge: { count: 1, tone: "red" },
    actions: ["message", "call"],
    tint: "#af52de",
  },
  mulder: {
    name: "Fox Mulder",
    strong: "Mulder",
    role: "Agent",
    degree: "2°",
    actions: ["message"],
    tint: "#007aff",
  },
  frasier: {
    name: "Frasier Crane",
    strong: "Crane",
    role: "Radio Host",
    degree: "3°",
    actions: ["call"],
    tint: "#ff3b30",
  },
}

/** A contact's card in the card view: what was last shared with them. */
export type Card =
  | {
      kind: "photo"
      app: "instagram"
      text: string
      when: string
      /** The pictures they shared together (public/work/amo/media). */
      pictures: Array<string>
    }
  | {
      kind: "video"
      app: "youtube"
      text: string
      when: string
      picture: string
    }
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
    pictures: ["alf-beach", "alf-poster", "alf-record"],
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
    picture: "drum-battle",
  },
  sterling: {
    kind: "line",
    app: "whatsapp",
    text: "you know what’s crazier than a cyborg spy ninja? Trying to find my car keys in the Danger Zone!",
    when: "1d ago",
  },
  chandler: {
    kind: "line",
    app: "whatsapp",
    text: "Running late. Save me a seat on the couch?",
    when: "5m ago",
  },
  scully: {
    kind: "line",
    app: "facetime",
    text: "Missed FaceTime call",
    when: "2h ago",
  },
  elaine: {
    kind: "line",
    app: "twitter",
    text: "New issue is out. Tell me what you think.",
    when: "3d ago",
  },
}

/** The contacts list, in its sections. */
export const SECTIONS: Array<[letter: string, ids: Array<string>]> = [
  ["A", ["alf", "tahani", "arthur", "archie", "animal", "sterling"]],
  ["B", ["bob", "lucille", "george", "kahuna", "burgers"]],
  ["C", ["carlton", "perk", "chandler", "kramer"]],
  ["D", ["scully", "daria", "dunder", "dwight"]],
  ["E", ["elaine"]],
  ["F", ["mulder", "frasier"]],
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

/** The apps a contact can be reached through, per action (the View sheet). */
export const REACH = ["Messages", "WhatsApp", "Discord", "Signal", "Instagram"]

/**
 * Who is on each list, so a list opened from Lists has people in it (the
 * file draws only the lists' names and counts; who is on which is made up).
 * A list not named here shows everyone.
 */
export const MEMBERS: Record<string, Array<string>> = {
  Favorites: ["tahani", "animal", "lucille", "bob", "elaine", "chandler"],
  "Top Friends": [
    "animal",
    "archie",
    "lucille",
    "george",
    "chandler",
    "elaine",
  ],
  Founders: ["george", "bob", "kahuna", "burgers", "perk", "dunder"],
  Mentors: ["lucille", "sterling", "frasier", "scully"],
  "SF Designers": ["tahani", "daria", "carlton", "kramer"],
  "NYC Designers": ["tahani", "archie", "chandler", "elaine", "kramer"],
  "Unkown Senders": ["alf", "arthur"],
  "Unread Messages": ["tahani", "chandler", "elaine"],
}
