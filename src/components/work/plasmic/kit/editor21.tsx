import {
  TbLink,
  TbAlignLeft,
  TbPaint,
  TbBold,
  TbWand,
  TbAlertTriangle,
  TbArrowLeft,
  TbArrowRight,
  TbBolt,
  TbBook,
  TbBrowser,
  TbChevronDown,
  TbChevronLeft,
  TbCode,
  TbColumns,
  TbComponents,
  TbDatabase,
  TbDiamond,
  TbDots,
  TbDotsVertical,
  TbEye,
  TbEyeClosed,
  TbEyeOff,
  TbFile,
  TbFilter,
  TbGridDots,
  TbHandFinger,
  TbHistory,
  TbLayoutColumns,
  TbLayoutRows,
  TbPalette,
  TbPhoto,
  TbPlayerPlay,
  TbPlus,
  TbPointer,
  TbRectangle,
  TbSettings,
  TbShoppingBag,
  TbTriangle,
  TbTypography,
  TbX,
} from "react-icons/tb"
import { Menu, Pop, Toast } from "@/components/work/plasmic/kit/overlays"
import {
  Chip,
  Field,
  IconBtn,
  Input,
  Mark,
  Search,
  Seg,
  Sel,
  Tree,
} from "@/components/work/plasmic/kit/studio"
import type { TreeNode } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// 2021's editor, from the "2021 Q1–Q3 Product" files: docked again after
// late 2020's floating panels. A 44px top bar (the page and its screen in
// dropdowns, insert and tools in the middle, view, data, code, share, and
// publish at the end), a 48px rail, a project panel (pages, components,
// imports, code components) or a component's panel (its variants above
// its tree), the canvas, and a 256px right panel. Drawn from a scene's
// state like the 2020 editor; its keys are listed on `Editor21`.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)
const num = (v: State[string], d: number) => (typeof v === "number" ? v : d)

/**
 * State keys: left: "project" | "component" | "none"; pageHover, pageMenu,
 * pageSettings; sel: "nav" | "hero" | "root"; pill: the variant picker
 * open; types: its type menu; rec: the variant recording; data: the data
 * panel open; insert: the insert popover; vis: the visibility menu;
 * expand: right panel sections open ("size,text"); railless: Q3's top bar
 * with Styles and the floating insert bar; sand: the warm canvas; grid:
 * the grid layout; tokenPop: a token's values per variant; preview: the
 * preview mode; pickerOpen; toast; zz, zx, zy.
 */
export function Editor21({ s }: { s: State }) {
  if (s.preview) return <Preview s={s} />
  const railless = Boolean(s.railless)
  const left = str(s.left, "project")
  const zz = num(s.zz, 0.62)
  const zx = num(s.zx, 0)
  const zy = num(s.zy, 0)
  return (
    <div
      className="pk-studio"
      style={{
        gridTemplateRows: "44px minmax(0,1fr)",
        gridTemplateColumns: railless
          ? "232px minmax(0,1fr) 256px"
          : "48px 208px minmax(0,1fr) 256px",
        gridTemplateAreas: railless
          ? '"top top top" "left canvas right"'
          : '"top top top top" "rail left canvas right"',
      }}
    >
      <Top21 s={s} />
      {!railless && <Rail21 s={s} />}
      <div
        className="pk-panel pk-area-left"
        style={{ borderRight: "1px solid var(--pk-line)" }}
        data-pk="left"
      >
        {left === "component" ? (
          <ComponentPanel s={s} />
        ) : (
          <ProjectPanel s={s} />
        )}
      </div>
      <main
        className="pk-canvas pk-area-canvas"
        data-pk="canvas"
        data-rec={s.rec || s.multiRec ? "" : undefined}
        style={
          s.sand
            ? ({
                "--pk-bg": "#efe9df",
                "--pk-dots": "#dcd3c5",
              } as React.CSSProperties)
            : undefined
        }
      >
        <div
          className="pk-world"
          style={{ transform: `translate(${zx}px, ${zy}px) scale(${zz})` }}
        >
          <div
            className="pk-board"
            style={{ left: 80, top: 90, width: 1180, height: 900 }}
            data-pk="board:home"
          >
            <span
              className="pk-board-label"
              style={{
                fontSize: 16,
                color: s.multiRec ? "var(--pk-rec)" : undefined,
              }}
            >
              {s.multiRec ? str(s.multiRec).split(",").join(" / ") : "Home"}{" "}
              <span className="pk-faint pk-mono">Desktop · 1180</span>
            </span>
            <div className="pk-board-body">
              <Site21
                grid={Boolean(s.grid)}
                dark={s.globalDark === true}
                hide={str(s.visMode)}
                spot={Boolean(s.spot)}
                navLink={str(s.navLink)}
                heroMargin={num(s.heroMargin, 0)}
                ink={s.multiColor ? "#2563eb" : undefined}
                rich={str(s.rich)}
              />
            </div>
          </div>
          {s.sel === "nav" && (
            <Sel
              x={80}
              y={90}
              w={1180}
              h={84}
              kind="component"
              tag={
                <>
                  <TbComponents className="h-3 w-3" />
                  Navigation
                </>
              }
              size="1180 × 84"
              pk="selection"
            />
          )}
          {s.sel === "hero" && (
            <Sel
              x={80}
              y={174}
              w={1180}
              h={400}
              tag="Hero"
              size="1180 × 400"
              pk="selection"
            />
          )}
          {s.handles && (
            <div
              className="pk-handles"
              style={{ left: 80, top: 174, width: 1180, height: 400 }}
              data-pk="handles"
            >
              <i style={{ top: 0, height: 48 }} />
              <i style={{ bottom: 0, height: 48 }} />
              <b style={{ top: 12 }}>48</b>
              <b style={{ bottom: 12 }}>48</b>
            </div>
          )}
          {Boolean(s.mband) && (
            <div
              className="pk-mband"
              style={{
                left: 80,
                top: 574,
                width: 1180,
                height: num(s.heroMargin, 0),
              }}
              data-pk="margin:band"
            >
              <b>{num(s.heroMargin, 0)}</b>
              {Boolean(s.mdrag) && <span className="pk-mtip">Margin</span>}
            </div>
          )}
          {Boolean(s.sand) && s.sel === "hero" && (
            <i
              className="pk-medge"
              style={{
                left: 80 + 1180 * 0.3 - 24,
                top: 574 + num(s.heroMargin, 0) - 6,
              }}
              data-pk="margin:edge"
            />
          )}
        </div>
        <VariantPill s={s} />
        {s.insert && <InsertPop21 s={s} />}
        {s.codeDrawer && <CodeDrawer />}
        {railless && <InsertBar s={s} />}
        <span
          className="pk-zoom absolute bottom-3 left-3 rounded-lg"
          style={{ background: "var(--pk-pop)", boxShadow: "var(--pk-shadow)" }}
          data-pk="zoom-level"
        >
          {Math.round(zz * 100)}%
        </span>
      </main>
      <div
        className="pk-panel pk-area-right"
        style={{ borderLeft: "1px solid var(--pk-line)" }}
        data-pk="right"
      >
        <Right21 s={s} />
      </div>
      {s.data && <DataPanel />}
      {Boolean(s.vis) && (
        <Menu
          x={1212}
          y={226}
          w={212}
          pk="vis-menu"
          hover={str(s.menuHover)}
          items={[
            { label: "Visible", icon: TbEye, pk: "vismenu:visible" },
            {
              label: "Render, but keep hidden",
              icon: TbEyeClosed,
              pk: "vismenu:keep",
            },
            { label: "Don’t render", icon: TbEyeOff, pk: "vismenu:none" },
          ]}
        />
      )}
      {Boolean(s.ctx) && (
        <Menu
          x={1196}
          y={318}
          w={220}
          pk="ctx-menu"
          hover={str(s.menuHover)}
          items={[
            { label: "Remove variant", pk: "ctx:remove-variant" },
            { label: "Remove base", pk: "ctx:remove-base" },
            { label: "Remove all", pk: "ctx:remove-all" },
            "sep",
            { label: "Extract to Mixin", pk: "ctx:mixin" },
            { label: "Extract to Token", pk: "ctx:token" },
            { label: "Extract to Variant", pk: "ctx:variant" },
            "sep",
            { label: "Link to prop", pk: "ctx:prop" },
            { label: "Link to data", pk: "ctx:data" },
          ]}
        />
      )}
      {s.pageMenu && (
        <Menu
          x={railless ? 150 : 200}
          y={150}
          w={176}
          pk="page-menu"
          hover={str(s.menuHover)}
          items={[
            { label: "Rename page" },
            { label: "Duplicate page" },
            { label: "Go to page" },
            { label: "Convert to component" },
            "sep",
            { label: "Delete page" },
          ]}
        />
      )}
      {s.pageSettings && <PageSettings />}
      {s.tokenPop && <TokenPop />}
      {s.toast && <Toast>{str(s.toast)}</Toast>}
    </div>
  )
}

