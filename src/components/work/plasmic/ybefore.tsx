import { Editor } from "@/components/work/plasmic/kit/editor"
import {
  Homework,
  Naming,
  ObjectModel,
  Wireframe,
} from "@/components/work/plasmic/kit/research"
import type { Dive, State } from "@/components/work/plasmic/types"

// Before 2020, from the "Research" file: naming the parts of the studio as
// it stood ("Today"), regrouping them ("Tomorrow" and two exploratory
// alternatives), a light restyle that asks what the top-level container is
// called, the product's object model, and a north star of a code-backed
// studio. The directions quote the file's labels and notes.

const URL = "studio.plasmic.app/research"

export const DIVES_BEFORE: Array<Dive> = [
  {
    slug: "today",
    title: "Today",
    summary: "Naming every part of the studio as it stood.",
    scenes: [
      {
        view: (s: State) => <Editor s={s} />,
        url: URL,
        state: { sel: "button" },
        notes: [
          { kind: "direction", on: "logo", beat: 0, text: "“Home”" },
          { kind: "direction", on: "arena", beat: 1, text: "“Arenas/Pages”" },
          {
            kind: "direction",
            on: "tools",
            beat: 2,
            text: "“Content Tools / App Actions”",
          },
          {
            kind: "direction",
            on: "tree",
            beat: 3,
            text: "“Document Tree (Layers)”",
          },
          {
            kind: "direction",
            on: "tab:gallery",
            beat: 4,
            text: "“Component Gallery Library”: Gallery struck out, renamed.",
          },
          {
            kind: "direction",
            on: "tab:assets",
            beat: 5,
            text: "“Assets (Imports, Keys, Globals, Variables?)”",
          },
          {
            kind: "direction",
            on: "zoom",
            beat: 6,
            text: "“Studio View Controls”",
          },
          { kind: "direction", on: "share", beat: 7, text: "“Project Share”" },
          {
            kind: "direction",
            on: "right",
            beat: 8,
            text: "“Styles, Attributes, Component Properties”",
          },
        ],
        script: [
          { on: "logo", wait: 1600 },
          { on: "arena", wait: 1600 },
          { on: "tools", wait: 1600 },
          { on: "tree", wait: 1600 },
          { on: "tab:gallery", wait: 1800 },
          { on: "tab:assets", wait: 1800 },
          { on: "zoom", wait: 1600 },
          { on: "share", wait: 1600 },
          { on: "sec:size", wait: 1800 },
        ],
      },
    ],
  },
  {
    slug: "tomorrow",
    title: "Tomorrow",
    summary:
      "Regrouping the parts: grounding, content, views, properties, and room reserved.",
    scenes: [
      {
        view: (s: State) => <Wireframe s={s} />,
        url: URL,
        notes: [
          {
            kind: "direction",
            on: "z:grounding",
            beat: 0,
            text: "“Grounding: Home, Project”",
          },
          {
            kind: "direction",
            on: "z:content",
            beat: 1,
            text: "“Content: high-level grouping of what’s been made in-product… Search/filter available w/in the context of each.”",
          },
          {
            kind: "direction",
            on: "z:path",
            beat: 2,
            text: "“Grounding/Wayfinding: single-selection path + state”",
          },
          {
            kind: "direction",
            on: "z:properties",
            beat: 3,
            text: "“Properties and States: low-level values of what’s been selected”: props, styles, variants, behaviors, media queries, overrides.",
          },
          {
            kind: "direction",
            on: "z:logic",
            beat: 4,
            text: "“Reserved: keyframe animations? business logic visual programming?”",
          },
          {
            kind: "discovery",
            on: "z:toasts",
            beat: 5,
            text: "Room held for what wasn’t designed yet. In 2023 Logic became a mode, its panel along the bottom.",
          },
        ],
        script: [
          { on: "z:grounding", wait: 2000 },
          { on: "z:content", wait: 2400 },
          { on: "z:path", wait: 2200 },
          { on: "z:properties", wait: 2400 },
          { on: "z:logic", wait: 2400 },
          { on: "z:toasts", wait: 2400 },
        ],
      },
      {
        view: (s: State) => <Wireframe s={s} />,
        url: URL,
        state: { wire: "a" },
        script: [
          { on: "z:card", wait: 2600 },
          { on: "z:drawer", wait: 2600 },
          { on: "wire", say: "The other way", set: { wire: "b" }, wait: 900 },
          { on: "z:modes", wait: 2600 },
          { on: "z:drawer", wait: 2600 },
        ],
        notes: [
          {
            kind: "direction",
            on: "z:card",
            beat: 0,
            text: "Exploratory A: properties as a card floating over the canvas…",
          },
          {
            kind: "direction",
            on: "z:drawer",
            beat: [1, 4],
            text: "…and the variants (A) or the library (B) in a drawer along the bottom.",
          },
          {
            kind: "direction",
            on: "z:modes",
            beat: 3,
            text: "Exploratory B: a rail of modes. Modes came back in 2023: Design, Logic, Preview.",
          },
        ],
      },
    ],
  },
  {
    slug: "naming",
    title: "Naming It",
    summary: "What do you call the top-level canvas? Studio, Page, or Arena.",
    scenes: [
      {
        view: (s: State) => <Naming s={s} />,
        url: URL,
        state: { root: "Studio 1" },
        script: [
          { on: "naming:root", wait: 2200 },
          { on: "naming:root", set: { root: "Page" }, wait: 2200 },
          { on: "naming:root", set: { root: "Arena 1" }, wait: 2600 },
        ],
        notes: [
          {
            kind: "direction",
            on: "naming:crumbs",
            side: "bottom",
            beat: [0, 1, 2],
            text: "Three restyles, one difference: the breadcrumb’s root, Studio, Page, or Arena.",
          },
          {
            kind: "discovery",
            on: "naming:root",
            beat: 2,
            text: "Arena stuck: a canvas to lay artboards out on, as the 2020 file draws it.",
          },
        ],
      },
    ],
  },
  {
    slug: "model",
    title: "The Object Model",
    summary:
      "What the product is made of, from the dashboard down to a style’s value.",
    scenes: [
      {
        view: () => <ObjectModel />,
        url: URL,
        script: [
          { on: "om:project", at: [0.3, 0.04], wait: 2400 },
          { on: "om:studio", at: [0.3, 0.05], wait: 2400 },
          { on: "om:holds", wait: 2600 },
        ],
        notes: [
          {
            kind: "concept",
            on: "om:project",
            side: "right",
            beat: 0,
            text: "Plasmic › Dashboard › Project › Arena › View › Component › Element.",
          },
          {
            kind: "direction",
            on: "om:studio",
            side: "right",
            beat: 1,
            text: "“Studio??”: whether the editor is a level of its own was still a question.",
          },
          {
            kind: "concept",
            on: "om:holds",
            side: "left",
            beat: 2,
            text: "A style holds a value, a token, or a mixin of tokens; a master has slots, an instance fills them; variant groups hold variants of style.",
          },
        ],
      },
    ],
  },
  {
    slug: "north-star",
    title: "A North Star",
    summary:
      "“Leo’s Homework”: a concept car of a code-backed studio, from Design to Deploy.",
    scenes: [
      {
        view: (s: State) => <Homework s={s} />,
        url: "todomvp://index.js",
        script: [
          { on: "hw:modes", wait: 2400 },
          {
            on: "hw:tab:dependencies",
            say: "Its dependencies",
            click: true,
            set: { side: "Dependencies" },
            wait: 2200,
          },
          {
            on: "hw:tab:content",
            say: "Its content sources",
            click: true,
            set: { side: "Content Sources" },
            wait: 2200,
          },
          {
            on: "hw:tab:files",
            click: true,
            set: { side: "Files" },
            wait: 1600,
          },
          { on: "hw:dom", wait: 2400 },
          { on: "hw:viewports", wait: 2400 },
          { on: "hw:state", wait: 2400 },
        ],
        notes: [
          {
            kind: "direction",
            on: "hw:modes",
            beat: 0,
            text: "Modes for the whole lifecycle: Design, Comment, Code, Run, Deploy.",
          },
          {
            kind: "direction",
            on: "hw:deps",
            beat: 1,
            text: "“Dependencies, packages, external resources. Similar to CodeSandbox.” A charting library added becomes components with props panels.",
          },
          {
            kind: "direction",
            on: "hw:sources",
            beat: 2,
            text: "“Data/API connections. Access to content, similar to Webflow CMS.”",
          },
          {
            kind: "direction",
            on: "hw:dom",
            beat: 4,
            text: "“As close to a true representation of the DOM tree as possible… still, treat similar to a design tool’s layer panel.”",
          },
          {
            kind: "direction",
            on: "hw:viewports",
            beat: 5,
            text: "Pinned views: “dark theme on mobile w/ rulers… and another custom ultrawide view.” Changes to any viewport reflect across all.",
          },
          {
            kind: "discovery",
            on: "hw:state",
            beat: 6,
            text: "A concept car, drawn once. Later files draw much of it: code components and data (2021), branches (late 2022), modes and logic (2023).",
          },
        ],
      },
    ],
  },
]
