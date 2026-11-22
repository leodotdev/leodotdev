import {
  TbAdjustmentsHorizontal,
  TbArrowsMaximize,
  TbChevronDown,
  TbCircleDot,
  TbColumns,
  TbComponents,
  TbCopy,
  TbLayoutRows,
  TbPalette,
  TbPlus,
  TbPointer,
  TbRectangle,
  TbRotate,
  TbTrash,
  TbTriangle,
  TbTypography,
} from "react-icons/tb"
import {
  AcmeButton,
  AcmeHome,
  AcmeLogin,
} from "@/components/work/plasmic/kit/acme"
import {
  CodeDialog,
  InsertPanel,
  Menu,
  PublishPop,
  SharePop,
  Toast,
} from "@/components/work/plasmic/kit/overlays"
import {
  Board,
  Canvas,
  Chip,
  Field,
  IconBtn,
  Input,
  Panel,
  PanelHead,
  Rail,
  Search,
  Section,
  Seg,
  Sel,
  Studio,
  Tabs,
  TopBar,
  TopBarEnd,
  Tree,
  Variants,
} from "@/components/work/plasmic/kit/studio"
import type {
  Layout,
  RailItem,
  TreeNode,
} from "@/components/work/plasmic/kit/studio"
import { Activity20 } from "@/components/work/plasmic/kit/activity20"
import { ProjectsPage } from "@/components/work/plasmic/kit/pages"
import type { State } from "@/components/work/plasmic/types"

// The editor, composed from the kit and drawn entirely from a scene's
// state, so every scene of every year is this one component in a different
// state and layout (the files' layouts: classic, rail, ribbon). The state's
// keys are listed on `Editor`.

/** The login page's tree. */
export const LOGIN_TREE: Array<TreeNode> = [
  { id: "page", label: "Login Page", kind: "component", open: true },
  { id: "root", label: "Root", kind: "vstack", depth: 1, open: true },
  { id: "header", label: "Header", kind: "component", depth: 2, open: true },
  { id: "title", label: "Title slot", kind: "slot", depth: 3 },
  { id: "heading", label: "Welcome back", kind: "text", depth: 2 },
  { id: "subtitle", label: "Log in to keep building.", kind: "text", depth: 2 },
  { id: "email", label: "TextInput", kind: "component", depth: 2 },
  { id: "password", label: "TextInput", kind: "component", depth: 2 },
  { id: "button", label: "Button", kind: "component", depth: 2 },
]

/** Where things are on the canvas's world (its own pixels, before pan and zoom). */
export const BOARDS = {
  login: { x: 96, y: 72, w: 360, h: 640 },
  button: { x: 520, y: 72, w: 280, h: 120 },
  home: { x: 520, y: 252, w: 320, h: 460 },
}
/** Boxes inside the login artboard, from the Acme page's own layout. */
const IN_LOGIN: Record<string, [number, number, number, number]> = {
  header: [0, 0, 360, 52],
  title: [40, 17, 100, 18],
  heading: [16, 72, 328, 26],
  subtitle: [16, 110, 328, 18],
  email: [16, 140, 328, 60],
  password: [16, 212, 328, 60],
  button: [16, 284, 328, 40],
  dropped: [16, 336, 328, 40],
  root: [0, 0, 360, 640],
}

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)
const num = (v: State[string], d: number) => (typeof v === "number" ? v : d)

/**
 * The editor. State keys (all optional):
 * - layout: "classic" | "rail" | "ribbon"; left: "tree" | "insert" |
 *   "gallery" | "assets" | "none"; leftFloat: the left panel floats (rail)
 * - q, qFocus: the left panel's search; sel, hover, drop: tree ids
 * - dropped: a Sign up button added to the login page
 * - variant: the login button's look; accent: the header's color
 * - right: "design" | "none"; vpanel: the variants panel open; typeGroup:
 *   the Type group made; rec: the variant recording; on: variants viewed
 * - pos: "free" | "auto"; dir: "row" | "column"; fill: the button's color
 * - zx, zy, zz: the canvas's pan and zoom
 * - menu: a context menu ("context"); share, invite, roles; publish,
 *   note, published; code; toast; topHover; tool; boards: "all"
 */
