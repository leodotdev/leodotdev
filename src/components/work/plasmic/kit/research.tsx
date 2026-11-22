import {
  TbBell,
  TbBinoculars,
  TbBrandReact,
  TbCheck,
  TbChevronDown,
  TbCloud,
  TbFile,
  TbFolder,
  TbHistory,
  TbMenu2,
  TbPackage,
  TbPlayerPlay,
  TbRocket,
  TbDatabase,
  TbCode,
  TbMessage,
  TbPencil,
} from "react-icons/tb"
import { AcmeLogin } from "@/components/work/plasmic/kit/acme"
import { Avatars, Mark, Tree } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// The research before 2020, from the "Research" file: wireframes of where
// the studio should go (drawn as the file draws them: outlines, with the
// zones named), the naming of its top-level container, the product's
// object model, and a north-star concept of a code-backed studio.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

/** A named zone of a wireframe, outlined, its name in red mono. */
function Zone({
  name,
  pk,
  style,
  dashed,
  children,
}: {
  name?: string
  pk?: string
  style: React.CSSProperties
  dashed?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      className="absolute rounded-md"
      style={{
        border: `1.5px ${dashed ? "dashed" : "solid"} ${dashed ? "var(--pk-rec)" : "var(--pk-fg-3)"}`,
        ...style,
      }}
      data-pk={pk}
    >
      {name && (
        <span
          className="pk-mono absolute top-1.5 left-2"
          style={{ color: dashed ? "var(--pk-rec)" : "var(--pk-fg-2)" }}
        >
          {name}
        </span>
      )}
      {children}
    </div>
  )
}

const lines = (n: number, top: number, left = 12, w = "70%") =>
  Array.from({ length: n }, (_, i) => (
    <i
      key={i}
      className="absolute block h-2 rounded"
      style={{
        top: top + i * 22,
        left,
        width: w,
        background: "var(--pk-panel-3)",
      }}
    />
  ))

/**
 * The wireframes: "tomorrow", and two exploratory alternatives (A: two
 * header rows, a floating properties card, variants in a drawer; B: a modes
 * rail, tools across the canvas, properties over variants, the library in a
 * drawer).
 */
