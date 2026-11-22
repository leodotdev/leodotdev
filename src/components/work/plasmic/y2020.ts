import type { Dive, Shot } from "@/components/work/plasmic/types"

// 2020, from the year's Figma file (2020 Product ARCHIVED). Places are in the
// app's own pixels (1440 wide, under the browser's bar), read from the
// file's layers. Decisions quote the file's notes and the designers' labels
// for each state; the "how it works" notes explain what the frame shows.

const panels = (
  prefix: string,
  labels: Array<string>,
  w: number,
  h: number | Array<number>
): Array<Shot> =>
  labels.map((label, i) => ({
    src: `${prefix}-${String(i + 1).padStart(prefix === "share" || prefix === "gallery" || prefix === "color" || prefix === "inh" ? 1 : 2, "0")}`,
    label,
    w,
    h: Array.isArray(h) ? h[i] : h,
  }))

const TREE = panels(
  "tree",
  [
    "Tree: Empty",
    "1st Frame just added, selected, not hovered",
    "Panel hover, triangle(s) shown",
    "Node hover, border + options shown",
    "Block selected, no hovers",
    "Block added + selected, panel hover",
    "Text Block added + selected, no hovers",
    "Dragging text Block up one",
    "Unsupported dragging, releasing does nothing",
    "Context menu, Paste Styles disabled",
    "Rename node",
    "Rename node",
    "Full Tree example, square dot variant indicator",
    "Panel hover",
    "Component hover, optional edit icon or just double-click",
    "Lock icons (exploration), panel hover",
    "Lock icons (exploration), component hover",
    "Spotlight (exploration), panel hover",
    "Spotlight (exploration), select slot, panel hover",
  ],
  256,
  1024
)

const GALLERY = panels(
  "gallery",
  [
    "Gallery: Default, first visit",
    "With Project Components",
    "Item hover and dragging, context menu with hover",
    "Search focus",
    "Search typed with clear option",
    "Grid search typed",
    "Grid view, switch hover, element hover",
    "List item hover",
    "List item drag",
  ],
  256,
  1024
)

const RIGHT_PANELS: Array<Shot> = [
  ...panels(
    "rp",
    [
      "Design: first visit, Arena options",
      "Design: non-component selected, “Box”",
      "1st Frame just added, selected, default props + variants",
      "Hovers: panel, Root Block position, active Variants Screen variant",
      "If center, hide screen variant presets, no hovers",
      "Frame rename focus, no hovers",
      "Screen variant set, no hovers",
      "Root block position: show less, no hovers",
      "Target gVariant",
      "Edit targeted gVariant",
      "Frame Variants tab/editor",
      "Target Variant from tab/editor",
    ],
    256,
    1024
  ),
  {
    src: "rp-13",
    label: "Design Element",
    w: 256,
    h: 1785,
    notes: [
      { kind: "decision", at: [0, 280, 256, 40], text: "“this can be nicer”" },
      {
        kind: "decision",
        at: [0, 400, 256, 64],
        text: "“this needs another pass, if Free-floating position is our default, this should be as straightforward as possible”",
      },
      { kind: "decision", at: [0, 610, 256, 40], text: "“best so far”" },
    ],
  },
  {
    src: "rp-14",
    label: "Most recent: no tabs, simpler spacing and border",
    w: 256,
    h: 1623,
  },
  { src: "rp-15", label: "Exploring spacing, deconstructed", w: 256, h: 1641 },
]

const LAYOUT = panels(
  "spi",
  [
    "Size: Unset",
    "Size: Width Set",
    "Size: More",
    "Position: Anywhere",
    "Position Auto",
    "Position Auto: Filled",
    "Position: Anywhere with Tokens",
    "Position Auto: Filled with Tokens",
    "Items: Row Unset",
    "Items: Column Unset",
    "Items: Row: Wrap",
    "Items: Row: Wrap: Reverse",
    "Items: Column with Tokens",
  ],
  256,
  [120, 120, 228, 277, 273, 277, 277, 277, 322, 322, 264, 264, 322]
)