export function Editor({ s }: { s: State }) {
  const layout = str(s.layout, "classic") as Layout
  const left = str(s.left, "tree")
  const sel = str(s.sel)
  const rec = str(s.rec)
  const variant = str(s.variant, "primary") as
    "primary" | "secondary" | "hover" | "disabled"
  const zz = num(s.zz, 1)
  const view = { x: num(s.zx, 0), y: num(s.zy, 0), z: zz }
  const login = BOARDS.login
  const inLogin = (id: string) => {
    const r = IN_LOGIN[id] as (typeof IN_LOGIN)[string] | undefined
    return r ? { x: login.x + r[0], y: login.y + r[1], w: r[2], h: r[3] } : null
  }
  const selBox = sel ? inLogin(sel) : null
  const hoverBox = s.canvasHover ? inLogin(str(s.canvasHover)) : null
  const accent = str(s.accent, "#2563eb")

  // Moved: the subtitle dragged up one, above the heading.
  const order = s.moved
    ? LOGIN_TREE.map((n) =>
        n.id === "heading"
          ? LOGIN_TREE[5]
          : n.id === "subtitle"
            ? LOGIN_TREE[4]
            : n
      )
    : LOGIN_TREE
  const tree = order
    .filter(
      (n) => !s.q || n.label.toLowerCase().includes(str(s.q).toLowerCase())
    )
    .concat(
      s.dropped
        ? [
            {
              id: "dropped",
              label: "Button",
              kind: "component",
              depth: 2,
            },
          ]
        : []
    )

  const leftPanel =
    left === "none" ? null : (
      <Panel
        area="left"
        pk="left"
        float={
          s.leftFloat
            ? {
                left: 58,
                top: 54,
                width: 256,
                height: left === "activity" ? 750 : 600,
                position: "absolute",
              }
            : undefined
        }
      >
        {layout === "classic" && (
          <Tabs
            items={["Tree", "Gallery", "Assets"]}
            active={
              left === "gallery"
                ? "Gallery"
                : left === "assets"
                  ? "Assets"
                  : "Tree"
            }
            hover={str(s.tabHover)}
          />
        )}
        {left === "activity" ? (
          <Activity20 s={s} />
        ) : left === "insert" ? (
          <InsertPanel
            query={str(s.q)}
            focus={Boolean(s.qFocus)}
            selected={str(s.insertSel)}
          />
        ) : left === "assets" ? (
          <Assets s={s} />
        ) : left === "gallery" ? (
          <Gallery />
        ) : (
          <>
            <PanelHead title="Login Page" pk="arena">
              <IconBtn icon={TbPlus} pk="tree:add" />
            </PanelHead>
            <Search
              value={str(s.q)}
              focus={Boolean(s.qFocus)}
              pk="tree:search"
            />
            <Tree
              nodes={tree}
              selected={sel}
              hover={str(s.hover)}
              drop={str(s.drop)}
            />
          </>
        )}
      </Panel>
    )

  return (
    <Studio layout={layout}>
      <TopBar
        tool={(str(s.tool, "select") || "select") as "select"}
        hover={str(s.topHover)}
        right={
          <TopBarEnd
            hover={str(s.topHover)}
            publish={layout !== "classic"}
            zoom={zz}
          />
        }
      />
      {layout === "rail" && (
        <Rail
          active={
            (left === "none"
              ? undefined
              : left === "activity"
                ? "versions"
                : left === "assets"
                  ? "tokens"
                  : left) as RailItem | undefined
          }
          hover={str(s.railHover)}
        />
      )}
      {layout !== "rail" && leftPanel}
      <Canvas
        rec={Boolean(rec)}
        view={view}
        over={
          <>
            {layout === "rail" && leftPanel}
            {s.vpanel && <VariantsFloat s={s} />}
            {rec && (
              <div className="pk-canvas-bar" data-pk="recbar">
                <Chip kind="rec">REC</Chip>
                <span>
                  Recording <b>{rec}</b> on Button
                </span>
                <span className="pk-btn" data-size="sm" data-pk="stop-rec">
                  Stop
                </span>
              </div>
            )}
            <span
              className="pk-zoom absolute bottom-3 left-3 rounded-lg"
              data-pk="zoom-level"
              style={{
                background: "var(--pk-pop)",
                boxShadow: "var(--pk-shadow)",
              }}
            >
              <TbArrowsMaximize className="h-3.5 w-3.5" />
              {Math.round(zz * 100)}%
            </span>
          </>
        }
      >
        <Board
          {...login}
          label="Login Page"
          kind="component"
          size="375 × 667"
          pk="board:login"
          covered={sel === "root"}
        >
          <AcmeLogin
            accent={accent}
            button={variant}
            extra={Boolean(s.dropped)}
            title={str(s.title, "Log in to Acme")}
          />
        </Board>
        {s.boards === "arena" && <Arena accent={accent} />}
        {s.boards === "all" && (
          <>
            <Board
              {...BOARDS.button}
              label="Button"
              kind="component"
              pk="board:button"
            >
              <AcmeButton accent={accent} kind={variant} />
            </Board>
            <Board {...BOARDS.home} label="Home" pk="board:home">
              <AcmeHome accent={accent} />
            </Board>
          </>
        )}
        {hoverBox && <Sel {...hoverBox} kind="hover" />}
        {selBox && (
          <Sel
            {...selBox}
            kind={
              rec
                ? "rec"
                : sel === "button" || sel === "header" || sel === "dropped"
                  ? "component"
                  : undefined
            }
            tag={
              <>
                {sel === "root" ? (
                  <TbLayoutRows className="h-3 w-3" />
                ) : sel === "subtitle" || sel === "heading" ? (
                  <TbTypography className="h-3 w-3" />
                ) : sel === "title" ? (
                  <TbCircleDot className="h-3 w-3" />
                ) : (
                  <TbComponents className="h-3 w-3" />
                )}
                {sel === "header"
                  ? "Header"
                  : sel === "title"
                    ? "Title slot"
                    : sel === "root"
                      ? "Root"
                      : sel === "subtitle" || sel === "heading"
                        ? "Text"
                        : "Button"}
              </>
            }
            size={
              s.sizeTag
                ? `${Math.round(selBox.w)} × ${Math.round(selBox.h)}`
                : undefined
            }
            pk="selection"
          />
        )}
      </Canvas>
      {str(s.right, "design") === "design" && <RightDesign s={s} />}
      {Boolean(s.zoomMenu) && (
        <Menu
          x={276}
          y={664}
          w={200}
          pk="zoom-menu"
          hover={str(s.menuHover)}
          items={[
            { label: "Zoom in", kbd: "⌘+", pk: "zoom:in" },
            { label: "Zoom out", kbd: "⌘−", pk: "zoom:out" },
            { label: "Zoom to 100%", kbd: "⌘0", pk: "zoom:100" },
            "sep",
            { label: "Zoom to fit", kbd: "⇧1", pk: "zoom:fit" },
            { label: "Zoom to selection", kbd: "⇧2", pk: "zoom:sel" },
          ]}
        />
      )}
      {Boolean(s.omni) && <Omnibar q={str(s.omniQ)} />}
      {s.menu === "context" && (
        <Menu
          x={num(s.menuX, 420)}
          y={num(s.menuY, 300)}
          hover={str(s.menuHover)}
          items={[
            { label: "Copy", icon: TbCopy, kbd: "⌘C" },
            { label: "Paste styles", disabled: true },
            "sep",
            { label: "Make component", icon: TbComponents, kbd: "⌥⌘K" },
            { label: "Wrap in stack", icon: TbLayoutRows },
            "sep",
            { label: "Delete", icon: TbTrash, kbd: "⌫" },
          ]}
        />
      )}
      {s.share && (
        <SharePop
          x={1440 - 360}
          y={50}
          invite={str(s.invite)}
          focus={Boolean(s.inviteFocus)}
          role={Boolean(s.roles)}
        />
      )}
      {s.publish && (
        <PublishPop
          x={1440 - 340}
          y={50}
          note={str(s.note)}
          focus={Boolean(s.noteFocus)}
          done={Boolean(s.published)}
        />
      )}
      {s.code && <CodeDialog />}
      {s.toast && <Toast>{str(s.toast)}</Toast>}
    </Studio>
  )
}