export function Wireframe({ s }: { s: State }) {
  const v = str(s.wire, "tomorrow")
  return (
    <div
      className="absolute inset-0"
      style={{ background: "var(--pk-bg)" }}
      data-pk="wire"
    >
      <span className="absolute top-5 left-6 text-[22px] font-bold">
        {v === "tomorrow"
          ? "Tomorrow"
          : `Tomorrow (exploratory ${v.toUpperCase()})`}
      </span>
      {v === "tomorrow" && (
        <>
          <Zone
            name="Grounding"
            pk="z:grounding"
            style={{ left: 40, top: 70, width: 420, height: 44 }}
          />
          <Zone
            name="Views"
            pk="z:views"
            style={{ left: 880, top: 70, width: 300, height: 44 }}
          />
          <Zone
            name="Sharing"
            pk="z:sharing"
            style={{ left: 1196, top: 70, width: 204, height: 44 }}
          />
          <Zone
            name="Content"
            pk="z:content"
            style={{ left: 40, top: 130, width: 300, height: 700 }}
          >
            <div
              className="absolute grid grid-cols-3 gap-2"
              style={{ top: 80, left: 16, right: 16 }}
            >
              {Array.from({ length: 9 }, (_, i) => (
                <i
                  key={i}
                  className="block h-14 rounded"
                  style={{ background: "var(--pk-panel-3)" }}
                />
              ))}
            </div>
            {lines(8, 300)}
          </Zone>
          <Zone
            name="Tools"
            pk="z:tools"
            style={{ left: 356, top: 150, width: 44, height: 260 }}
          />
          <Zone
            name="Viewport"
            pk="z:viewport"
            style={{ left: 500, top: 150, width: 360, height: 560 }}
          >
            <span
              className="pk-mono absolute -top-7 left-0 rounded px-2 py-0.5"
              style={{ background: "var(--pk-panel-3)" }}
            >
              Mobile
            </span>
          </Zone>
          <Zone
            name="Path to selection"
            pk="z:path"
            style={{ left: 500, top: 726, width: 360, height: 32 }}
          />
          <Zone
            name="Reserved: toasts"
            pk="z:toasts"
            dashed
            style={{ left: 880, top: 130, width: 300, height: 90 }}
          />
          <Zone
            name="Reserved: animation, logic"
            pk="z:logic"
            dashed
            style={{ left: 356, top: 776, width: 824, height: 70 }}
          />
          <Zone
            name="Properties & states"
            pk="z:properties"
            style={{ left: 1196, top: 130, width: 204, height: 700 }}
          >
            {lines(14, 50, 12, "75%")}
          </Zone>
        </>
      )}
      {v === "a" && (
        <>
          <Zone
            name="Project"
            style={{ left: 40, top: 70, width: 300, height: 36 }}
          />
          <Zone
            name="Version"
            style={{ left: 1100, top: 70, width: 300, height: 36 }}
          />
          <Zone
            name="Path to selection"
            pk="z:path"
            style={{ left: 40, top: 114, width: 600, height: 36 }}
          />
          <Zone
            name="Views"
            style={{ left: 880, top: 114, width: 260, height: 36 }}
          />
          <Zone
            name="Share"
            style={{ left: 1156, top: 114, width: 244, height: 36 }}
          />
          <Zone
            name="Content"
            style={{ left: 40, top: 162, width: 280, height: 680 }}
          >
            {lines(10, 50)}
          </Zone>
          <Zone
            name="Tools"
            style={{ left: 336, top: 172, width: 40, height: 280 }}
          />
          <Zone
            name="Viewport"
            style={{ left: 500, top: 172, width: 360, height: 420 }}
          />
          <Zone
            name="Properties"
            pk="z:card"
            style={{
              left: 1080,
              top: 172,
              width: 300,
              height: 420,
              background: "var(--pk-panel)",
              boxShadow: "var(--pk-shadow)",
            }}
          >
            {lines(8, 50, 12, "70%")}
          </Zone>
          <Zone
            name="Variants"
            pk="z:drawer"
            style={{ left: 336, top: 620, width: 1064, height: 222 }}
          >
            <div className="absolute flex gap-3" style={{ top: 60, left: 16 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <i
                  key={i}
                  className="block h-28 w-40 rounded"
                  style={{ background: "var(--pk-panel-3)" }}
                />
              ))}
            </div>
          </Zone>
        </>
      )}
      {v === "b" && (
        <>
          <Zone
            name="Home · Project · Path to selection"
            pk="z:path"
            style={{ left: 40, top: 70, width: 760, height: 36 }}
          />
          <Zone
            name="Notifications · Share"
            style={{ left: 1100, top: 70, width: 300, height: 36 }}
          />
          <Zone
            name="Modes"
            pk="z:modes"
            style={{ left: 40, top: 118, width: 52, height: 220 }}
          />
          <Zone
            name="Tree, Outline, Graph"
            style={{ left: 104, top: 118, width: 240, height: 724 }}
          >
            {lines(12, 50)}
          </Zone>
          <Zone
            name="Tools"
            pk="z:tools"
            style={{ left: 356, top: 118, width: 700, height: 40 }}
          />
          <Zone
            name="Viewport"
            style={{ left: 520, top: 180, width: 360, height: 400 }}
          />
          <Zone
            name="Properties"
            style={{ left: 1068, top: 118, width: 332, height: 420 }}
          >
            {lines(8, 50)}
          </Zone>
          <Zone
            name="Variants"
            style={{ left: 1068, top: 550, width: 332, height: 292 }}
          >
            {lines(5, 50)}
          </Zone>
          <Zone
            name="Library"
            pk="z:drawer"
            style={{ left: 356, top: 600, width: 700, height: 242 }}
          >
            <div
              className="absolute grid grid-cols-5 gap-3"
              style={{ top: 50, left: 16, right: 16 }}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <i
                  key={i}
                  className="block h-20 rounded"
                  style={{ background: "var(--pk-panel-3)" }}
                />
              ))}
            </div>
          </Zone>
        </>
      )}
    </div>
  )
}

