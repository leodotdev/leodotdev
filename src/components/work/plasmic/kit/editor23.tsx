import {
  TbLayoutKanban,
  TbInbox,
  TbTable,
  TbList,
  TbDeviceMobile,
  TbLayoutGrid,
  TbBolt,
  TbAlertTriangle,
  TbBook,
  TbBuildingSkyscraper,
  TbCheck,
  TbChevronDown,
  TbChevronRight,
  TbCircleCheck,
  TbComponents,
  TbDatabase,
  TbDeviceDesktop,
  TbDiamond,
  TbDots,
  TbDroplet,
  TbExternalLink,
  TbEye,
  TbFileText,
  TbGitBranch,
  TbHelp,
  TbLayersSubtract,
  TbMessage,
  TbPalette,
  TbPencil,
  TbPhoto,
  TbPlayerPlay,
  TbPlus,
  TbSearch,
  TbSettings,
  TbSparkles,
  TbTriangle,
  TbWorld,
  TbX,
} from "react-icons/tb"
import { Menu, Pop } from "@/components/work/plasmic/kit/overlays"
import {
  Avatars,
  Field,
  Input,
  Search,
  Tree,
} from "@/components/work/plasmic/kit/studio"
import type { TreeNode } from "@/components/work/plasmic/kit/studio"
import {
  EmptyStack,
  Integrations,
  PageSettings,
  QueryDrawer,
  SettingsModal,
  TemplatePick,
  WelcomeInsert,
} from "@/components/work/plasmic/kit/app23"
import type { State } from "@/components/work/plasmic/types"

// The editor after the ribbon (late 2022) and through 2023, from the
// "2021 – 2022 Product" and "P2023 H1" files: back to a rail with docked
// panels, under a top bar that reads as a breadcrumb (project › branch ›
// page › variants). Around it: branches and merging, publishing with
// tests, a Logic mode, an app builder with data, and a command palette
// with Copilot. Its state keys are listed on `EditorCrumb`.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

/**
 * State keys: labeled: the app builder's labeled rail; project: the
 * project's name; left: "tree" | "tests" | "copilot" | "none"; rec: the
 * screen variant recording (the bar turns red); mode: "design" | "logic";
 * flow: Logic's flow graph; projMenu, branches, branchSub; publish,
 * testsRun; merge; palette, q; crm: the dark data-bound sample; tab: the
 * right panel's tab; floating: the floating-chrome exploration.
 */
export function EditorCrumb({ s }: { s: State }) {
  const labeled = Boolean(s.labeled)
  const left = str(s.left, "tree")
  const rec =
    str(s.rec) || (comboOf(s).some(([, k]) => k !== "Global") ? "combo" : "")
  const logic = s.mode === "logic"
  const railW = labeled ? 72 : 48
  const view = {
    x: typeof s.zx === "number" ? s.zx : 40,
    y: typeof s.zy === "number" ? s.zy : 40,
    z: typeof s.zz === "number" ? s.zz : 0.42,
  }
  const leftW = left === "none" ? 0 : 260
  return (
    <div
      className="pk-studio"
      style={{
        gridTemplateRows: "48px minmax(0,1fr)",
        gridTemplateColumns: `${railW}px ${leftW}px minmax(0,1fr) ${(s.crm && !s.coll) || logic ? 0 : 300}px`,
        gridTemplateAreas: '"top top top top" "rail left canvas right"',
      }}
    >
      {s.floating ? <FloatingChrome /> : <CrumbBar s={s} />}
      <RailCrumb s={s} />
      {leftW > 0 && (
        <div
          className="pk-panel pk-area-left"
          style={{ borderRight: "1px solid var(--pk-line)" }}
          data-pk="left"
        >
          {left === "tests" ? (
            <TestResults s={s} />
          ) : left === "copilot" ? (
            <Copilot />
          ) : (
            <TreePanel s={s} />
          )}
        </div>
      )}
      <main
        className="pk-canvas pk-area-canvas"
        data-pk="canvas"
        data-rec={rec ? "" : undefined}
        style={{ "--pk-dots": "var(--pk-line-2)" } as React.CSSProperties}
      >
        {s.emptyPage ? (
          <EmptyStack drop={Boolean(s.stackDrop)} />
        ) : s.newPage ? (
          <TemplatePick hover={str(s.tpl)} />
        ) : s.crm ? (
          <Crm viewAs={str(s.viewAs)} type={str(s.ctype, "Cards")} />
        ) : (
          <Boards rec={rec} view={view} s={s} />
        )}
        <span
          className="pk-zoom absolute right-3 bottom-3 rounded-lg"
          style={{ background: "var(--pk-pop)", boxShadow: "var(--pk-shadow)" }}
          data-pk="zoom-level"
        >
          {Math.round(view.z * 100)}% <TbChevronDown className="h-3 w-3" />
        </span>
        {logic && <LogicPanel flow={Boolean(s.flow)} />}
        {Boolean(s.query) && <QueryDrawer s={s} />}
        {Boolean(s.welcome) && <WelcomeInsert hover={str(s.tplHover)} />}
      </main>
      {!s.crm && !logic && <RightCrumb s={s} />}
      {Boolean(s.crm && s.coll) && (
        <CollectionPanel type={str(s.ctype, "Cards")} />
      )}
      {s.projMenu && <ProjectMenu s={s} />}
      {s.publish && <PublishDialog ran={Boolean(s.testsRun)} />}
      {s.merge && <MergeDialog />}
      {s.palette && <Palette q={str(s.q)} />}
      {Boolean(s.settings) && <SettingsModal s={s} />}
      {Boolean(s.pageSet) && <PageSettings s={s} />}
      {s.crumbMenu === "page" && (
        <Menu
          x={290}
          y={46}
          w={230}
          pk="switch:page"
          hover={str(s.menuHover)}
          items={[
            { heading: "Pages" },
            { label: "Homepage", icon: TbFileText, kbd: "/" },
            { label: "Pricing", icon: TbFileText, kbd: "/pricing" },
            { label: "Blog", icon: TbFileText, kbd: "/blog" },
            "sep",
            { heading: "Components" },
            { label: "Button", icon: TbComponents },
            { label: "Navigation", icon: TbComponents },
            "sep",
            { heading: "Custom arenas" },
            { label: "Explorations", icon: TbLayoutGrid },
          ]}
        />
      )}
      {s.crumbMenu === "variant" && (
        <Menu
          x={430}
          y={46}
          w={220}
          pk="switch:variant"
          hover={str(s.menuHover)}
          items={[
            { heading: "Interactions" },
            { label: "Hover", icon: TbBolt },
            { label: "Pressed", icon: TbBolt },
            { heading: "Toggles" },
            { label: "isDark", icon: TbTriangle },
            { heading: "Screens" },
            { label: "Desktop", icon: TbDeviceDesktop },
            { label: "Mobile-only", icon: TbDeviceMobile, pk: "switch:mobile" },
            { heading: "Globals" },
            { label: "DarkTheme", icon: TbWorld },
          ]}
        />
      )}
      {Boolean(s.integrations) && <Integrations hover={str(s.srcHover)} />}
    </div>
  )
}

