import { Editor } from "@/components/work/plasmic/kit/editor"
import { Editor21 } from "@/components/work/plasmic/kit/editor21"
import { Connect } from "@/components/work/plasmic/kit/onboard"
import { Dashboard21 } from "@/components/work/plasmic/kit/teams"
import type { Dive, Peer, Shot, State } from "@/components/work/plasmic/types"

// 2021, rebuilt from the year's three quarterly files ("2021 Q1–Q3
// Product"): the panels dock again around a 48px rail, the project gets a
// panel of its own, components get behavior, recording moves onto the
// canvas, data arrives, and by Q3 the rail itself goes. The directions
// quote the files' notes, including the lo-fi map that names every region.
// Q3 also grew the dashboard teams, workspaces, and plans to pay for them.

const e21 = (s: State) => <Editor21 s={s} />
const URL = "studio.plasmic.app/projects/acme-store"

const whole = (label: string, state: State): Shot => ({
  label,
  w: 1440,
  h: 868,
  view: () => <Editor21 s={state} />,
})

const RECORDING_EXPLORATIONS: Array<Shot> = [
  whole("The right panel as an inset card, values in mono", {
    left: "component",
    rec: "Round",
    expand: "size,text",
  }),
  whole("“Recording locked…”, with Done", {
    left: "component",
    rec: "Round",
    recLocked: true,
    expand: "size,text",
  }),
  whole("The picker on the canvas, its types listed", {
    left: "component",
    pill: true,
    types: true,
    typeHover: "Single-select group",
  }),
  whole("Recording into Round, from the canvas’s pill", {
    left: "component",
    rec: "Round",
    expand: "size,text",
  }),
]

const TEAM: Array<Peer> = [
  {
    name: "Maya",
    color: "#ec4899",
    script: [
      { on: "site:nav", select: true, wait: 2200 },
      { on: "site:grid", select: true, wait: 2400 },
    ],
  },
  {
    name: "Kai",
    color: "#0ea5e9",
    script: [
      { on: "p:about", wait: 1800 },
      { on: "site:hero", select: true, wait: 2600 },
    ],
  },
]