function Top21({ s }: { s: State }) {
  const railless = Boolean(s.railless)
  return (
    <header className="pk-top pk-area-top" data-pk="top">
      <span className="pk-logo">
        <Mark />
      </span>
      <span className="pk-project" data-pk="project">
        Acme Store
      </span>
      <span className="pk-btn" data-kind="ghost" data-pk="page-picker">
        <TbFile style={{ color: "var(--pk-accent)" }} />
        Home
        <TbChevronDown className="h-3 w-3" />
      </span>
      <span className="pk-btn" data-kind="ghost" data-pk="screen-picker">
        <TbBrowser style={{ color: "var(--pk-accent)" }} />
        Desktop
        <TbChevronDown className="h-3 w-3" />
      </span>
      {railless && (
        <span className="pk-seg ml-2" data-pk="styles-tabs">
          <span aria-pressed={!s.stylesTab}>Design</span>
          <span aria-pressed={Boolean(s.stylesTab)}>Styles</span>
        </span>
      )}
      <span className="pk-tools">
        {!railless && (
          <span
            className="pk-tool"
            data-pk="tool:insert"
            aria-pressed={Boolean(s.insert)}
            style={{
              borderRadius: 99,
              background: s.insert ? undefined : "var(--pk-accent)",
              color: "#fff",
            }}
          >
            <TbPlus />
          </span>
        )}
        {[
          TbRectangle,
          TbLayoutColumns,
          TbLayoutRows,
          TbTypography,
          TbPhoto,
        ].map((I, i) => (
          <span key={i} className="pk-tool" data-pk={`tool:${i}`}>
            <I />
          </span>
        ))}
      </span>
      <span className="pk-zoom">
        75% <TbChevronDown className="h-3 w-3" />
      </span>
      <span className="pk-btn" data-kind="ghost">
        View <TbChevronDown className="h-3 w-3" />
      </span>
      <span className="pk-tool" data-pk="preview">
        <TbPlayerPlay />
      </span>
      <span
        className="pk-btn"
        data-kind={s.data ? undefined : "ghost"}
        data-pk="data-toggle"
        style={s.data ? { background: "#7c3aed", color: "#fff" } : undefined}
      >
        <TbDatabase />
        Data
      </span>
      <span className="pk-btn" data-kind="ghost" data-pk="code">
        <TbCode />
        Code
      </span>
      <span className="pk-btn" data-pk="share">
        Share
      </span>
      <span className="pk-btn" data-kind="primary" data-pk="publish">
        Publish
      </span>
    </header>
  )
}

function Rail21({ s }: { s: State }) {
  const items: Array<[string, React.ComponentType<{ className?: string }>]> = [
    ["project", TbLayoutRows],
    ["assets", TbPalette],
    ["images", TbPhoto],
    ["docs", TbBook],
    ["preview", TbBrowser],
  ]
  return (
    <nav className="pk-rail pk-area-rail" data-pk="rail">
      {items.map(([id, I]) => (
        <span
          key={id}
          className="pk-tool"
          data-pk={`rail:${id}`}
          aria-pressed={id === "project"}
        >
          <I />
        </span>
      ))}
      <span
        className="pk-sep"
        style={{ width: 20, height: 1, margin: "6px 0" }}
      />
      <span className="pk-tool">
        <TbSettings />
      </span>
      <span className="pk-tool" data-pk="rail:history">
        <TbHistory />
      </span>
      <span className="pk-rail-end" />
      <span className="flex flex-col items-center gap-1" data-pk="rail:people">
        {["Y", "C", "K"].map((n, i) => (
          <span
            key={n}
            className="pk-avatar"
            style={{
              margin: 0,
              background: ["#f97316", "#8b5cf6", "#0ea5e9"][i],
              opacity: s.people === false ? 0 : 1,
            }}
          >
            {n}
          </span>
        ))}
      </span>
      <span
        className="pk-avatar mt-2"
        style={{ margin: "8px 0 0", background: "#10b981" }}
      >
        L
      </span>
    </nav>
  )
}

