import { Editor21 } from "@/components/work/plasmic/kit/editor21"
import { Editor22 } from "@/components/work/plasmic/kit/editor22"
import { EditorCrumb } from "@/components/work/plasmic/kit/editor23"
import { Cms } from "@/components/work/plasmic/kit/cms"
import { EditorTabs } from "@/components/work/plasmic/kit/editortabs"
import { Insights } from "@/components/work/plasmic/kit/insights"
import type { Dive, Shot, State } from "@/components/work/plasmic/types"

// 2022, from the "2021 – 2022 Product" file: the ribbon, a concept car
// after Office's ribbon (every style control in a row of captioned groups
// over the canvas, and no side panels at all), tried between two versions
// of the rail and left; then back to a rail with docked panels under a
// breadcrumb top bar. The directions quote the file's notes.

const e22 = (s: State) => <Editor22 s={s} />
const URL = "studio.plasmic.app/projects/blank-project"

const RIBBONS: Array<Shot> = [
  {
    label: "Captioned groups, the Style tab",
    w: 1440,
    h: 868,
    view: () => <Editor22 s={{}} />,
  },
  {
    label: "A heading: the text group joins, the row runs off the edge",
    w: 1440,
    h: 868,
    view: () => <Editor22 s={{ sel: "h1" }} />,
  },
  {
    label: "The Project tab: buttons that open floating panels",
    w: 1440,
    h: 868,
    view: () => <Editor22 s={{ tab: "project", float: "arenas" }} />,
  },
  {
    label: "A narrow window: tabs fold, “More…” takes the rest",
    w: 1440,
    h: 868,
    view: () => (
      <Editor22 s={{ tab: "project", narrow: true, float: "layers" }} />
    ),
  },
]

