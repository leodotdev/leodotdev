import {
  ContactSheet,
  ContactsScreen,
  HomeScreen,
  ListsScreen,
  Phone,
  SearchScreen,
} from "@/components/work/amo/app"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Figure } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// /work/amo's Design tab: the file's ten screens, two to a figure as its
// boards set them out, each a working phone. A figure's demo cursor tries
// the screens and tells their story: every note is one of the notes Leo
// wrote under that screen in the file (or, where said, on the research
// board), in his words.

/** A figure of phones, tried out by a demo cursor. */
function Screens({
  steps,
  children,
}: {
  steps: Array<DemoStep>
  children: React.ReactNode
}) {
  return (
    <Figure>
      <div className="amo-figure" data-figure>
        <DemoCursor steps={steps} className="amo-pair">
          {children}
        </DemoCursor>
      </div>
    </Figure>
  )
}

const HOME_STEPS: Array<DemoStep> = [
  {
    on: "[data-phone='home'] [data-app='Contacts'] > i",
    rest: 700,
    note: {
      kind: "direction",
      title: "Contacts",
      text: "Contacts takes its new rightful place on the home screen.",
    },
  },
  {
    on: "[data-phone='lists'] [data-group='Groups']",
    at: [0.5, 0.4],
    idle: true,
    note: {
      kind: "direction",
      title: "Groups",
      text: "Lists exist today, but sorely limited. How about personalized groups?",
    },
  },
  {
    on: "[data-phone='lists'] [data-group='Suggested Groups'] .amo-inset-row",
    rest: 600,
    note: {
      kind: "concept",
      title: "Suggested Groups",
      text: "Opt in to auto-generated suggested groups.",
    },
  },
]

export function HomeDoc() {
  return (
    <Screens steps={HOME_STEPS}>
      <Phone id="home" name="Home">
        <HomeScreen />
      </Phone>
      <Phone id="lists" name="Lists">
        <ListsScreen />
      </Phone>
    </Screens>
  )
}

const LANDING_STEPS: Array<DemoStep> = [
  {
    on: "[data-phone='card'] .amo-card",
    at: [0.4, 0.5],
    idle: true,
    note: {
      kind: "concept",
      title: "Cards",
      text: "Cards and notifications with recently shared multimedia and messages.",
    },
  },
  {
    on: "[data-phone='card'] [data-degree='1°']",
    click: true,
    rest: 500,
    note: {
      kind: "concept",
      title: "Degrees of separation",
      on: "[data-phone='card'] [aria-label='Degrees']",
      text: "People close to me first, then the next degree of connections, and so on. The default is All.",
    },
  },
  { on: "[data-phone='card'] [data-degree='All']", click: true, rest: 400 },
  {
    on: "[data-phone='list'] .amo-list",
    at: [0.5, 0.3],
    idle: true,
    note: {
      kind: "direction",
      title: "List view",
      text: "Closer to today: a tighter list view. Let people choose the density of info.",
    },
  },
  {
    on: "[data-phone='list'] [data-view-pick='card']",
    click: true,
    rest: 500,
  },
  {
    on: "[data-phone='list'] [data-view-pick='list']",
    click: true,
    rest: 500,
    note: {
      kind: "direction",
      title: "Tighter still",
      text: "Maybe an even tighter view, without avatars, which is exactly like today.",
    },
  },
  {
    on: "[data-phone='list'] [data-view-pick='max']",
    rest: 500,
    note: {
      kind: "direction",
      title: "Not shown",
      text: "A “max” view: something like a full social feed, but aggregating from across services.",
    },
  },
]

export function LandingDoc() {
  return (
    <Screens steps={LANDING_STEPS}>
      <Phone id="card" lead="Landing:" name="Card View">
        <ContactsScreen view="card" back />
      </Phone>
      <Phone id="list" name="List View">
        <ContactsScreen view="list" />
      </Phone>
    </Screens>
  )
}

