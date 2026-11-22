import {
  TbArrowDown,
  TbArrowsHorizontal,
  TbBolt,
  TbBorderAll,
  TbBorderCorners,
  TbBox,
  TbBrush,
  TbChartBar,
  TbChevronDown,
  TbClipboardList,
  TbCode,
  TbComponents,
  TbDeviceDesktop,
  TbDeviceMobile,
  TbDots,
  TbDotsVertical,
  TbDroplet,
  TbEye,
  TbFileText,
  TbFrame,
  TbGitBranch,
  TbHelp,
  TbHome,
  TbIcons,
  TbItalic,
  TbLayersSubtract,
  TbMessage,
  TbPaint,
  TbPhoto,
  TbPin,
  TbPlayerPlay,
  TbPlus,
  TbPointer,
  TbSettings,
  TbShadow,
  TbStack2,
  TbTextSize,
  TbTransform,
  TbTriangle,
  TbTypography,
  TbUnderline,
  TbVariable,
  TbWorld,
} from "react-icons/tb"
import { Avatars, Search, Tree } from "@/components/work/plasmic/kit/studio"
import type { TreeNode } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// The ribbon, from the "2021 – 2022 Product" file (its "Primitives +
// Drafts" page, MacBook frames 8–13): an exploration after Office's ribbon,
// tried between two versions of the left rail and left. A 48px top bar with
// the page and a row of tabs (Project, Insert, Style, States, Optimize),
// over a 72px ribbon holding every control of the tab in captioned groups,
// and no side panels at all: on the Project tab the ribbon is a row of
// icon-over-label buttons, each opening a panel that floats under it.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

/**
 * State keys: tab: "project" | "insert" | "style" | "states" | "optimize";
 * sel: "root" | "h1"; float: "arenas" | "layers" (a floating panel);
 * narrow: the window narrowed (tabs collapse); hover: a ribbon item;
 * scrollX: the ribbon scrolled sideways (px); rec: a new variant recording.
 */