export const DIVES_2022: Array<Dive> = [
  {
    slug: "tabs",
    title: "Panels as Tabs",
    summary:
      "The panels as icon tabs in the top bar, a breadcrumb between them, and Insert in columns.",
    scenes: [
      {
        view: (s: State) => <EditorTabs s={s} />,
        url: URL,
        script: [
          { on: "tabs", wait: 2400 },
          { on: "tokens:tip", wait: 2400 },
          { on: "textbar", wait: 2000 },
          {
            on: "tab:insert",
            say: "Open Insert",
            click: true,
            set: { dialog: true, cat: "Recent" },
            wait: 1400,
          },
          {
            on: "cat:media",
            say: "Media, then Images",
            click: true,
            set: { cat: "Media" },
            wait: 1200,
          },
          {
            on: "pic:sunset",
            click: true,
            set: { pick: "sunset.png" },
            wait: 2200,
          },
          {
            on: "ins3:insert",
            say: "Insert it inside the page",
            click: true,
            set: { dialog: false, inserted: "sunset.png", pick: "" },
            wait: 2400,
          },
          {
            on: "tab:insert",
            say: "Or from the Component Store",
            click: true,
            set: { dialog: true, cat: "Component Store" },
            wait: 1200,
          },
          {
            on: "store:pricing-table",
            click: true,
            set: { pick: "Pricing table" },
            wait: 2600,
          },
          {
            on: "tab:styles",
            click: true,
            set: { dialog: false, pick: "", inserted: "" },
            wait: 1200,
          },
        ],
        notes: [
          {
            kind: "direction",
            on: "tabs",
            side: "bottom",
            beat: 0,
            text: "The rail’s panels moved into the top bar as icon tabs: insert, tree, styles, globals, and data.",
          },
          {
            kind: "concept",
            on: "tokens:tip",
            side: "right",
            beat: 1,
            text: "“Create and reuse tokens for foundational design values like colors and measurements. A token can also reference another token.”",
          },
          {
            kind: "concept",
            on: "ins3:where",
            side: "top",
            beat: [4, 5],
            text: "Insert in columns, a category, its items, then the one picked, and where it goes: before, inside, or after the selection.",
          },
          {
            kind: "direction",
            on: "ins3:cats",
            side: "right",
            beat: [7, 8],
            text: "Insert reached past the project: a Component Store and a Template Store, then Airtable and Google Sheets.",
          },
        ],
      },
    ],
  },
  {
    slug: "ribbon",
    title: "The Ribbon",
    summary:
      "A concept car: every control in a ribbon over the canvas, no side panels.",
    scenes: [
      {
        view: e22,
        url: URL,
        change: {
          from: () => <Editor21 s={{ railless: true }} />,
          title: "2022: the ribbon",
          items: [
            "Tabs for modes: Project, Insert, Style, States, Optimize",
            "A 72px ribbon holds every control of the tab",
            "No side panels: the canvas takes the whole width",
          ],
        },
        notes: [
          {
            kind: "direction",
            on: "tabs",
            beat: 0,
            text: "A ribbon, after Office’s: modes as tabs across the top bar, each filling the ribbon under it.",
          },
          {
            kind: "concept",
            on: "rb:selection",
            beat: 1,
            text: "The selection leads the row: what it is (Root, a vertical stack) and its menu.",
          },
          {
            kind: "concept",
            on: "rb:size",
            beat: 2,
            text: "Every control is a value over its name: Auto over Width, Auto over Height.",
          },
          {
            kind: "concept",
            on: "rb:layout",
            beat: 3,
            text: "Layout as a pictogram: three stacked bars for a vertical stack, then how its children stretch and align.",
          },
          {
            kind: "concept",
            on: "ruler",
            beat: 4,
            text: "A ruler of breakpoints over the artboard: desktop first, then 400 and 1920.",
          },
          {
            kind: "direction",
            on: "rb:variant",
            beat: 5,
            text: "“New variant…” closes the row, in red: recording is always one press away.",
          },
        ],
        script: [
          { on: "tab:style", wait: 2200 },
          { on: "rb:selection", wait: 2200 },
          { on: "rb:size", wait: 2200 },
          { on: "rb:layout", wait: 2400 },
          { on: "ruler", wait: 2200 },
          { on: "rb:variant", wait: 2400 },
        ],
        explore: {
          label: "4 ribbons",
          on: "ribbon",
          title: "The ribbon, explored",
          items: RIBBONS,
        },
      },
      {
        view: e22,
        url: URL,
        state: { sel: "h1" },
        script: [
          { on: "h1", say: "Select the heading", click: true, wait: 1800 },
          { on: "rb:text", wait: 2400 },
          {
            on: "ribbon",
            at: [0.9, 0.5],
            say: "The row runs out of room",
            set: { scrollX: 220 },
            wait: 2600,
          },
          { on: "ribbon", at: [0.1, 0.5], set: { scrollX: 0 }, wait: 1600 },
        ],
        notes: [
          {
            kind: "concept",
            on: "rb:text",
            beat: 1,
            text: "A heading brings its own group: color, font, weight, size, style, and decoration.",
          },
          {
            kind: "discovery",
            on: "ribbon",
            beat: [2, 3],
            text: "The ribbon ran out of room: with text selected the row is 1537px wide and scrolls sideways. Side panels scroll down; a ribbon can only scroll across.",
          },
          {
            kind: "concept",
            on: "margin-band",
            beat: 1,
            text: "Margin drawn on the canvas, hatched under the heading.",
          },
        ],
      },
    ],
  },
  {
    slug: "ribbon-project",
    title: "Project Tab",
    summary:
      "The project as a row of buttons, each opening a panel that floats.",
    scenes: [
      {
        view: e22,
        url: URL,
        state: { tab: "project" },
        script: [
          {
            on: "rb:arenas",
            say: "Open the arenas",
            click: true,
            set: { float: "arenas" },
            wait: 2400,
          },
          {
            on: "rb:layers",
            say: "And the layers",
            click: true,
            set: { float: "layers" },
            wait: 2400,
          },
          { on: "float:layers", wait: 2000 },
        ],
        notes: [
          {
            kind: "direction",
            on: "ribbon",
            beat: 0,
            text: "On the Project tab the ribbon is a row of buttons: arenas, layers, tokens, mixins, components, images, fonts, versions, and more.",
          },
          {
            kind: "direction",
            on: "float:arenas",
            beat: 1,
            text: "Each button drops a panel that floats under it, pinnable: the side panels, called up only when wanted.",
          },
          {
            kind: "discovery",
            on: "float:layers",
            beat: 2,
            text: "The tree is wanted all the time; floating it on call turned every selection into a round trip.",
          },
        ],
      },
    ],
  },
  {
    slug: "optimize",
    title: "Optimize",
    summary:
      "A/B tests, scheduled and targeted content, from a ribbon tab of their own.",
    scenes: [
      {
        view: e22,
        url: URL,
        state: { tab: "optimize" },
        script: [
          { on: "tab:optimize", wait: 2000 },
          {
            on: "rb:ab",
            say: "Start an A/B test",
            click: true,
            set: { ab: true },
            wait: 1600,
          },
          { on: "ab:knob", shape: "grab", wait: 500 },
          {
            on: "ab:split",
            at: [0.8, 0.82],
            say: "Send a fifth of the traffic to B",
            shape: "grab",
            set: { split: 20 },
            wait: 2200,
          },
          { on: "ab:goal", wait: 2200 },
          {
            on: "ab:start",
            say: "Straight into editing B",
            click: true,
            set: { ab: false, abRec: true },
            wait: 1400,
          },
          {
            on: "h1",
            say: "Try another headline",
            shape: "text",
            click: true,
            set: { hFocus: true, headline: "" },
            wait: 300,
          },
          {
            on: "h1",
            shape: "text",
            type: { key: "headline", text: "Ship it today" },
            wait: 2600,
          },
          { on: "ab:rec", set: { hFocus: false }, wait: 2600 },
        ],
        notes: [
          {
            kind: "direction",
            on: "ribbon",
            beat: 0,
            text: "“3 starting froms: “optimize” panel, tree context menu, right panel details section.” Here, the ribbon’s own tab.",
          },
          {
            kind: "concept",
            on: "ab-pop",
            side: "bottom",
            beat: 4,
            text: "A test needs a goal to count. “How to set up conversions?!” was the open question.",
          },
          {
            kind: "concept",
            on: "ab:rec",
            side: "right",
            beat: [5, 6, 7],
            text: "Version B is a variant: “already in variant editing mode immediately,” so every change is recorded to it.",
          },
          {
            kind: "discovery",
            on: "h1",
            beat: 8,
            text: "“Target variant is extra important”: the base stays the Original, and only B’s visitors see the new headline.",
          },
        ],
      },
      {
        view: (s: State) => <Insights s={s} />,
        url: "studio.plasmic.app/insights/new-website",
        script: [
          { on: "ins:header", at: [0.3, 0.5], wait: 2600 },
          {
            on: "ins:metric:clicks",
            say: "Compare unique clicks",
            click: true,
            set: { metric: "clicks" },
            wait: 2200,
          },
          {
            on: "ins:metric:ctr",
            click: true,
            set: { metric: "ctr" },
            wait: 2400,
          },
          {
            on: "ins:event:signup-link",
            say: "And each conversion event",
            click: true,
            set: { event: "signup-link" },
            wait: 2600,
          },
          { on: "ins:side", at: [0.5, 0.3], wait: 2600 },
        ],
        notes: [
          {
            kind: "concept",
            on: "ins:header",
            side: "bottom",
            beat: 0,
            text: "Insights: the Original against its variant, the visitors each has had, and the days the test has run.",
          },
          {
            kind: "direction",
            on: "ins:events",
            side: "bottom",
            beat: 3,
            text: "Where results live was open: “no events or results (the data is tracked in Google Optimize),” or tracked “in both Plasmic analytics and Google Optimize.”",
          },
          {
            kind: "concept",
            on: "ins:side",
            side: "right",
            beat: 4,
            text: "Every optimization in one list: an A/B test, scheduled content, targeted content.",
          },
        ],
      },
    ],
  },
  {
    slug: "cms",
    title: "Content",
    summary:
      "A hosted CMS: types, entries, and publishing content without a deploy.",
    scenes: [
      {
        view: (s: State) => <Cms s={s} />,
        url: "studio.plasmic.app/cms/acme-content",
        script: [
          { on: "cms:types", wait: 2000 },
          {
            on: "entry:2",
            say: "Open a draft",
            click: true,
            set: { entry: 2 },
            wait: 1400,
          },
          {
            on: "cms:question",
            click: true,
            set: { qFocus: true, question: "" },
            wait: 300,
          },
          {
            on: "cms:question",
            type: { key: "question", text: "Does Plasmic host my site?" },
            wait: 900,
          },
          {
            on: "cms:publish",
            say: "Publish the entry",
            click: true,
            set: { qFocus: false, published: true },
            wait: 2600,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "cms:types",
            beat: 0,
            text: "Types are models (blog posts, products, FAQs); entries are their content, written by people who never open the studio.",
          },
          {
            kind: "concept",
            on: "cms:publish",
            beat: 4,
            text: "An entry publishes on its own: content changes go live without a new version of the site.",
          },
          {
            kind: "direction",
            on: "cms:locale",
            beat: [2, 3],
            text: "“multi-select locale at the top, not at each field”",
          },
        ],
      },
    ],
  },
  {
    slug: "rail-again",
    title: "Back to the Rail",
    summary: "The ribbon is left; a rail, docked panels, and a breadcrumb.",
    scenes: [
      {
        view: (s) => <EditorCrumb s={s} />,
        url: URL,
        change: {
          from: () => <Editor22 s={{}} />,
          title: "Late 2022: back to the rail",
          items: [
            "A rail and docked panels again",
            "The top bar reads as a breadcrumb: project › branch › page › variant",
            "A 300px right panel, sentence case, nothing bold but titles",
          ],
        },
        notes: [
          {
            kind: "direction",
            on: "top",
            beat: 0,
            text: "The top bar became a breadcrumb: where you are, from the project down to the variant.",
          },
          {
            kind: "direction",
            on: "right",
            beat: 1,
            text: "The panel review: “nothing bold except panel section titles”; “Can we please have Element States on Roots?”",
          },
        ],
        script: [
          { on: "crumb:page", wait: 2400 },
          { on: "r:layout", wait: 2600 },
        ],
      },
      {
        view: (s) => <EditorCrumb s={s} />,
        url: URL,
        script: [
          {
            on: "crumb:screen",
            say: "Record into Mobile",
            click: true,
            set: { rec: "Mobile" },
            wait: 2400,
          },
          {
            on: "r:spacing",
            say: "Tighter padding on phones",
            click: true,
            wait: 2400,
          },
          { on: "publish", wait: 2000 },
        ],
        notes: [
          {
            kind: "direction",
            on: "crumb:rec",
            beat: [1, 2],
            text: "Recording became a red chip in the breadcrumb, beside the variant: the whole top bar says where your edits go.",
          },
          {
            kind: "concept",
            on: "board:mobile",
            beat: 1,
            text: "Mobile is a screen variant: what is recorded here applies under 414px, over the base.",
          },
          {
            kind: "concept",
            on: "publish",
            beat: 2,
            text: "Even Publish turns red while recording.",
          },
        ],
      },
      {
        view: (s) => <EditorCrumb s={s} />,
        url: URL,
        state: { left: "none", zz: 0.5, zx: 20, zy: 30 },
        script: [
          {
            on: "crumb:variant",
            say: "Record into Halloween22",
            click: true,
            set: { combo: "Halloween22" },
            wait: 1800,
          },
          {
            on: "land:cta",
            say: "An orange button",
            click: true,
            set: { cta: "#f97316" },
            wait: 2200,
          },
          {
            on: "crumb:variant",
            say: "See it in the dark theme",
            click: true,
            set: { combo: "Halloween22,DarkTheme" },
            wait: 2600,
          },
          {
            on: "land:headline",
            say: "Only while the heading is hovered",
            click: true,
            set: { combo: "Halloween22,h1:hover,DarkTheme" },
            wait: 1200,
          },
          { on: "land:headline", set: { h1color: "#f97316" }, wait: 3000 },
        ],
        notes: [
          {
            kind: "concept",
            on: "crumb:combo:0",
            side: "bottom",
            beat: [0, 1],
            text: "Recording into a variant, Halloween22: what changes now belongs to it, over the base.",
          },
          {
            kind: "concept",
            on: "crumb:combo:1",
            side: "bottom",
            beat: 2,
            text: "A global variant, DarkTheme, in gray: the whole page under it, so the recording is for both at once.",
          },
          {
            kind: "direction",
            on: "top",
            side: "bottom",
            beat: 4,
            text: "Recording where variants meet: the file’s recording bar lists “Halloween22”, “h1:hover”, “DarkTheme”, and “Mobile-only” together.",
          },
        ],
      },
    ],
  },
]
