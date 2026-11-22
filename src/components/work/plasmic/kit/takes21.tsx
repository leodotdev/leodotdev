import {
  TbAppWindow,
  TbArrowBackUp,
  TbBook,
  TbHistory,
  TbListTree,
  TbPalette,
  TbPhoto,
  TbBolt,
  TbChevronDown,
  TbComponents,
  TbDots,
  TbExternalLink,
  TbEye,
  TbLayoutGrid,
  TbLock,
  TbPlayerPlay,
  TbPlus,
  TbSearch,
  TbSettings,
  TbTarget,
  TbTriangle,
  TbX,
} from "react-icons/tb"
import { Avatars, Mark, Tree } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// Q1 2021, from the "2021 Q1" file: isolated editing, one component with
// every variant laid out as its own artboard, and the quarter's run of
// takes on where recording a variant lives: a context bar of pills, a
// targeting bar across the canvas, a toolbar floating on the artboard, a
// tab hanging from the canvas's top, and a red bar along the bottom.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

type Art = {
  id: string
  group?: string
  name: string
  x: number
  y: number
  w: number
  button: React.CSSProperties
  label?: string
}

const ARTS: Array<Art> = [
  {
    id: "base",
    name: "Base",
    x: 0,
    y: 0,
    w: 280,
    button: { background: "#22c55e" },
  },
  {
    id: "mobile",
    group: "Screen",
    name: "Mobile",
    x: 330,
    y: 0,
    w: 280,
    button: {
      background: "linear-gradient(90deg,#22c55e,#14b8a6)",
      width: 220,
    },
  },
  {
    id: "hover",
    group: "Interaction",
    name: "Hover",
    x: 0,
    y: 160,
    w: 280,
    button: { background: "#27272a" },
  },
  {
    id: "primary",
    name: "Primary",
    x: 0,
    y: 320,
    w: 280,
    button: { background: "#2563eb" },
  },
  {
    id: "primary-mobile",
    group: "Primary + Screen",
    name: "Mobile",
    x: 330,
    y: 320,
    w: 280,
    button: {
      background: "linear-gradient(90deg,#2563eb,#0ea5e9)",
      width: 220,
    },
  },
  {
    id: "secondary",
    name: "Secondary",
    x: 0,
    y: 480,
    w: 280,
    button: { background: "linear-gradient(90deg,#a855f7,#ec4899)" },
  },
  {
    id: "v1",
    group: "Group",
    name: "Variant1",
    x: 330,
    y: 480,
    w: 280,
    button: { background: "#16a34a", letterSpacing: "0.14em" },
    label: "LABEL",
  },
]

/**
 * State keys: take: "context" | "bar" | "float" | "tab" | "bottom", the
 * way recording is drawn; rec: recording into Hover.
 */