function Crumb({
  icon: I,
  value,
  label,
  pk,
  red,
}: {
  icon?: React.ComponentType<{ className?: string }>
  value: string
  label?: string
  pk?: string
  red?: boolean
}) {
  return (
    <span
      className="pk-btn"
      data-kind={red ? "rec" : "ghost"}
      data-pk={pk}
      style={{ height: label ? 36 : 28, gap: 6 }}
    >
      {I && <I />}
      <span className="flex flex-col items-start leading-[14px]">
        <span className="font-medium">{value}</span>
        {label && <span className="text-[10px] opacity-60">{label}</span>}
      </span>
      <TbChevronDown className="h-3 w-3 opacity-70" />
    </span>
  )
}

/**
 * The variants a recording combines (state key combo, a comma list): a
 * variant, an element state (name:state), or a global variant (Dark…),
 * which shows gray: it is applied, not recorded into.
 */
function comboOf(s: State): Array<[string, string]> {
  return str(s.combo)
    .split(",")
    .filter(Boolean)
    .map((c) => [
      c,
      c.includes(":") ? "State" : c.startsWith("Dark") ? "Global" : "Variant",
    ])
}

function CrumbBar({ s }: { s: State }) {
  const combo = comboOf(s)
  const rec =
    str(s.rec) || (combo.some(([, k]) => k !== "Global") ? "combo" : "")
  const logic = s.mode === "logic"
  return (
    <header
      className="pk-top pk-area-top"
      style={{ gap: 2, background: rec ? "var(--pk-rec-bg)" : undefined }}
      data-pk="top"
    >
      <span className="pk-logo">
        <span
          className="grid h-7 w-7 place-items-center rounded-full"
          style={{ background: "var(--pk-panel-3)" }}
        >
          <TbBuildingSkyscraper className="h-4 w-4 opacity-70" />
        </span>
      </span>
      <Crumb
        value={str(s.project, "Blank Project")}
        label="Project"
        pk="crumb:project"
      />
      <TbChevronRight className="h-3 w-3 opacity-40" />
      <Crumb
        icon={TbGitBranch}
        value={str(s.branch, "main")}
        label="Branch"
        pk="crumb:branch"
      />
      <TbChevronRight className="h-3 w-3 opacity-40" />
      <Crumb
        icon={TbFileText}
        value={logic ? "Counter" : s.newPage ? "New" : "Homepage"}
        label={logic ? "Component" : "Page"}
        pk="crumb:page"
      />
      <TbChevronRight className="h-3 w-3 opacity-40" />
      <Crumb
        icon={TbTriangle}
        value="Base"
        label="Variant"
        pk="crumb:variant"
      />
      {Boolean(s.rec) && (
        <>
          <Crumb
            icon={TbDeviceDesktop}
            value={str(s.rec)}
            label="Screen"
            pk="crumb:rec"
            red
          />
          <span className="pk-icon-btn" style={{ color: "var(--pk-rec)" }}>
            <TbX />
          </span>
        </>
      )}
      {combo.map(([name, kind], i) => (
        <span
          key={name}
          className="pk-btn"
          data-kind={kind === "Global" ? "ghost" : "rec"}
          style={{ height: 26, gap: 5, padding: "0 8px" }}
          title={kind}
          data-pk={`crumb:combo:${i}`}
        >
          {kind === "Global" ? <TbWorld /> : <TbTriangle />}
          {name}
        </span>
      ))}
      {s.viewAs !== undefined && (
        <span
          className="pk-btn"
          data-kind="ghost"
          style={{ gap: 6 }}
          data-pk="viewas"
        >
          <TbEye />
          Viewing as <b className="font-semibold">{str(s.viewAs, "Admin")}</b>
          <TbChevronDown className="h-3 w-3" />
        </span>
      )}
      <span className="flex flex-1 justify-center gap-1" data-pk="modes">
        {(s.labeled
          ? ["Build", "Preview"]
          : ["Design", "Logic", "Preview"]
        ).map((m) => (
          <span
            key={m}
            className="pk-ribbon-tab"
            aria-selected={
              m === "Logic"
                ? logic
                : m === "Design" || m === "Build"
                  ? !logic
                  : false
            }
            data-pk={`mode:${m.toLowerCase()}`}
          >
            {m}
          </span>
        ))}
      </span>
      {s.palette !== undefined && (
        <span
          className="pk-search"
          style={{ width: 220, margin: 0 }}
          data-pk="palette:open"
        >
          <TbSearch className="h-3.5 w-3.5" />
          <span>Search…</span>
          <span className="pk-faint pk-mono ml-auto">⌘K</span>
        </span>
      )}
      <Crumb icon={TbDeviceDesktop} value="Desktop" pk="crumb:screen" />
      <span className="pk-tool" style={{ color: "var(--pk-ok)" }}>
        <TbPlayerPlay />
      </span>
      <span className="pk-tool">
        <TbExternalLink />
      </span>
      <Avatars names={["Y", "C", "K"]} />
      <span className="pk-btn" data-kind="ghost" data-pk="share">
        Share <TbChevronDown className="h-3 w-3" />
      </span>
      <span className="pk-btn" data-kind="ghost" data-pk="code">
        Code <TbChevronDown className="h-3 w-3" />
      </span>
      <span
        className="pk-btn"
        data-kind={rec ? "rec" : "primary"}
        data-pk="publish"
      >
        Publish
      </span>
    </header>
  )
}