/** The right panel's Design tab, for the selection. */
function RightDesign({ s }: { s: State }) {
  const sel = str(s.sel, "button")
  const rec = str(s.rec)
  const name =
    sel === "header"
      ? "Header"
      : sel === "title"
        ? "Title slot"
        : sel === "root"
          ? "Root"
          : "Button"
  const pos = str(s.pos, "auto")
  const dir = str(s.dir, "column")
  const fill = str(s.fill, str(s.accent, "#2563eb"))
  return (
    <Panel area="right" pk="right">
      <PanelHead
        pk="right:head"
        title={
          <span className="flex items-center gap-2">
            <TbComponents style={{ color: "var(--pk-component)" }} />
            {name}
            <span className="pk-faint font-normal">Component</span>
          </span>
        }
      >
        <IconBtn icon={TbAdjustmentsHorizontal} />
      </PanelHead>
      <div className="flex gap-1 px-3 pb-2">
        {["Design", "Variants", "Props"].map((t) => (
          <span
            key={t}
            className="pk-tab"
            aria-selected={t === (s.vtab ? "Variants" : "Design")}
            data-pk={`rtab:${t.toLowerCase()}`}
          >
            {t}
          </span>
        ))}
      </div>
      {s.vtab ? (
        <div className="pk-scroll">
          <Variants
            groups={[
              ...(s.typeGroup === false
                ? []
                : [{ name: "Type", options: ["Primary", "Secondary"] }]),
              {
                name: "States",
                icon: "state" as const,
                options: ["Hover", "Pressed", "Disabled"],
              },
              {
                name: "Screen",
                icon: "global" as const,
                options: ["Mobile", "Desktop"],
              },
            ]}
            on={str(s.on).split(",").filter(Boolean)}
            rec={rec}
            hover={str(s.vHover)}
          />
          <div className="pk-variant pk-faint" data-pk="variant:new-group">
            <TbPlus />
            New variant group
          </div>
        </div>
      ) : (
        <div className="pk-scroll">
          <Section title="Variants" pk="sec:variants" add={false}>
            <div className="pk-chips">
              <Chip>Base</Chip>
              {rec && <Chip kind="rec">{rec}</Chip>}
              {str(s.on)
                .split(",")
                .filter(Boolean)
                .map((v) => (
                  <Chip key={v}>{v}</Chip>
                ))}
            </div>
          </Section>
          <Section title="Size" pk="sec:size">
            <Field label="Width">
              <Seg items={["Fixed", "Stretch", "Wrap"]} pressed={1} />
            </Field>
            <Field label="Height">
              <Input>40px</Input>
            </Field>
          </Section>
          <Section title="Position" pk="sec:position">
            <Field label="Type">
              <Seg
                items={["Auto", "Free"]}
                pressed={pos === "free" ? 1 : 0}
                pk="pos:type"
              />
            </Field>
            {pos === "free" && (
              <div className="pk-pad" data-pk="pos:pad">
                <span style={{ gridArea: "1 / 2" }}>24</span>
                <span style={{ gridArea: "2 / 1" }}>16</span>
                <i />
                <span style={{ gridArea: "2 / 3" }}>16</span>
                <span style={{ gridArea: "3 / 2" }}>auto</span>
              </div>
            )}
          </Section>
          <Section title="Layout" pk="sec:layout">
            <Field label="Direction">
              <Seg
                items={[TbLayoutRows, TbColumns]}
                pressed={dir === "row" ? 1 : 0}
                pk="layout:dir"
              />
            </Field>
            <Field label="Align">
              <span className="pk-align">
                {Array.from({ length: 9 }, (_, i) => (
                  <i key={i} aria-pressed={i === 4} />
                ))}
              </span>
            </Field>
            <Field label="Gap">
              <Input set>12px</Input>
            </Field>
          </Section>
          <Section title="Background" pk="sec:fill">
            <div className="relative">
              <Field label="Fill" pk="fill">
                <Input set={Boolean(s.fillToken)} rec={Boolean(rec)}>
                  <span className="pk-swatch" style={{ background: fill }} />
                  {s.fillToken ? str(s.fillToken) : fill.toUpperCase()}
                </Input>
              </Field>
              {Boolean(s.inherit) && (
                <Inheritance
                  title="Fill"
                  rows={[
                    ["base", "Base", "#2563EB"],
                    ["variant", "Type: Secondary", fill.toUpperCase()],
                  ]}
                />
              )}
            </div>
          </Section>
          <Section title="Text" pk="sec:text">
            <Field label="Font">
              <Input mono={false}>
                Inter
                <TbChevronDown className="ml-auto" />
              </Input>
            </Field>
            <Field label="Size">
              <div className="pk-pair">
                <Input>16</Input>
                <Input>Semibold</Input>
              </div>
            </Field>
          </Section>
        </div>
      )}
    </Panel>
  )
}

