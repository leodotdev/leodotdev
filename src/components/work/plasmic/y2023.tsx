import { EditorCrumb } from "@/components/work/plasmic/kit/editor23"
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
            text: "The project, and under it everything a project holds: settings, imports, tests.",
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
      "Internal apps: a labeled rail, collections, and lists bound to data.",
    scenes: [
      {
        view: crumb,
        url: "studio.plasmic.app/projects/crm-app",
        state: { labeled: true, project: "CRM App", crm: true, left: "none" },
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
