import { Dashboard23 } from "@/components/work/plasmic/kit/dash23"
import { EditorCrumb } from "@/components/work/plasmic/kit/editor23"
import { Dashboard21 } from "@/components/work/plasmic/kit/teams"
import type { Dive, Peer, Shot, State } from "@/components/work/plasmic/types"

// 2023, from "P2023 H1": the breadcrumb editor grows branches and merging,
// a publish pipeline with tests, a Logic mode (and a flow graph, a north
// star), an app builder for internal tools with data, and a command
// palette with Copilot. The directions quote the file's notes.

const crumb = (s: State) => <EditorCrumb s={s} />
const URL = "studio.plasmic.app/projects/acme-internal-app"

const CHROME: Array<Shot> = [
  {
    label: "The breadcrumb top bar",
    w: 1440,
    h: 868,
    view: () => <EditorCrumb s={{}} />,
  },
  {
    label: "Floating chrome: the top bar as two pills, no rail",
    w: 1440,
    h: 868,
    view: () => <EditorCrumb s={{ floating: true, left: "none" }} />,
  },
  {
    label: "The labeled rail of the app builder",
    w: 1440,
    h: 868,
    view: () => <EditorCrumb s={{ labeled: true, project: "CRM App" }} />,
  },
]

const TEAM: Array<Peer> = [
  {
    name: "Kai",
    color: "#0ea5e9",
    script: [
      { on: "row:heading", select: true, wait: 2200 },
      { on: "r:background", wait: 1800 },
    ],
  },
]

const APP: State = { labeled: true, project: "CRM App", left: "none" }

/** Three teammates on the landing page at once, each on a part of it. */
const CREW: Array<Peer> = [
  {
    name: "Maya",
    color: "#ec4899",
    script: [
      { on: "land:headline", select: true, wait: 1800 },
      {
        on: "land:headline",
        select: true,
        set: { headline: "Tools your team will love" },
        wait: 4200,
      },
      {
        on: "land:headline",
        select: true,
        set: { headline: "Welcome to Acme" },
        wait: 3200,
      },
    ],
  },
  {
    name: "Sam",
    color: "#10b981",
    script: [
      { on: "land:cta", select: true, wait: 2600 },
      { on: "land:cta", select: true, set: { cta: "#7c3aed" }, wait: 3600 },
      { on: "m:land:cta", select: true, wait: 2400 },
      { on: "land:cta", select: true, set: { cta: "#2563eb" }, wait: 2600 },
    ],
  },
  {
    name: "Kai",
    color: "#0ea5e9",
    script: [
      { on: "land:nav", select: true, wait: 3000 },
      { on: "land:nav", select: true, set: { nav: "Customers" }, wait: 4400 },
      { on: "m:land:headline", select: true, wait: 2600 },
      { on: "land:nav", select: true, set: { nav: "" }, wait: 2000 },
    ],
  },
]