/** An exploration: the top bar split into two pills floating over the canvas. */
function FloatingChrome() {
  return (
    <header
      className="pk-area-top relative z-[3]"
      style={{ background: "var(--pk-bg)" }}
      data-pk="top"
    >
      <div
        className="absolute top-2 left-2 flex h-[52px] items-center gap-1 rounded-2xl px-2"
        style={{ background: "var(--pk-pop)", boxShadow: "var(--pk-shadow)" }}
        data-pk="pill:left"
      >
        <Avatars names={["L"]} />
        <Crumb value="Blank Project" label="Project" />
        <Crumb icon={TbGitBranch} value="main" label="Branch" />
        <Crumb icon={TbFileText} value="Homepage" label="Page" />
        <Crumb icon={TbTriangle} value="Variants" />
      </div>
      <div
        className="absolute top-2 right-2 flex h-[52px] items-center gap-1 rounded-2xl px-2"
        style={{ background: "var(--pk-pop)", boxShadow: "var(--pk-shadow)" }}
        data-pk="pill:right"
      >
        <Crumb icon={TbDeviceDesktop} value="Desktop" label="Screen" />
        <Crumb value="25%" label="View" />
        <span className="pk-tool" style={{ color: "var(--pk-ok)" }}>
          <TbPlayerPlay />
        </span>
        <span className="pk-btn" data-kind="ghost">
          Share
        </span>
        <span className="pk-btn" data-kind="ghost">
          Code
        </span>
        <span className="pk-btn" data-kind="primary">
          Publish
        </span>
      </div>
    </header>
  )
}

function RailCrumb({ s }: { s: State }) {
  const labeled = Boolean(s.labeled)
  const left = str(s.left, "tree")
  const rec = Boolean(s.rec) || comboOf(s).some(([, k]) => k !== "Global")
  const items: Array<
    [string, React.ComponentType<{ className?: string }>, string]
  > = labeled
    ? [
        ["tree", TbLayersSubtract, "Tree"],
        ["pages", TbFileText, "Pages"],
        ["components", TbComponents, "Components"],
        ["styles", TbDroplet, "Styles"],
        ["assets", TbPhoto, "Assets"],
        ["data", TbDatabase, "Data"],
        ["copilot", TbSparkles, "Copilot"],
        ["more", TbDots, "More…"],
      ]
    : [
        ["tree", TbLayersSubtract, "Tree"],
        ["styles", TbDroplet, "Styles"],
        ["docs", TbBook, "Docs"],
        ["globals", TbWorld, "Globals"],
        ["more", TbDots, "More"],
        ["settings", TbSettings, "Settings"],
      ]
  return (
    <nav className="pk-rail pk-area-rail" data-pk="rail">
      <span
        className="flex flex-col items-center gap-0.5"
        data-pk="rail:insert"
      >
        <span
          className="pk-tool"
          style={{
            background: rec ? "var(--pk-rec)" : "var(--pk-accent)",
            color: "#fff",
            borderRadius: 99,
          }}
        >
          <TbPlus />
        </span>
        {labeled && (
          <span
            className="text-[10px]"
            style={{ color: rec ? "var(--pk-rec)" : "var(--pk-accent)" }}
          >
            Insert
          </span>
        )}
      </span>
      {items.map(([id, I, label]) => (
        <span
          key={id}
          className="flex flex-col items-center gap-0.5"
          data-pk={`rail:${id}`}
        >
          <span className="pk-tool" aria-pressed={left === id}>
            <I />
          </span>
          {labeled && <span className="pk-faint text-[10px]">{label}</span>}
        </span>
      ))}
      <span className="pk-rail-end" />
      {labeled && (
        <span
          className="pk-tool"
          data-pk="rail:settings"
          aria-pressed={Boolean(s.settings)}
        >
          <TbSettings />
        </span>
      )}
      <span className="pk-tool">
        <TbMessage />
      </span>
      <span className="pk-tool">
        <TbHelp />
      </span>
    </nav>
  )
}

const TREE: Array<TreeNode> = [
  { id: "root", label: "Root", kind: "vstack", open: true },
  { id: "nav", label: "Navigation", kind: "component", depth: 1 },
  { id: "hero", label: "Hero", kind: "vstack", depth: 1, open: true },
  { id: "heading", label: "Welcome", kind: "text", depth: 2 },
  { id: "cta", label: "Button", kind: "component", depth: 2 },
  { id: "grid", label: "Features", kind: "hstack", depth: 1 },
]

function TreePanel({ s }: { s: State }) {
  return (
    <>
      <div className="pk-head">
        <span>Tree</span>
        <span className="pk-btn" data-kind="ghost" data-size="sm">
          View <TbChevronDown className="h-3 w-3" />
        </span>
      </div>
      <Search placeholder="Search…" />
      <Tree nodes={TREE} selected={str(s.treeSel, "hero")} />
    </>
  )
}