type Row = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  dim?: boolean
  kind?: string
}
const PROJECT: Array<[string, Array<Row>, string?]> = [
  [
    "Pages",
    [
      { id: "home", label: "Home", icon: TbFile, path: "/" },
      { id: "about", label: "About", icon: TbFile, path: "/about" },
      { id: "contact", label: "Contact us", icon: TbFile, path: "/contact" },
    ],
  ],
  [
    "Components",
    [
      { id: "header", label: "Header", icon: TbComponents },
      { id: "hero", label: "Hero", icon: TbComponents },
      { id: "navigation", label: "Navigation", icon: TbComponents },
      { id: "footer", label: "Footer", icon: TbComponents },
    ],
  ],
  [
    "Behavioral components",
    [
      { id: "checkbox", label: "Checkbox", icon: TbHandFinger },
      { id: "select", label: "Select", icon: TbHandFinger },
    ],
  ],
  [
    "Imported from SystemKit",
    [
      { id: "panel", label: "Panel", icon: TbComponents },
      { id: "modal", label: "Modal", icon: TbComponents, dim: true },
    ],
    "import",
  ],
  [
    "Code components",
    [
      {
        id: "code-button",
        label: "Button",
        icon: TbCode,
        path: "./src/Button.tsx",
      },
      { id: "code-tabs", label: "Tabs", icon: TbCode, path: "./src/Tabs.tsx" },
    ],
  ],
]

