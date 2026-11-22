import { TbComponents, TbCopy, TbLayoutRows, TbTrash } from "react-icons/tb"
import { Editor, LOGIN_TREE } from "@/components/work/plasmic/kit/editor"
import { Menu } from "@/components/work/plasmic/kit/overlays"
import { LoginPage, ProjectsPage } from "@/components/work/plasmic/kit/pages"
import {
  Chip,
  Field,
  Input,
  Panel,
  PanelHead,
  Search,
  Section,
  Seg,
  TopBar,
  TopBarEnd,
  Tree,
  Variants,
} from "@/components/work/plasmic/kit/studio"
import type { TreeNode } from "@/components/work/plasmic/kit/studio"
import type { Dive, Peer, Shot, State } from "@/components/work/plasmic/types"

// 2020, rebuilt in HTML from the year's Figma file ("2020 Product
// ARCHIVED"): the first dark comps, the classic editor (a top bar, the tree
// on the left, the canvas, and the right panel), the projects pages, and
// the move to an icon rail at the end of the year. The directions quote the
// file's notes and the designers' labels for each state.

const editor = (s: State) => <Editor s={s} />
const URL = "studio.plasmic.app/projects/acme-app"

/** A panel on its own, for a sheet or a lightbox. */
const panelShot = (
  label: string,
  h: number,
  body: React.ReactNode,
  w = 264
): Shot => ({
  label,
  w,
  h,
  view: () => (
    <div className="absolute inset-0 flex">
      <Panel className="flex-1">{body}</Panel>
    </div>
  ),
})

const tree = (
  props: Partial<React.ComponentProps<typeof Tree>> & { q?: string }
) => (
  <>
    <PanelHead title="Login Page" />
    <Search value={props.q} focus={Boolean(props.q)} />
    <Tree nodes={props.nodes ?? LOGIN_TREE} {...props} />
  </>
)

const TREE_STATES: Array<Shot> = [
  panelShot(
    "Tree: Empty",
    420,
    <>
      <PanelHead title="Login Page" />
      <Search />
      <p className="pk-faint px-4 py-6 text-center">
        Nothing here yet. Draw a box, or insert a component.
      </p>
    </>
  ),
  panelShot(
    "1st Frame just added, selected, not hovered",
    420,
    tree({ nodes: LOGIN_TREE.slice(0, 1), selected: "page" })
  ),
  panelShot("Panel hover, triangle(s) shown", 420, tree({})),
  panelShot(
    "Node hover, border + options shown",
    420,
    tree({ hover: "header" })
  ),
  panelShot("Block selected, no hovers", 420, tree({ selected: "root" })),
  panelShot("Text Block added + selected", 420, tree({ selected: "subtitle" })),
  panelShot(
    "Dragging text Block up one",
    420,
    tree({ selected: "subtitle", drop: "header" })
  ),
  panelShot(
    "Search typed",
    420,
    tree({
      q: "Text",
      nodes: LOGIN_TREE.filter((n) => n.label.includes("Text")),
    })
  ),
  panelShot(
    "Spotlight (exploration)",
    420,
    tree({
      selected: "header",
      nodes: LOGIN_TREE.map((n): TreeNode => ({
        ...n,
        dim: !["page", "root", "header", "title"].includes(n.id),
      })),
    })
  ),
  panelShot(
    "Context menu, Paste Styles disabled",
    420,
    <>
      {tree({ selected: "button" })}
      <Menu
        x={60}
        y={260}
        w={190}
        items={[
          { label: "Copy", icon: TbCopy, kbd: "⌘C" },
          { label: "Paste styles", disabled: true },
          "sep",
          { label: "Make component", icon: TbComponents },
          { label: "Wrap in stack", icon: TbLayoutRows },
          "sep",
          { label: "Delete", icon: TbTrash },
        ]}
        hover="Make component"
      />
    </>
  ),
]

const vpanel = (
  label: string,
  props: React.ComponentProps<typeof Variants>,
  h = 360
) =>
  panelShot(
    label,
    h,
    <>
      <PanelHead title="Button" />
      <Variants {...props} />
    </>,
    240
  )