/** The light restyle: a breadcrumb of pills, the container's name in question. */
export function Naming({ s }: { s: State }) {
  const root = str(s.root, "Studio 1")
  const crumbs =
    root === "Page"
      ? ["Page", "Variant", "Root"]
      : [root, "Frame", "app-header"]
  return (
    <div
      className="pk-studio"
      style={{
        gridTemplateRows: "48px minmax(0,1fr)",
        gridTemplateColumns: "264px minmax(0,1fr) 280px",
        gridTemplateAreas: '"top top top" "left canvas right"',
      }}
    >
      <header className="pk-top pk-area-top" data-pk="top">
        <span className="pk-logo">
          <Mark />
        </span>
        <b className="mr-3 font-semibold">My Auth Flow Project</b>
        <span className="flex items-center gap-1" data-pk="naming:crumbs">
          {crumbs.map((c, i) => (
            <span key={c} className="flex items-center gap-1">
              <span
                className="pk-chip"
                style={
                  i === 0
                    ? {
                        background: "var(--pk-accent-bg)",
                        color: "var(--pk-accent)",
                      }
                    : undefined
                }
                data-pk={i === 0 ? "naming:root" : undefined}
              >
                {c}
                {i === 0 && <TbChevronDown className="h-3 w-3" />}
              </span>
              <span className="pk-faint">›</span>
            </span>
          ))}
          <span
            className="pk-chip"
            style={{ background: "var(--pk-accent)", color: "#fff" }}
          >
            h1: Text Block
          </span>
        </span>
        <span className="flex-1" />
        <Avatars names={["L"]} />
      </header>
      <div
        className="pk-panel pk-area-left"
        style={{ borderRight: "1px solid var(--pk-line)" }}
      >
        <div className="pk-tabs">
          {["Tree", "Gallery", "Assets"].map((t) => (
            <span key={t} className="pk-tab" aria-selected={t === "Tree"}>
              {t}
            </span>
          ))}
        </div>
        <Tree
          nodes={[
            { id: "root", label: crumbs[0], kind: "frame", open: true },
            {
              id: "frame",
              label: crumbs[1],
              kind: "vstack",
              depth: 1,
              open: true,
            },
            {
              id: "header",
              label: crumbs[2],
              kind: "component",
              depth: 2,
              open: true,
            },
            { id: "h1", label: "h1: Text Block", kind: "text", depth: 3 },
            { id: "body", label: "app-body", kind: "vstack", depth: 2 },
          ]}
          selected="h1"
        />
      </div>
      <main className="pk-canvas pk-area-canvas">
        <div
          className="pk-board"
          style={{ left: 120, top: 60, width: 375, height: 720 }}
        >
          <div className="pk-board-body pk-naming">
            <AcmeLogin title="Sign in" />
          </div>
        </div>
      </main>
      <div
        className="pk-panel pk-area-right"
        style={{ borderLeft: "1px solid var(--pk-line)" }}
      />
    </div>
  )
}

const MODEL: Array<Array<string>> = [
  [
    "Plasmic",
    "Dashboard",
    "Project",
    "Studio??",
    "Arena",
    "View",
    "Component",
    "Element",
  ],
]
const HOLDS: Array<Array<string>> = [
  ["Style", "Value"],
  ["Style", "Token", "Value"],
  ["Style", "Mixin", "Token", "Value"],
  ["Master", "Slot", "Component", "Element"],
  ["Instance", "Slot", "Component", "Element"],
  ["Variant group", "Variant", "Style"],
]

/**
 * The object model: what the product is made of, as the file drew it, each
 * level drawn inside the one that holds it (the file repeats Project's row
 * for many projects). Beside it, what an element holds.
 */
export function ObjectModel() {
  const levels = MODEL[0]
  const id = (w: string) => `om:${w.toLowerCase().replace(/\W/g, "")}`
  const level = (i: number): React.ReactNode => {
    const name = levels[i]
    const last = i === levels.length - 1
    return (
      <div
        className="pk-om-level"
        data-q={name.endsWith("??") || undefined}
        data-last={last || undefined}
        data-pk={id(name)}
      >
        <span className="pk-om-label">{name}</span>
        {last ? (
          <span className="grid flex-1 place-items-center">
            <span className="pk-btn" data-kind="primary">
              Log in
            </span>
          </span>
        ) : name === "Dashboard" ? (
          <span className="flex min-h-0 flex-1 gap-3">
            {level(i + 1)}
            <span className="flex w-[104px] flex-none flex-col gap-3">
              {["Project", "Project", "Project"].map((p, k) => (
                <span key={k} className="pk-om-level" data-mini>
                  <span className="pk-om-label">{p}</span>
                </span>
              ))}
            </span>
          </span>
        ) : (
          level(i + 1)
        )}
      </div>
    )
  }
  const chain = (row: Array<string>) => (
    <div className="flex flex-wrap items-center gap-1.5">
      {row.map((w, i) => (
        <span key={w + i} className="flex items-center gap-1.5">
          <span className="pk-om-chip">{w}</span>
          {i < row.length - 1 && <span className="pk-faint">›</span>}
        </span>
      ))}
    </div>
  )
  return (
    <div
      className="absolute inset-0 flex gap-10 px-12 pt-10 pb-12"
      style={{ background: "var(--pk-bg)", fontSize: 13 }}
      data-pk="model"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <b className="text-[22px] leading-7 font-semibold">The object model</b>
        <div className="flex min-h-0 flex-1" data-pk="om:chain">
          {level(0)}
        </div>
      </div>
      <div
        className="flex w-[400px] flex-none flex-col gap-4 pt-12"
        data-pk="om:holds"
      >
        <span className="pk-muted">What an element holds</span>
        {HOLDS.map((r, i) => (
          <div key={i}>{chain(r)}</div>
        ))}
      </div>
    </div>
  )
}