function ProjectPanel({ s }: { s: State }) {
  return (
    <>
      <div className="flex items-center gap-1 pr-2">
        <div className="flex-1">
          <Search
            placeholder="Search…"
            pk="project:search"
            value={str(s.q)}
            focus={Boolean(s.qFocus)}
          />
        </div>
        <IconBtn icon={TbFilter} />
        <IconBtn icon={TbPlus} pk="project:add" />
      </div>
      <div className="pk-scroll" data-pk="project">
        {PROJECT.filter(
          ([, rows]) =>
            !s.q ||
            rows.some((r) =>
              r.label.toLowerCase().includes(str(s.q).toLowerCase())
            )
        ).map(([group, rows]) => (
          <div
            key={group}
            className="pb-2"
            data-pk={`group:${group.toLowerCase()}`}
          >
            <div
              className="pk-group-label"
              style={{ textTransform: "none", letterSpacing: 0, fontSize: 12 }}
            >
              {group}
            </div>
            {rows.map((r) => {
              const hovered = s.pageHover === r.id
              return (
                <div
                  key={r.id}
                  className="pk-row"
                  data-pk={`p:${r.id}`}
                  data-dim={r.dim || undefined}
                  aria-selected={s.page === r.id || undefined}
                  data-state={hovered ? "hover" : undefined}
                  style={{ paddingLeft: 10 }}
                >
                  <r.icon />
                  <span className="truncate">{r.label}</span>
                  {r.path && (hovered || r.id.startsWith("code")) && (
                    <span className="pk-faint pk-mono truncate">{r.path}</span>
                  )}
                  {hovered && (
                    <span className="ml-auto flex gap-0.5">
                      <TbSettings
                        className="h-3.5 w-3.5 opacity-70"
                        data-pk={`p:${r.id}:settings`}
                      />
                      <TbDotsVertical
                        className="h-3.5 w-3.5 opacity-70"
                        data-pk={`p:${r.id}:more`}
                      />
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}

const SELECT_TREE: Array<TreeNode> = [
  { id: "root", label: "Root", kind: "box", open: true },
  { id: "trigger", label: "trigger", kind: "hstack", depth: 1 },
  { id: "overlay", label: "dropdownOverlay", kind: "box", depth: 1, dim: true },
  { id: "options", label: "optionsContainer", kind: "vstack", depth: 1 },
]

function ComponentPanel({ s }: { s: State }) {
  const rec = str(s.rec)
  const groups: Array<
    [string, React.ComponentType<{ className?: string }>, Array<string>]
  > = [
    ["Interactions", TbBolt, ["Hover", "Focused"]],
    ["Toggles", TbTriangle, ["isOpen", "isDisabled", "showPlaceholder"]],
  ]
  return (
    <div className="pk-scroll flex flex-col">
      <div
        className="flex items-center gap-2 px-3 pt-3 pb-2"
        data-pk="component:head"
      >
        <TbHandFinger
          className="h-4 w-4"
          style={{ color: "var(--pk-component)" }}
        />
        <span className="flex flex-col">
          <b className="font-semibold">Select</b>
          <span className="pk-faint text-[11px]">Behavioral component</span>
        </span>
        <TbSettings className="ml-auto h-4 w-4 opacity-60" />
      </div>
      <p
        className="pk-muted mx-3 mb-2 text-[11px] leading-4"
        data-pk="component:about"
      >
        Show a list of options in a dropdown menu. Supports selection 0 or 1
        option at a time.
      </p>
      <div
        className="mx-3 mb-3 rounded-lg p-2.5 text-[11px] leading-4"
        style={{
          background: "rgb(245 184 74 / 0.14)",
          color: "var(--pk-warn)",
        }}
        data-pk="missing"
      >
        <span className="mb-1 flex items-center gap-1.5 font-semibold">
          <TbAlertTriangle className="h-3.5 w-3.5" />
          Missing
        </span>
        Variants: <u>isDisabled</u>
        <br />
        Slots: <u>children</u>
        <br />
        Elements: <u>optionsContainer</u>
      </div>
      <div
        className="pk-head"
        style={{ borderTop: "1px solid var(--pk-line)" }}
      >
        <span>Variants</span>
        <IconBtn icon={TbPlus} pk="variants:add" />
      </div>
      <div className="pk-variant" aria-checked={!rec} data-pk="v:base">
        <TbDiamond style={{ color: "var(--pk-component)" }} />
        Base
      </div>
      {groups.map(([g, I, opts]) => (
        <div key={g} data-pk={`vg:${g.toLowerCase()}`}>
          <div
            className="pk-group-label"
            style={{ textTransform: "none", letterSpacing: 0 }}
          >
            {g}
          </div>
          {opts.map((o) => (
            <div
              key={o}
              className="pk-variant"
              data-rec={rec === o || undefined}
              data-pk={`v:${o.toLowerCase()}`}
            >
              <I />
              {o}
              {rec === o && <Chip kind="rec">REC</Chip>}
            </div>
          ))}
        </div>
      ))}
      <div
        className="pk-head mt-2"
        style={{ borderTop: "1px solid var(--pk-line)" }}
      >
        <span>Tree</span>
      </div>
      <Tree nodes={SELECT_TREE} selected={str(s.treeSel, "trigger")} />
    </div>
  )
}

/** The right panel in 2021's order; `expand` lists the sections open. */
function Right21({ s }: { s: State }) {
  const open = str(s.expand, "size").split(",")
  const rec = Boolean(s.rec || s.multiRec)
  const head = (
    <div
      className="grid grid-cols-3 gap-1 border-b px-3 py-2.5"
      style={{ borderColor: "var(--pk-line)" }}
      data-pk="right:head"
    >
      {[
        [
          s.sel === "nav" ? "Navigation" : "Root",
          s.sel === "nav" ? "Component" : "Element",
        ],
        ["div ▾", "Tag"],
        ["Default ▾", "State"],
      ].map(([a, b]) => (
        <span key={b} className="flex flex-col">
          <b className="truncate font-semibold">{a}</b>
          <span className="pk-faint text-[11px]">{b}</span>
        </span>
      ))}
      {s.sel === "nav" && (
        <span
          className="pk-btn col-span-3 mt-1 justify-start"
          data-kind={s.spot ? "primary" : "ghost"}
          style={{ height: 26 }}
          data-pk="spotlight"
        >
          <TbWand className="h-3.5 w-3.5" />
          {s.spot ? "Spotlight editing Navigation" : "Spotlight edit"}
          <span className="pk-mono ml-auto opacity-70">⌘↵</span>
        </span>
      )}
    </div>
  )
  const row = (
    name: string,
    pk: string,
    body?: React.ReactNode,
    add = false
  ) => (
    <div className="pk-section" style={{ padding: 0 }} data-pk={pk} key={pk}>
      <div className="pk-section-head" style={{ height: 40 }}>
        <span>{name}</span>
        {add ? (
          <TbPlus className="h-3.5 w-3.5 opacity-60" />
        ) : open.includes(pk.replace("sec:", "")) ? (
          <TbChevronDown className="h-3.5 w-3.5 opacity-60" />
        ) : (
          <TbChevronLeft className="h-3.5 w-3.5 opacity-60" />
        )}
      </div>
      {open.includes(pk.replace("sec:", "")) && body && (
        <div className="pb-3">{body}</div>
      )}
    </div>
  )
  return (
    <div
      className="pk-scroll"
      style={rec ? { boxShadow: "inset 0 0 0 2px var(--pk-rec)" } : undefined}
    >
      {s.multiRec && (
        <div
          className="flex flex-col gap-1.5 px-3 py-2.5 text-white"
          style={{ background: "var(--pk-rec)" }}
          data-pk="multi-rec"
        >
          <b className="text-[11px] tracking-wide">RECORDING</b>
          <span className="flex flex-wrap gap-1">
            {str(s.multiRec)
              .split(",")
              .map((v) => (
                <span
                  key={v}
                  className="flex items-center gap-1 rounded-md px-1.5 py-0.5"
                  style={{ background: "rgb(255 255 255 / 0.2)" }}
                >
                  {v}
                  <TbX className="h-3 w-3" />
                </span>
              ))}
            <span
              className="rounded-md px-1.5 py-0.5"
              style={{ background: "rgb(255 255 255 / 0.2)" }}
            >
              +
            </span>
          </span>
        </div>
      )}
      {s.recLocked && (
        <div
          className="flex items-center gap-2 px-3 py-2 text-white"
          style={{ background: "var(--pk-rec)" }}
          data-pk="rec-locked"
        >
          <span className="flex-1 font-medium">Recording locked…</span>
          <span
            className="pk-btn"
            data-size="sm"
            style={{ background: "#fff", color: "var(--pk-rec)" }}
          >
            Done
          </span>
        </div>
      )}
      {head}
      {row("Attributes", "sec:attributes")}
      {row("Mixins", "sec:mixins", null, true)}
      {row("Visibility", "sec:visibility", null)}
      <div
        className="-mt-9 mb-1 flex justify-end gap-1 px-8"
        data-pk="vis-modes"
      >
        {[TbEye, TbEyeClosed, TbEyeOff].map((I, i) => (
          <span
            key={i}
            className="pk-icon-btn"
            style={
              i === ["", "keep", "none"].indexOf(str(s.visMode))
                ? { background: "var(--pk-panel-3)", color: "var(--pk-fg)" }
                : undefined
            }
            data-pk={`vis:${["visible", "keep", "none"][i]}`}
          >
            <I />
          </span>
        ))}
      </div>
      {row(
        "Size",
        "sec:size",
        <>
          <Field label="Width" pk="f:width">
            <Input rec={rec}>Stretch</Input>
          </Field>
          <Field label="Height">
            <Input>Hug</Input>
          </Field>
          <Field label="Overflow">
            <Input>Visible</Input>
          </Field>
        </>
      )}
      {row(
        "Position",
        "sec:position",
        <>
          <Field label="Type">
            <Seg items={["Auto", "Sticky", "Fixed"]} pressed={0} />
          </Field>
          <p className="pk-faint px-3 text-[11px] leading-4">
            Auto-set by parent container.
          </p>
        </>
      )}
      {row(
        s.grid ? "Grid" : "Horizontal",
        "sec:layout",
        s.grid ? (
          <>
            <Field label="Columns">
              <Input set>3 × 1fr</Input>
            </Field>
            <Field label="Rows">
              <Input>auto</Input>
            </Field>
            <Field label="Areas">
              <Input mono>“nav nav nav”</Input>
            </Field>
          </>
        ) : (
          <>
            <Field label="Layout">
              <Seg
                items={[TbColumns, TbLayoutRows, TbGridDots, TbPointer]}
                pressed={0}
              />
            </Field>
            <Field label="Gap">
              <Input>24px</Input>
            </Field>
          </>
        )
      )}
      {row(
        "Padding",
        "sec:padding",
        <div className="pk-pad" style={{ height: 80 }}>
          <span style={{ gridArea: "1 / 2" }}>48</span>
          <span style={{ gridArea: "2 / 1" }}>80</span>
          <i />
          <span style={{ gridArea: "2 / 3" }}>80</span>
          <span style={{ gridArea: "3 / 2" }}>48</span>
        </div>
      )}
      {row(
        "Text",
        "sec:text",
        <>
          <Field
            label={
              <span className="flex items-center gap-1.5">
                <span className="pk-dot" data-kind={rec ? "rec" : "set"} />
                Color
              </span>
            }
          >
            <Input rec={rec}>
              <span
                className="pk-swatch"
                style={{
                  background: s.globalDark
                    ? "#f8fafc"
                    : s.multiColor
                      ? "#2563eb"
                      : "#222",
                }}
              />
              {s.globalDark ? "#F8FAFC" : s.multiColor ? "#2563EB" : "#222222"}
            </Input>
          </Field>
          <Field label="Family">
            <Input mono={false}>Roboto</Input>
          </Field>
          <Field label="Size">
            <div className="pk-pair">
              <Input>32</Input>
              <Input>400</Input>
            </div>
          </Field>
          <Field label="Height">
            <Input>1.5</Input>
          </Field>
        </>
      )}
      {row("Background", "sec:background")}
      {row("Border", "sec:border", null, true)}
      {row("Shadows", "sec:shadows", null, true)}
      {row("Effects", "sec:effects")}
      {row("Transitions", "sec:transitions", null, true)}
    </div>
  )
}

/** The canvas's pill: which variants to record into, and the recording chip. */
function VariantPill({ s }: { s: State }) {
  const rec = str(s.rec)
  return (
    <>
      <div
        className="pk-canvas-bar"
        style={rec ? { background: "var(--pk-rec)", color: "#fff" } : undefined}
        data-pk="pill"
      >
        {rec ? (
          <>
            <span className="h-2 w-2 rounded-full bg-white" />
            {rec}
            <TbX className="h-3.5 w-3.5 opacity-80" />
          </>
        ) : (
          <>
            <span className="pk-muted">Select variants to record…</span>
            <TbChevronDown className="h-3.5 w-3.5" />
          </>
        )}
      </div>
      {s.pill && (
        <Pop x={(1440 - 48 - 208 - 256) / 2 - 140} y={52} w={280} pk="picker">
          <Search placeholder="Search variants…" pk="picker:search" />
          <div className="pk-variant" aria-checked>
            <TbDiamond style={{ color: "var(--pk-component)" }} />
            Base
          </div>
          {s.types ? (
            <div className="px-1 pb-2" data-pk="picker:types">
              <div className="pk-menu-label px-2">Select variant type</div>
              {[
                [TbBolt, "Interaction"],
                [TbTriangle, "Toggle"],
                [TbDots, "Single-select group"],
                [TbGridDots, "Multi-select group"],
                [TbBrowser, "Screen breakpoint"],
                [TbPalette, "Global"],
                [TbArrowRight, "Combination"],
              ].map(([I, label]) => {
                const Icon = I as React.ComponentType<{ className?: string }>
                return (
                  <div
                    key={label as string}
                    className="pk-menu-item"
                    data-state={s.typeHover === label ? "hover" : undefined}
                    data-pk={`type:${(label as string).toLowerCase()}`}
                  >
                    <Icon />
                    {label as string}
                  </div>
                )
              })}
            </div>
          ) : (
            <>
              <div
                className="pk-group-label"
                style={{ textTransform: "none", letterSpacing: 0 }}
              >
                Types
              </div>
              {["Round", "Flat"].map((o) => (
                <div
                  key={o}
                  className="pk-variant"
                  data-pk={`picker:${o.toLowerCase()}`}
                  data-rec={rec === o || undefined}
                >
                  <TbDots />
                  {o}
                </div>
              ))}
              <div
                className="pk-group-label"
                style={{ textTransform: "none", letterSpacing: 0 }}
              >
                Screen breakpoints
              </div>
              <div className="pk-variant">
                <TbBrowser />
                Mobile only
                <span className="pk-faint pk-mono ml-auto">≤768</span>
              </div>
              <div className="p-2">
                <span
                  className="pk-btn w-full"
                  style={{ background: "var(--pk-rec)", color: "#fff" }}
                  data-pk="picker:new"
                >
                  New variant
                  <TbArrowRight />
                </span>
              </div>
            </>
          )}
        </Pop>
      )}
    </>
  )
}

/** Insert, as a popover over the canvas: before, inside, or after the selection. */
function InsertPop21({ s }: { s: State }) {
  return (
    <Pop x={(1440 - 48 - 208 - 256) / 2 - 200} y={52} w={400} pk="insert">
      <div className="flex items-center gap-2 px-3 pt-3">
        <b className="flex-1 font-semibold">Insert</b>
        <Seg
          items={["Before", "Inside", "After"]}
          pressed={num(s.where, 2)}
          pk="insert:where"
        />
      </div>
      <Search
        placeholder="Search elements, components, templates, and commands…"
        value={str(s.q2)}
        focus={Boolean(s.q2Focus)}
        pk="insert:search"
      />
      <div className="pk-menu-label px-4">Basic elements</div>
      {[
        [TbColumns, "Horizontal stack"],
        [TbLayoutRows, "Vertical stack"],
        [TbRectangle, "Free box"],
        [TbTypography, "Text"],
        [TbPhoto, "Image"],
      ].map(([I, l]) => {
        const Icon = I as React.ComponentType<{ className?: string }>
        return (
          <div
            key={l as string}
            className="pk-insert-item"
            data-pk={`ins:${(l as string).toLowerCase()}`}
          >
            <i>
              <Icon />
            </i>
            {l as string}
          </div>
        )
      })}
      <div className="pk-menu-label px-4">Project components</div>
      {["Button", "Card", "Navigation"].map((c) => (
        <div
          key={c}
          className="pk-insert-item"
          data-kind="component"
          aria-selected={s.insSel === c || undefined}
          data-pk={`ins:${c.toLowerCase()}`}
        >
          <i>
            <TbComponents />
          </i>
          {c}
        </div>
      ))}
      <div className="pb-2" />
    </Pop>
  )
}

/**
 * Q1's north star ("Focused Mode"): the selected component's code in a
 * drawer under the canvas, React on one side and its CSS on the other,
 * ejected once into plain React.
 */
function CodeDrawer() {
  return (
    <div
      className="absolute right-0 bottom-0 left-0 flex"
      style={{
        height: 300,
        background: "#0b0c0e",
        borderTop: "1px solid var(--pk-line)",
      }}
      data-pk="code-drawer"
    >
      {[
        [
          "PlasmicNavigation.jsx",
          [
            "<nav className={sty.root}>",
            "  <Logo />",
            "  <Links items={links} />",
            '  <Button kind="pill">',
            "    Let’s go!",
            "  </Button>",
            "</nav>",
          ],
        ],
        [
          "PlasmicNavigation.module.css",
          [
            ".root {",
            "  display: flex;",
            "  align-items: center;",
            "  gap: 32px;",
            "  padding: 0 80px;",
            "}",
          ],
        ],
      ].map(([file, code]) => (
        <div
          key={file as string}
          className="flex min-w-0 flex-1 flex-col"
          style={{ borderRight: "1px solid #1f2329" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 text-[11px]"
            style={{ color: "#9ca3af", borderBottom: "1px solid #1f2329" }}
          >
            <TbCode className="h-3.5 w-3.5" />
            {file as string}
            {(file as string).endsWith(".jsx") && (
              <span className="pk-badge ml-auto">
                Plain React (one-time eject)
              </span>
            )}
          </div>
          <pre
            className="pk-code m-0 flex-1 rounded-none"
            style={{ background: "transparent" }}
          >
            {(code as Array<string>).join("\n")}
          </pre>
        </div>
      ))}
    </div>
  )
}

/** Q3's floating insert toolbar at the foot of the canvas (the rail gone). */
function InsertBar({ s }: { s: State }) {
  return (
    <div
      className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-xl p-1.5"
      style={{ background: "var(--pk-pop)", boxShadow: "var(--pk-shadow)" }}
      data-pk="insert-bar"
    >
      <span
        className="pk-tool"
        style={{
          background: "var(--pk-accent)",
          color: "#fff",
          borderRadius: 99,
        }}
      >
        <TbPlus />
      </span>
      {[
        TbRectangle,
        TbColumns,
        TbLayoutRows,
        TbTypography,
        TbPhoto,
        TbComponents,
      ].map((I, i) => (
        <span
          key={i}
          className="pk-tool"
          data-state={s.barHover === i ? "hover" : undefined}
        >
          <I />
        </span>
      ))}
    </div>
  )
}

function DataPanel() {
  return (
    <div
      className="pk-panel"
      style={{
        // Inline, since .pk-panel's own position would win over a utility.
        position: "absolute",
        top: 44,
        right: 256,
        bottom: 0,
        width: 256,
        borderLeft: "1px solid var(--pk-line)",
        zIndex: 4,
      }}
      data-pk="data-panel"
    >
      <div className="pk-section">
        <div className="pk-section-head">
          <span>Queries</span>
          <TbPlus className="h-3.5 w-3.5 opacity-60" />
        </div>
        {["get blog posts", "https://jsonplaceholder.typic…"].map((q) => (
          <div key={q} className="pk-variant">
            <TbDatabase />
            {q}
            <span className="pk-badge ml-auto">Result</span>
          </div>
        ))}
      </div>
      <div className="pk-section" data-pk="data:logic">
        <div className="pk-section-head">
          <span>Logic</span>
          <TbChevronDown className="h-3.5 w-3.5 opacity-60" />
        </div>
        <Field label="Show only if…">
          <Input mono={false}>Select a yes/no…</Input>
        </Field>
        <Field label="Repeat…">
          <Input mono={false}>Select a collection…</Input>
        </Field>
      </div>
      <div className="pk-section">
        <div className="pk-section-head">
          <span>Variables</span>
          <TbPlus className="h-3.5 w-3.5 opacity-60" />
        </div>
      </div>
      <div className="pk-section" data-pk="data:props">
        <div className="pk-section-head">
          <span>Props</span>
        </div>
        {[
          "Contents",
          "Hover text",
          "On click",
          "On mouse enter",
          "Placeholder",
        ].map((p) => (
          <Field key={p} label={p}>
            <Input>--</Input>
          </Field>
        ))}
      </div>
    </div>
  )
}

function PageSettings() {
  return (
    <Pop x={60} y={120} w={220} pk="page-settings">
      <div className="pk-head">
        <span>Contact us</span>
        <TbX className="h-3.5 w-3.5 opacity-60" />
      </div>
      <div className="flex flex-col gap-1 pb-3">
        <Field label="Path">
          <Input>/contact</Input>
        </Field>
        <Field label="Title">
          <Input mono={false}>Contact us</Input>
        </Field>
        <Field label="Description">
          <Input mono={false}>
            <span className="pk-faint">Recommended 160 characters.</span>
          </Input>
        </Field>
        <Field label="Social image">
          <Input mono={false}>
            <span className="pk-faint">Select image…</span>
          </Input>
        </Field>
      </div>
    </Pop>
  )
}

/** Q3: a token's value per global variant. */
function TokenPop() {
  return (
    <Pop x={1440 - 256 - 300} y={300} w={280} pk="token-pop">
      <div className="pk-head">
        <span className="flex items-center gap-2">
          <span className="pk-swatch" style={{ background: "#222" }} />
          text-primary
        </span>
        <TbX className="h-3.5 w-3.5 opacity-60" />
      </div>
      {[
        ["Base", "#222222"],
        ["Dark", "#F8FAFC"],
        ["Right-to-left", "inherit"],
        ["Mobile", "inherit"],
      ].map(([v, c]) => (
        <Field key={v} label={v}>
          <Input set={c !== "inherit"}>
            {c !== "inherit" && (
              <span className="pk-swatch" style={{ background: c }} />
            )}
            {c}
          </Input>
        </Field>
      ))}
      <div className="pb-3" />
    </Pop>
  )
}

/** The page on the artboard: a store's home page, with a navigation bar. */
/**
 * hide: the navigation's visibility, "keep" (rendered but hidden, its room
 * kept) or "none" (not rendered, its room gone).
 */
function Site21({
  grid,
  dark,
  hide = "",
  spot = false,
  navLink = "",
  heroMargin = 0,
  ink,
  rich = "",
}: {
  grid: boolean
  dark: boolean
  hide?: string
  /** Spotlight edit: the navigation alone, the page grayed out around it. */
  spot?: boolean
  /** A link added to the navigation. */
  navLink?: string
  /** The hero's bottom margin, dragged on the canvas. */
  heroMargin?: number
  /** The hero heading's color, when an edit has changed it. */
  ink?: string
  /** Rich text being edited on the canvas: "caret", "word", or "bold". */
  rich?: string
}) {
  const away: React.CSSProperties = spot
    ? {
        opacity: 0.25,
        filter: "grayscale(1)",
        transition: "opacity 0.4s, filter 0.4s",
      }
    : { transition: "opacity 0.4s, filter 0.4s" }
  const fg = dark ? "#f8fafc" : "#111827"
  const bg = dark ? "#0f172a" : "#fff"
  return (
    <div
      className="pk-acme"
      style={{ background: bg, color: fg, fontSize: 18, lineHeight: "26px" }}
    >
      <div
        className="flex items-center gap-8 px-20"
        style={{
          height: 84,
          borderBottom: `1px solid ${dark ? "#1e293b" : "#eee"}`,
          visibility: hide === "keep" ? "hidden" : undefined,
          display: hide === "none" ? "none" : undefined,
        }}
        data-pk="site:nav"
      >
        <TbShoppingBag className="h-8 w-8" style={{ color: "#ec4899" }} />
        <span style={{ color: "#ec4899", textDecoration: "underline" }}>
          Welcome
        </span>
        <span style={{ color: "#ec4899" }}>About</span>
        <span style={{ color: "#ec4899" }}>Contact</span>
        {navLink && (
          <span
            style={{
              color: "#ec4899",
              animation: "pk-pop-in 0.3s ease-out both",
            }}
            data-pk="site:navlink"
          >
            {navLink}
          </span>
        )}
        <span
          className="ml-auto rounded-full px-5 py-2 text-white"
          style={{ background: "#ec4899" }}
        >
          Let’s go! →
        </span>
      </div>
      <div
        className="flex flex-col justify-center gap-4 px-20"
        style={{
          height: 400,
          marginBottom: heroMargin,
          background: dark ? "#111c33" : "#fdf2f8",
          transition: "margin 0.6s cubic-bezier(0.3,0,0.2,1)",
          ...away,
        }}
        data-pk="site:hero"
      >
        <span
          style={{
            fontSize: 56,
            lineHeight: "64px",
            fontWeight: 700,
            color: ink,
            transition: "color 0.5s",
          }}
        >
          New collection
        </span>
        <span
          className="relative w-fit"
          style={{
            fontSize: 32,
            lineHeight: "48px",
            opacity: rich ? 1 : 0.7,
            outline: rich ? "2px solid var(--pk-accent)" : undefined,
            outlineOffset: 6,
          }}
          data-pk="site:subtitle"
        >
          {rich && <RichBar bold={rich === "bold"} />}
          <span
            style={{
              fontWeight: rich === "bold" ? 700 : undefined,
              background:
                rich === "word" || rich === "bold"
                  ? "rgb(76 141 255 / 0.25)"
                  : undefined,
            }}
            data-pk="site:word"
          >
            Welcome
          </span>{" "}
          to your first page.
          {rich === "caret" && <i className="pk-caret" />}
        </span>
        <span
          className="w-fit rounded-full px-6 py-3 text-white"
          style={{ background: "#111827" }}
        >
          Shop →
        </span>
      </div>
      <div
        className="grid gap-8 px-20 py-12"
        style={{
          gridTemplateColumns: grid ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
          ...away,
        }}
        data-pk="site:grid"
      >
        {["Ultra Boost", "Air Zoom", "Court Low", "Runner 2"]
          .slice(0, grid ? 3 : 4)
          .map((p, i) => (
            <div key={p} className="flex flex-col gap-2">
              <i
                className="block h-36 rounded-xl"
                style={{
                  background: ["#fde68a", "#bfdbfe", "#fbcfe8", "#bbf7d0"][i],
                }}
              />
              <b>{p}</b>
              <span style={{ opacity: 0.6 }}>$88.99</span>
            </div>
          ))}
      </div>
    </div>
  )
}

/** Preview mode: the page on its own, a picker of pages and variants, and back. */
function Preview({ s }: { s: State }) {
  const w = typeof s.previewW === "number" ? s.previewW : 640
  const variant = str(s.cartVariant, "Full")
  return (
    <div className="pk-page flex flex-col" data-pk="preview">
      <div className="pk-page-bar" style={{ height: 44 }}>
        <Mark />
        <b className="font-semibold text-[color:var(--pk-fg)]">Acme Store</b>
        <span className="flex-1" />
        <span className="pk-btn" data-pk="preview:picker">
          <TbFile />
          Shopping Cart <span className="pk-faint pk-mono">/cart</span>
          <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-btn" data-pk="preview:variant">
          <TbTriangle />
          {variant}
          <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="flex-1" />
        <span className="pk-btn" data-kind="ghost">
          <TbCode />
          Code
        </span>
        <span className="pk-btn" data-pk="preview:back">
          <TbArrowLeft />
          Back to studio
        </span>
      </div>
      <div className="relative flex-1">
        <div
          className="absolute top-6 bottom-0 left-1/2 -translate-x-1/2 overflow-hidden rounded-t-lg"
          style={{
            width: w,
            transition: "width 0.9s cubic-bezier(0.3,0,0.2,1)",
          }}
          data-pk="preview:page"
        >
          <Cart variant={variant} narrow={w < 480} />
        </div>
        {[-1, 1].map((side) => (
          <span
            key={side}
            className="absolute top-1/3 h-24 w-1.5 rounded-full"
            style={{
              left: `calc(50% + ${side * (w / 2 + 10) - 3}px)`,
              background: "var(--pk-line-2)",
              transition: "left 0.9s cubic-bezier(0.3,0,0.2,1)",
            }}
            data-pk={side > 0 ? "preview:grip" : undefined}
          />
        ))}
        <span
          className="pk-chip absolute top-1 left-1/2 -translate-x-1/2"
          data-pk="preview:width"
        >
          {w} px
        </span>
        {s.pickerOpen && (
          <>
            <Menu
              x={560}
              y={4}
              w={240}
              pk="preview:menu"
              hover={str(s.menuHover)}
              items={[
                { heading: "Pages" },
                { label: "Homepage" },
                { label: "Shopping Cart", kbd: "›" },
                { label: "About" },
                "sep",
                { heading: "Components" },
                { label: "Button", kbd: "›" },
                { label: "Card" },
                { label: "Select", kbd: "›" },
              ]}
            />
            {s.menuHover === "Shopping Cart" && (
              <Menu
                x={804}
                y={60}
                w={180}
                pk="preview:sub"
                items={[
                  { heading: "Variants" },
                  { label: "Base", icon: TbTriangle },
                  { label: "Empty", icon: TbTriangle },
                  { label: "Full", icon: TbTriangle },
                  "sep",
                  { label: "Screens", kbd: "›" },
                  { label: "Themes", kbd: "›" },
                ]}
              />
            )}
          </>
        )}
        {Boolean(s.variantOpen) && (
          <Menu
            x={700}
            y={4}
            w={160}
            pk="preview:variants"
            hover={str(s.menuHover)}
            items={[
              { label: "Base", icon: TbTriangle },
              { label: "Empty", icon: TbTriangle, pk: "variant:empty" },
              { label: "Full", icon: TbTriangle, pk: "variant:full" },
            ]}
          />
        )}
      </div>
    </div>
  )
}

/** The sample store's cart, in its Empty and Full variants. */
function Cart({ variant, narrow }: { variant: string; narrow: boolean }) {
  const items: Array<[string, string, string]> = [
    ["Ultra Boost", "$88.99", "#fde68a"],
    ["Air Zoom", "$88.99", "#bfdbfe"],
  ]
  return (
    <div className="pk-acme" style={{ fontSize: 15, lineHeight: "22px" }}>
      <div
        className="flex items-center gap-6 px-6"
        style={{ height: 60, borderBottom: "1px solid #eee" }}
      >
        <TbShoppingBag className="h-6 w-6" style={{ color: "#ec4899" }} />
        {!narrow && (
          <>
            <span style={{ color: "#ec4899" }}>Welcome</span>
            <span style={{ color: "#ec4899" }}>About</span>
          </>
        )}
        <span
          className="ml-auto rounded-full px-4 py-1.5 text-white"
          style={{ background: "#ec4899" }}
        >
          Cart · {variant === "Empty" ? 0 : 2}
        </span>
      </div>
      <div className="flex flex-col gap-4 p-6" data-pk="cart">
        <b style={{ fontSize: narrow ? 24 : 32, lineHeight: 1.2 }}>Your cart</b>
        {variant === "Empty" ? (
          <div
            className="flex flex-col items-center gap-3 rounded-xl py-14"
            style={{
              background: "#fdf2f8",
              animation: "pk-pop-in 0.3s ease-out both",
            }}
          >
            <span style={{ color: "#6b7280" }}>Your cart is empty.</span>
            <span
              className="rounded-full px-5 py-2 text-white"
              style={{ background: "#111827" }}
            >
              Shop →
            </span>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: narrow ? "1fr" : "1.6fr 1fr" }}
          >
            <div className="flex flex-col gap-3">
              {items.map(([n, p, c]) => (
                <div key={n} className="flex items-center gap-3">
                  <span
                    className="h-14 w-14 flex-none rounded-lg"
                    style={{ background: c }}
                  />
                  <span className="flex flex-1 flex-col">
                    <b>{n}</b>
                    <span style={{ color: "#6b7280" }}>Size 10 · 1</span>
                  </span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div
              className="flex flex-col gap-2 rounded-xl p-4"
              style={{ background: "#f9fafb" }}
            >
              <span className="flex justify-between">
                Subtotal <b>$177.98</b>
              </span>
              <span
                className="flex justify-between"
                style={{ color: "#6b7280" }}
              >
                Shipping <span>Free</span>
              </span>
              <span
                className="mt-2 rounded-full py-2 text-center text-white"
                style={{ background: "#111827" }}
              >
                Checkout
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Q2 2021's empty and error states: the shell with nothing in it, and a
 * page that could not be found, drawn inside the shell.
 */
export function EmptyShell21({ notFound }: { notFound?: boolean }) {
  return (
    <div
      className="pk-studio"
      style={{
        gridTemplateRows: "44px minmax(0,1fr)",
        gridTemplateColumns: "48px 208px minmax(0,1fr) 256px",
        gridTemplateAreas: '"top top top top" "rail left canvas right"',
      }}
    >
      <header className="pk-top pk-area-top">
        <span className="pk-logo">
          <Mark />
        </span>
      </header>
      <nav className="pk-rail pk-area-rail" />
      <div
        className="pk-panel pk-area-left"
        style={{ borderRight: "1px solid var(--pk-line)" }}
      />
      <main className="pk-canvas pk-area-canvas grid place-items-center">
        {notFound && (
          <div className="flex flex-col items-center gap-4">
            <span className="pk-404">404</span>
            <span className="pk-muted text-[14px]">
              This page could not be found.
            </span>
          </div>
        )}
      </main>
      <div
        className="pk-panel pk-area-right"
        style={{ borderLeft: "1px solid var(--pk-line)" }}
      />
    </div>
  )
}

/**
 * Q3 2021's rich-text bar, floating over the text being edited on the
 * canvas: bold, fill, align, link, Convert…, and +.
 */
function RichBar({ bold }: { bold: boolean }) {
  return (
    <span className="pk-richbar" data-pk="richbar">
      <span className="pk-richbar-item" aria-pressed={bold} data-pk="rich:bold">
        <TbBold /> <TbChevronDown className="h-3 w-3 opacity-60" />
      </span>
      <span className="pk-richbar-item">
        <TbPaint /> <TbChevronDown className="h-3 w-3 opacity-60" />
      </span>
      <span className="pk-richbar-item">
        <TbAlignLeft /> <TbChevronDown className="h-3 w-3 opacity-60" />
      </span>
      <span className="pk-richbar-item">
        <TbLink /> <TbChevronDown className="h-3 w-3 opacity-60" />
      </span>
      <span className="pk-richbar-item">
        Convert… <TbChevronDown className="h-3 w-3 opacity-60" />
      </span>
      <span className="pk-richbar-item" data-pk="rich:plus">
        <TbPlus />
      </span>
    </span>
  )
}