/** The variants panel floating over the canvas, as 2020 drew it. */
function VariantsFloat({ s }: { s: State }) {
  const rec = str(s.rec)
  return (
    <Panel float={{ right: 16, top: 16, width: 232, height: 470 }} pk="vpanel">
      {rec && (
        <div className="pk-recbar" data-pk="vpanel:rec">
          <Chip kind="rec">REC</Chip>
          <span className="flex-1">{rec}</span>
          <TbPointer className="h-3.5 w-3.5 opacity-60" />
        </div>
      )}
      <Variants
        groups={[
          ...(s.typeGroup === false
            ? []
            : [{ name: "Type", options: ["Primary", "Secondary"] }]),
          {
            name: "States",
            icon: "state" as const,
            options: ["Hover", "Pressed"],
          },
        ]}
        on={str(s.on).split(",").filter(Boolean)}
        rec={rec}
        hover={str(s.vHover)}
      />
      <div className="pk-variant pk-faint" data-pk="vpanel:new-group">
        <TbPlus />
        New variant group
      </div>
    </Panel>
  )
}

/** Assets: the project's tokens and mixins. */
function Assets({ s }: { s: State }) {
  const colors: Array<[string, string]> = [
    ["brand", "#2563eb"],
    ["brand-soft", "#eef2ff"],
    ["ink", "#111827"],
    ["muted", "#6b7280"],
    ["danger", "#e5484d"],
  ]
  return (
    <div className="pk-scroll" data-pk="assets">
      <Section
        title={
          <span className="flex items-center gap-2">
            <TbPalette />
            Color tokens
          </span>
        }
        pk="tokens"
      >
        {colors.map(([n, c]) => (
          <div
            key={n}
            className="pk-variant"
            data-pk={`token:${n}`}
            data-state={s.tokenHover === n ? "hover" : undefined}
          >
            <span className="pk-swatch" style={{ background: c }} />
            {n}
            <span className="pk-faint pk-mono ml-auto">{c}</span>
          </div>
        ))}
      </Section>
      <Section
        title={
          <span className="flex items-center gap-2">
            <TbTypography />
            Mixins
          </span>
        }
        pk="mixins"
      >
        <div className="pk-chips">
          <Chip>heading</Chip>
          <Chip>body</Chip>
          <Chip>card shadow</Chip>
          <Chip>focus ring</Chip>
        </div>
      </Section>
    </div>
  )
}