export function Editor22({ s }: { s: State }) {
  const tab = str(s.tab, "style")
  return (
    <div
      className="pk-studio"
      style={{
        gridTemplateRows: "48px 72px minmax(0,1fr)",
        gridTemplateColumns: "minmax(0,1fr)",
        gridTemplateAreas: '"top" "ribbon" "canvas"',
      }}
    >
      <header
        className="pk-top pk-area-top"
        style={{ gap: 8, padding: "0 12px" }}
        data-pk="top"
      >
        <span className="pk-icon-btn">
          <TbHome />
        </span>
        <span className="pk-project" data-pk="project">
          Blank Project <TbDotsVertical className="h-3.5 w-3.5 opacity-60" />
        </span>
        <span className="pk-btn" data-pk="page">
          <TbFileText />
          Homepage <span className="pk-faint">/</span>
          <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-icon-btn">
          <TbSettings />
        </span>
        <span className="pk-btn" data-kind="ghost" data-pk="new">
          <TbPlus />
          New…
        </span>
        <span className="flex flex-1 justify-center gap-1" data-pk="tabs">
          {(s.narrow
            ? ["Project", "Insert ▾"]
            : ["Project", "Insert", "Style", "States", "Optimize"]
          ).map((t) => (
            <span
              key={t}
              className="pk-ribbon-tab"
              aria-selected={t.toLowerCase().startsWith(tab)}
              data-pk={`tab:${t.toLowerCase().replace(" ▾", "")}`}
            >
              {t}
            </span>
          ))}
        </span>
        <span
          className="pk-tool"
          style={{ color: "var(--pk-ok)" }}
          data-pk="preview"
        >
          <TbPlayerPlay />
        </span>
        <span className="pk-tool">
          <TbFrame />
        </span>
        <span className="pk-zoom">
          50% <TbChevronDown className="h-3 w-3" />
        </span>
        <Avatars names={["Y", "C"]} />
        <span className="pk-btn" data-kind="ghost" data-pk="share">
          Share
        </span>
        <span className="pk-btn" data-kind="ghost" data-pk="code">
          Code
        </span>
        <span
          className="pk-btn"
          data-kind="ghost"
          style={{ color: "var(--pk-accent)" }}
          data-pk="deploy"
        >
          Deploy
        </span>
        <span className="pk-icon-btn">
          <TbHelp />
        </span>
      </header>
      <div className="pk-ribbon pk-area-ribbon" data-pk="ribbon">
        <div
          className="flex"
          style={{
            translate: `${-(Number(s.scrollX) || 0)}px 0`,
            transition: "translate 0.8s cubic-bezier(0.3,0,0.2,1)",
          }}
        >
          {tab === "project" ? <ProjectRibbon s={s} /> : <StyleRibbon s={s} />}
        </div>
      </div>
      <main className="pk-canvas pk-area-canvas" data-pk="canvas">
        <div
          className="absolute flex items-stretch"
          style={{
            left: 240,
            top: 0,
            width: 961,
            height: 32,
            borderBottom: "1px solid var(--pk-line)",
            background: "var(--pk-panel)",
          }}
          data-pk="ruler"
        >
          <span
            className="pk-muted flex flex-1 items-center gap-1.5 px-2"
            style={{ borderRight: "1px solid var(--pk-line)" }}
          >
            <TbDeviceDesktop className="h-4 w-4" />
            Desktop <sup className="pk-faint">1st</sup>
          </span>
          <span
            className="pk-muted flex w-[200px] items-center justify-between px-2"
            style={{ borderRight: "1px solid var(--pk-line)" }}
          >
            <TbDeviceMobile className="h-4 w-4" />
            <span className="pk-mono">400</span>
          </span>
          <span className="pk-mono pk-muted flex w-[380px] items-center justify-end px-2">
            1920
          </span>
        </div>
        <div
          className="pk-board"
          style={{ left: 240, top: 100, width: 960, height: 700 }}
          data-pk="board"
        >
          <span
            className="pk-sel-tag"
            style={{
              position: "absolute",
              top: -24,
              left: 0,
              borderRadius: "4px 4px 0 0",
            }}
          >
            <TbArrowDown className="h-3 w-3" />
            Root
            <TbDotsVertical className="h-3 w-3" />
          </span>
          <div
            className="pk-board-body"
            style={{ outline: "1.5px solid var(--pk-accent)" }}
          >
            <div className="pk-acme" style={{ padding: "64px 80px", gap: 20 }}>
              <h1
                className="m-0"
                style={{
                  fontSize: 72,
                  lineHeight: "80px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  outline:
                    s.sel === "h1"
                      ? "1.5px dashed var(--pk-accent)"
                      : undefined,
                }}
                data-pk="h1"
              >
                Welcome
              </h1>
              {s.sel === "h1" && (
                <div
                  style={{
                    height: 32,
                    background:
                      "repeating-linear-gradient(135deg, rgb(245 160 120 / 0.45) 0 2px, transparent 2px 7px)",
                  }}
                  data-pk="margin-band"
                />
              )}
              <p
                className="m-0"
                style={{
                  fontSize: 22,
                  lineHeight: "32px",
                  color: "#6b7280",
                  maxWidth: 560,
                }}
              >
                Build the page your way: every control is in the ribbon above.
              </p>
            </div>
          </div>
        </div>
        {s.float && <FloatPanel kind={str(s.float)} />}
      </main>
    </div>
  )
}

type Item = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  pk?: string
}