const GROUPS = [
  { name: "Type", options: ["Primary", "Secondary"] },
  { name: "States", icon: "state" as const, options: ["Hover", "Pressed"] },
]
const VARIANT_STATES: Array<Shot> = [
  vpanel("Name Component", { groups: [] }, 200),
  vpanel(
    "New Group",
    { groups: [{ name: "Unnamed group", options: [] }] },
    220
  ),
  vpanel(
    "New Variant",
    { groups: [{ name: "Type", options: ["Primary", "Unnamed variant"] }] },
    260
  ),
  vpanel("Named, Viewing and Recording Target", {
    groups: GROUPS,
    rec: "Secondary",
  }),
  vpanel("Pinned Variant View", { groups: GROUPS, on: ["Secondary", "Hover"] }),
  vpanel("Recording Event", { groups: GROUPS, rec: "Hover" }),
  vpanel("New Group, Variant Hover", { groups: GROUPS, hover: "Secondary" }),
]

const section = (label: string, h: number, body: React.ReactNode) =>
  panelShot(label, h, body, 264)
const LAYOUT_STATES: Array<Shot> = [
  section(
    "Size: Unset",
    140,
    <Section title="Size">
      <Field label="Width">
        <Input>auto</Input>
      </Field>
      <Field label="Height">
        <Input>auto</Input>
      </Field>
    </Section>
  ),
  section(
    "Size: Width Set",
    140,
    <Section title="Size">
      <Field label="Width">
        <Input set>320px</Input>
      </Field>
      <Field label="Height">
        <Input>auto</Input>
      </Field>
    </Section>
  ),
  section(
    "Position: Anywhere",
    200,
    <Section title="Position">
      <Field label="Type">
        <Seg items={["Auto", "Free"]} pressed={1} />
      </Field>
      <div className="pk-pad">
        <span style={{ gridArea: "1 / 2" }}>24</span>
        <span style={{ gridArea: "2 / 1" }}>16</span>
        <i />
        <span style={{ gridArea: "2 / 3" }}>--</span>
        <span style={{ gridArea: "3 / 2" }}>--</span>
      </div>
    </Section>
  ),
  section(
    "Position Auto",
    100,
    <Section title="Position">
      <Field label="Type">
        <Seg items={["Auto", "Free"]} pressed={0} />
      </Field>
    </Section>
  ),
  section(
    "Items: Column",
    140,
    <Section title="Layout">
      <Field label="Direction">
        <Seg items={["Column", "Row"]} pressed={0} />
      </Field>
      <Field label="Gap">
        <Input set>12px</Input>
      </Field>
    </Section>
  ),
  section(
    "Items: Row: Wrap",
    170,
    <Section title="Layout">
      <Field label="Direction">
        <Seg items={["Column", "Row"]} pressed={1} />
      </Field>
      <Field label="Wrap">
        <Seg items={["No wrap", "Wrap", "Reverse"]} pressed={1} />
      </Field>
      <Field label="Gap">
        <Input set>12px</Input>
      </Field>
    </Section>
  ),
  section(
    "Items: Column with Tokens",
    140,
    <Section title="Layout">
      <Field label="Direction">
        <Seg items={["Column", "Row"]} pressed={0} />
      </Field>
      <Field label="Gap">
        <Input set>
          <Chip kind="token">space-3</Chip>
        </Input>
      </Field>
    </Section>
  ),
]

/** The Text section as each version drew it; dots say where a value comes from. */
const text = (
  label: string,
  rows: Array<[string, string, "set" | "inherited" | "default"]>
) =>
  section(
    label,
    64 + rows.length * 30,
    <Section title="Text">
      {rows.map(([k, v, from]) => (
        <Field
          key={k}
          label={
            <span className="flex items-center gap-1.5">
              <span
                className="pk-dot"
                data-kind={from === "default" ? undefined : from}
              />
              {k}
            </span>
          }
        >
          <Input set={from === "set"}>{v}</Input>
        </Field>
      ))}
    </Section>
  )
