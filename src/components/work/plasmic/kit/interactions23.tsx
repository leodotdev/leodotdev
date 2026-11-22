import {
  TbAdjustmentsHorizontal,
  TbBolt,
  TbBook,
  TbBrush,
  TbChevronDown,
  TbChevronLeft,
  TbChevronRight,
  TbComponents,
  TbDatabase,
  TbDeviceDesktop,
  TbDots,
  TbDroplet,
  TbEye,
  TbEyeOff,
  TbFileText,
  TbGitBranch,
  TbHelp,
  TbListTree,
  TbMessage,
  TbPencil,
  TbPlayerPlay,
  TbPlus,
  TbSearch,
  TbSettings,
  TbSparkles,
  TbX,
} from "react-icons/tb"
import { Avatars, Mark } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// 2023's interactions, from the "P2023 H1" file's App Builder page: a
// button in a dark sample app, its onClick a Data operation, and the
// operation a list of actions, each opened to set its fields.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

const COS: Array<[string, string]> = [
  ["Bluth Company", "Newport Beach, CA"],
  ["Dunder Mifflin", "Scranton, PA"],
  ["Greendale Comm…", "Los Angeles, CA"],
  ["Nakatomi Corpora…", "Los Angeles, CA"],
  ["Paddy’s Pub", "Philadelphia, PA"],
  ["Pied Piper", "Palo Alto, CA"],
  ["Sterling Cooper", "New York City, NY"],
]

function Row({
  k,
  children,
  pk,
}: {
  k: string
  children: React.ReactNode
  pk?: string
}) {
  return (
    <span className="grid grid-cols-[80px_1fr] items-center gap-2" data-pk={pk}>
      <span className="pk-muted">{k}</span>
      {children}
    </span>
  )
}

function Action({
  title,
  open,
  pk,
  children,
}: {
  title: React.ReactNode
  open?: boolean
  pk: string
  children?: React.ReactNode
}) {
  return (
    <div className="pk-op" data-open={open || undefined} data-pk={pk}>
      <span className="flex h-11 items-center justify-between px-3">
        <span>{title}</span>
        {open ? (
          <TbChevronDown className="opacity-60" />
        ) : (
          <TbChevronLeft className="opacity-60" />
        )}
      </span>
      {open && <div className="flex flex-col gap-2 px-3 pb-3">{children}</div>}
    </div>
  )
}

/**
 * State keys: pop: the Data operation open; open: the action expanded
 * ("select" | "count"); added: the Set count action added.
 */