/** The gallery: the project's components, to drag onto the canvas. */
function Gallery() {
  return (
    <div className="pk-scroll grid grid-cols-2 gap-1 p-2" data-pk="gallery">
      {["Button", "Header", "TextInput", "ProjectCard", "Avatar", "Modal"].map(
        (c) => (
          <div
            key={c}
            className="pk-tile"
            data-pk={`gallery:${c.toLowerCase()}`}
          >
            <i>
              <TbRectangle className="h-5 w-5 opacity-50" />
            </i>
            {c}
          </div>
        )
      )}
    </div>
  )
}

/**
 * A fuller arena, for panning and zooming: the login page, the button's
 * four variants in a column beside it, the home screen, and the projects
 * page at desktop size (drawn at half size on its board).
 */
export const ARENA = {
  login: BOARDS.login,
  buttons: [0, 1, 2, 3].map((i) => ({
    x: 520,
    y: 72 + i * 136,
    w: 280,
    h: 112,
  })),
  home: { x: 860, y: 72, w: 320, h: 460 },
  desktop: { x: 1240, y: 72, w: 720, h: 434 },
}

function Arena({ accent }: { accent: string }) {
  const kinds = ["primary", "secondary", "hover", "disabled"] as const
  return (
    <>
      {kinds.map((k, i) => (
        <Board
          key={k}
          {...ARENA.buttons[i]}
          label={`Button: ${k[0].toUpperCase()}${k.slice(1)}`}
          kind="component"
          pk={`board:btn-${k}`}
        >
          <AcmeButton accent={accent} kind={k} />
        </Board>
      ))}
      <Board {...ARENA.home} label="Home" pk="board:home">
        <AcmeHome accent={accent} />
      </Board>
      <Board
        {...ARENA.desktop}
        label="Projects"
        size="1440 × 868"
        pk="board:desktop"
      >
        <div
          className="pk"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 868,
            transform: "scale(0.5)",
            transformOrigin: "0 0",
          }}
        >
          <ProjectsPage s={{}} />
        </div>
      </Board>
    </>
  )
}