export function Takes21({ s }: { s: State }) {
  const take = str(s.take, "bar")
  const rec = Boolean(s.rec)
  return (
    <div
      className="pk-studio"
      style={{
        gridTemplateRows: "48px minmax(0,1fr)",
        gridTemplateColumns: "48px 208px minmax(0,1fr) 244px",
        gridTemplateAreas: '"top top top top" "rail left canvas right"',
      }}
    >
      <header className="pk-top pk-area-top" style={{ gap: 10 }} data-pk="top">
        <span className="pk-logo">
          <Mark />
        </span>
        <b className="font-semibold">Project Acme</b>
        <span className="flex flex-1 items-center justify-center gap-1">
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
          {[TbLayoutGrid, TbComponents, TbTriangle].map((I, i) => (
            <span key={i} className="pk-tool">
              <I />
            </span>
          ))}
        </span>
        <span className="pk-zoom">
          100% <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-tool">
          <TbPlayerPlay />
        </span>
        <span className="pk-tool">
          <TbExternalLink />
        </span>
        <span className="pk-btn" data-kind="ghost">
          Share <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-btn" data-kind="primary">
          Publish <TbChevronDown className="h-3 w-3" />
        </span>
        <Avatars names={["L"]} />
      </header>
      <nav className="pk-rail pk-area-rail">
        {[TbListTree, TbPalette, TbPhoto, TbBook, TbAppWindow, TbHistory].map(
          (I, i) => (
            <span key={i} className="pk-tool" aria-pressed={i === 0}>
              <I />
            </span>
          )
        )}
      </nav>
      <div
        className="pk-panel pk-area-left"
        style={{ borderRight: "1px solid var(--pk-line)" }}
        data-pk="left"
      >
        <div className="pk-search">
          <TbSearch className="h-3.5 w-3.5" />
          <span>Search…</span>
        </div>
        {["Unnamed Page", "Button", "Mixed Experiment"].map((n) => (
          <div
            key={n}
            className="pk-row"
            aria-selected={n === "Button"}
            style={{ paddingLeft: 12 }}
          >
            {n === "Button" ? <TbComponents /> : <TbLayoutGrid />}
            <span className="flex-1">{n}</span>
            {n === "Button" && <TbSettings className="opacity-50" />}
          </div>
        ))}
        <hr className="pk-dash-rule" />
        {rec && (
          <span
            className="pk-btn mx-3 my-1 self-start"
            data-kind="rec"
            style={{ height: 24 }}
          >
            <TbBolt /> Hover <TbChevronDown className="h-3 w-3" />
          </span>
        )}
        <Tree
          nodes={[
            { id: "root", label: "Root", kind: "hstack", open: true },
            {
              id: "button",
              label: "<button>",
              kind: "box",
              depth: 1,
              open: true,
            },
            { id: "label", label: "Slot: “Label”", kind: "slot", depth: 2 },
            { id: "icon", label: "Icon", kind: "image", depth: 2 },
          ]}
          selected="button"
        />
      </div>
      <main
        className="pk-canvas pk-area-canvas"
        data-pk="canvas"
        style={{ background: "var(--pk-panel-2)" }}
      >
        <div
          className="absolute"
          style={{
            left: 120,
            top: take === "bar" || take === "context" ? 96 : 64,
          }}
        >
          {ARTS.map((a) => {
            const sel = a.id === "hover"
            return (
              <div
                key={a.id}
                className="absolute"
                style={{ left: a.x, top: a.y, width: a.w }}
                data-pk={`art:${a.id}`}
              >
                <span
                  className="pk-faint flex h-8 flex-col justify-end text-[11px] leading-[13px]"
                  style={sel && rec ? { color: "var(--pk-rec)" } : undefined}
                >
                  {a.group && <span>{a.group}</span>}
                  <span>{a.name}</span>
                </span>
                <div
                  className="pk-checker relative grid h-[96px] place-items-center"
                  style={
                    sel
                      ? {
                          outline: `1.5px solid var(${rec ? "--pk-rec" : "--pk-accent"})`,
                        }
                      : undefined
                  }
                >
                  <span
                    className="grid h-10 place-items-center rounded-lg px-5 font-semibold text-white"
                    style={{ minWidth: 70, fontSize: 14, ...a.button }}
                  >
                    {a.label ?? "Label"}
                  </span>
                  {sel && take === "float" && <FloatBar rec={rec} />}
                </div>
              </div>
            )
          })}
        </div>
        {take === "context" && (
          <div className="pk-take-context" data-pk="take:bar">
            <span className="pk-chip">
              Button <TbChevronDown className="h-3 w-3" />
            </span>
            <span className="pk-faint">·</span>
            <span className="pk-chip" data-kind={rec ? "rec" : undefined}>
              {rec ? <TbBolt /> : "◇"} {rec ? "Hover" : "base"}
            </span>
            <span className="pk-faint">·</span>
            <span className="pk-faint flex items-center gap-1">
              <TbPlus /> Add variants to context…
            </span>
          </div>
        )}
        {take === "bar" && (
          <div
            className="pk-take-bar"
            data-rec={rec || undefined}
            data-pk="take:bar"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <TbTarget /> Button
            </span>
            {rec ? (
              <span className="pk-chip" data-kind="rec">
                <TbBolt /> Hover
              </span>
            ) : (
              <span className="pk-chip">◇ Base</span>
            )}
            <span className="flex-1" />
            <span className="pk-faint flex items-center gap-1">
              <TbPlus /> Target, view, or create variants…
            </span>
            <TbDots className="opacity-50" />
            {rec && (
              <span
                className="flex items-center gap-1 pl-3"
                style={{
                  color: "var(--pk-rec)",
                  borderLeft: "1px solid var(--pk-line-2)",
                }}
              >
                <TbArrowBackUp /> Return to base
              </span>
            )}
          </div>
        )}
        {take === "tab" && rec && (
          <div className="pk-take-tab" data-pk="take:bar">
            <TbLock /> Recording variant… <TbX />
          </div>
        )}
        {take === "bottom" && rec && (
          <div className="pk-take-bottom" data-pk="take:bar">
            <span>
              Recording <b>Button</b> → <b>Hover</b> variant…
            </span>
            <span className="flex items-center gap-1 font-medium">
              Stop <TbX />
            </span>
          </div>
        )}
      </main>
      <div
        className="pk-panel pk-area-right"
        style={{ borderLeft: "1px solid var(--pk-line)" }}
        data-pk="right"
      >
        <div className="pk-head" style={{ minHeight: 52 }}>
          <span className="flex flex-col leading-4">
            <b className="font-semibold">Button</b>
            <span className="pk-faint text-[11px]">Component</span>
          </span>
        </div>
        <div
          className="pk-group-label"
          style={rec ? { color: "var(--pk-rec)" } : undefined}
          data-pk="r:variants"
        >
          Variants targeting
          <TbPlus className="ml-auto" />
        </div>
        {[
          ["Base", "◇", 0],
          ["Hover", "bolt", 0],
          ["Primary", "△", 0],
          ["Secondary", "△", 0],
          ["Group", "group", 0],
          ["Variant1", "△", 1],
          ["Variant2", "△", 1],
        ].map(([n, icon, depth]) => {
          const on = n === "Hover" && rec
          return (
            <div
              key={n}
              className="pk-row"
              style={{
                paddingLeft: 12 + (depth as number) * 16,
                background: on ? "var(--pk-rec-bg)" : undefined,
                color: on ? "var(--pk-rec)" : undefined,
              }}
              data-pk={`r:v:${(n as string).toLowerCase()}`}
            >
              {icon === "bolt" ? (
                <TbBolt />
              ) : icon === "group" ? (
                <TbLayoutGrid />
              ) : (
                <span className="w-4 text-center">{icon}</span>
              )}
              <span className="flex-1">{n}</span>
              {on && (
                <>
                  <TbTarget />
                  <TbEye />
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The targeting toolbar, floating on the selected artboard. */
function FloatBar({ rec }: { rec: boolean }) {
  return (
    <span
      className="pk-take-float"
      data-rec={rec || undefined}
      data-pk="take:bar"
    >
      <span className="flex items-center gap-1">
        <TbTarget /> Button
      </span>
      <span className="pk-chip" data-kind={rec ? "rec" : undefined}>
        <TbBolt /> Hover
      </span>
      <TbPlus />
      <TbDots />
    </span>
  )
}