const TESTS: Array<[string, string, boolean]> = [
  ["Description", "contains nested links.", false],
  ["Section", "has an inefficient visibility setting.", true],
  ["Select", "has unnecessary variant styles.", true],
  [
    "Section",
    "has sticky positioning, but is a child of an overflow hidden container.",
    false,
  ],
  [
    "Heading",
    "content overrides targeting a screen variant. This can flash while JavaScript hydrates.",
    false,
  ],
]

function TestResults({ s }: { s: State }) {
  const fixed = Number(s.fixed) || 0
  return (
    <div className="pk-scroll flex flex-col" data-pk="tests">
      <div className="pk-head">
        <span>Test Results ({5 - fixed})</span>
        <TbX className="h-3.5 w-3.5 opacity-60" />
      </div>
      {TESTS.map(([el, what, auto], i) => {
        const done = auto && i <= fixed
        return (
          <div
            key={i}
            className="flex gap-2 px-3 py-2.5"
            style={{
              borderTop: "1px solid var(--pk-line)",
              opacity: done ? 0.45 : 1,
            }}
            data-pk={`test:${i}`}
          >
            {done ? (
              <TbCircleCheck
                className="mt-0.5 h-4 w-4"
                style={{ color: "var(--pk-ok)" }}
              />
            ) : (
              <TbAlertTriangle
                className="mt-0.5 h-4 w-4"
                style={{ color: "var(--pk-warn)" }}
              />
            )}
            <span className="flex flex-1 flex-col gap-1.5">
              <span className="leading-4">
                <u>{el}</u> {what}
              </span>
              {auto && !done && (
                <span
                  className="pk-btn w-fit"
                  data-size="sm"
                  data-pk={`autofix:${i}`}
                >
                  Auto-fix
                </span>
              )}
            </span>
          </div>
        )
      })}
      <div className="p-3">
        <span className="pk-btn w-full">Run tests again</span>
      </div>
    </div>
  )
}

function Copilot() {
  return (
    <div className="pk-scroll flex flex-col" data-pk="copilot">
      <div className="pk-head">
        <span className="flex items-center gap-1.5">
          <TbSparkles />
          Copilot
        </span>
        <span className="pk-badge" data-kind="new">
          Beta
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <span
          className="self-end rounded-xl px-3 py-2 text-white"
          style={{ background: "var(--pk-accent)" }}
        >
          Make a pricing section with three plans
        </span>
        <span
          className="rounded-xl px-3 py-2"
          style={{ background: "var(--pk-panel-2)" }}
        >
          Here are three plan cards in a row: Free, Pro, and Team, using your
          project’s tokens. Insert them under the hero?
        </span>
        <span className="pk-btn w-fit" data-kind="primary" data-size="sm">
          Insert
        </span>
      </div>
      <div className="p-2">
        <span className="pk-input" style={{ height: 34 }}>
          <span className="pk-faint">Ask copilot…</span>
        </span>
      </div>
    </div>
  )
}