function ProjectRibbon({ s }: { s: State }) {
  const groups: Array<Array<Item>> = [
    [
      { icon: TbStack2, label: "Arenas", pk: "rb:arenas" },
      { icon: TbLayersSubtract, label: "Layers", pk: "rb:layers" },
    ],
    [
      { icon: TbVariable, label: "Tokens" },
      { icon: TbBrush, label: "Mixins" },
      { icon: TbComponents, label: "Components" },
    ],
    [
      { icon: TbPhoto, label: "Images" },
      { icon: TbIcons, label: "Icons" },
    ],
    [
      { icon: TbBox, label: "Defaults" },
      { icon: TbDeviceMobile, label: "Breakpoints" },
      { icon: TbTypography, label: "Fonts" },
    ],
    [
      { icon: TbBolt, label: "Optimizations" },
      { icon: TbWorld, label: "Global variants" },
    ],
    [
      { icon: TbClipboardList, label: "Data sources" },
      { icon: TbChartBar, label: "Activity" },
      { icon: TbMessage, label: "Comments" },
    ],
    [
      { icon: TbGitBranch, label: "Versions" },
      { icon: TbComponents, label: "Imported projects" },
    ],
  ]
  const shown = s.narrow ? [groups[0], groups[1].concat(groups[2])] : groups
  return (
    <>
      {shown.map((g, i) => (
        <div
          key={i}
          className="pk-ribbon-group"
          style={{ justifyContent: "center", padding: "0 10px" }}
        >
          <div className="pk-ribbon-items">
            {g.map((it) => (
              <span
                key={it.label}
                className="pk-ribbon-item"
                aria-pressed={s.float === it.label.toLowerCase() || undefined}
                data-state={s.hover === it.label ? "hover" : undefined}
                data-pk={it.pk ?? `rb:${it.label.toLowerCase()}`}
              >
                <it.icon />
                {it.label}
                {it.label === "Arenas" && (
                  <span className="pk-faint">(15)</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
      {s.narrow && (
        <div className="pk-ribbon-group" style={{ justifyContent: "center" }}>
          <span className="pk-ribbon-item">
            <TbDots />
            More…
          </span>
        </div>
      )}
    </>
  )
}

/** A captioned control: a value over its name. */
function Ctl({
  value,
  label,
  pk,
  set,
}: {
  value: React.ReactNode
  label: string
  pk?: string
  set?: boolean
}) {
  return (
    <span className="flex flex-col items-center gap-1" data-pk={pk}>
      <span className="flex h-7 items-center gap-1 rounded-md px-1.5 whitespace-nowrap hover:bg-[color:var(--pk-panel-2)]">
        {set && <span className="pk-dot" data-kind="set" />}
        {value}
        <TbChevronDown className="h-3 w-3 opacity-60" />
      </span>
      <span className="pk-faint text-[11px] leading-[14px]">{label}</span>
    </span>
  )
}

function StyleRibbon({ s }: { s: State }) {
  const h1 = s.sel === "h1"
  const rec = str(s.rec)
  const group = (pk: string, children: React.ReactNode) => (
    <div
      className="pk-ribbon-group"
      style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
      data-pk={pk}
    >
      {children}
    </div>
  )
  return (
    <>
      {group(
        "rb:selection",
        <span className="flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-md"
            style={{
              background: "var(--pk-accent-bg)",
              color: "var(--pk-accent)",
            }}
          >
            {h1 ? (
              <TbTextSize className="h-4 w-4" />
            ) : (
              <TbArrowDown className="h-4 w-4" />
            )}
          </span>
          <span className="flex flex-col">
            <b className="font-semibold">{h1 ? "Unnamed H1" : "Root"}</b>
            <span className="text-[11px]" style={{ color: "var(--pk-accent)" }}>
              {h1 ? "Heading" : "V-stack"}
            </span>
          </span>
          <TbDotsVertical className="h-4 w-4 opacity-60" />
        </span>
      )}
      {group(
        "rb:tag",
        <>
          <Ctl
            value={h1 ? "Heading" : "Box"}
            label={h1 ? "<h1> Tag" : "<div> Tag"}
          />
          <Ctl value={<TbCode className="h-4 w-4" />} label="Attributes…" />
        </>
      )}
      {group(
        "rb:visibility",
        <>
          <Ctl
            value={
              <>
                <TbEye className="h-4 w-4" /> 100%
              </>
            }
            label="Visibility"
          />
          <Ctl value="Scroll" label="Overflow" />
        </>
      )}
      {group(
        "rb:size",
        <>
          <Ctl value={h1 ? "Stretch" : "Auto"} label="Width" set={h1} />
          <Ctl value={h1 ? "Hug" : "Auto"} label="Height" set={h1} />
        </>
      )}
      {h1 &&
        group(
          "rb:text",
          <>
            <Ctl
              value={
                <span className="pk-swatch" style={{ background: "#111827" }} />
              }
              label="Color"
            />
            <Ctl value="Inter" label="Font" />
            <Ctl value="Bold" label="Weight" />
            <Ctl value="72" label="Size" />
            <Ctl value={<TbItalic className="h-4 w-4" />} label="Style" />
            <Ctl
              value={<TbUnderline className="h-4 w-4" />}
              label="Decoration"
            />
          </>
        )}
      {group(
        "rb:layout",
        <>
          <span
            className="grid h-11 w-11 place-items-center gap-0.5 rounded-lg p-1.5"
            style={{ background: "var(--pk-panel-2)" }}
          >
            {[0, 1, 2].map((i) => (
              <i
                key={i}
                className="block h-2 w-7 rounded-sm"
                style={{ background: "var(--pk-accent)" }}
              />
            ))}
          </span>
          <span className="flex flex-col gap-1">
            <span className="flex items-center gap-1">
              <TbArrowsHorizontal className="h-4 w-4 opacity-60" />
              Stretch
            </span>
            <span className="flex items-center gap-1">
              <TbArrowDown className="h-4 w-4 opacity-60" />
              Top
            </span>
          </span>
        </>
      )}
      {group(
        "rb:spacing",
        <>
          <Ctl value="0" label="Padding" />
          <Ctl value={h1 ? "0,0,32,0" : "0"} label="Margin" set={h1} />
        </>
      )}
      {group(
        "rb:backgrounds",
        <span className="flex flex-col items-center gap-1">
          <span className="flex gap-2">
            <TbPaint className="h-5 w-5" />
            <TbPhoto className="h-5 w-5" />
            <TbDroplet className="h-5 w-5" />
          </span>
          <span className="pk-faint text-[11px]">Backgrounds…</span>
        </span>
      )}
      {group(
        "rb:border",
        <span className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1">
            <TbBorderAll className="h-4 w-4" />0
          </span>
          <span className="flex items-center gap-1">
            <TbBorderCorners className="h-4 w-4" />0
          </span>
        </span>
      )}
      {group(
        "rb:effects",
        <span className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1">
            <TbShadow className="h-4 w-4" />
            Shadow
          </span>
          <span className="flex items-center gap-1">
            <TbPointer className="h-4 w-4" />
            Cursor
          </span>
        </span>
      )}
      {group(
        "rb:motion",
        <span className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1">
            <TbBolt className="h-4 w-4" />
            Transitions
          </span>
          <span className="flex items-center gap-1">
            <TbTransform className="h-4 w-4" />
            Transforms
          </span>
        </span>
      )}
      {group(
        "rb:variant",
        <span
          className="flex flex-col items-center gap-1"
          style={{ color: "var(--pk-rec)" }}
        >
          <TbTriangle className="h-5 w-5" />
          <span className="font-medium">{rec ? rec : "New variant…"}</span>
        </span>
      )}
    </>
  )
}

const ARENAS: Array<[string, Array<[string, string?]>]> = [
  [
    "Pages (6)",
    [
      ["Homepage", "/"],
      ["About", "/about"],
      ["Features", "/features"],
    ],
  ],
  [
    "Components (8)",
    [["Headers (4)"], ["Footers (2)"], ["Button"], ["Select"]],
  ],
  ["Custom arenas (1)", [["Blank arena"]]],
]
const LAYERS: Array<TreeNode> = [
  { id: "root", label: "Root", kind: "vstack", open: true },
  { id: "grid", label: "Grid", kind: "box", depth: 1, open: true },
  { id: "card", label: "V-stack", kind: "vstack", depth: 2, open: true },
  { id: "img", label: "Image", kind: "image", depth: 3 },
  { id: "txt", label: "Text", kind: "text", depth: 3 },
  { id: "link", label: "Link", kind: "text", depth: 3 },
  { id: "foot", label: "V-stack", kind: "vstack", depth: 1 },
]

/** A panel dropped from a Project-tab button, floating over the canvas. */
function FloatPanel({ kind }: { kind: string }) {
  return (
    <section
      className="pk-panel pk-float"
      style={{ left: 16, top: 12, width: 256, height: 440 }}
      data-pk={`float:${kind}`}
    >
      <div className="flex items-center gap-1 pr-2">
        <div className="flex-1">
          <Search
            placeholder={
              kind === "layers" ? "Search layers…" : "Search arenas…"
            }
          />
        </div>
        <TbPin className="h-4 w-4 opacity-60" />
      </div>
      {kind === "layers" ? (
        <Tree nodes={LAYERS} selected="root" />
      ) : (
        <div className="pk-scroll">
          {ARENAS.map(([g, rows]) => (
            <div key={g} className="pb-2">
              <div className="pk-head">
                <span>{g}</span>
                <TbPlus className="h-3.5 w-3.5 opacity-60" />
              </div>
              {rows.map(([r, path], i) => (
                <div
                  key={r}
                  className="pk-row"
                  aria-selected={g.startsWith("Pages") && i === 0}
                  style={{ paddingLeft: 12 }}
                >
                  {g.startsWith("Pages") ? <TbFileText /> : <TbComponents />}
                  {r}
                  {path && <span className="pk-faint pk-mono">{path}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
