import {
  TbBorderAll,
  TbChevronDown,
  TbChevronRight,
  TbCircleDot,
  TbCode,
  TbColumns,
  TbComponents,
  TbDots,
  TbEye,
  TbFrame,
  TbHandStop,
  TbHelp,
  TbLayoutRows,
  TbLock,
  TbPhoto,
  TbPlayerPlay,
  TbPlus,
  TbPointer,
  TbRectangle,
  TbSlideshow,
  TbSquareRoundedPlus,
  TbTypography,
  TbVariable,
} from "react-icons/tb"
import { cn } from "@/lib/utils"

// The studio's shell and panels, as the Figma files draw them, in the
// kit's one cleaned-up look (src/plasmic-kit.css). Every part a note or the
// demo cursor can point at takes a `pk` name, written as `data-pk`.

export type Layout = "classic" | "rail" | "ribbon" | "bare"

export function Studio({
  layout,
  children,
}: {
  layout: Layout
  children: React.ReactNode
}) {
  return (
    <div className="pk-studio" data-layout={layout}>
      {children}
    </div>
  )
}

/** Plasmic's mark: arcs in the product's colors. */
export function Mark({ size = 22 }: { size?: number }) {
  const arcs = ["#4c8dff", "#a88bfa", "#f472b6", "#f5b84a"]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {arcs.map((c, i) => (
        <path
          key={c}
          d={`M${3 + i * 2.5} 18a${9 - i * 2.5} ${9 - i * 2.5} 0 0 1 ${18 - i * 5} 0`}
          fill="none"
          stroke={c}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

const AVATAR_COLORS = ["#f97316", "#8b5cf6", "#0ea5e9", "#10b981"]

/** The team in the file: initials only (no one's face). */
export function Avatars({
  names = ["L", "Y", "C"],
}: {
  names?: Array<string>
}) {
  return (
    <span className="pk-avatars" data-pk="avatars">
      {names.map((n, i) => (
        <span
          key={n + i}
          className="pk-avatar"
          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
        >
          {n}
        </span>
      ))}
    </span>
  )
}

export type Tool =
  "select" | "hand" | "box" | "stack" | "text" | "image" | "insert"

const TOOLS: Array<[Tool, React.ComponentType<{ className?: string }>]> = [
  ["select", TbPointer],
  ["hand", TbHandStop],
  ["box", TbRectangle],
  ["stack", TbLayoutRows],
  ["text", TbTypography],
  ["image", TbPhoto],
]

/** The bar across the top of the editor. */
export function TopBar({
  project = "Acme App",
  version,
  tool = "select",
  tools = true,
  hover,
  right,
}: {
  project?: string
  version?: string
  tool?: Tool | null
  tools?: boolean
  /** A part shown under the pointer (`data-pk` name). */
  hover?: string
  right?: React.ReactNode
}) {
  return (
    <header className="pk-top pk-area-top" data-pk="top">
      <span className="pk-logo" data-pk="logo">
        <Mark />
      </span>
      <span className="pk-project" data-pk="project">
        {project}
        {version && <small>{version}</small>}
        <TbChevronDown className="h-3 w-3 opacity-60" />
      </span>
      {tools ? (
        <span className="pk-tools" data-pk="tools">
          {TOOLS.map(([id, Icon]) => (
            <span
              key={id}
              className="pk-tool"
              data-pk={`tool:${id}`}
              aria-pressed={tool === id}
              data-state={hover === `tool:${id}` ? "hover" : undefined}
            >
              <Icon />
            </span>
          ))}
          <span className="pk-sep" />
          <span
            className="pk-tool"
            data-pk="tool:insert"
            aria-pressed={tool === "insert"}
          >
            <TbSquareRoundedPlus />
          </span>
        </span>
      ) : (
        <span className="flex-1" />
      )}
      {right ?? <TopBarEnd hover={hover} />}
    </header>
  )
}

/** The top bar's end: zoom, preview, code, share, people. */
export function TopBarEnd({
  hover,
  share = "Share",
  publish = false,
  zoom = 1,
}: {
  hover?: string
  share?: string
  publish?: boolean
  zoom?: number
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="pk-zoom" data-pk="zoom">
        {Math.round(zoom * 100)}%
        <TbChevronDown className="h-3 w-3" />
      </span>
      <span
        className="pk-tool"
        data-pk="preview"
        data-state={hover === "preview" ? "hover" : undefined}
      >
        <TbPlayerPlay />
      </span>
      <span
        className="pk-btn"
        data-kind="ghost"
        data-pk="code"
        data-state={hover === "code" ? "hover" : undefined}
      >
        <TbCode />
        Code
      </span>
      <span
        className="pk-btn"
        data-pk="share"
        data-state={hover === "share" ? "hover" : undefined}
      >
        {share}
      </span>
      {publish && (
        <span
          className="pk-btn"
          data-kind="primary"
          data-pk="publish"
          data-state={hover === "publish" ? "hover" : undefined}
        >
          Publish
        </span>
      )}
      <Avatars />
      <span className="pk-icon-btn">
        <TbHelp />
      </span>
    </span>
  )
}

export type RailItem =
  | "tree"
  | "insert"
  | "components"
  | "tokens"
  | "mixins"
  | "images"
  | "versions"
  | "settings"
  | "data"

const RAIL: Array<[RailItem, React.ComponentType<{ className?: string }>]> = [
  ["tree", TbLayoutRows],
  ["insert", TbSquareRoundedPlus],
  ["components", TbComponents],
  ["tokens", TbVariable],
  ["mixins", TbBorderAll],
  ["images", TbPhoto],
  ["data", TbSlideshow],
]

/** The icon rail down the left (late 2020 on): one icon per panel. */
export function Rail({ active, hover }: { active?: RailItem; hover?: string }) {
  return (
    <nav className="pk-rail pk-area-rail" data-pk="rail">
      {RAIL.map(([id, Icon]) => (
        <span
          key={id}
          className="pk-tool"
          data-pk={`rail:${id}`}
          aria-pressed={active === id}
          data-state={hover === `rail:${id}` ? "hover" : undefined}
        >
          <Icon />
        </span>
      ))}
      <span className="pk-rail-end" />
      <span className="pk-tool" data-pk="rail:versions">
        <TbCircleDot />
      </span>
      <span className="pk-tool" data-pk="rail:settings">
        <TbDots />
      </span>
    </nav>
  )
}

/** A panel: in a column of the layout, or floating over the canvas. */
export function Panel({
  area,
  float,
  pk,
  className,
  children,
}: {
  area?: "left" | "right"
  float?: React.CSSProperties
  pk?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "pk-panel",
        area && !float && `pk-area-${area}`,
        float && "pk-float",
        className
      )}
      style={float}
      data-pk={pk}
    >
      {children}
    </section>
  )
}

export function Tabs({
  items,
  active,
  hover,
}: {
  items: Array<string>
  active: string
  hover?: string
}) {
  return (
    <div className="pk-tabs" role="tablist">
      {items.map((t) => (
        <span
          key={t}
          className="pk-tab"
          role="tab"
          aria-selected={t === active}
          data-pk={`tab:${t.toLowerCase()}`}
          data-state={hover === `tab:${t.toLowerCase()}` ? "hover" : undefined}
        >
          {t}
        </span>
      ))}
    </div>
  )
}

export function PanelHead({
  title,
  pk,
  children,
}: {
  title: React.ReactNode
  pk?: string
  children?: React.ReactNode
}) {
  return (
    <div className="pk-head" data-pk={pk}>
      <span>{title}</span>
      {children}
    </div>
  )
}

export function IconBtn({
  icon: Icon,
  pk,
  hover,
}: {
  icon: React.ComponentType<{ className?: string }>
  pk?: string
  hover?: boolean
}) {
  return (
    <span
      className="pk-icon-btn"
      data-pk={pk}
      data-state={hover ? "hover" : undefined}
    >
      <Icon />
    </span>
  )
}

/** A search field; `value` is what is typed, with a caret while focused. */
export function Search({
  value = "",
  focus,
  placeholder = "Search…",
  pk = "search",
}: {
  value?: string
  focus?: boolean
  placeholder?: string
  pk?: string
}) {
  return (
    <div
      className="pk-search"
      data-pk={pk}
      data-state={focus ? "focus" : undefined}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      {value ? <b>{value}</b> : !focus && <span>{placeholder}</span>}
      {focus && <i className="pk-caret" />}
    </div>
  )
}

export type NodeKind =
  | "frame"
  | "component"
  | "box"
  | "vstack"
  | "hstack"
  | "text"
  | "image"
  | "slot"

const NODE_ICON: Record<
  NodeKind,
  React.ComponentType<{ className?: string }>
> = {
  frame: TbFrame,
  component: TbComponents,
  box: TbRectangle,
  vstack: TbLayoutRows,
  hstack: TbColumns,
  text: TbTypography,
  image: TbPhoto,
  slot: TbCircleDot,
}

export type TreeNode = {
  id: string
  label: string
  kind: NodeKind
  depth?: number
  open?: boolean
  dim?: boolean
}

/** The tree of what is on an artboard. */
export function Tree({
  nodes,
  selected,
  hover,
  drop,
}: {
  nodes: Array<TreeNode>
  selected?: string
  hover?: string
  /** The row a dragged item would land under (or, as `^id`, above). */
  drop?: string
}) {
  return (
    <div className="pk-scroll py-1" data-pk="tree">
      {nodes.map((n) => {
        const Icon = NODE_ICON[n.kind]
        const kind =
          n.kind === "component" || n.kind === "slot" || n.kind === "frame"
            ? n.kind
            : undefined
        return (
          <div
            key={n.id}
            className="pk-row"
            data-pk={`row:${n.id}`}
            data-kind={kind}
            data-dim={n.dim || undefined}
            data-drop={
              drop === n.id
                ? "below"
                : drop === `^${n.id}`
                  ? "above"
                  : undefined
            }
            data-state={hover === n.id ? "hover" : undefined}
            aria-selected={selected === n.id}
            style={
              {
                paddingLeft: 8 + (n.depth ?? 0) * 14,
                "--drop-indent": `${24 + (n.depth ?? 0) * 14}px`,
              } as React.CSSProperties
            }
          >
            {n.open === undefined ? (
              <span className="w-2.5" />
            ) : n.open ? (
              <TbChevronDown className="pk-twisty" />
            ) : (
              <TbChevronRight className="pk-twisty" />
            )}
            <Icon />
            <span className="truncate">{n.label}</span>
            <span className="pk-row-end">
              <TbLock />
              <TbEye />
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** A section of the right panel. */
export function Section({
  title,
  pk,
  add = true,
  children,
}: {
  title: React.ReactNode
  pk?: string
  add?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="pk-section" data-pk={pk}>
      <div className="pk-section-head">
        <span>{title}</span>
        {add && (
          <span className="pk-icon-btn">
            <TbPlus />
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export function Field({
  label,
  pk,
  children,
}: {
  label: React.ReactNode
  pk?: string
  children: React.ReactNode
}) {
  return (
    <div className="pk-field" data-pk={pk}>
      <label>{label}</label>
      {children}
    </div>
  )
}

export function Input({
  children,
  set,
  rec,
  focus,
  pk,
  mono = true,
  caret,
}: {
  children?: React.ReactNode
  set?: boolean
  rec?: boolean
  focus?: boolean
  pk?: string
  mono?: boolean
  caret?: boolean
}) {
  return (
    <span
      className={cn("pk-input", mono && "pk-mono")}
      data-set={set || undefined}
      data-rec={rec || undefined}
      data-state={focus ? "focus" : undefined}
      data-pk={pk}
    >
      {children}
      {caret && <i className="pk-caret" />}
    </span>
  )
}

export function Seg({
  items,
  pressed,
  pk,
}: {
  items: Array<React.ComponentType<{ className?: string }> | string>
  pressed: number
  pk?: string
}) {
  return (
    <span className="pk-seg" data-pk={pk}>
      {items.map((It, i) => (
        <span key={i} aria-pressed={i === pressed}>
          {typeof It === "string" ? It : <It />}
        </span>
      ))}
    </span>
  )
}

export function Chip({
  children,
  kind,
  pk,
}: {
  children: React.ReactNode
  kind?: "token" | "rec"
  pk?: string
}) {
  return (
    <span className="pk-chip" data-kind={kind} data-pk={pk}>
      {children}
    </span>
  )
}

export type VariantGroup = {
  name: string
  icon?: "group" | "state" | "global"
  options: Array<string>
}

/** The variants panel: Base, then each group and its options. */
export function Variants({
  groups,
  on = [],
  rec,
  hover,
  base = true,
}: {
  groups: Array<VariantGroup>
  /** Variants turned on. */
  on?: Array<string>
  /** The variant being recorded into. */
  rec?: string
  hover?: string
  base?: boolean
}) {
  return (
    <div data-pk="variants">
      {base && (
        <div
          className="pk-variant"
          data-pk="variant:base"
          aria-checked={!rec}
          data-state={hover === "base" ? "hover" : undefined}
        >
          <TbComponents style={{ color: "var(--pk-component)" }} />
          Base
          {!rec && <span className="pk-badge ml-auto">editing</span>}
        </div>
      )}
      {groups.map((g) => (
        <div key={g.name} data-pk={`group:${g.name.toLowerCase()}`}>
          <div className="pk-group-label">
            {g.icon === "state" ? (
              <TbPointer />
            ) : g.icon === "global" ? (
              <TbCircleDot />
            ) : (
              <TbComponents />
            )}
            {g.name}
          </div>
          {g.options.map((o) => (
            <div
              key={o}
              className="pk-variant"
              data-pk={`variant:${o.toLowerCase()}`}
              aria-checked={on.includes(o)}
              data-rec={rec === o || undefined}
              data-state={hover === o ? "hover" : undefined}
            >
              {on.includes(o) || rec === o ? (
                <TbEye />
              ) : (
                <span className="w-3.5" />
              )}
              {o}
              {rec === o && <Chip kind="rec">REC</Chip>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/** Where the canvas is looking: panned by `x`, `y` and zoomed by `z`. */
export type View = { x?: number; y?: number; z?: number }

/**
 * The canvas: a dotted field the artboards sit on, panned and zoomed as a
 * whole (the dots move with it), with what floats over it (`over`) staying
 * put.
 */
export function Canvas({
  rec,
  view,
  over,
  children,
  pk = "canvas",
}: {
  rec?: boolean
  view?: View
  over?: React.ReactNode
  children?: React.ReactNode
  pk?: string
}) {
  const x = view?.x ?? 0
  const y = view?.y ?? 0
  const z = view?.z ?? 1
  return (
    <main
      className="pk-canvas pk-area-canvas"
      data-rec={rec || undefined}
      data-pk={pk}
      style={{
        backgroundSize: `${16 * z}px ${16 * z}px`,
        backgroundPosition: `${x}px ${y}px`,
      }}
    >
      <div
        className="pk-world"
        style={{ transform: `translate(${x}px, ${y}px) scale(${z})` }}
      >
        {children}
      </div>
      {over}
    </main>
  )
}

/**
 * An artboard on the canvas, its label above it. `covered`: its root is
 * selected, and the selection's tag stands where the label was.
 */
export function Board({
  x,
  y,
  w,
  h,
  label,
  kind,
  size,
  pk,
  children,
  tag,
  covered,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  kind?: "component"
  size?: string
  pk?: string
  tag?: React.ReactNode
  children?: React.ReactNode
  covered?: boolean
}) {
  return (
    <div
      className="pk-board"
      style={{ left: x, top: y, width: w, height: h }}
      data-pk={pk ?? `board:${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span
        className="pk-board-label"
        data-kind={kind}
        style={covered ? { visibility: "hidden" } : undefined}
      >
        {kind === "component" ? <TbComponents /> : <TbFrame />}
        {label}
        {tag}
        {size && <span className="pk-faint pk-mono">{size}</span>}
      </span>
      <div className="pk-board-body">{children}</div>
    </div>
  )
}

/** A selection (or hover) outline over a box on the canvas. */
export function Sel({
  x,
  y,
  w,
  h,
  tag,
  size,
  kind,
  pk,
}: {
  x: number
  y: number
  w: number
  h: number
  tag?: React.ReactNode
  size?: string
  kind?: "component" | "rec" | "hover"
  pk?: string
}) {
  return (
    <div
      className="pk-sel"
      data-kind={kind}
      data-pk={pk}
      style={{ left: x, top: y, width: w, height: h }}
    >
      {kind !== "hover" && (
        <>
          <i />
          <i />
          <i />
          <i />
        </>
      )}
      {tag && <span className="pk-sel-tag">{tag}</span>}
      {size && <span className="pk-sel-size">{size}</span>}
    </div>
  )
}

/** A thing being dragged, following the cursor. */
export function Ghost({
  x,
  y,
  children,
}: {
  x: number
  y: number
  children: React.ReactNode
}) {
  return (
    <div className="pk-ghost" style={{ left: x + 14, top: y + 10 }}>
      {children}
    </div>
  )
}