const TEXT_VERSIONS: Array<Shot> = [
  text("Current", [
    ["Font", "Inter", "inherited"],
    ["Size", "16", "set"],
    ["Weight", "400", "default"],
  ]),
  text("Exploration: every text setting", [
    ["Font", "Inter", "inherited"],
    ["Size", "16", "set"],
    ["Weight", "400 Normal", "default"],
    ["Leading", "1.5", "default"],
    ["Tracking", "--", "default"],
    ["Indent", "--", "default"],
    ["Transform", "None", "default"],
    ["Wrap", "Wrap", "default"],
  ]),
  text("Default", [
    ["Font", "Inter", "default"],
    ["Size", "16", "default"],
    ["Weight", "400", "default"],
    ["Leading", "1.5", "default"],
  ]),
  text("Mixed: inherited and locally set (size and justify)", [
    ["Font", "Inter", "inherited"],
    ["Size", "18", "set"],
    ["Align", "Justify", "set"],
    ["Weight", "400", "inherited"],
  ]),
  text(
    "Local: size + underline. Default: weight, style… Inherited: the rest (gray dots)",
    [
      ["Font", "Inter", "inherited"],
      ["Size", "16", "set"],
      ["Underline", "On", "set"],
      ["Weight", "400", "default"],
      ["Style", "Normal", "default"],
    ]
  ),
]

const TOP_BARS: Array<Shot> = [
  { label: "Top Bar 1", w: 1440, h: 44, view: () => <TopBar /> },
  {
    label: "Hover Quick Tool",
    w: 1440,
    h: 44,
    view: () => <TopBar hover="tool:box" />,
  },
  {
    label: "Insert held down",
    w: 1440,
    h: 44,
    view: () => <TopBar tool="insert" />,
  },
  {
    label: "Preview with Variants, Frame Selection Menu",
    w: 1440,
    h: 44,
    view: () => (
      <TopBar tools={false} right={<TopBarEnd share="Exit preview" />} />
    ),
  },
  {
    label: "Share and publish",
    w: 1440,
    h: 44,
    view: () => <TopBar right={<TopBarEnd publish hover="publish" />} />,
  },
]

const TEAM: Array<Peer> = [
  {
    name: "Maya",
    color: "#ec4899",
    script: [
      { on: "row:header", select: true, wait: 1600 },
      {
        on: "acme:title",
        select: true,
        set: { title: "Sign in to Acme" },
        wait: 2200,
      },
      {
        on: "acme:title",
        select: true,
        set: { title: "Log in to Acme" },
        wait: 1800,
      },
    ],
  },
  {
    name: "Sam",
    color: "#10b981",
    script: [
      { on: "board:home", select: true, wait: 2000 },
      { on: "board:button", select: true, wait: 2400 },
    ],
  },
]