/**
 * Where a value comes from, from the 2020 file's Inheritance popover: each
 * source in order, those overridden struck through, the one in effect last.
 */
function Inheritance({
  title,
  rows,
}: {
  title: string
  rows: Array<["base" | "variant", string, string]>
}) {
  return (
    <div className="pk-inherit" data-pk="inherit">
      <span className="flex items-center justify-between pb-1.5">
        <b className="font-medium">{title}</b>
        <TbRotate className="h-3.5 w-3.5 opacity-60" />
      </span>
      {rows.map(([kind, label, value], i) => {
        const over = i < rows.length - 1
        return (
          <span
            key={label}
            className="pk-inherit-row"
            data-over={over || undefined}
          >
            {kind === "base" ? (
              <TbComponents className="h-3 w-3" />
            ) : (
              <TbTriangle className="h-3 w-3" />
            )}
            <span className="flex-1">{label}</span>
            <span className="pk-mono">{value}</span>
          </span>
        )
      })}
    </div>
  )
}

/**
 * The 2020 file's Omnibar: an “Insert…” search dropped over the canvas,
 * a blank artboard first and the project's components under it.
 */
function Omnibar({ q }: { q: string }) {
  const items: Array<[string, boolean]> = [
    ["Insert Blank Artboard", false],
    ["Button", true],
    ["LoginPage", true],
    ["PanelTabs", true],
    ["PanelTab", true],
  ]
  const shown = items.filter(
    ([label]) => !q || label.toLowerCase().includes(q.toLowerCase())
  )
  return (
    <div className="pk-omni" data-pk="omnibar">
      <span className="pk-omni-search">
        <TbPlus className="h-3.5 w-3.5 opacity-50" />
        {q || <span className="opacity-50">Insert…</span>}
        <i className="pk-caret" />
      </span>
      {shown.map(([label, comp], i) => (
        <span key={label} className="pk-omni-row" aria-selected={i === 0}>
          {comp ? (
            <TbComponents className="h-3.5 w-3.5" />
          ) : (
            <TbRectangle className="h-3.5 w-3.5" />
          )}
          {label}
        </span>
      ))}
    </div>
  )
}