const TEXT = panels(
  "text",
  [
    "Current",
    "Exploration: every text setting",
    "Default",
    "Semi-filled",
    "Mixed: inherited and locally set (size and justify)",
    "An icon dropdown, suggested",
    "Combined all feedback, default",
    "Set locally, full",
    "Default, set locally, and inherited (soft gray, secondary labels), mixed",
    "Local: size and underline. Default: weight, style, letter spacing, indent, transform. Inherited: the rest (gray dots)",
  ],
  256,
  [346, 492, 394, 490, 490, 394, 394, 490, 490, 426]
)

const VARIANTS = [
  ...panels(
    "var",
    [
      "Name Component",
      "Name Component",
      "Show and Hide Tab Contents",
      "New Group",
      "Tab Key to Name Variant",
      "Named, Viewing and Recording Target",
      "Pinned Variant View",
      "New Variant",
      "New Group, Variant Hover",
      "New Event",
      "Recording Event",
      "Group Context Menu",
      "No Panel Hover = No Color",
    ],
    256,
    [210, 244, 80, 327, 291, 291, 291, 323, 404, 436, 436, 436, 705]
  ),
  { src: "var-14", label: "V Panel", w: 200, h: 505 },
]

const MIXINS = panels(
  "mix",
  [
    "Search to Add or Name and Create, 1 List Item Selected",
    "1 Mixin Set, Panel Hover, More Menu",
    "1 Mixin Set, Resting",
    "1 Mixin Set, Field Focus",
    "1 Mixin Set, Field Typing",
    "2 Mixins Set",
    "Multiple Mixins Example",
    "Add Mixin, Auto-focus Placeholder Edit",
    "Target Recording",
    "Target Recording, 1 Style Set",
    "1 Mixin Hover Preview Popover",
    "List View, Groups",
    "Grid View, Group Hover and Rename, Swatch Hover",
    "Hover and Context Menu",
    "Rename Token",
  ],
  256,
  [81, 89, 89, 113, 113, 117, 201, 85, 85, 85, 85, 460, 407, 210, 90]
)

const SHARE = panels(
  "share",
  [
    "Sharing Popover, Resting in Field Focus",
    "Sharing Popover",
    "Sharing Popover",
    "Permission Role Menu",
    "Button Hover",
    "List with Item Hover",
    "Sandbox Popover Empty",
    "Sandbox Popover",
    "Sandbox Popover",
  ],
  320,
  [153, 234, 202, 153, 153, 269, 171, 366, 366]
)

const POPOVERS: Array<Shot> = [
  ...panels(
    "color",
    [
      "Color Picker",
      "Color Picker",
      "Color Picker with Token",
      "Color Picker with Token",
    ],
    200,
    [432, 497, 498, 498]
  ),
  { src: "color-5", label: "Token List", w: 184, h: 152 },
  { src: "color-6", label: "Background Image Popover", w: 200, h: 732 },
  ...panels(
    "inh",
    Array.from({ length: 8 }, () => "Inheritance & overrides"),
    200,
    [108, 140, 140, 108, 108, 108, 148, 310]
  ),
]

const TOP_BARS = panels(
  "top",
  [
    "Top Bar",
    "Top Bar",
    "Top Bar 3",
    "Top Bar 2",
    "Top Bar 4",
    "Top Bar 2",
    "Top Bar 1",
    "Hover Quick Tool",
    "Logo Hover",
    "Tool Hover Tooltip",
    "Add Action Hold Down",
    "Preview",
    "Preview with Variants, Frame Selection Menu",
  ],
  1440,
  40
)

const PROJECT = "plasmic.app/projects/tQVs5XeEQpy75bbK8RX9T5"