export function Interactions23({ s }: { s: State }) {
  const open = str(s.open)
  return (
    <div
      className="pk-studio"
      style={{
        gridTemplateRows: "48px minmax(0,1fr)",
        gridTemplateColumns: "60px minmax(0,1fr) 290px",
        gridTemplateAreas: '"top top top" "rail canvas right"',
      }}
    >
      <header className="pk-top pk-area-top" style={{ gap: 6 }} data-pk="top">
        <span className="pk-logo">
          <Mark />
        </span>
        <b className="font-semibold">CRM App</b>
        <TbChevronDown className="h-3 w-3 opacity-60" />
        <span className="pk-tool">
          <TbGitBranch />
        </span>
        <span className="pk-btn" data-kind="ghost" style={{ height: 36 }}>
          <TbFileText />
          <span className="flex flex-col items-start leading-[14px]">
            Homepage <span className="text-[10px] opacity-60">Page</span>
          </span>
          <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-btn" data-kind="ghost">
          <TbDeviceDesktop /> Desktop <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="flex-1" />
        <span className="pk-zoom">
          25% <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-seg">
          <span aria-pressed className="px-2">
            <TbPencil />
          </span>
          <span className="px-2">
            <TbPlayerPlay />
          </span>
        </span>
        <span className="pk-tool">
          <TbMessage />
        </span>
        <span className="pk-btn" data-kind="ghost">
          Share <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-btn" data-kind="ghost">
          Code <TbChevronDown className="h-3 w-3" />
        </span>
        <span
          className="pk-btn"
          data-kind="ghost"
          style={{ color: "var(--pk-accent)" }}
        >
          Publish <TbChevronDown className="h-3 w-3" />
        </span>
      </header>
      <nav className="pk-rail pk-area-rail" style={{ gap: 6 }}>
        <span
          className="pk-tool"
          style={{
            background: "var(--pk-accent)",
            color: "#fff",
            borderRadius: 99,
            width: 36,
            height: 36,
          }}
        >
          <TbPlus />
        </span>
        {[
          TbListTree,
          TbFileText,
          TbComponents,
          TbDroplet,
          TbBook,
          TbDatabase,
          TbDots,
          TbSettings,
        ].map((I, i) => (
          <span key={i} className="pk-tool">
            <I />
          </span>
        ))}
        <span className="pk-rail-end" />
        <Avatars names={["L", "Y", "C"]} />
        <span className="pk-tool">
          <TbHelp />
        </span>
      </nav>
      <main
        className="pk-canvas pk-area-canvas"
        data-pk="canvas"
        style={{ background: "var(--pk-panel-2)" }}
      >
        <span className="pk-faint absolute top-3 right-4 flex items-center gap-1">
          <TbDeviceDesktop /> Desktop (default){" "}
          <TbChevronDown className="h-3 w-3" />
        </span>
        <div className="pk-int-app" data-pk="app">
          <div
            className="flex flex-col items-center gap-3 pt-5 pb-4"
            style={{ borderBottom: "1px solid #1f2329" }}
          >
            <b className="text-[22px]">Alex’s Project</b>
            <span className="flex items-center gap-3 text-[15px]">
              <span
                className="rounded-md px-3 py-1.5"
                style={{ background: "#2a2e35" }}
              >
                Companies
              </span>
              <span style={{ color: "#9ca3af" }}>Categories</span>
              <span
                className="relative rounded-md px-3 py-1.5 text-white"
                style={{
                  background: "#16a34a",
                  outline: "1.5px solid var(--pk-accent)",
                  outlineOffset: 3,
                }}
                data-pk="app:action"
              >
                Action
                <span className="pk-sel-tag" style={{ top: -30 }}>
                  <TbComponents className="h-3 w-3" /> Button
                </span>
              </span>
            </span>
          </div>
          <div className="flex min-h-0 flex-1 gap-6 p-6">
            <div className="flex w-[190px] flex-none flex-col gap-1">
              <span
                className="mb-2 flex items-center gap-2 rounded-md px-3 py-2"
                style={{
                  boxShadow: "inset 0 0 0 1px #2a2e35",
                  color: "#9ca3af",
                }}
              >
                <TbSearch /> Search…
              </span>
              {COS.map(([n, c], i) => (
                <span
                  key={n}
                  className="flex flex-col rounded-md px-3 py-2"
                  style={i === 0 ? { background: "#2a2e35" } : undefined}
                >
                  <span className="text-[14px]">{n}</span>
                  <span className="text-[11px]" style={{ color: "#9ca3af" }}>
                    {c}
                  </span>
                </span>
              ))}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="pk-int-hero">
                <b>Bluth Company</b>
              </div>
              {[1, 0.95, 0.9, 1, 0.7].map((k, i) => (
                <i
                  key={i}
                  className="block h-2 rounded-full"
                  style={{ width: `${k * 100}%`, background: "#2a2e35" }}
                />
              ))}
            </div>
          </div>
        </div>
        {Boolean(s.pop) && (
          <section
            className="pk-pop"
            style={{ right: 16, top: 70, width: 300 }}
            data-pk="dataop"
          >
            <div
              className="flex items-center gap-2.5 p-3"
              style={{ borderBottom: "1px solid var(--pk-line)" }}
            >
              <span
                className="grid h-8 w-8 place-items-center rounded-full"
                style={{
                  background: "var(--pk-accent-bg)",
                  color: "var(--pk-accent)",
                }}
              >
                <TbDatabase />
              </span>
              <span className="flex flex-1 flex-col leading-4">
                <b className="text-[14px] font-medium">Data operation</b>
                <span className="pk-faint">Interaction</span>
              </span>
              <span data-pk="op:close">
                <TbX className="opacity-60" />
              </span>
            </div>
            <div className="flex flex-col gap-2 p-3" data-pk="op:list">
              <span className="flex items-center justify-between pb-1">
                <b className="font-medium">Actions</b>
                <TbPlus className="opacity-60" />
              </span>
              <Action title="Show prompt" pk="op:prompt" />
              <Action title="Send data to API" pk="op:api" />
              <Action
                title={<>Set select → Value</>}
                open={open === "select"}
                pk="op:select"
              >
                <Row k="Action">
                  <span className="pk-input">
                    UPDATE variable <TbChevronDown className="ml-auto" />
                  </span>
                </Row>
                <Row k="Variable">
                  <span className="pk-input pk-mono">$state.select.value</span>
                </Row>
                <Row k="Operation">
                  <span className="pk-input">
                    New value <TbChevronDown className="ml-auto" />
                  </span>
                </Row>
                <Row k="Value" pk="op:value">
                  <span className="pk-input pk-faint">
                    Unset <TbChevronDown className="ml-auto" />
                  </span>
                </Row>
                <span className="pk-dash-or" style={{ margin: "2px 0" }}>
                  <span className="text-[11px]">Advanced</span>
                </span>
                <Row k="When?">
                  <span className="pk-input pk-faint">
                    Select… <TbChevronDown className="ml-auto" />
                  </span>
                </Row>
              </Action>
              <Action title="Trigger zap" pk="op:zap" />
              {Boolean(s.added) && (
                <Action
                  title={<>Set count</>}
                  open={open === "count"}
                  pk="op:count"
                >
                  <Row k="Action">
                    <span className="pk-input">
                      UPDATE variable <TbChevronDown className="ml-auto" />
                    </span>
                  </Row>
                  <Row k="Variable">
                    <span className="pk-input pk-mono">
                      $state.count <span className="pk-faint ml-auto">0</span>
                    </span>
                  </Row>
                  <Row k="Operation">
                    <span className="pk-input">
                      Increment variable <TbChevronDown className="ml-auto" />
                    </span>
                  </Row>
                </Action>
              )}
              <span
                className="pk-btn self-start"
                data-kind="ghost"
                data-pk="op:new"
              >
                <TbPlus /> New action
              </span>
            </div>
          </section>
        )}
      </main>
      <div
        className="pk-panel pk-area-right"
        style={{ borderLeft: "1px solid var(--pk-line)" }}
        data-pk="right"
      >
        <div className="pk-tabs" style={{ padding: "8px 8px 0" }}>
          {["Settings", "Styles", "Data"].map((t) => (
            <span key={t} className="pk-tab" aria-selected={t === "Settings"}>
              {t}
            </span>
          ))}
        </div>
        <div className="pk-head" style={{ minHeight: 56 }}>
          <span className="flex flex-col leading-4">
            <b className="text-[14px] font-medium">Unnamed Button</b>
            <span className="text-[11px]" style={{ color: "var(--pk-accent)" }}>
              Button Component
            </span>
          </span>
          <TbSettings className="opacity-60" />
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <b className="font-medium">Apply</b>
          <span className="flex gap-3 opacity-70">
            <TbBrush />
            <TbAdjustmentsHorizontal />
            <TbBolt />
            <TbSparkles />
          </span>
        </div>
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderTop: "1px solid var(--pk-line)" }}
        >
          <b className="font-medium">Visibility</b>
          <span className="flex items-center gap-2">
            <span className="pk-seg">
              <span aria-pressed className="px-1.5">
                <TbEye />
              </span>
              <span className="px-1.5">
                <TbEyeOff />
              </span>
            </span>
            <span className="pk-input w-16">100%</span>
          </span>
        </div>
        <div
          className="flex flex-col gap-2 px-3 py-3"
          style={{ borderTop: "1px solid var(--pk-line)" }}
        >
          <span className="flex flex-col leading-4">
            <b className="font-medium">Props</b>
            <span className="pk-faint text-[11px]">
              A component’s information/properties.
            </span>
          </span>
          <Row k="Link">
            <span className="pk-input pk-faint">Enter…</span>
          </Row>
        </div>
        <div
          className="flex flex-col gap-2 px-3 py-3"
          style={{ borderTop: "1px solid var(--pk-line)" }}
        >
          <span className="flex flex-col leading-4">
            <b className="font-medium">Variants</b>
            <span className="pk-faint text-[11px]">
              Different visual states.
            </span>
          </span>
          {["Show start icon", "Show end icon", "Is disabled"].map((v) => (
            <span key={v} className="flex items-center justify-between">
              {v}
              <span className="pk-switch" role="switch" aria-checked={false} />
            </span>
          ))}
          {["Shape", "Size", "Color"].map((v) => (
            <Row key={v} k={v}>
              <span className="pk-input pk-faint">
                Select… <TbChevronDown className="ml-auto" />
              </span>
            </Row>
          ))}
        </div>
        <div
          className="flex flex-col gap-2 px-3 py-3"
          style={{ borderTop: "1px solid var(--pk-line)" }}
          data-pk="int:section"
        >
          <span className="flex items-center justify-between">
            <b className="font-medium">Interactions</b>
            <TbPlus className="opacity-60" />
          </span>
          <Row k="onClick" pk="int:onclick">
            <span
              className="pk-input"
              style={{
                background: "var(--pk-accent-bg)",
                color: "var(--pk-accent)",
              }}
            >
              <TbDatabase /> Data operation{" "}
              <TbChevronRight className="ml-auto" />
            </span>
          </Row>
        </div>
      </div>
    </div>
  )
}