export const DIVES_2021: Array<Dive> = [
  {
    slug: "docked",
    title: "Docked Again",
    summary:
      "The panels dock again around a rail, and every region gets a job.",
    scenes: [
      {
        view: e21,
        url: URL,
        change: {
          from: () => (
            <Editor s={{ layout: "rail", left: "insert", leftFloat: true }} />
          ),
          title: "2021: docked again",
          items: [
            "A 44px top bar: the page and its screen in dropdowns",
            "Panels dock beside a 48px rail, not floating",
            "A project panel: pages, components, imports, and code",
          ],
        },
        notes: [
          {
            kind: "direction",
            on: "left",
            beat: 0,
            text: "The lo-fi map named each region’s job: “arenas and variants” on the left…",
          },
          {
            kind: "direction",
            on: "tool:0",
            beat: 1,
            text: "…“insert, create, tools” across the middle of the top bar…",
          },
          {
            kind: "direction",
            on: "publish",
            beat: 2,
            text: "…“view, preview, publish” at its end…",
          },
          {
            kind: "direction",
            on: "right",
            beat: 3,
            text: "…“selection meta, data, styles” on the right…",
          },
          {
            kind: "direction",
            on: "rail",
            beat: 4,
            text: "…and “navigation, assets, settings” down the rail, with “plugin, help, account” at its foot.",
          },
        ],
        script: [
          { on: "p:home", wait: 2400 },
          { on: "tool:2", wait: 2400 },
          { on: "publish", wait: 2400 },
          { on: "sec:size", wait: 2400 },
          { on: "rail:assets", wait: 2400 },
        ],
      },
    ],
  },
  {
    slug: "multi",
    title: "Recording Many",
    summary:
      "Q1: recording into several variants at once, and a north star with code beside the design.",
    scenes: [
      {
        view: e21,
        url: URL,
        state: { expand: "size,text" },
        script: [
          { on: "board:home", wait: 1800 },
          {
            on: "pill",
            say: "Target three variants",
            set: { multiRec: "new layout experiment,with blue button,Mobile" },
            wait: 2400,
          },
          { on: "multi-rec", wait: 2600 },
          { on: "sec:text", say: "One edit, all three", wait: 2400 },
        ],
        notes: [
          {
            kind: "concept",
            on: "multi-rec",
            beat: [2, 3],
            text: "Multi-editing: record into several variants at once, and the edit lands on their combination. Each chip comes off with its ×.",
          },
          {
            kind: "direction",
            on: "board:home",
            beat: [1, 2],
            text: "Everything being recorded turns coral red: the chips, the artboard, and the names stacked over it.",
          },
        ],
      },
      {
        view: e21,
        url: URL,
        state: { sel: "nav", codeDrawer: true },
        script: [
          { on: "site:nav", wait: 2000 },
          { on: "code-drawer", wait: 3000 },
        ],
        notes: [
          {
            kind: "direction",
            on: "code-drawer",
            beat: 1,
            text: "A north star, “Focused Mode”: the selection’s React and CSS in a drawer under the canvas, ejected once into plain React. Shelved; code components and the code sync carried it instead.",
          },
        ],
      },
    ],
  },
  {
    slug: "project",
    title: "The Project Panel",
    summary: "Pages, components, imports, and code components in one list.",
    scenes: [
      {
        view: e21,
        url: URL,
        peers: [TEAM[1]],
        script: [
          { on: "p:contact", set: { pageHover: "contact" }, wait: 1800 },
          {
            on: "p:contact:more",
            say: "Open the page’s menu",
            click: true,
            set: { pageMenu: true },
            wait: 600,
          },
          {
            on: "item:convert to component",
            set: { menuHover: "Convert to component" },
            wait: 1800,
          },
          {
            on: "p:contact:settings",
            say: "Its settings: path, title, SEO",
            click: true,
            set: { pageMenu: false, pageSettings: true },
            wait: 2600,
          },
          {
            on: "group:imported from systemkit",
            set: { pageSettings: false, pageHover: "" },
            wait: 2200,
          },
          { on: "group:code components", wait: 2400 },
        ],
        notes: [
          {
            kind: "concept",
            on: "p:contact",
            beat: [0, 1],
            text: "A page has a path (/contact); under the pointer a row shows it, with settings and a menu.",
          },
          {
            kind: "concept",
            on: "page-settings",
            beat: 3,
            text: "Page settings: its path, title, description, and the image it shares with, for search and social.",
          },
          {
            kind: "concept",
            on: "group:imported from systemkit",
            beat: 4,
            text: "Imported from SystemKit: components from another project, kept in step with its published versions. Ones not in use are dimmed.",
          },
          {
            kind: "concept",
            on: "group:code components",
            beat: 5,
            text: "Code components: a codebase’s own React components, registered so designers can place them like any other.",
          },
          {
            kind: "direction",
            on: "group:behavioral components",
            beat: [4, 5],
            text: "“plus icons here? i think yes”",
          },
        ],
      },
    ],
  },
  {
    slug: "right-panel",
    title: "Visibility & Values",
    summary:
      "Visible, rendered but hidden, or not rendered; and a value’s own menu.",
    scenes: [
      {
        view: e21,
        url: URL,
        state: { sel: "nav", expand: "size" },
        script: [
          { on: "sec:visibility", wait: 2400 },
          {
            on: "vis:none",
            say: "Open the visibility menu",
            click: true,
            set: { vis: true },
            wait: 900,
          },
          {
            on: "vismenu:keep",
            say: "Render it, but keep it hidden",
            set: { menuHover: "Render, but keep hidden" },
            wait: 500,
          },
          {
            on: "vismenu:keep",
            click: true,
            set: { vis: false, menuHover: "", visMode: "keep" },
            wait: 2600,
          },
          {
            on: "vis:none",
            say: "Or don’t render it at all",
            click: true,
            set: { vis: true },
            wait: 700,
          },
          {
            on: "vismenu:none",
            click: true,
            set: { vis: false, visMode: "none" },
            wait: 2600,
          },
          {
            on: "f:width",
            say: "Right-click a value",
            click: true,
            set: { ctx: true, visMode: "" },
            wait: 900,
          },
          {
            on: "ctx:token",
            set: { menuHover: "Extract to Token" },
            wait: 1400,
          },
          { on: "ctx:data", set: { menuHover: "Link to data" }, wait: 2400 },
          { on: "f:width", set: { ctx: false, menuHover: "" }, wait: 1000 },
        ],
        notes: [
          {
            kind: "direction",
            on: "top",
            side: "bottom",
            beat: 0,
            text: "Q2 drew every screen twice, light and dark, on Apple’s system grays; by the file’s end, every new screen is dark.",
          },
          {
            kind: "concept",
            on: "site:nav",
            side: "bottom",
            beat: 3,
            text: "“Render, but keep hidden”: the navigation is still there, holding its room.",
          },
          {
            kind: "concept",
            on: "canvas",
            side: "left",
            beat: 5,
            text: "“Don’t render”: gone, and the page closes up behind it.",
          },
          {
            kind: "concept",
            on: "ctx-menu",
            side: "bottom",
            beat: [7, 8],
            text: "A value’s own menu: take it out of a variant or the base, extract it to a mixin, token, or variant, or link it to a prop or data.",
          },
        ],
      },
    ],
  },
  {
    slug: "behavior",
    title: "Behavioral Components",
    summary:
      "Components that come with behavior, and a checklist of what’s missing.",
    scenes: [
      {
        view: e21,
        url: URL,
        state: { left: "component", sel: "nav" },
        script: [
          { on: "component:head", wait: 2200 },
          { on: "missing", wait: 2600 },
          { on: "vg:interactions", wait: 2400 },
          { on: "vg:toggles", wait: 2400 },
        ],
        notes: [
          {
            kind: "concept",
            on: "component:head",
            beat: 0,
            text: "A behavioral component (Select, Checkbox, Tabs) brings its behavior, keyboard, and accessibility; the design team draws how it looks.",
          },
          {
            kind: "concept",
            on: "missing",
            beat: 1,
            text: "“Missing”: the variants, slots, and elements it needs before it works, each a link to make it.",
          },
          {
            kind: "concept",
            on: "vg:interactions",
            beat: 2,
            text: "Interactions (Hover, Focused) turn on by themselves…",
          },
          {
            kind: "concept",
            on: "vg:toggles",
            beat: 3,
            text: "…toggles (isOpen, isDisabled) are set from outside, as props.",
          },
        ],
      },
    ],
  },
  {
    slug: "recording",
    title: "Recording, Rethought",
    summary: "Choosing what to record from a pill on the canvas.",
    scenes: [
      {
        view: e21,
        url: URL,
        state: { left: "component", expand: "size,text" },
        script: [
          {
            on: "pill",
            say: "Choose what to record",
            click: true,
            set: { pill: true },
            wait: 1600,
          },
          {
            on: "picker:new",
            say: "Make a new variant",
            click: true,
            set: { types: true },
            wait: 800,
          },
          {
            on: "type:single-select group",
            set: { typeHover: "Single-select group" },
            wait: 1600,
          },
          {
            on: "type:single-select group",
            click: true,
            set: { types: false },
            wait: 700,
          },
          {
            on: "picker:round",
            say: "Record into Round",
            click: true,
            set: { pill: false, rec: "Round" },
            wait: 2600,
          },
          { on: "sec:text", wait: 2600 },
        ],
        notes: [
          {
            kind: "concept",
            on: "picker:types",
            beat: 2,
            text: "Variant types: interactions, toggles, single- or multi-select groups, screen breakpoints, globals, and combinations of them.",
          },
          {
            kind: "direction",
            on: "pill",
            beat: [4, 5],
            text: "Recording moved to a pill on the canvas: what you are recording into, always in view, and one click to stop.",
          },
          {
            kind: "concept",
            on: "sec:text",
            beat: 5,
            text: "While recording, the panel is ringed in red and every change is Round’s.",
          },
        ],
        explore: {
          label: "4 recording modes",
          on: "right:head",
          title: "Recording, explored",
          items: RECORDING_EXPLORATIONS,
        },
      },
    ],
  },
  {
    slug: "data",
    title: "Data & Insert",
    summary:
      "Queries, logic, and props beside the design; insert before, inside, or after.",
    scenes: [
      {
        view: e21,
        url: URL,
        state: { sel: "nav" },
        script: [
          {
            on: "data-toggle",
            say: "Open the data panel",
            click: true,
            set: { data: true },
            wait: 1800,
          },
          { on: "data:logic", wait: 2600 },
          { on: "data:props", wait: 2400 },
          {
            on: "tool:insert",
            say: "Insert after the navigation",
            click: true,
            set: { data: false, insert: true },
            wait: 900,
          },
          {
            on: "insert:where",
            at: [0.5, 0.5],
            click: true,
            set: { where: 1 },
            wait: 900,
          },
          { on: "ins:card", set: { insSel: "Card" }, wait: 2000 },
        ],
        notes: [
          {
            kind: "concept",
            on: "data:logic",
            side: "left",
            beat: 1,
            text: "Logic: show an element only if a value is true, or repeat it for each item in a collection from a query.",
          },
          {
            kind: "concept",
            on: "data:props",
            side: "left",
            beat: 2,
            text: "Props: what an instance passes in, and what happens on click or hover.",
          },
          {
            kind: "direction",
            on: "insert:where",
            beat: [4, 5],
            text: "Insert asks where first: before, inside, or after the selection.",
          },
        ],
      },
    ],
  },
  {
    slug: "preview",
    title: "Preview",
    summary:
      "The page on its own, any page or variant, and back to the studio.",
    scenes: [
      {
        view: e21,
        url: "studio.plasmic.app/projects/acme-store/preview/cart",
        state: { preview: true },
        script: [
          {
            on: "preview:picker",
            say: "Pick a page or a component",
            click: true,
            set: { pickerOpen: true },
            wait: 900,
          },
          {
            on: "item:shopping cart",
            set: { menuHover: "Shopping Cart" },
            wait: 2000,
          },
          { on: "preview:back", set: { pickerOpen: false }, wait: 2200 },
        ],
        notes: [
          {
            kind: "concept",
            on: "preview:page",
            beat: 2,
            text: "Preview: the page as it will ship, at any width (the grips either side), in any variant.",
          },
        ],
      },
    ],
  },
  {
    slug: "teams",
    title: "Teams & Plans",
    summary:
      "Teams, workspaces, and drafts in the dashboard, and the plans to pay for them.",
    scenes: [
      {
        view: (s: State) => <Dashboard21 s={s} />,
        url: "studio.plasmic.app/projects",
        span: 2,
        explore: {
          label: "3 team pickers",
          on: "dash:upgrade",
          title: "Select a team to upgrade, three ways",
          items: [
            {
              label: "A list of teams, or a new one",
              w: 1440,
              h: 868,
              view: () => <Dashboard21 s={{ upgrade: "team", pick: "list" }} />,
            },
            {
              label: "Choose one, then Next",
              w: 1440,
              h: 868,
              view: () => (
                <Dashboard21 s={{ upgrade: "team", pick: "choose" }} />
              ),
            },
            {
              label: "No team yet: name one",
              w: 1440,
              h: 868,
              view: () => (
                <Dashboard21 s={{ upgrade: "team", pick: "create" }} />
              ),
            },
          ],
        },
        script: [
          { on: "dash:teams", wait: 2400 },
          { on: "dash:crumbs:designkit-form-controls", wait: 2400 },
          {
            on: "dash:upgrade",
            say: "Upgrade a team",
            click: true,
            set: { upgrade: "team" },
            wait: 1600,
          },
          {
            on: "team:design",
            say: "Pick the Design team",
            set: { hover: "team:Design" },
            wait: 700,
          },
          {
            on: "team:design",
            click: true,
            set: { upgrade: "plans", hover: "" },
            wait: 2600,
          },
          { on: "plan:growth", say: "Compare the plans", wait: 2600 },
          { on: "plan:pro", wait: 2400 },
          {
            on: "plan:pro:cta",
            say: "Select Pro",
            click: true,
            set: { upgrade: "checkout" },
            wait: 1400,
          },
          {
            on: "seats:plus",
            say: "Add a seat",
            click: true,
            set: { seats: 2 },
            wait: 1800,
          },
          {
            on: "card",
            say: "Pay by card",
            shape: "text",
            click: true,
            set: { cardFocus: true },
            wait: 300,
          },
          {
            on: "card",
            shape: "text",
            type: { key: "card", text: "4242 4242" },
            wait: 700,
          },
          {
            on: "checkout:submit",
            say: "Submit",
            click: true,
            set: { error: true, cardFocus: false },
            wait: 3200,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "dash:teams",
            side: "right",
            beat: 0,
            text: "Teams in the dashboard’s nav, each with its workspaces, and Drafts.",
          },
          {
            kind: "concept",
            on: "dash:crumbs:designkit-form-controls",
            beat: 1,
            text: "A row says where its project lives: version, team, and workspace.",
          },
          {
            kind: "direction",
            on: "plans:head",
            side: "top",
            beat: 4,
            text: "The upgrade names what it unlocks: “This team’s current plan does not support shared workspaces.”",
          },
          {
            kind: "direction",
            on: "plan:growth",
            side: "bottom",
            beat: 5,
            text: "Growth promised optimization, segmented content, and scheduled content, before the ribbon’s Optimize tab drew them.",
          },
          {
            kind: "direction",
            on: "plan:pro",
            side: "bottom",
            beat: 6,
            text: "Priced per collaborator. An earlier card called Pro “Basic,” at $15.",
          },
          {
            kind: "direction",
            on: "checkout:error",
            side: "bottom",
            beat: 11,
            text: "The checkout’s failure was drawn too: “Your card number is incomplete.”",
          },
        ],
      },
    ],
  },
  {
    slug: "connect",
    title: "Connect a Codebase",
    summary:
      "Onboarding: a new project asks where its code will live, then hands over one command.",
    scenes: [
      {
        view: (s: State) => (
          <>
            <Editor21 s={s} />
            {Boolean(s.wizard) && <Connect s={s} />}
          </>
        ),
        url: URL,
        state: { wizard: "repo" },
        explore: {
          label: "2 ways in",
          on: "wizard",
          title: "Step two, by repo",
          items: [
            {
              label: "A test repo: NextJS, Gatsby, or Other",
              w: 1440,
              h: 868,
              view: () => (
                <>
                  <Editor21 s={{}} />
                  <Connect s={{ wizard: "flavor" }} />
                </>
              ),
            },
            {
              label: "Your own repo: React too, and a longer snippet",
              w: 1440,
              h: 868,
              view: () => (
                <>
                  <Editor21 s={{}} />
                  <Connect
                    s={{ wizard: "flavor", repo: "existing", flavor: "react" }}
                  />
                </>
              ),
            },
          ],
        },
        script: [
          { on: "choice:test", wait: 2400 },
          {
            on: "choice:existing",
            set: { repo: "existing" },
            click: true,
            wait: 1400,
          },
          {
            on: "choice:test",
            say: "Start from a test repo",
            click: true,
            set: { repo: "test" },
            wait: 1000,
          },
          {
            on: "wizard:next",
            click: true,
            set: { wizard: "flavor" },
            wait: 1400,
          },
          {
            on: "flavor:gatsby",
            say: "Pick a flavor",
            click: true,
            set: { flavor: "gatsby" },
            wait: 2400,
          },
          {
            on: "wizard:copy",
            say: "Copy the command",
            click: true,
            set: { copied: true },
            wait: 2200,
          },
          { on: "wizard:sync", wait: 2600 },
          {
            on: "wizard:done",
            say: "Done: off to the terminal",
            click: true,
            set: { wizard: "" },
            wait: 2600,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "wizard",
            side: "left",
            beat: [0, 1],
            text: "Plasmic’s pages and components become code in a codebase, so a new project begins by asking which.",
          },
          {
            kind: "concept",
            on: "wizard:command",
            side: "right",
            beat: [4, 5],
            text: "One command makes the app, already wired to this project, in the flavor picked.",
          },
          {
            kind: "direction",
            on: "wizard:sync",
            side: "right",
            beat: 6,
            text: "“Now make some changes in the studio and see your updates sync!” Then into the real codebase.",
          },
        ],
      },
    ],
  },
  {
    slug: "sand",
    title: "Sand & Grid",
    summary: "A warmer canvas, padding drawn on it, and CSS grid.",
    scenes: [
      {
        view: e21,
        url: URL,
        state: { sand: true, sel: "hero", expand: "padding,layout" },
        peers: TEAM,
        script: [
          { on: "canvas", at: [0.85, 0.15], wait: 2000 },
          {
            on: "sec:padding",
            say: "Padding, on the canvas",
            set: { handles: true },
            wait: 2600,
          },
          {
            on: "sec:layout",
            say: "Lay the products out in a grid",
            click: true,
            set: { handles: false, grid: true },
            wait: 2600,
          },
        ],
        notes: [
          {
            kind: "direction",
            on: "canvas",
            beat: 0,
            text: "“Sand”: a warm canvas with a dot grid, tried in Q3, so white pages stand out from it.",
          },
          {
            kind: "direction",
            on: "handles",
            beat: 1,
            text: "Margins and padding, drawn and dragged on the canvas itself, not only typed in the panel.",
          },
          {
            kind: "concept",
            on: "site:grid",
            beat: 2,
            text: "Grid layout: columns, rows, and named areas, CSS grid as a choice beside stacks.",
          },
        ],
      },
    ],
  },
  {
    slug: "globals",
    title: "Global Variants & Tokens",
    summary:
      "Dark mode, right-to-left, and screens as variants of everything, and tokens that follow.",
    scenes: [
      {
        view: e21,
        url: URL,
        state: { railless: true, expand: "text" },
        change: {
          from: (s) => <Editor21 s={{ ...s, railless: false }} />,
          title: "Q3: the rail goes",
          items: [
            "The rail’s panels move into the top bar, as a Styles tab",
            "Insert floats at the foot of the canvas",
            "A token opens with a value for each global variant",
          ],
        },
        script: [
          { on: "styles-tabs", wait: 2200 },
          { on: "insert-bar", wait: 2200 },
          {
            on: "sec:text",
            say: "Open the color’s token",
            click: true,
            set: { tokenPop: true },
            wait: 2400,
          },
          {
            on: "token-pop",
            say: "Preview the Dark variant",
            set: { globalDark: true },
            wait: 2600,
          },
          { on: "canvas", set: { tokenPop: false }, wait: 1800 },
        ],
        notes: [
          {
            kind: "direction",
            on: "styles-tabs",
            beat: 0,
            text: "The rail’s icons became a Styles tab in the top bar, giving its width back to the canvas.",
          },
          {
            kind: "direction",
            on: "insert-bar",
            beat: 1,
            text: "Insert became a toolbar floating at the foot of the canvas, where the hand already is.",
          },
          {
            kind: "concept",
            on: "token-pop",
            beat: [2, 3],
            text: "Global variants (Dark, Right-to-left, Mobile) override tokens: one token, a value for each.",
          },
        ],
      },
    ],
  },
]