const SCROLL_STEPS: Array<DemoStep> = [
  { on: "[data-phone='card'] .amo-list", scroll: 0 },
  {
    on: "[data-phone='card'] .amo-list",
    scroll: 46,
    note: {
      kind: "concept",
      title: "Header",
      on: "[data-phone='card'] .amo-head",
      text: "Scrolling collapses and minifies the header.",
    },
  },
  {
    on: "[data-phone='card'] .amo-card[data-kind='music']",
    idle: true,
    note: {
      kind: "concept",
      title: "Rich cards",
      text: "More rich card types: recently shared music and posts, and recent notifications between contacts.",
    },
  },
  { on: "[data-phone='list'] .amo-list", scroll: 0 },
  {
    on: "[data-phone='list'] .amo-list",
    scroll: 60,
    note: {
      kind: "concept",
      title: "Businesses",
      on: "[data-phone='list'] .amo-row[data-business]",
      text: "Businesses as contacts, with relevant info.",
    },
  },
]

export function ScrollDoc() {
  return (
    <Screens steps={SCROLL_STEPS}>
      <Phone id="card" lead="Card View:" name="Scroll">
        <ContactsScreen view="card" start={420} />
      </Phone>
      <Phone id="list" lead="List View:" name="Scroll">
        <ContactsScreen view="list" start={120} />
      </Phone>
    </Screens>
  )
}

const SEARCH_STEPS: Array<DemoStep> = [
  {
    on: "[data-phone='focus'] .amo-search",
    rest: 600,
    note: {
      kind: "concept",
      title: "Focus",
      text: "Contextual suggestions before typing.",
    },
  },
  {
    on: "[data-phone='focus'] [data-part='suggested']",
    at: [0.4, 0.5],
    idle: true,
    note: {
      kind: "discovery",
      title: "Suggested",
      text: "From the notes on today’s app: the focus state could show the most recent, then suggestions based on Mail, Calendar, Location, etc.",
    },
  },
  {
    on: "[data-phone='search'] .amo-search",
    type: "And",
    note: {
      kind: "concept",
      title: "Matches",
      on: "[data-phone='search'] .amo-list",
      text: "Search highlights the matching string, and results sort by relevancy: the most contacted first.",
    },
  },
]

export function SearchDoc() {
  return (
    <Screens steps={SEARCH_STEPS}>
      <Phone id="focus" name="Focus">
        <SearchScreen />
      </Phone>
      <Phone id="search" name="Search">
        <SearchScreen query="And" />
      </Phone>
    </Screens>
  )
}

const CONTACT_STEPS: Array<DemoStep> = [
  {
    on: "[data-phone='view'] .amo-grabber",
    idle: true,
    note: {
      kind: "concept",
      title: "A sheet",
      on: "[data-phone='view'] .amo-sheet-head",
      text: "View is a “sheet”, not a full route, for faster switching.",
    },
  },
  {
    on: "[data-phone='view'] [data-star='WhatsApp']",
    click: true,
    rest: 500,
    note: {
      kind: "concept",
      title: "An app per action",
      on: "[data-phone='view'] [data-group='Message']",
      text: "People pick which app they want for each action.",
    },
  },
  { on: "[data-phone='view'] [data-star='WhatsApp']", click: true, rest: 400 },
  {
    on: "[data-phone='carousel'] .amo-faces [data-at='1']",
    at: [0.85, 0.5],
    click: true,
    rest: 500,
    note: {
      kind: "concept",
      title: "Carousel",
      on: "[data-phone='carousel'] .amo-faces",
      text: "People can have multiple avatars or profile pictures.",
    },
  },
  {
    on: "[data-phone='carousel'] .amo-faces [data-at='-1']",
    at: [0.15, 0.5],
    click: true,
    rest: 500,
  },
]

export function ContactDoc() {
  return (
    <Screens steps={CONTACT_STEPS}>
      <Phone id="view" name="View">
        <ContactSheet />
      </Phone>
      <Phone id="carousel" name="Carousel">
        <ContactSheet carousel />
      </Phone>
    </Screens>
  )
}
