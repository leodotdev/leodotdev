import { Editor21 } from "@/components/work/plasmic/kit/editor21"
import { Editor22 } from "@/components/work/plasmic/kit/editor22"
import { EditorCrumb } from "@/components/work/plasmic/kit/editor23"
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
    ],
  },
]