export const DIVES_2023: Array<Dive> = [
  {
    slug: "breadcrumbs",
    title: "Breadcrumbs",
    summary:
      "Where you are, read left to right: project, branch, page, variant.",
    scenes: [
      {
        view: crumb,
        url: URL,
        peers: TEAM,
        notes: [
          {
            kind: "concept",
            on: "crumb:project",
            beat: 0,
            text: "The project, and under it everything a project holds: settings, branches, localization.",
          },
          {
            kind: "concept",
            on: "crumb:branch",
            beat: 1,
            text: "Branches: work apart from main, then review and merge.",
          },
          {
            kind: "concept",
            on: "crumb:variant",
            beat: 2,
            text: "The variant being edited, last: Base unless recording.",
          },
          {
            kind: "direction",
            on: "modes",
            beat: 3,
            text: "Design, Logic, Preview: modes for the same page, not separate tools.",
          },
          {
            kind: "concept",
            on: "board:mobile",
            beat: 4,
            text: "Every screen side by side on one canvas, zoomed into as a design tool would.",
          },
          {
            kind: "discovery",
            on: "top",
            side: "bottom",
            beat: 6,
            text: "The shell was also drawn floating, the top bar as pills and the right panel as a card. It wasn’t carried forward: the year ends docked.",
          },
        ],
        script: [
          { on: "crumb:project", wait: 2200 },
          { on: "crumb:branch", wait: 2200 },
          { on: "crumb:variant", wait: 2200 },
          { on: "modes", wait: 2400 },
          {
            on: "board:mobile",
            say: "Zoom in on the phone",
            set: { zz: 0.9, zx: -1260, zy: -40 },
            wait: 2600,
          },
          {
            on: "zoom-level",
            say: "And back out",
            set: { zz: 0.42, zx: 40, zy: 40 },
            wait: 2000,
          },
          { on: "top", at: [0.5, 0.5], wait: 2800 },
        ],
        explore: {
          label: "3 shells",
          on: "top",
          title: "The 2023 shell, explored",
          items: CHROME,
        },
      },
    ],
  },
  {
    slug: "together",
    title: "Building Together",
    summary:
      "Four people on one page at once: a headline, a button, a link, and a new card.",
    scenes: [
      {
        view: crumb,
        url: URL,
        state: { left: "none", zz: 0.54, zx: 0, zy: 24 },
        peers: CREW,
        script: [
          { on: "avatars", wait: 2600 },
          {
            on: "land:features",
            at: [0.97, 0.5],
            say: "Add a fourth feature",
            click: true,
            set: { features: true, featureName: "" },
            wait: 900,
          },
          {
            on: "land:feature-3",
            at: [0.3, 0.3],
            shape: "text",
            type: { key: "featureName", text: "Secure" },
            wait: 3200,
          },
          {
            on: "m:land:features",
            say: "It’s on mobile too",
            wait: 3000,
          },
          {
            on: "land:features",
            set: { features: false },
            wait: 1600,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "avatars",
            side: "bottom",
            beat: 0,
            text: "Everyone in the page at once, each selection in its person’s color, with their name.",
          },
          {
            kind: "concept",
            on: "land:feature-3",
            side: "bottom",
            beat: 2,
            text: "Each change lands on every canvas as it is made: a headline, a button’s color, a link, a card.",
          },
          {
            kind: "concept",
            on: "m:land:features",
            side: "left",
            beat: 3,
            text: "One page, laid out for each screen: the new card is on the mobile board too.",
          },
        ],
      },
    ],
  },
  {
    slug: "page-settings",
    title: "A Page’s Settings",
    summary:
      "A path with a parameter, previewed with a value; SEO; and who may edit the page.",
    scenes: [
      {
        view: crumb,
        url: URL,
        state: { left: "none", zz: 0.5, zx: 20, zy: 270 },
        script: [
          {
            on: "crumb:page",
            say: "Open the page’s settings",
            click: true,
            set: { pageSet: "Page path", headline: "Posts from Jan" },
            wait: 1600,
          },
          { on: "pageset:route", wait: 2400 },
          {
            on: "pageset:month",
            say: "Preview it with another month",
            shape: "text",
            click: true,
            set: { monthFocus: true, month: "" },
            wait: 300,
          },
          {
            on: "pageset:month",
            shape: "text",
            type: { key: "month", text: "Feb" },
            wait: 500,
          },
          {
            on: "pageset:preview",
            set: { monthFocus: false, headline: "Posts from Feb" },
            wait: 2400,
          },
          {
            on: "pageset:seo",
            say: "Then its SEO",
            click: true,
            set: { pageSet: "SEO" },
            wait: 1200,
          },
          {
            on: "pageset:desc",
            shape: "text",
            click: true,
            set: { descFocus: true },
            wait: 300,
          },
          {
            on: "pageset:desc",
            shape: "text",
            type: {
              key: "desc",
              text: "Every post from the month, newest first.",
            },
            wait: 600,
          },
          { on: "pageset:count", set: { descFocus: false }, wait: 2200 },
          {
            on: "pageset:more",
            say: "And who may edit it",
            click: true,
            set: { pageSet: "More…" },
            wait: 2600,
          },
          {
            on: "crumb:page",
            click: true,
            set: {
              pageSet: "",
              headline: "Welcome to Acme",
              month: "Jan",
              desc: "",
            },
            wait: 1400,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "pageset:route",
            side: "bottom",
            beat: [1, 2, 3, 4],
            text: "A path can hold a parameter, /posts/[month], previewed on the canvas with a value: “Defined in path, e.g. [param].”",
          },
          {
            kind: "direction",
            on: "pageset:seo",
            side: "left",
            beat: 5,
            text: "Worked out beside the frames: “modal dialog / tabs / ??? / 2. seo / 3. meta.”",
          },
          {
            kind: "concept",
            on: "pageset:count",
            side: "right",
            beat: [7, 8],
            text: "SEO by the design: a title, content counted against the 160 characters recommended, and an image.",
          },
          {
            kind: "concept",
            on: "pageset",
            side: "bottom",
            beat: 9,
            text: "“Page editable by…”: Content editors, or Viewers.",
          },
        ],
      },
    ],
  },
  {
    slug: "branches",
    title: "Branches & Merging",
    summary: "Branching a project, and picking which changes to keep.",
    scenes: [
      {
        view: crumb,
        url: URL,
        script: [
          {
            on: "crumb:project",
            say: "Open the project menu",
            click: true,
            set: { projMenu: true },
            wait: 900,
          },
          { on: "proj:branch", set: { branches: true }, wait: 1600 },
          {
            on: "branch:feat/pricing",
            say: "A teammate’s branch",
            set: { branchSub: "feat/pricing" },
            wait: 1600,
          },
          {
            on: "branch:merge",
            say: "Review and merge it",
            click: true,
            set: {
              projMenu: false,
              branches: false,
              branchSub: "",
              merge: true,
            },
            wait: 3200,
          },
        ],
        notes: [
          {
            kind: "direction",
            on: "branches",
            beat: [1, 2],
            text: "“Need to find a way to indicate the current branch”: a check, and the branch in the breadcrumb.",
          },
          {
            kind: "concept",
            on: "merge:table",
            beat: 3,
            text: "Merging picks, change by change, which branch to keep: pages, components, and tokens.",
          },
          {
            kind: "direction",
            on: "merge",
            beat: 3,
            text: "“make these toggle switch-like”",
          },
        ],
      },
    ],
  },
  {
    slug: "publish",
    title: "Publish & Tests",
    summary:
      "Publishing as a pipeline: save a version, run tests, deploy, and fix what they find.",
    scenes: [
      {
        view: crumb,
        url: URL,
        script: [
          {
            on: "publish",
            say: "Publish",
            click: true,
            set: { publish: true },
            wait: 1200,
          },
          { on: "publish:steps", wait: 1800 },
          {
            on: "publish:run",
            say: "Run the tests first",
            click: true,
            set: { testsRun: true },
            wait: 1600,
          },
          {
            on: "publish:review",
            say: "Review what they found",
            click: true,
            set: { publish: false, left: "tests" },
            wait: 1600,
          },
          {
            on: "autofix:1",
            say: "Auto-fix",
            click: true,
            set: { fixed: 1 },
            wait: 1400,
          },
          { on: "autofix:2", click: true, set: { fixed: 2 }, wait: 1800 },
        ],
        notes: [
          {
            kind: "concept",
            on: "publish:steps",
            beat: 1,
            text: "Publishing is a pipeline: save a version, run tests, deploy a site, call webhooks, push to GitHub.",
          },
          {
            kind: "concept",
            on: "publish:tests",
            beat: 2,
            text: "Tests check for errors and waste before anything ships.",
          },
          {
            kind: "concept",
            on: "tests",
            beat: [3, 4, 5],
            text: "Each finding names its element; some fix themselves: an inefficient visibility setting, variant styles that change nothing.",
          },
        ],
      },
    ],
  },
  {
    slug: "logic",
    title: "Logic",
    summary:
      "State, props, and interactions beside the design; and a flow graph, a north star.",
    scenes: [
      {
        view: crumb,
        url: URL,
        state: { mode: "logic" },
        script: [
          { on: "logic:state", wait: 2200 },
          { on: "logic:interactions", wait: 2400 },
          {
            on: "mode:logic",
            say: "Draw it as a flow",
            set: { flow: true },
            wait: 1200,
          },
          { on: "logic:node", wait: 3000 },
        ],
        notes: [
          {
            kind: "concept",
            on: "logic:state",
            beat: 0,
            text: "Local state: values a component keeps, like a counter’s Count.",
          },
          {
            kind: "direction",
            on: "logic:interactions",
            beat: 1,
            text: "“interactions are selection specific”; “everything else higher up”.",
          },
          {
            kind: "direction",
            on: "logic:flow",
            beat: [2, 3],
            text: "A north star: interactions as a flow graph, from Entry through actions to Exit. Explored, and left for a list.",
          },
          {
            kind: "concept",
            on: "logic:node",
            beat: 3,
            text: "OnClick: set Count to Count + 1.",
          },
        ],
      },
    ],
  },
  {
    slug: "app-builder",
    title: "App Builder",
    summary:
      "Internal apps: templates, lists bound to data, queries, and sign-in.",
    scenes: [
      {
        view: crumb,
        url: "studio.plasmic.app/projects/crm-app",
        state: { ...APP, crm: true },
        notes: [
          {
            kind: "direction",
            on: "rail",
            beat: 0,
            text: "The rail got labels: Insert, Tree, Pages, Components, Styles, Assets, Copilot.",
          },
          {
            kind: "concept",
            on: "crm:list",
            beat: 1,
            text: "A list bound to a collection: one card designed, repeated for every company in the data.",
          },
          {
            kind: "direction",
            on: "modes",
            beat: 2,
            text: "Build and Preview, as one switch: try the app without leaving it.",
          },
        ],
        script: [
          { on: "rail:components", wait: 2400 },
          { on: "crm:list", wait: 2600 },
          { on: "mode:preview", wait: 2200 },
        ],
      },
      {
        view: crumb,
        url: "studio.plasmic.app/projects/crm-app",
        state: { ...APP, newPage: true },
        script: [
          { on: "tpl", wait: 2200 },
          { on: "tpl:inbox", set: { tpl: "Inbox" }, wait: 1300 },
          { on: "tpl:kanban-board", set: { tpl: "Kanban board" }, wait: 1300 },
          { on: "tpl:data-details", set: { tpl: "Data details" }, wait: 1300 },
          {
            on: "tpl:cards",
            say: "Start from Cards",
            set: { tpl: "Cards" },
            wait: 700,
          },
          {
            on: "tpl:cards",
            click: true,
            set: { newPage: false, crm: true, tpl: "" },
            wait: 2800,
          },
        ],
        notes: [
          {
            kind: "direction",
            on: "tpl",
            side: "right",
            beat: [0, 1, 2, 3],
            text: "A new page opens on templates in the shapes internal apps take: cards, inbox, table, kanban board, list, form, and data details.",
          },
          {
            kind: "concept",
            on: "crm:list",
            side: "bottom",
            beat: 5,
            text: "Cards, filled from the data: one card designed, one per row.",
          },
        ],
      },
      {
        view: crumb,
        url: "studio.plasmic.app/projects/crm-app",
        state: { ...APP, crm: true },
        script: [
          {
            on: "rail:data",
            say: "Open the page’s data",
            click: true,
            set: { query: true },
            wait: 1600,
          },
          { on: "query:form", wait: 2400 },
          { on: "query:preview", at: [0.5, 0.45], wait: 2400 },
          {
            on: "query:sql",
            say: "The same query, as SQL",
            click: true,
            set: { sql: true },
            wait: 1400,
          },
          {
            on: "query:code",
            at: [0.9, 0.5],
            shape: "text",
            click: true,
            set: { sqlFocus: true },
            wait: 300,
          },
          {
            on: "query:code",
            at: [0.9, 0.5],
            shape: "text",
            type: { key: "where", text: "state = 'CA'" },
            wait: 900,
          },
          {
            on: "query:run",
            say: "Save & run",
            click: true,
            set: { sqlFocus: false, ran: true },
            wait: 2600,
          },
          {
            on: "query:view",
            say: "See it as JSON",
            click: true,
            set: { json: true },
            wait: 2600,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "query:form",
            side: "top",
            beat: [1],
            text: "A query fetches, caches, and updates a page’s data, from a source picked here, in a GUI or SQL.",
          },
          {
            kind: "concept",
            on: "query:preview",
            side: "top",
            beat: [2, 6, 7],
            text: "Its rows previewed as the page will get them, as a table or JSON.",
          },
        ],
      },
      {
        view: crumb,
        url: "studio.plasmic.app/projects/crm-app",
        state: { ...APP, crm: true, viewAs: "Admin" },
        script: [
          {
            on: "rail:settings",
            say: "Open the project’s settings",
            click: true,
            set: { settings: true },
            wait: 1600,
          },
          { on: "auth:provider", wait: 2200 },
          { on: "auth:registration", wait: 2200 },
          {
            on: "auth:google",
            at: [0.12, 0.5],
            say: "Let people sign in with Google",
            click: true,
            set: { google: true },
            wait: 1800,
          },
          { on: "auth:roles", wait: 2400 },
          {
            on: "auth:login",
            at: [0.12, 0.5],
            say: "New pages need a login",
            click: true,
            set: { loginNeeded: true },
            wait: 2000,
          },
          {
            on: "viewas",
            say: "View the app as Anonymous",
            click: true,
            set: { settings: false, viewAs: "Anonymous" },
            wait: 2600,
          },
          {
            on: "viewas",
            say: "As a Normal user",
            click: true,
            set: { viewAs: "Normal" },
            wait: 2400,
          },
          {
            on: "viewas",
            say: "As an Admin",
            click: true,
            set: { viewAs: "Admin" },
            wait: 2400,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "settings:nav",
            side: "left",
            beat: [1, 2],
            text: "An app has users: Authentication sits in the project’s Settings with data sources, publishing, the app host, and localization.",
          },
          {
            kind: "concept",
            on: "auth:roles",
            side: "right",
            beat: 4,
            text: "Roles nest, Admin over Power over Normal, and a page can ask for one.",
          },
          {
            kind: "concept",
            on: "auth:defaults",
            side: "right",
            beat: 5,
            text: "Defaults for new pages: Login needed, Role needed.",
          },
          {
            kind: "concept",
            on: "crm:nav:contracts",
            side: "right",
            beat: [6, 7, 8],
            text: "“Viewing as”: the app as each role meets it, from inside the editor.",
          },
        ],
      },
    ],
  },
  {
    slug: "dashboard",
    title: "The Dashboard, Again",
    summary:
      "An organization and its workspaces, a trial counting down, and new apps from templates.",
    scenes: [
      {
        view: (s: State) => <Dashboard23 s={s} />,
        url: "studio.plasmic.app/workspaces/marketing",
        change: {
          from: () => <Dashboard21 s={{}} />,
          title: "2023: the dashboard, again",
          items: [
            "An organization over its workspaces, where 2021 had teams",
            "Create an app or a website from a template, up top",
            "Integrations, Usage, and CMS beside Projects",
          ],
        },
        script: [
          { on: "d23:workspaces", at: [0.5, 0.4], wait: 2600 },
          { on: "d23:upgrade", wait: 2400 },
          { on: "d23:tpl:mobile", set: { hover: "mobile" }, wait: 900 },
          { on: "d23:tpl:some", set: { hover: "some" }, wait: 900 },
          {
            on: "d23:tpl:desktop",
            say: "A new app, desktop-first",
            set: { hover: "desktop" },
            wait: 600,
          },
          {
            on: "d23:tpl:desktop",
            click: true,
            set: { hover: "", created: true },
            wait: 2800,
          },
          { on: "d23:tab:integrations", wait: 2200 },
        ],
        notes: [
          {
            kind: "direction",
            on: "d23:workspaces",
            side: "right",
            beat: 0,
            text: "The dashboard, regrouped: an organization (“Acme / Organization”), and under it its workspaces.",
          },
          {
            kind: "direction",
            on: "d23:upgrade",
            side: "right",
            beat: 1,
            text: "A free trial, counted down beside Upgrade: “8 days left.”",
          },
          {
            kind: "concept",
            on: "d23:create",
            side: "bottom",
            beat: [2, 3, 4],
            text: "“Create a new App | Website”: a project can start from a template, right on the dashboard.",
          },
        ],
      },
    ],
  },
  {
    slug: "copilot",
    title: "Command & Copilot",
    summary: "One search for every action, and an assistant that builds.",
    scenes: [
      {
        view: crumb,
        url: URL,
        state: { labeled: true, palette: false },
        script: [
          {
            on: "palette:open",
            say: "Press ⌘K",
            click: true,
            set: { palette: true },
            wait: 900,
          },
          {
            on: "palette:search",
            type: { key: "q", text: "Button" },
            wait: 1600,
          },
          {
            on: "pal:0",
            say: "Ask Copilot instead",
            click: true,
            set: { palette: false, left: "copilot", q: "" },
            wait: 3200,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "palette",
            beat: 1,
            text: "One palette for everything: insert, create, wrap, apply, edit, and the docs.",
          },
          {
            kind: "direction",
            on: "copilot",
            beat: 2,
            text: "Copilot started in the palette; the note on it says “this goes in a left panel”.",
          },
        ],
      },
    ],
  },
]