export function Homework({ s }: { s: State }) {
  const mode = str(s.mode, "Design")
  const side = str(s.side, "Files")
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: "var(--pk-bg)" }}
      data-pk="homework"
    >
      <div
        className="flex h-10 items-center gap-2 px-3"
        style={{
          background: "var(--pk-panel)",
          borderBottom: "1px solid var(--pk-line)",
        }}
      >
        <span className="pk-chip">
          <TbCloud className="h-3.5 w-3.5" />
          Drive
        </span>
        <span className="pk-chip" style={{ background: "var(--pk-panel-3)" }}>
          Repositories / <b>ToDoMVP</b>
          <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="flex-1" />
        <TbBell className="h-4 w-4 opacity-50" />
        <span
          className="flex items-center gap-1 text-[11px]"
          style={{ color: "var(--pk-ok)" }}
          data-pk="hw:saved"
        >
          <TbCheck className="h-3.5 w-3.5" />
          Changes saved
        </span>
        <TbHistory className="h-4 w-4 opacity-60" />
      </div>
      <div
        className="flex h-11 items-center gap-2 px-3"
        style={{
          background: "var(--pk-panel)",
          borderBottom: "1px solid var(--pk-line)",
        }}
      >
        <TbMenu2 className="h-4 w-4 opacity-60" />
        <span
          className="pk-input pk-mono"
          style={{ width: 300 }}
          data-pk="hw:address"
        >
          <TbFile />
          {mode === "Design" && s.selPath
            ? "Project/HomePage/Mobile/Root/Button"
            : "todomvp://index.js"}
        </span>
        <span className="pk-seg" data-pk="hw:modes">
          {[
            ["Design", TbPencil],
            ["Comment", TbMessage],
            ["Code", TbCode],
            ["Run", TbPlayerPlay],
            ["Deploy", TbRocket],
          ].map(([m, I]) => {
            const Icon = I as React.ComponentType<{ className?: string }>
            return (
              <span
                key={m as string}
                aria-pressed={mode === m}
                className="gap-1 px-2.5"
                style={{ display: "flex" }}
                data-pk={`hw:mode:${(m as string).toLowerCase()}`}
              >
                <Icon />
                {m as string}
              </span>
            )
          })}
        </span>
        <span className="flex-1" />
        <Avatars names={["L", "Y"]} />
        <span
          className="pk-btn"
          style={{ background: "var(--pk-fg)", color: "var(--pk-bg)" }}
        >
          Share
        </span>
      </div>
      <div className="flex min-h-0 flex-1">
        <div
          className="flex w-[280px] flex-col"
          style={{
            background: "var(--pk-panel)",
            borderRight: "1px solid var(--pk-line)",
          }}
        >
          <div className="pk-tabs" data-pk="hw:side">
            {["Files", "Dependencies", "Content Sources"].map((t) => (
              <span
                key={t}
                className="pk-tab"
                aria-selected={side === t}
                data-pk={`hw:tab:${t.split(" ")[0].toLowerCase()}`}
              >
                {t}
              </span>
            ))}
          </div>
          {side === "Dependencies" ? (
            <div className="flex flex-col gap-1 p-2" data-pk="hw:deps">
              {[
                ["next.js", "latest"],
                ["react", "^16.7.0"],
                ["react-dom", "^16.7.0"],
              ].map(([n, v]) => (
                <div key={n} className="pk-variant">
                  <TbPackage />
                  {n}
                  <span className="pk-faint pk-mono ml-auto">{v}</span>
                </div>
              ))}
              <span
                className="pk-btn mt-2"
                style={{ background: "var(--pk-ok)", color: "#fff" }}
              >
                Add dependency…
              </span>
            </div>
          ) : side === "Content Sources" ? (
            <div className="flex flex-col gap-1 p-2" data-pk="hw:sources">
              <span className="pk-menu-label">Storage</span>
              {[
                "Amazon Web Services…",
                "Google Cloud Platform…",
                "Firebase…",
              ].map((n) => (
                <div key={n} className="pk-variant">
                  <TbDatabase />
                  {n}
                </div>
              ))}
              <span className="pk-menu-label">Images</span>
              <div className="pk-variant">
                <TbDatabase />
                Unsplash…
              </div>
            </div>
          ) : (
            <div className="flex flex-col py-1" data-pk="hw:files">
              {[
                ["src", true],
                ["components", true],
                ["index.js", false],
                ["TodoList.js", false],
                ["package.json", false],
              ].map(([n, dir], i) => (
                <div
                  key={n as string}
                  className="pk-row"
                  aria-selected={n === "index.js"}
                  style={{ paddingLeft: 10 + (i > 0 && i < 4 ? 14 : 0) }}
                >
                  {dir ? <TbFolder /> : <TbFile />}
                  {n as string}
                </div>
              ))}
              <div className="pk-head mt-2">
                <span>Tree</span>
              </div>
              <div className="pk-mono flex flex-col" data-pk="hw:dom">
                {[
                  '<body class="custom-body">',
                  "  <section>",
                  "    <h2>",
                  '    <ul class="todo-list">',
                  "      <TodoItem>",
                  "    <footer>",
                ].map((l) => (
                  <span key={l} className="pk-muted px-3 py-0.5 whitespace-pre">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative min-w-0 flex-1" data-pk="hw:viewports">
          <div className="absolute flex gap-6" style={{ left: 40, top: 40 }}>
            {[
              [375, 560, "Mobile · dark · rulers", true],
              [400, 560, "Desktop · spacing", false],
            ].map(([w, h, l, dark]) => (
              <div key={l as string} className="flex flex-col gap-2">
                <span className="pk-faint pk-mono">{l as string}</span>
                <div
                  className="overflow-hidden rounded-lg"
                  style={{
                    width: w as number,
                    height: h as number,
                    background: dark ? "#111827" : "#fff",
                    color: dark ? "#f9fafb" : "#111827",
                    boxShadow: "0 1px 3px rgb(0 0 0 / 0.3)",
                  }}
                >
                  <div
                    className="flex flex-col gap-3 p-5"
                    style={{ fontSize: 14 }}
                  >
                    <b style={{ fontSize: 28 }}>todos</b>
                    {["Design the studio", "Wire up data", "Ship it"].map(
                      (t, i) => (
                        <span
                          key={t}
                          className="flex items-center gap-2 rounded-md px-3 py-2.5"
                          style={{ background: dark ? "#1f2937" : "#f3f4f6" }}
                        >
                          <span
                            className="grid h-4 w-4 place-items-center rounded-full"
                            style={{ border: "1.5px solid #10b981" }}
                          >
                            {i === 0 && (
                              <TbCheck
                                className="h-3 w-3"
                                style={{ color: "#10b981" }}
                              />
                            )}
                          </span>
                          {t}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-lg px-3 py-2"
            style={{
              background: "var(--pk-panel)",
              boxShadow: "var(--pk-shadow)",
            }}
            data-pk="hw:state"
          >
            <b className="text-[11px]">State</b>
            <span className="pk-chip">todos: 3</span>
            <span className="pk-chip">filter: “all”</span>
            <span className="pk-chip">editing: null</span>
            <span className="flex-1" />
            <TbBinoculars className="h-4 w-4 opacity-60" />
            <span className="pk-mono pk-faint">100%</span>
          </div>
        </div>
        <div
          className="w-[280px]"
          style={{
            background: "var(--pk-panel)",
            borderLeft: "1px solid var(--pk-line)",
          }}
          data-pk="hw:components"
        >
          <div className="pk-tabs">
            {["All", "Local", "Global", "Saved"].map((t) => (
              <span key={t} className="pk-tab" aria-selected={t === "All"}>
                {t}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 p-3">
            {[
              "<a>",
              "<Link>",
              "<h2>",
              "<HeadingTwo>",
              "<button>",
              "TodoItem",
            ].map((c) => (
              <span key={c} className="pk-tile">
                <i>
                  <TbBrandReact className="h-5 w-5 opacity-50" />
                </i>
                <span className="pk-mono">{c}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