export const DIVES_2020: Array<Dive> = [
  {
    slug: "first-comps",
    title: "First Comps",
    summary:
      "The first designs: the tree, the canvas, and what a selection says.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { sel: "button", sizeTag: true },
        notes: [
          {
            kind: "concept",
            on: "row:button",
            beat: 0,
            text: "Button is a component (the diamond): designed once, placed anywhere, and every copy an instance that follows it.",
          },
          {
            kind: "direction",
            on: "selection",
            beat: 1,
            text: "“I’m recommending we get rid of Selection Labels (except on Frames), the Tree should be good enough.”",
          },
          {
            kind: "direction",
            on: "tree",
            beat: 2,
            text: "“We need to deepen the difference between containers/parents and items/children.” A selected container reads bolder in the tree; its children get a slight shade.",
          },
          {
            kind: "concept",
            on: "right",
            beat: 3,
            text: "Everything about the selection, in one panel: its variants, size, position, layout, fill, and text.",
          },
        ],
        script: [
          { on: "row:button", wait: 2200 },
          { on: "selection", at: [0.7, 0.5], wait: 2400 },
          { on: "row:root", wait: 2400 },
          { on: "sec:size", wait: 2400 },
        ],
      },
    ],
  },
  {
    slug: "variants-panel",
    title: "A Panel for Variants",
    summary: "Variants get a panel of their own, and recording begins.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { sel: "button", vpanel: true },
        change: {
          from: (s) => <Editor s={{ ...s, vpanel: false, sizeTag: true }} />,
          title: "Variants get a panel",
          items: [
            "A component’s variants float over the canvas, by group",
            "Base, then each group’s options",
            "Interaction states are variants too",
          ],
        },
        notes: [
          {
            kind: "direction",
            on: "vpanel",
            text: "“Make your selection a Component to enable more Variants like: primary, secondary, neutral roles; loading, warning, error, success states; light, dark, and other modes; custom interactions.”",
          },
          {
            kind: "concept",
            on: "variant:base",
            text: "Base is the component as it is by default. Every other variant keeps only how it differs from Base.",
          },
        ],
      },
    ],
  },
  {
    slug: "projects",
    title: "Projects",
    summary: "Logging in, and the projects you build with your team.",
    scenes: [
      {
        view: (s) =>
          s.page === "projects" ? <ProjectsPage s={s} /> : <LoginPage s={s} />,
        url: "studio.plasmic.app/login",
        script: [
          {
            on: "login:google",
            say: "Log in with Google",
            click: true,
            set: { page: "projects" },
            wait: 1600,
          },
          { on: "project:acme-app", set: { hover: "Acme App" }, wait: 1400 },
          {
            on: "projects:new",
            say: "Start a new project",
            click: true,
            set: { hover: "new", created: true },
            wait: 2000,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "project:component-kit",
            beat: [1, 2],
            text: "A project can import another, like a kit of components or colors, and update when it publishes a new version.",
          },
          {
            kind: "concept",
            on: "tutorials",
            beat: 2,
            text: "Tutorials are projects too: “Click to duplicate” starts a copy to learn in.",
          },
        ],
      },
    ],
  },
  {
    slug: "insert",
    title: "Insert & Drop",
    summary:
      "Finding a component and dropping it onto the page, zoomed in close.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { left: "insert", zz: 1, zx: 0, zy: 0 },
        script: [
          {
            on: "insert:search",
            say: "Search the insert panel",
            click: true,
            set: { qFocus: true },
            wait: 400,
          },
          { on: "insert:search", type: { key: "q", text: "But" }, wait: 700 },
          { on: "insert:button", set: { insertSel: "Button" }, wait: 600 },
          {
            on: "insert:button",
            say: "Drag Button onto the page",
            drag: "acme:password",
            ghost: "Button",
            set: {
              dropped: true,
              sel: "dropped",
              left: "tree",
              q: "",
              qFocus: false,
            },
            wait: 1400,
          },
          {
            on: "zoom-level",
            say: "Zoom in to check it",
            set: { zz: 1.6, zx: -120, zy: -320 },
            wait: 2000,
          },
          {
            on: "acme:dropped",
            set: { toast: "Button added to Login Page" },
            wait: 1800,
          },
          {
            on: "zoom-level",
            say: "Zoom back to fit",
            set: { zz: 1, zx: 0, zy: 0, toast: "" },
            wait: 1600,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "insert",
            beat: [0, 1, 2],
            text: "Insert finds anything by name: the basics (boxes, stacks, text, images) and the project’s own components.",
          },
          {
            kind: "concept",
            on: "board:login",
            beat: [4, 5],
            text: "The canvas pans and zooms like a design tool’s, over pages built of real HTML and CSS.",
          },
        ],
      },
    ],
  },
  {
    slug: "arena",
    title: "Pan & Zoom",
    summary:
      "An arena of artboards, zoomed to one, panned across, and fitted again.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { boards: "arena", sel: "", zz: 0.42, zx: 16, zy: 210 },
        script: [
          { on: "board:login", at: [0.5, 0.3], wait: 2600 },
          {
            on: "board:btn-hover",
            say: "Zoom to a variant",
            click: true,
            set: { zz: 1.6, zx: -608, zy: -230 },
            wait: 2600,
          },
          {
            on: "zoom-level",
            say: "Back to 100%",
            click: true,
            set: { zoomMenu: true },
            wait: 700,
          },
          {
            on: "zoom:100",
            click: true,
            set: { zoomMenu: false, zz: 1, zx: -572, zy: 108 },
            wait: 1800,
          },
          {
            to: [1000, 470],
            shape: "grab",
            say: "Pan across",
            wait: 400,
          },
          {
            to: [420, 470],
            shape: "grab",
            set: { zx: -1152, zy: 121 },
            wait: 2600,
          },
          {
            on: "zoom-level",
            say: "Zoom to fit",
            click: true,
            set: { zoomMenu: true },
            wait: 700,
          },
          {
            on: "zoom:fit",
            click: true,
            set: { zoomMenu: false, zz: 0.42, zx: 16, zy: 210 },
            wait: 2600,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "board:login",
            side: "bottom",
            beat: 0,
            text: "An arena: a canvas to lay artboards out on, a component’s variants beside the pages that use them.",
          },
          {
            kind: "concept",
            on: "board:btn-hover",
            side: "bottom",
            beat: 1,
            text: "Zoomed in, a variant is still the real thing: HTML and CSS, not a picture of it.",
          },
          {
            kind: "direction",
            on: "zoom-level",
            side: "right",
            beat: 0,
            text: "The zoom control, among what the research called “Studio View Controls.”",
          },
        ],
      },
    ],
  },
  {
    slug: "tree",
    title: "The Tree",
    summary: "Searching, reordering, and acting on what is on the page.",
    scenes: [
      {
        view: editor,
        url: URL,
        script: [
          {
            on: "tree:search",
            say: "Search the tree",
            click: true,
            set: { qFocus: true },
            wait: 300,
          },
          { on: "tree:search", type: { key: "q", text: "Text" }, wait: 1400 },
          { on: "tree:search", set: { q: "", qFocus: false }, wait: 600 },
          {
            on: "row:subtitle",
            say: "Drag a row up one",
            set: { sel: "subtitle" },
            wait: 400,
          },
          {
            on: "row:subtitle",
            drag: "row:header",
            ghost: "Log in to keep building.",
            set: { drop: "" },
            wait: 1200,
          },
          {
            on: "row:button",
            say: "Right-click for more",
            click: true,
            set: { sel: "button", menu: "context", menuX: 140, menuY: 330 },
            wait: 900,
          },
          {
            on: "item:make component",
            set: { menuHover: "Make component" },
            wait: 1600,
          },
        ],
        notes: [
          {
            kind: "direction",
            on: "tree",
            beat: [3, 4],
            text: "“Dragging text Block up one”: a line shows where a row will land, at its depth.",
          },
          {
            kind: "direction",
            on: "menu",
            beat: 6,
            text: "“Context menu, Paste Styles disabled”: what can’t be done shows, dimmed, rather than going missing.",
          },
        ],
      },
      {
        view: editor,
        url: URL,
        span: 3,
        sheet: { title: "Tree", items: TREE_STATES },
      },
    ],
  },
  {
    slug: "variants",
    title: "Variants",
    summary: "Base, variant groups, and recording a change into a variant.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { sel: "button", vtab: true },
        peers: [TEAM[0]],
        script: [
          { on: "variant:base", wait: 2200 },
          { on: "group:states", wait: 2200 },
          {
            on: "variant:secondary",
            say: "Record into Secondary",
            click: true,
            set: { rec: "Secondary" },
            wait: 1400,
          },
          {
            on: "rtab:design",
            say: "Change its fill",
            click: true,
            set: { vtab: false },
            wait: 800,
          },
          {
            on: "fill",
            click: true,
            set: { fill: "#eef2ff", variant: "secondary" },
            wait: 2000,
          },
          {
            on: "fill",
            at: [0.12, 0.5],
            say: "Where does this fill come from?",
            set: { inherit: true },
            wait: 3000,
          },
          {
            on: "stop-rec",
            say: "Stop recording",
            click: true,
            set: {
              rec: "",
              variant: "primary",
              fill: "#2563eb",
              inherit: false,
            },
            wait: 1600,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "variant:base",
            beat: 0,
            text: "Base is the component as it is by default; every other variant keeps only how it differs.",
          },
          {
            kind: "concept",
            on: "group:states",
            beat: 1,
            text: "Hover, Pressed, Disabled: element states, variants turned on by interaction. Screen sizes are global variants, for the whole page.",
          },
          {
            kind: "concept",
            on: "recbar",
            beat: [3, 4],
            text: "Recording: while Secondary records, every change on the canvas is saved to Secondary, not to Base.",
          },
          {
            kind: "concept",
            on: "fill",
            beat: 4,
            text: "A recorded value shows in red: set in this variant, over the base.",
          },
          {
            kind: "concept",
            on: "inherit",
            side: "top",
            beat: 5,
            text: "Inheritance: each place the value is set, in order. Base’s fill is struck through; Type: Secondary’s is the one in effect.",
          },
        ],
      },
      {
        view: editor,
        url: URL,
        state: { sel: "button", vpanel: true },
        span: 3,
        sheet: { title: "Variants panel", items: VARIANT_STATES },
      },
    ],
  },
  {
    slug: "layout",
    title: "Size, Position & Layout",
    summary:
      "How a box sizes itself, where it sits, and how it lays out its children.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { sel: "root", pos: "auto", dir: "column" },
        script: [
          {
            on: "pos:type",
            at: [0.75, 0.5],
            say: "Free: place it anywhere",
            click: true,
            set: { pos: "free" },
            wait: 2200,
          },
          {
            on: "pos:type",
            at: [0.25, 0.5],
            say: "Auto: back in the flow",
            click: true,
            set: { pos: "auto" },
            wait: 1800,
          },
          {
            on: "layout:dir",
            at: [0.75, 0.5],
            say: "Lay children out in a row",
            click: true,
            set: { dir: "row" },
            wait: 2000,
          },
        ],
        notes: [
          {
            kind: "direction",
            on: "sec:position",
            beat: [0, 1],
            text: "“If Free-floating position is our default, this should be as straightforward as possible.” Here, Auto and Free as one switch.",
          },
          {
            kind: "concept",
            on: "sec:layout",
            beat: 2,
            text: "A box lays its children out in a column or a row, with a gap: flexbox, drawn as a choice.",
          },
          {
            kind: "direction",
            on: "sec:size",
            text: "Sizes, explored: “0. type: fixed (px, %), 1. stretch/fill parent container, 2. wrap children/content.”",
          },
        ],
      },
      {
        view: editor,
        url: URL,
        state: { sel: "root" },
        span: 3,
        sheet: { title: "Size, Position & Items", items: LAYOUT_STATES },
      },
    ],
  },
  {
    slug: "tokens",
    title: "Tokens & Mixins",
    summary: "Named values and sets of styles, applied across a project.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { left: "assets", sel: "button" },
        script: [
          { on: "token:brand", set: { tokenHover: "brand" }, wait: 2000 },
          {
            on: "fill",
            say: "Use a token for the fill",
            click: true,
            set: { fillToken: "brand" },
            wait: 2200,
          },
          { on: "mixins", wait: 2400 },
        ],
        notes: [
          {
            kind: "concept",
            on: "tokens",
            beat: 0,
            text: "“Set and group foundational values like text, units, and colors.” A token is a value with a name: change it, and everything using it follows.",
          },
          {
            kind: "concept",
            on: "fill",
            beat: 1,
            text: "A value from a token shows as the token’s name, in blue.",
          },
          {
            kind: "concept",
            on: "mixins",
            beat: 2,
            text: "A mixin is a set of styles under one name, applied together, like a class.",
          },
        ],
        explore: {
          label: "5 text panels",
          on: "sec:text",
          title: "Text settings, 2020",
          items: TEXT_VERSIONS,
        },
      },
    ],
  },
  {
    slug: "together",
    title: "Together",
    summary:
      "A team in one project at once: each person’s cursor and selection, live.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { boards: "all", zz: 0.82, zx: 10, zy: 30, right: "none" },
        peers: TEAM,
        script: [
          { on: "avatars", wait: 2200 },
          {
            on: "share",
            say: "Invite a teammate",
            click: true,
            set: { share: true },
            wait: 600,
          },
          {
            on: "share:invite",
            click: true,
            set: { inviteFocus: true },
            wait: 200,
          },
          {
            on: "share:invite",
            type: { key: "invite", text: "kai@acme.com" },
            wait: 600,
          },
          { on: "share:role", click: true, set: { roles: true }, wait: 2200 },
        ],
        notes: [
          {
            kind: "concept",
            on: "avatars",
            beat: 0,
            text: "Plasmic is multiplayer: everyone in a project is here, with their cursor, their selection, and their edits as they make them.",
          },
          {
            kind: "concept",
            on: "share-pop",
            beat: [3, 4],
            text: "Roles decide who can edit, who can only view, and who can change content but not the design.",
          },
        ],
      },
    ],
  },
  {
    slug: "code",
    title: "Code & Publishing",
    summary: "The design as React, and publishing a version for code to use.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { layout: "rail", left: "none" },
        script: [
          {
            on: "code",
            say: "See it as code",
            click: true,
            set: { code: true },
            wait: 2600,
          },
          { on: "code:jsx", wait: 2600 },
          { to: [1100, 120], set: { code: false }, wait: 600 },
          {
            on: "publish",
            say: "Publish a version",
            click: true,
            set: { publish: true },
            wait: 500,
          },
          {
            on: "publish:note",
            click: true,
            set: { noteFocus: true },
            wait: 200,
          },
          {
            on: "publish:note",
            type: { key: "note", text: "Secondary buttons" },
            wait: 500,
          },
          {
            on: "publish:go",
            click: true,
            set: {
              published: true,
              noteFocus: false,
              toast: "Published v1.3.0",
            },
            wait: 2400,
          },
        ],
        notes: [
          {
            kind: "concept",
            on: "code:jsx",
            beat: 1,
            text: "The design is React: each component a component, its variant groups its props (Button’s type and size).",
          },
          {
            kind: "concept",
            on: "publish-pop",
            beat: [4, 5, 6],
            text: "“Version numbers are automatically calculated using semantic versioning.” Projects that import this one can update to it.",
          },
        ],
      },
      {
        view: editor,
        url: URL,
        state: { layout: "rail", left: "activity", leftFloat: true },
        script: [
          { on: "act:figma", wait: 2400 },
          {
            on: "act:autosaves",
            say: "Autosaves, folded away",
            click: true,
            set: { open: "act:autosaves" },
            wait: 2200,
          },
          { on: "act:branched", wait: 2600 },
          { on: "act:published", wait: 2400 },
          {
            on: "act:merged",
            say: "A comment comes in",
            set: { comment: true },
            wait: 1400,
          },
          { on: "act:comment", wait: 2800 },
        ],
        notes: [
          {
            kind: "concept",
            on: "activity",
            side: "right",
            beat: [0, 1],
            text: "Activity: the project’s history as a feed, from its creation and a Figma import to visits, with autosaves folded away.",
          },
          {
            kind: "discovery",
            on: "act:branched",
            side: "right",
            beat: [2, 3, 4],
            text: "Branched, forked, and merged are already in 2020’s feed. Branching got a menu of its own in the late-2022 and 2023 files.",
          },
          {
            kind: "concept",
            on: "act:comment",
            side: "right",
            beat: 5,
            text: "Comments arrive in the feed with their replies.",
          },
        ],
      },
    ],
  },
  {
    slug: "rail",
    title: "The Rail",
    summary: "Late 2020: an icon rail down the left, and panels that float.",
    scenes: [
      {
        view: editor,
        url: URL,
        state: { layout: "rail", left: "insert", leftFloat: true },
        change: {
          from: (s) => (
            <Editor
              s={{ ...s, layout: "classic", left: "tree", leftFloat: false }}
            />
          ),
          title: "Late 2020: the rail",
          items: [
            "An icon rail down the left, an icon per panel",
            "One panel at a time, floating over the canvas",
          ],
        },
        notes: [
          {
            kind: "direction",
            on: "rail",
            beat: [0, 1],
            text: "The tabs became a rail: tree, insert, components, tokens, mixins, images, and data, each a panel of its own.",
          },
          {
            kind: "discovery",
            on: "left",
            side: "right",
            beat: 2,
            text: "The rail stayed; the floating didn’t. In 2021 the panels docked beside it again.",
          },
        ],
        script: [
          { on: "rail:tree", click: true, set: { left: "tree" }, wait: 1800 },
          {
            on: "rail:tokens",
            click: true,
            set: { left: "assets" },
            wait: 1800,
          },
          {
            on: "rail:insert",
            click: true,
            set: { left: "insert" },
            wait: 1800,
          },
        ],
        explore: {
          label: "5 top bars",
          on: "tools",
          title: "Top bar, 2020",
          items: TOP_BARS,
        },
      },
    ],
  },
]