function Boards({
  rec,
  view,
  s,
}: {
  rec: string
  view: { x: number; y: number; z: number }
  s: State
}) {
  return (
    <div
      className="pk-world"
      style={{
        transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})`,
      }}
    >
      <div
        className="pk-board"
        style={{ left: 60, top: 80, width: 1440, height: 1024 }}
        data-pk="board:desktop"
      >
        <span className="pk-board-label" style={{ fontSize: 22, height: 40 }}>
          Desktop <span className="pk-faint pk-mono">1440 × 1024</span>
        </span>
        <div
          className="pk-board-body"
          style={
            rec === "combo" ? { outline: "4px solid var(--pk-rec)" } : undefined
          }
        >
          <Landing s={s} />
        </div>
      </div>
      <div
        className="pk-board"
        style={{ left: 1560, top: 80, width: 414, height: 864 }}
        data-pk="board:mobile"
      >
        <span
          className="pk-board-label"
          style={{ fontSize: 22, height: 40, color: "var(--pk-rec)" }}
        >
          Mobile-only <span className="pk-faint pk-mono">414 × 864</span>
        </span>
        <div
          className="pk-board-body"
          style={
            rec && rec !== "combo"
              ? { outline: "4px solid var(--pk-rec)" }
              : undefined
          }
        >
          <Landing narrow s={s} />
        </div>
      </div>
    </div>
  )
}

/**
 * The sample landing page, drawn from the scene's state so a team can
 * change it: headline, cta (the button's color), nav (an added link), and
 * features (a fourth card, featureName its title). Parts on the mobile
 * board are named with "m:" first.
 */
function Landing({ narrow, s }: { narrow?: boolean; s: State }) {
  const p = narrow ? "m:" : ""
  // Under the DarkTheme global variant, the page wears its dark theme.
  const dark = comboOf(s).some(([n]) => n === "DarkTheme")
  const features = ["Fast", "Flexible", "Yours"].concat(
    s.features ? [str(s.featureName, "")] : []
  )
  return (
    <div
      className="pk-acme"
      style={{
        fontSize: narrow ? 18 : 22,
        transition: "background 0.5s, color 0.5s",
        ...(dark ? { background: "#0b0d10", color: "#f3f4f6" } : {}),
      }}
    >
      <div
        className="flex items-center justify-between px-10"
        style={{
          height: 88,
          borderBottom: `1px solid ${dark ? "#1f2329" : "#eee"}`,
        }}
      >
        <b style={{ fontSize: 26 }}>Acme</b>
        {!narrow && (
          <span
            className="flex gap-8"
            style={{ color: "#6b7280" }}
            data-pk="land:nav"
          >
            <span>Product</span>
            <span>Pricing</span>
            <span>Docs</span>
            {Boolean(s.nav) && (
              <span className="pk-land-new">{str(s.nav)}</span>
            )}
          </span>
        )}
        <span
          className="rounded-lg px-5 py-2.5 text-white"
          style={{ background: "#111827" }}
        >
          Sign up
        </span>
      </div>
      <div
        className="flex flex-col gap-6 px-10 py-20"
        style={{
          alignItems: narrow ? "flex-start" : "center",
          textAlign: narrow ? "left" : "center",
        }}
      >
        <span
          style={{
            fontSize: narrow ? 44 : 80,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: str(s.h1color) || undefined,
            transition: "color 0.5s",
          }}
          data-pk={`${p}land:headline`}
        >
          {str(s.headline, "Welcome to Acme")}
        </span>
        <span style={{ color: "#6b7280", maxWidth: 640 }}>
          The internal tools your team actually wants to use.
        </span>
        <span
          className="rounded-xl px-8 py-4 text-white"
          style={{
            background: str(s.cta, "#2563eb"),
            transition: "background 0.5s",
          }}
          data-pk={`${p}land:cta`}
        >
          Get started
        </span>
      </div>
      <div
        className="grid gap-6 px-10"
        style={{
          gridTemplateColumns: narrow
            ? "1fr"
            : `repeat(${features.length}, 1fr)`,
        }}
        data-pk={`${p}land:features`}
      >
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl p-6"
            style={{
              background: dark ? "#16191e" : "#f3f4f6",
              animation: i === 3 ? "pk-pop-in 0.3s ease-out both" : undefined,
            }}
            data-pk={`${p}land:feature-${i}`}
          >
            <b style={{ minHeight: "1.2em" }}>{f}</b>
            <span style={{ color: "#6b7280", fontSize: 16 }}>
              Built with real components and real data.
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RightCrumb({ s }: { s: State }) {
  const tab = str(s.tab, "Styles")
  return (
    <div
      className="pk-panel pk-area-right"
      style={{ borderLeft: "1px solid var(--pk-line)" }}
      data-pk="right"
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{
            background: "var(--pk-accent-bg)",
            color: "var(--pk-accent)",
          }}
        >
          <TbDiamond className="h-4 w-4" />
        </span>
        <span className="flex flex-col">
          <b className="font-semibold">Hero</b>
          <span className="pk-faint text-[11px]">Vertical stack</span>
        </span>
        <span className="pk-btn ml-auto" data-size="sm" data-pk="apply">
          Apply <TbChevronDown className="h-3 w-3" />
        </span>
      </div>
      <div
        className="flex gap-1 px-3 pb-2"
        style={{ borderBottom: "1px solid var(--pk-line)" }}
        data-pk="right:tabs"
      >
        {["Styles", "Attributes", "Behaviors"].map((t) => (
          <span key={t} className="pk-tab" aria-selected={t === tab}>
            {t}
          </span>
        ))}
      </div>
      <div className="pk-scroll">
        <div className="pk-section" data-pk="r:layout">
          <div className="pk-section-head">
            <span>Layout</span>
          </div>
          <Field label="Direction">
            <Input>Vertical</Input>
          </Field>
          <Field label="Align">
            <Input>Center</Input>
          </Field>
          <Field label="Gap">
            <Input set>24px</Input>
          </Field>
        </div>
        <div className="pk-section" data-pk="r:size">
          <div className="pk-section-head">
            <span>Size</span>
          </div>
          <Field label="Width">
            <Input rec={Boolean(s.rec)}>{s.rec ? "100%" : "Stretch"}</Input>
          </Field>
          <Field label="Height">
            <Input>Hug</Input>
          </Field>
        </div>
        <div className="pk-section" data-pk="r:spacing">
          <div className="pk-section-head">
            <span>Spacing</span>
          </div>
          <Field label="Padding">
            <Input rec={Boolean(s.rec && s.tightPad)}>
              {s.rec && s.tightPad ? "48 24" : "80 40"}
            </Input>
          </Field>
        </div>
        <div className="pk-section" data-pk="r:background">
          <div className="pk-section-head">
            <span>Background</span>
          </div>
          <Field label="Fill">
            <Input set>
              <span className="pk-swatch" style={{ background: "#fff" }} />
              surface
            </Input>
          </Field>
        </div>
      </div>
    </div>
  )
}

function ProjectMenu({ s }: { s: State }) {
  return (
    <>
      <Menu
        x={56}
        y={46}
        w={210}
        pk="proj-menu"
        hover={s.branches ? "Main" : undefined}
        items={[
          { label: "Main", kbd: "›", icon: TbGitBranch, pk: "proj:branch" },
          { label: "File", kbd: "›" },
          { label: "Edit", kbd: "›" },
          { label: "View", kbd: "›" },
          { label: "Help", kbd: "›" },
          "sep",
          { label: "Configure project…" },
          { label: "Enable localization…" },
        ]}
      />
      {s.branches && (
        <Pop x={270} y={46} w={300} pk="branches">
          <div className="pk-head">
            <span>Branches</span>
            <span className="pk-btn" data-size="sm">
              <TbPlus />
              New
            </span>
          </div>
          <Search placeholder="Search…" />
          <div className="pk-menu-label px-4">Active</div>
          {[
            ["main", true],
            ["feat/new-layout", false],
            ["feat/pricing", false],
          ].map(([b, cur]) => (
            <div
              key={b as string}
              className="pk-menu-item mx-1"
              data-state={s.branchSub === b ? "hover" : undefined}
              data-pk={`branch:${b as string}`}
            >
              {cur ? <TbCheck /> : <TbGitBranch />}
              {b as string}
              {!cur && <Avatars names={["K"]} />}
            </div>
          ))}
          <div className="pb-2" />
        </Pop>
      )}
      {s.branchSub && (
        <Menu
          x={574}
          y={130}
          w={200}
          pk="branch-menu"
          hover={str(s.subHover)}
          items={[
            { label: "Switch to this branch" },
            { label: "Update from main" },
            { label: "Save a checkpoint" },
            "sep",
            { label: "Review and merge…", pk: "branch:merge" },
            { label: "Archive" },
            { label: "Delete" },
          ]}
        />
      )}
    </>
  )
}

function PublishDialog({ ran }: { ran: boolean }) {
  const steps: Array<[string, boolean]> = [
    ["Save version", true],
    ["Run tests", true],
    ["Deploy site", false],
    ["Call webhooks", false],
    ["Push to GitHub", false],
  ]
  return (
    <>
      <div className="pk-scrim" />
      <div
        className="pk-dialog"
        style={{ width: 620, height: 560 }}
        data-pk="publish-dialog"
      >
        <div className="flex h-full">
          <div
            className="flex w-48 flex-col gap-1 p-4"
            style={{ borderRight: "1px solid var(--pk-line)" }}
            data-pk="publish:steps"
          >
            <b className="mb-2 text-[15px]">Publish</b>
            {steps.map(([l, on]) => (
              <span key={l} className="flex items-center gap-2 py-1">
                <span
                  className="grid h-4 w-4 place-items-center rounded"
                  style={{
                    background: on ? "var(--pk-accent)" : "var(--pk-panel-3)",
                  }}
                >
                  {on && <TbCheck className="h-3 w-3 text-white" />}
                </span>
                {l}
              </span>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="flex flex-col gap-2" data-pk="publish:version">
              <b className="font-semibold">Save a new version</b>
              <span className="pk-muted text-[11px] leading-4">
                Versions let you restore projects later, and let other projects
                import this one to use its components.
              </span>
              <Field label="Changes">
                <span className="flex items-center gap-2">
                  <span
                    className="pk-badge"
                    style={{
                      background: "rgb(245 184 74 / 0.18)",
                      color: "var(--pk-warn)",
                    }}
                  >
                    New changes
                  </span>
                  <span className="pk-faint">Review →</span>
                </span>
              </Field>
              <Field label="Version">
                <Input>0.0.2</Input>
              </Field>
              <Field label="Description">
                <Input mono={false}>
                  <span className="pk-faint">What changed?</span>
                </Input>
              </Field>
            </div>
            <div className="flex flex-col gap-2" data-pk="publish:tests">
              <b className="font-semibold">Run tests</b>
              <span className="pk-muted text-[11px]">
                Check for errors and optimize before publishing.
              </span>
              {ran ? (
                <span className="flex items-center gap-2">
                  <span
                    className="pk-badge"
                    style={{
                      background: "rgb(245 184 74 / 0.18)",
                      color: "var(--pk-warn)",
                    }}
                  >
                    <TbAlertTriangle className="mr-1 h-3 w-3" />5 warnings
                  </span>
                  <span className="pk-faint" data-pk="publish:review">
                    Review results →
                  </span>
                </span>
              ) : (
                <span className="pk-btn w-fit" data-pk="publish:run">
                  Run tests
                </span>
              )}
            </div>
            <span className="mt-auto flex justify-end gap-2">
              <span className="pk-btn" data-kind="ghost">
                Cancel
              </span>
              <span className="pk-btn" data-kind="primary" data-pk="publish:go">
                Publish project
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

function MergeDialog() {
  const rows: Array<[string, string, number]> = [
    ["Homepage", "Some changes were merged", 0],
    ["Primary", "Token", 1],
    ["Secondary", "Token", 0],
  ]
  return (
    <>
      <div className="pk-scrim" />
      <div className="pk-dialog" style={{ width: 560 }} data-pk="merge">
        <div className="pk-dialog-head">
          <span>Review changes</span>
          <TbX className="h-4 w-4 opacity-60" />
        </div>
        <div className="flex flex-col gap-3 p-4">
          <span className="pk-muted">
            Conflicting changes: pick the branch to keep each change from.
          </span>
          <div
            className="grid grid-cols-[1fr_110px_110px] items-center gap-y-2 text-[12px]"
            data-pk="merge:table"
          >
            <span className="pk-faint">Item</span>
            <span className="pk-faint">main</span>
            <span className="pk-faint">feat/pricing</span>
            {rows.map(([n, sub, pick]) => [
              <span key={n} className="flex flex-col">
                <b className="font-medium">{n}</b>
                <span className="pk-faint text-[11px]">{sub}</span>
              </span>,
              <span
                key={n + "a"}
                className="pk-btn w-fit"
                data-size="sm"
                data-kind={pick === 0 ? "primary" : undefined}
              >
                {pick === 0 && <TbCheck />}Keep
              </span>,
              <span
                key={n + "b"}
                className="pk-btn w-fit"
                data-size="sm"
                data-kind={pick === 1 ? "primary" : undefined}
              >
                {pick === 1 && <TbCheck />}Keep
              </span>,
            ])}
          </div>
        </div>
        <div className="pk-dialog-foot">
          <span className="pk-btn" data-kind="ghost">
            Cancel
          </span>
          <span className="pk-btn" data-kind="primary">
            Merge into main
          </span>
        </div>
      </div>
    </>
  )
}

function LogicPanel({ flow }: { flow: boolean }) {
  const col = (title: string, rows: Array<[string, string]>, pk: string) => (
    <div
      className="flex min-w-0 flex-1 flex-col"
      style={{ borderRight: "1px solid var(--pk-line)" }}
      data-pk={pk}
    >
      <div className="pk-head">
        <span>{title}</span>
        <TbPlus className="h-3.5 w-3.5 opacity-60" />
      </div>
      {rows.map(([a, b]) => (
        <div key={a} className="pk-variant">
          <span className="pk-mono pk-faint">{b}</span>
          {a}
        </div>
      ))}
    </div>
  )
  return (
    <div
      className="absolute right-0 bottom-0 left-0 flex"
      style={{
        height: 290,
        background: "var(--pk-panel)",
        borderTop: "1px solid var(--pk-line)",
      }}
      data-pk="logic"
    >
      <div className="flex" style={{ width: flow ? "48%" : "100%" }}>
        {col("Local state", [["Count", "#"]], "logic:state")}
        {col(
          "Props",
          [
            ["label", "Aa"],
            ["onChange", "ƒ"],
          ],
          "logic:props"
        )}
        {col(
          "Interactions",
          [
            ["OnClick", "▶"],
            ["OnHover", "▶"],
          ],
          "logic:interactions"
        )}
      </div>
      {flow && (
        <div
          className="relative flex-1"
          style={{
            backgroundImage:
              "radial-gradient(var(--pk-dots) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
          data-pk="logic:flow"
        >
          <span
            className="absolute rounded-full px-3 py-1 text-[11px] font-semibold text-white"
            style={{ left: 24, top: 120, background: "var(--pk-ok)" }}
          >
            Entry
          </span>
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            <path
              d="M84 132 C 120 132, 120 132, 150 132"
              stroke="var(--pk-fg-3)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M370 132 C 400 132, 400 132, 420 132"
              stroke="var(--pk-fg-3)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          <div
            className="pk-card absolute flex w-[220px] flex-col gap-2 p-3"
            style={{ left: 150, top: 56, background: "var(--pk-pop)" }}
            data-pk="logic:node"
          >
            <b className="flex items-center gap-1.5 font-semibold">
              <TbPlayerPlay className="h-3.5 w-3.5" />
              OnClick
            </b>
            <span
              className="rounded-lg p-2"
              style={{ background: "var(--pk-panel-2)" }}
            >
              <span className="pk-faint text-[10px] uppercase">
                Set local state
              </span>
              <span className="block">
                Count = <span className="pk-mono">Count + 1</span>
              </span>
            </span>
          </div>
          <span
            className="absolute rounded-full px-3 py-1 text-[11px] font-semibold text-white"
            style={{ left: 420, top: 120, background: "#ec4899" }}
          >
            Exit
          </span>
        </div>
      )}
    </div>
  )
}

function Palette({ q }: { q: string }) {
  const rows: Array<
    [React.ComponentType<{ className?: string }>, string, boolean?]
  > = [
    [TbSparkles, `Ask Plasmic Copilot${q ? `: ${q}` : "…"}`, true],
    [TbPlus, `Insert element, component, template${q ? `: ${q}` : "…"}`],
    [TbPlus, "New page, component, interaction, page variant…"],
    [TbPlus, "New image, icon, mixin, token…"],
    [TbPencil, "Wrap in container, section, slot, link…"],
    [TbPalette, "Apply repeat, mixin, element state, custom behavior…"],
    [TbPencil, "Edit name, settings, design…"],
    [TbBook, "Search the docs…"],
  ]
  return (
    <Pop x={560} y={46} w={420} pk="palette">
      <Search value={q} focus placeholder="Search…" pk="palette:search" />
      {rows.map(([I, l, beta], i) => (
        <div
          key={i}
          className="pk-menu-item mx-1"
          data-state={i === 0 ? "hover" : undefined}
          data-pk={`pal:${i}`}
        >
          <I />
          {l}
          {beta && (
            <span
              className="pk-badge ml-auto"
              data-kind="new"
              style={{ background: "rgb(255 255 255 / 0.2)", color: "#fff" }}
            >
              Beta
            </span>
          )}
        </div>
      ))}
      <div className="pb-1.5" />
    </Pop>
  )
}

/**
 * The sample CRM, as a role would see it (viewAs): Anonymous meets the
 * login, Normal has no Staff page, and Admin sees everything.
 */
function Crm({
  viewAs = "",
  type = "Cards",
}: {
  viewAs?: string
  /** The collection's Type: how its items are laid out. */
  type?: string
}) {
  const anon = viewAs === "Anonymous"
  const cos = [
    "Bluth Company",
    "Dunder Mifflin",
    "Greendale College",
    "Nakatomi Corp.",
    "Pied Piper",
    "Sterling Cooper",
    "Vandelay Industries",
  ]
  return (
    <div
      className="absolute inset-6 flex overflow-hidden rounded-lg"
      style={{
        background: "#0b0d10",
        color: "#e5e7eb",
        boxShadow: "0 1px 3px rgb(0 0 0 / 0.4)",
      }}
      data-pk="crm"
    >
      <div
        className="flex w-44 flex-col gap-1 p-3"
        style={{ borderRight: "1px solid #1f2329" }}
      >
        <b className="mb-3 text-[14px]">Acme CRM</b>
        {["Accounts", "Contacts", "Contracts", "Staff"]
          .filter((n) => !(n === "Staff" && (viewAs === "Normal" || anon)))
          .map((n, i) => (
            <span
              key={n}
              className="rounded-md px-2 py-1.5"
              style={i === 0 ? { background: "#1f2329" } : { color: "#9ca3af" }}
              data-pk={`crm:nav:${n.toLowerCase()}`}
            >
              {n}
            </span>
          ))}
      </div>
      {anon ? (
        <div className="grid flex-1 place-items-center" data-pk="crm:login">
          <div
            className="flex w-[300px] flex-col gap-3 rounded-xl p-6"
            style={{
              background: "#14171c",
              animation: "pk-pop-in 0.3s ease-out both",
            }}
          >
            <b className="text-[16px]">Log in to Acme CRM</b>
            <span style={{ color: "#9ca3af" }}>This page needs a login.</span>
            <span
              className="rounded-lg px-3 py-2"
              style={{ background: "#0b0d10", color: "#6b7280" }}
            >
              you@acme.com
            </span>
            <span
              className="rounded-lg px-3 py-2 text-center text-white"
              style={{ background: "#2563eb" }}
            >
              Continue with email
            </span>
            <span
              className="rounded-lg px-3 py-2 text-center"
              style={{ boxShadow: "inset 0 0 0 1px #2a2f37" }}
            >
              Continue with Google
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 p-5">
          <span className="text-[12px]" style={{ color: "#9ca3af" }}>
            Home / Accounts
          </span>
          <span
            className="rounded-lg px-3 py-2 text-[12px]"
            style={{ background: "#14171c", color: "#6b7280" }}
          >
            Search…
          </span>
          <CrmList cos={cos} type={type} />
        </div>
      )}
    </div>
  )
}

const CITIES = [
  "Newport Beach, CA",
  "Scranton, PA",
  "Los Angeles, CA",
  "Los Angeles, CA",
  "Palo Alto, CA",
  "New York City, NY",
  "New York City, NY",
]

/** The bound list, laid out as its collection's Type says. */
function CrmList({ cos, type }: { cos: Array<string>; type: string }) {
  const thumb = (
    <span
      className="h-8 w-8 flex-none rounded-md"
      style={{ background: "linear-gradient(135deg,#334155,#64748b)" }}
    />
  )
  const frame: React.CSSProperties = {
    outline: "1.5px dashed var(--pk-accent)",
    outlineOffset: 4,
    animation: "pk-fade 0.35s ease-out both",
  }
  if (type === "Table")
    return (
      <div
        key={type}
        className="flex flex-col"
        style={frame}
        data-pk="crm:list"
      >
        <div
          className="grid grid-cols-[2fr_1.4fr_1fr] gap-3 px-3 py-2 text-[11px]"
          style={{ color: "#6b7280" }}
        >
          <span>Name</span>
          <span>Location</span>
          <span>Created</span>
        </div>
        {cos.map((c, i) => (
          <div
            key={c}
            className="grid grid-cols-[2fr_1.4fr_1fr] gap-3 px-3 py-2"
            style={{ borderTop: "1px solid #1f2329" }}
          >
            <b className="text-[13px]">{c}</b>
            <span style={{ color: "#9ca3af" }}>{CITIES[i]}</span>
            <span style={{ color: "#6b7280" }}>0{(i % 9) + 1}/20/2021</span>
          </div>
        ))}
      </div>
    )
  if (type === "List")
    return (
      <div
        key={type}
        className="flex flex-col gap-1"
        style={frame}
        data-pk="crm:list"
      >
        {cos.map((c, i) => (
          <div
            key={c}
            className="flex items-center gap-3 rounded-md px-3 py-2"
            style={{ background: i === 0 ? "#1f2329" : undefined }}
          >
            {thumb}
            <span className="flex flex-col">
              <b className="text-[13px]">{c}</b>
              <span className="text-[11px]" style={{ color: "#6b7280" }}>
                {CITIES[i]}
              </span>
            </span>
          </div>
        ))}
      </div>
    )
  if (type === "Kanban")
    return (
      <div
        key={type}
        className="grid grid-cols-3 gap-3"
        style={frame}
        data-pk="crm:list"
      >
        {["Lead", "Active", "Closed"].map((col, k) => (
          <div
            key={col}
            className="flex flex-col gap-2 rounded-lg p-2"
            style={{ background: "#14171c" }}
          >
            <span className="px-1 text-[11px]" style={{ color: "#9ca3af" }}>
              {col}
            </span>
            {cos
              .filter((_, i) => i % 3 === k)
              .map((c) => (
                <div
                  key={c}
                  className="rounded-md p-2"
                  style={{ background: "#1f2329" }}
                >
                  <b className="text-[12px]">{c}</b>
                </div>
              ))}
          </div>
        ))}
      </div>
    )
  return (
    <div
      key={type}
      className="grid grid-cols-2 gap-2"
      style={frame}
      data-pk="crm:list"
    >
      {cos.map((c) => (
        <div
          key={c}
          className="flex items-center gap-3 rounded-lg p-3"
          style={{ background: "#14171c" }}
        >
          {thumb}
          <span className="flex flex-col">
            <b className="text-[13px]">{c}</b>
            <span className="text-[11px]" style={{ color: "#6b7280" }}>
              Collection · Companies
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

/** A selected collection's panel: its data, its Type as a grid, its fields. */
function CollectionPanel({ type }: { type: string }) {
  const types: Array<[string, React.ComponentType<{ className?: string }>]> = [
    ["Cards", TbLayoutGrid],
    ["List", TbList],
    ["Table", TbTable],
    ["Inbox", TbInbox],
    ["Kanban", TbLayoutKanban],
    ["Custom", TbDots],
  ]
  return (
    <div
      className="pk-panel pk-area-right"
      style={{ borderLeft: "1px solid var(--pk-line)" }}
      data-pk="coll"
    >
      <div className="pk-head" style={{ minHeight: 56 }}>
        <span className="flex flex-col leading-4">
          <b className="font-semibold">Companies</b>
          <span className="pk-faint text-[11px]">Collection</span>
        </span>
      </div>
      <div className="flex flex-col gap-3 p-3">
        <span className="grid grid-cols-[56px_1fr] items-center gap-2">
          <span className="pk-muted">Data</span>
          <span className="pk-input">
            <TbDatabase /> Demo Data <TbChevronDown className="ml-auto" />
          </span>
        </span>
        <span
          className="grid grid-cols-[56px_1fr] items-start gap-2"
          data-pk="coll:types"
        >
          <span className="pk-muted pt-2">Type</span>
          <span className="grid grid-cols-3 gap-1.5">
            {types.map(([t, I]) => (
              <span
                key={t}
                className="pk-ctype"
                aria-pressed={t === type}
                data-pk={`ctype:${t.toLowerCase()}`}
              >
                <I />
                {t}
              </span>
            ))}
          </span>
        </span>
      </div>
      <div
        className="pk-section-head"
        style={{ height: 36, padding: "0 12px" }}
      >
        <span>Fields</span>
        <TbPlus className="h-3.5 w-3.5 opacity-60" />
      </div>
      {[
        ["id", "Key"],
        ["name", "Text"],
        ["location › city", "Text"],
        ["location › state", "Text"],
        ["avatar", "Image"],
      ].map(([k, t]) => (
        <span key={k} className="flex h-8 items-center justify-between px-3">
          <span className="pk-mono">{k}</span>
          <span className="pk-faint">{t}</span>
        </span>
      ))}
    </div>
  )
}