export const DIVES_2020: Array<Dive> = [
  {
    slug: "first-comps",
    title: "First Comps",
    summary: "The first designs: a dark editor, its tree, and the canvas.",
    scenes: [
      {
        frame: "comps-1",
        url: PROJECT,
        notes: [
          {
            kind: "decision",
            at: [0, 129, 256, 450],
            text: "“We need to deepen the difference between containers/parents and items/children.” Selecting a frame or a component reads bolder in the tree; its children get a slight shade.",
          },
          {
            kind: "concept",
            at: [0, 321, 256, 32],
            text: "MyButton is a component (the diamond): designed once and placed anywhere, each copy an instance of it.",
          },
          {
            kind: "decision",
            at: [513, 120, 414, 108],
            text: "“I’m recommending we get rid of Selection Labels (except on Frames), the Tree should be good enough.”",
            from: 1,
          },
        ],
        script: [
          { to: [150, 337], wait: 1400 },
          { to: [592, 184], shape: "pointer", click: true, wait: 2200 },
        ],
      },
      {
        frame: "comps-2",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [1184, 85, 256, 125],
            text: "Active Variants: the canvas shows this screen as “mobile” and “light”, and the component as its Base with its “secondary” and “loading” variants on.",
          },
          {
            kind: "concept",
            at: [1184, 223, 256, 111],
            text: "Mixins: named sets of styles, like “8 marg right” or “12,16 pad”, applied to an element together.",
            from: 1,
          },
        ],
        script: [
          { to: [1224, 137], shape: "pointer", click: true, wait: 1600 },
          { to: [1240, 280], wait: 1800 },
        ],
      },
    ],
  },
  {
    slug: "going-light",
    title: "Going Light",
    summary: "The editor turns light, and variants get a panel of their own.",
    scenes: [
      {
        frame: "light-box",
        url: PROJECT,
        change: {
          from: "comps-1",
          title: "The editor turns light",
          items: [
            "Light panels and a light canvas",
            "Variants and Interactions get a panel along the bottom",
            "The selection’s tag, size, position, and styles in one right panel",
          ],
        },
        notes: [
          {
            kind: "concept",
            at: [264, 768, 912, 177],
            side: "top",
            text: "“Make your selection a Component to enable more Variants like: primary, secondary, neutral roles; loading, warning, error, success states; light, dark, and other modes; custom interactions.”",
          },
        ],
        explore: {
          label: "15 right panels",
          at: [1184, 0, 256, 48],
          title: "Right panel, 2020",
          items: RIGHT_PANELS,
        },
      },
      {
        frame: "light-box-styled",
        url: PROJECT,
        notes: [
          {
            kind: "decision",
            at: [1184, 392, 256, 109],
            text: "“If Free-floating position is our default, this should be as straightforward as possible.” A box’s children start as a “Regular Free-floating Box”.",
          },
          {
            kind: "concept",
            at: [1184, 222, 256, 170],
            side: "left",
            text: "Position: Free, “Place anywhere in the container”, or Auto, in the container’s flow.",
            from: 1,
          },
          {
            kind: "concept",
            at: [1184, 715, 256, 180],
            text: "Border and radius are set for all sides or each one (“All sides?”, “All corners?”), and a color can be a token (“someToken”).",
            from: 2,
          },
        ],
        script: [
          { to: [1300, 449], shape: "pointer", click: true, wait: 1600 },
          { to: [1380, 236], shape: "pointer", click: true, wait: 1600 },
          { to: [1330, 887], shape: "pointer", wait: 1800 },
        ],
      },
    ],
  },
  {
    slug: "projects",
    title: "Projects",
    summary: "Logging in, the projects list, settings, and sharing.",
    scenes: [
      {
        frame: "login",
        url: "plasmic.app/login",
        script: [
          { to: [737, 292], shape: "pointer", wait: 1000 },
          {
            to: [734, 400],
            shape: "pointer",
            click: true,
            frame: "login-email",
            wait: 1200,
          },
          { to: [640, 464], shape: "text", click: true, wait: 1600 },
        ],
        hot: [{ at: [520, 370, 400, 44], frame: "login-email" }],
      },
      {
        frame: "projects",
        url: "plasmic.app/projects",
        notes: [
          {
            kind: "concept",
            at: [240, 148, 960, 230],
            side: "bottom",
            text: "Each project is versioned and shared with a team. A project can import another, like a kit of components, colors, or text styles.",
          },
          {
            kind: "concept",
            at: [240, 564, 960, 215],
            side: "top",
            text: "Tutorials are projects too: “Click to duplicate” starts a copy to learn in.",
            from: 1,
          },
        ],
        script: [
          { to: [640, 263], wait: 1400 },
          { to: [1124, 652], shape: "pointer", wait: 1800 },
        ],
      },
      {
        frame: "settings",
        url: "plasmic.app/settings",
        notes: [
          {
            kind: "concept",
            at: [240, 226, 960, 140],
            side: "bottom",
            text: "Personal access tokens let Plasmic’s command line tool sync a project’s code into a codebase.",
          },
        ],
        script: [
          { to: [1146, 259], shape: "pointer", click: true, wait: 1400 },
          { to: [857, 348], shape: "pointer", click: true, wait: 1800 },
        ],
      },
      {
        frame: "projects",
        url: "plasmic.app/projects",
        span: 2,
        sheet: { title: "Share & CodeSandbox", items: SHARE },
      },
    ],
  },
  {
    slug: "top-bar",
    title: "Top Bar",
    summary: "The bar across the top: tools, preview, code, and alerts.",
    scenes: [
      {
        frame: "banner",
        url: PROJECT,
        notes: [
          {
            kind: "decision",
            at: [256, 40, 928, 40],
            side: "bottom",
            text: "Permission and saving problems get a banner under the top bar: “We’re having trouble saving this project. We’ll keep trying.”",
          },
          {
            kind: "concept",
            at: [1150, 6, 72, 28],
            side: "bottom",
            text: "Generate turns the design into React components, ready to use in code.",
            from: 2,
          },
        ],
        explore: {
          label: "13 top bars",
          at: [545, 4, 350, 32],
          title: "Top bar, 2020",
          items: TOP_BARS,
        },
        script: [
          { to: [600, 20], wait: 900 },
          { to: [760, 20], shape: "pointer", wait: 1100 },
          { to: [1185, 20], shape: "pointer", wait: 1800 },
        ],
      },
    ],
  },
  {
    slug: "tree",
    title: "Tree & Arenas",
    summary: "Arenas to lay artboards out in, and the tree of what’s on them.",
    scenes: [
      {
        frame: "arenas-menu",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [0, 80, 256, 137],
            text: "An arena is a canvas to lay artboards out on. A project has as many as it needs, like “Onboarding Materials” and “Landing Page”.",
          },
        ],
        script: [
          { to: [90, 175], wait: 1000 },
          { to: [146, 175], shape: "pointer", click: true, wait: 2200 },
        ],
      },
      {
        frame: "arena-empty",
        url: PROJECT,
        notes: [
          {
            kind: "decision",
            at: [268, 52, 200, 240],
            text: "An empty arena explains itself: “To create an Artboard, click on the Insert button in the top bar…”",
          },
          {
            kind: "decision",
            at: [1184, 173, 256, 331],
            side: "left",
            text: "So do tokens and mixins: “To create a color Token, click on the plus icon in the color picker…”",
            from: 1,
          },
        ],
        explore: {
          label: "9 gallery states",
          at: [52, 44, 48, 32],
          title: "Gallery, 2020",
          items: GALLERY,
        },
        script: [
          { to: [333, 260], shape: "pointer", wait: 1600 },
          { to: [1300, 260], wait: 1800 },
        ],
      },
      {
        frame: "arenas-menu",
        url: PROJECT,
        span: 3,
        sheet: { title: "Tree", items: TREE },
      },
    ],
  },
  {
    slug: "artboards",
    title: "Artboards & Components",
    summary: "Artboards at a device’s size, inserting, and making components.",
    scenes: [
      {
        frame: "artboard",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [1170, 48, 256, 259],
            side: "left",
            text: "An artboard shows a page at a device’s size. View Mode: Fill stretches the root box over the artboard; Hug wraps it round its content.",
          },
        ],
        script: [
          { to: [720, 476], wait: 1200 },
          { to: [1290, 230], shape: "pointer", click: true, wait: 1800 },
        ],
      },
      {
        frame: "omnibar",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [528, 113, 384, 200],
            text: "Insert anything by typing its name: a blank artboard, or any of the project’s components.",
          },
        ],
        script: [
          { to: [600, 133], shape: "text", wait: 1200 },
          { to: [640, 214], shape: "pointer", wait: 1800 },
        ],
      },
      {
        frame: "component-new",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [1170, 48, 256, 210],
            side: "left",
            text: "A new component, with an artboard of its own (“Artboard for NewComponent”), listed in the tree with the rest.",
          },
        ],
        script: [{ to: [110, 226], shape: "pointer", wait: 2000 }],
      },
      {
        frame: "header",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [268, 160, 200, 430],
            side: "right",
            text: "Snapshot: the variants each component on the artboard is in, group by group (Header: Intent Primary; Password: State Disabled, Icons Right).",
          },
          {
            kind: "concept",
            at: [556, 200, 328, 64],
            side: "right",
            text: "Header is a component placed inside Login Page: an instance, with variants and slots of its own.",
            from: 1,
          },
        ],
        script: [
          { to: [340, 300], wait: 1400 },
          { to: [650, 232], shape: "pointer", click: true, wait: 1800 },
        ],
      },
    ],
  },
  {
    slug: "variants",
    title: "Variants",
    summary:
      "Base variants, variant groups, and recording changes into a variant.",
    scenes: [
      {
        frame: "variants-1",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [976, 104, 200, 96],
            side: "left",
            text: "Recording: while “primary” and “mobile” are recording, every change made on the canvas is saved to those variants, not to the base.",
          },
          {
            kind: "concept",
            at: [976, 292, 200, 30],
            side: "left",
            text: "Base is the component as it is by default. Every other variant keeps only how it differs from Base.",
            from: 0,
          },
          {
            kind: "concept",
            at: [976, 324, 200, 80],
            side: "left",
            text: "Mouse over, Active, Mouse down: element states, variants turned on by interaction.",
            from: 1,
          },
          {
            kind: "concept",
            at: [976, 420, 200, 200],
            side: "left",
            text: "Variant groups, like Type (primary, secondary) and Size (small): one variant of each group at a time. In code, each group is a prop.",
            from: 2,
          },
        ],
        script: [
          { to: [1080, 305], shape: "pointer", wait: 1400 },
          { to: [1062, 343], shape: "pointer", click: true, wait: 1600 },
          { to: [1040, 466], shape: "pointer", wait: 1800 },
        ],
      },
      {
        frame: "recording",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [272, 44, 874, 28],
            side: "bottom",
            text: "While recording, the app says so in red, and the canvas bar names the variant every edit goes to.",
          },
        ],
        script: [{ to: [645, 232], shape: "pointer", click: true, wait: 2200 }],
      },
      {
        frame: "variant-artboards",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [242, 180, 740, 592],
            side: "right",
            text: "The same component in two artboards: as its base, and with a variant on.",
          },
        ],
        script: [
          { to: [400, 232], wait: 1400 },
          { to: [820, 232], shape: "pointer", click: true, wait: 1800 },
        ],
      },
      {
        frame: "variants-1",
        url: PROJECT,
        span: 3,
        sheet: { title: "Variants panel", items: VARIANTS },
      },
    ],
  },
  {
    slug: "slots",
    title: "Slots & Relateds",
    summary:
      "A component’s slots, and what the canvas bar says is being edited.",
    scenes: [
      {
        frame: "slot",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [593, 216, 145, 32],
            text: "A slot is a place in a component for content of its own: each Header fills its title slot with its own text.",
          },
          {
            kind: "concept",
            at: [304, 48, 850, 40],
            side: "bottom",
            text: "The canvas bar says what is being edited: the component, a related one to record into, and the theme it’s shown in.",
            from: 1,
          },
        ],
        script: [
          { to: [665, 232], shape: "pointer", click: true, wait: 1600 },
          { to: [520, 68], shape: "pointer", wait: 1800 },
        ],
      },
      {
        frame: "slot-2",
        url: PROJECT,
        script: [{ to: [665, 232], shape: "pointer", wait: 2000 }],
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
        frame: "variants-2",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [1184, 430, 256, 117],
            side: "left",
            text: "Size: fixed, stretched to fill the parent, or wrapped round the content (Wrap, Stretch).",
          },
          {
            kind: "concept",
            at: [1184, 547, 256, 257],
            side: "left",
            text: "Position: Free places a box anywhere in its parent; Auto puts it in the parent’s row or column.",
            from: 1,
          },
        ],
        script: [
          { to: [1290, 487], shape: "pointer", wait: 1600 },
          { to: [1300, 566], shape: "pointer", click: true, wait: 1800 },
        ],
      },
      {
        frame: "variants-2",
        url: PROJECT,
        span: 3,
        sheet: { title: "Size, Position & Items", items: LAYOUT },
      },
    ],
  },
  {
    slug: "style",
    title: "Text & Styles",
    summary: "Text settings, colors, and where a style’s value comes from.",
    scenes: [
      {
        frame: "project-settings",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [48, 56, 240, 92],
            text: "Project settings, like the nudge amount: how far the arrow keys move a box, a small step or a large one.",
          },
          {
            kind: "decision",
            at: [1170, 419, 256, 420],
            side: "left",
            text: "Every setting shows where its value comes from: “Local: size + underline. Default: weight, style… Inherited: the rest (gray dots).”",
            from: 1,
          },
        ],
        explore: {
          label: "10 text panels",
          at: [1170, 419, 256, 200],
          title: "Text settings, 2020",
          items: TEXT,
        },
        script: [
          { to: [170, 132], shape: "pointer", wait: 1400 },
          { to: [1300, 470], shape: "pointer", wait: 1800 },
        ],
      },
      {
        frame: "project-settings",
        url: PROJECT,
        span: 2,
        sheet: { title: "Color & override popovers", items: POPOVERS },
      },
    ],
  },
  {
    slug: "tokens",
    title: "Tokens, Mixins & Themes",
    summary: "Named values, sets of styles, and themes that change them.",
    scenes: [
      {
        frame: "tokens-empty",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [64, 152, 176, 124],
            text: "“Set and group foundational values like text, units, and colors.” A token is a value with a name: change it, and everything using it follows.",
          },
        ],
        script: [{ to: [100, 268], shape: "pointer", click: true, wait: 2000 }],
      },
      { frame: "tokens-filled", url: PROJECT },
      { frame: "tokens-grid", url: PROJECT },
      {
        frame: "mixins-empty",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [64, 146, 176, 176],
            text: "A mixin is a set of styles under one name, applied to elements together, like a class.",
          },
        ],
      },
      {
        frame: "themes",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [21, 202, 215, 88],
            text: "“Assign or override values, tokens, and mixins with themes.” The base theme holds the defaults: text, scales, and a palette.",
          },
        ],
        script: [{ to: [60, 362], shape: "pointer", wait: 2000 }],
      },
      {
        frame: "mixins-empty",
        url: PROJECT,
        span: 2,
        sheet: { title: "Mixins & tokens", items: MIXINS },
      },
    ],
  },
  {
    slug: "code",
    title: "Code & Versions",
    summary:
      "Generating React code, publishing versions, and updating imports.",
    scenes: [
      {
        frame: "codegen",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [585, 116, 447, 230],
            side: "right",
            text: "Generate Code: the design as React. Variants become props: PanelTab’s status, type, and size, and the artboard’s global variant, “mobile”.",
          },
        ],
        script: [
          { to: [470, 172], shape: "pointer", click: true, wait: 1600 },
          { to: [760, 220], shape: "text", wait: 1800 },
        ],
      },
      {
        frame: "versions",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [56, 56, 224, 265],
            text: "Publishing a version: “Version numbers are automatically calculated using semantic versioning.” Projects that import this one can update to it.",
          },
        ],
        script: [{ to: [252, 309], shape: "pointer", click: true, wait: 2000 }],
      },
      {
        frame: "update-import",
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [440, 23, 512, 110],
            side: "right",
            text: "Updating an imported project, here from v0.2.0 to v4.0.0: what was removed, added, and renamed, and what can’t update, before it happens.",
          },
        ],
      },
      { frame: "docs", height: 2000, url: "docs.plasmic.app" },
    ],
  },
  {
    slug: "rail",
    title: "The Rail",
    summary: "Late 2020: an icon rail down the left, and floating panels.",
    scenes: [
      {
        frame: "rail",
        url: PROJECT,
        change: {
          from: "project-settings",
          title: "Late 2020: the rail",
          items: [
            "An icon rail down the left, an icon per panel",
            "Panels float over the canvas",
            "A floating button inserts anything",
          ],
        },
        explore: {
          label: "A dark theme",
          at: [0, 0, 1440, 40],
          title: "Dark theme, 2020",
          items: [{ src: "dark", label: "Dark theme", w: 1440, h: 945 }],
        },
      },
      {
        frame: "rail-insert",
        height: 1890,
        url: PROJECT,
        notes: [
          {
            kind: "concept",
            at: [294, 108, 248, 600],
            side: "right",
            text: "Insert: recently used, artboards, the basics, the project’s own components, and Plume’s, in one list.",
          },
        ],
        script: [
          { to: [380, 128], shape: "text", wait: 1200 },
          { to: [400, 420], shape: "pointer", wait: 1800 },
        ],
      },
      { frame: "rail-acme", url: PROJECT },
    ],
  },
]
