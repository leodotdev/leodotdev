import {
  TbArrowUpRight,
  TbBell,
  TbChevronDown,
  TbDeviceDesktop,
  TbDeviceMobile,
  TbDots,
  TbEye,
  TbHelp,
  TbLayoutGrid,
  TbList,
  TbMessage,
  TbPlus,
  TbPuzzle,
  TbSearch,
  TbSettings,
  TbSparkles,
  TbUserPlus,
  TbUsersGroup,
  TbX,
} from "react-icons/tb"
import { Avatars, Mark } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// 2023's dashboard, from the "P2023 H1" file's Dashboard page: an
// organization and its workspaces down the side, a free trial counting down
// beside Upgrade, and over the projects, a panel to get started or create a
// new app or website from a template.

/** A template's thumbnail, drawn small. */
function Thumb({ kind }: { kind: string }) {
  if (kind === "desktop" || kind === "mobile") {
    const I = kind === "desktop" ? TbDeviceDesktop : TbDeviceMobile
    return (
      <span className="pk-d23-thumb grid place-items-center">
        <I className="h-4 w-4 opacity-40" />
      </span>
    )
  }
  if (kind === "levels")
    return (
      <span className="pk-d23-thumb grid place-items-center">
        <TbPuzzle className="h-4 w-4 opacity-40" />
      </span>
    )
  if (kind === "some")
    return (
      <span
        className="pk-d23-thumb flex flex-col items-center gap-1 pt-3"
        style={{ background: "#e8eefc" }}
      >
        <i className="block h-1 w-16 rounded-full bg-[#1e293b]" />
        <i className="block h-1 w-12 rounded-full bg-[#1e293b]" />
        <i className="mt-1 block h-1.5 w-8 rounded-sm bg-[#2563eb]" />
      </span>
    )
  if (kind === "todo")
    return (
      <span
        className="pk-d23-thumb flex items-end gap-1 p-2"
        style={{ background: "linear-gradient(135deg,#4c1d95,#111827)" }}
      >
        <i className="block h-6 w-8 rounded-sm bg-[#0f172a]" />
        <i className="block h-9 w-6 rounded-sm bg-[#334155]" />
      </span>
    )
  return (
    <span
      className="pk-d23-thumb flex gap-1.5 p-2"
      style={{ background: "#fff" }}
    >
      <i className="block w-6 rounded-sm bg-[#ef4444]" />
      <span className="flex flex-1 flex-col gap-1 pt-1">
        <i className="block h-1 w-full rounded-full bg-[#1e293b]" />
        <i className="block h-1 w-3/4 rounded-full bg-[#cbd5e1]" />
        <i className="block h-1 w-2/3 rounded-full bg-[#cbd5e1]" />
      </span>
    </span>
  )
}

const ROWS: Array<[string, string, Array<string>]> = [
  ["Blank", "5m ago", ["L"]],
  ["Blank", "2d ago", ["L"]],
  ["Blank", "1w ago", ["L", "Y", "C"]],
]

/** State keys: created: a new app made from a template; hover: a tile. */
export function Dashboard23({ s }: { s: State }) {
  const nav = (
    I: React.ComponentType<{ className?: string }> | null,
    label: React.ReactNode,
    extra?: React.ReactNode,
    pk?: string,
    current?: boolean
  ) => (
    <span
      className="pk-dash-nav"
      aria-current={current || undefined}
      data-pk={pk}
      style={{ minHeight: 34 }}
    >
      {I ? <I /> : null}
      <span className="flex-1">{label}</span>
      {extra}
    </span>
  )
  return (
    <div className="pk-page flex" data-pk="dash23">
      <nav
        className="flex w-[236px] flex-none flex-col gap-0.5 p-3"
        style={{
          background: "var(--pk-panel)",
          borderRight: "1px solid var(--pk-line)",
        }}
        data-pk="d23:nav"
      >
        <span className="px-2 pt-1 pb-4">
          <Mark size={28} />
        </span>
        {nav(null, "Recent projects")}
        {nav(null, "My playground")}
        <hr className="pk-dash-rule" />
        <span
          className="pk-dash-nav"
          data-pk="d23:org"
          style={{ minHeight: 42 }}
        >
          <span className="flex flex-1 flex-col leading-4">
            <b className="font-medium text-[color:var(--pk-fg)]">Acme</b>
            <span className="pk-faint text-[11px]">
              Organization,{" "}
              <span style={{ color: "var(--pk-accent)" }}>Free trial</span>
            </span>
          </span>
          <TbChevronDown className="opacity-60" />
        </span>
        {nav(TbBell, "Notifications", <span className="pk-d23-count">2</span>)}
        {nav(TbSettings, "Settings")}
        <span
          className="pk-dash-nav"
          data-pk="d23:upgrade"
          style={{ minHeight: 34 }}
        >
          <span className="flex-1" style={{ color: "var(--pk-accent)" }}>
            Upgrade
          </span>
          <span className="pk-d23-trial">8 days left</span>
        </span>
        <hr className="pk-dash-rule" />
        <div className="flex flex-col gap-0.5" data-pk="d23:workspaces">
          <span className="pk-faint px-2 py-1.5">Workspaces</span>
          {nav(TbLayoutGrid, "Marketing", null, undefined, true)}
          {nav(TbLayoutGrid, "Design")}
          {nav(TbLayoutGrid, "Engineering")}
          {nav(TbPlus, <span className="pk-faint">New workspace…</span>)}
        </div>
        <span className="flex-1" />
        {nav(TbUsersGroup, "Community")}
        {nav(TbSparkles, "What’s new?")}
        {nav(TbMessage, "Share feedback")}
        {nav(TbUserPlus, "Invite people")}
        {nav(TbHelp, "Help")}
        <span
          className="pk-dash-nav mt-1"
          style={{ background: "var(--pk-panel-2)" }}
        >
          <Avatars names={["L"]} />
          <span className="flex-1">leo</span>
          <TbChevronDown className="opacity-60" />
        </span>
      </nav>
      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex flex-col gap-3 px-6 pt-5"
          style={{ borderBottom: "1px solid var(--pk-line)" }}
        >
          <span className="flex items-center gap-2">
            <b className="text-[16px] font-semibold">Marketing</b>
            <TbChevronDown className="opacity-60" />
            <span className="flex-1" />
            <span className="pk-btn h-8" data-kind="primary" data-pk="d23:new">
              <TbPlus /> New project
            </span>
          </span>
          <span className="flex items-end gap-5">
            {["Projects", "Integrations", "Usage", "CMS"].map((t) => (
              <span
                key={t}
                className="pk-d23-tab"
                aria-selected={t === "Projects"}
                data-pk={`d23:tab:${t.toLowerCase()}`}
              >
                {t}
              </span>
            ))}
            <span className="flex-1" />
            <span className="pk-input mb-2 w-[180px]">
              <TbSearch />
              <span className="pk-faint">Search…</span>
            </span>
            <span className="pk-muted mb-3.5 flex items-center gap-1">
              Last modified <TbChevronDown className="h-3 w-3" />
            </span>
            <span className="pk-seg mb-2">
              <span aria-pressed className="px-2">
                <TbList />
              </span>
              <span className="px-2">
                <TbLayoutGrid />
              </span>
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-3 px-10 pt-8">
          <div className="pk-d23-start" data-pk="d23:start">
            <div
              className="flex w-[180px] flex-none flex-col gap-3 pr-5"
              style={{ borderRight: "1px solid var(--pk-line)" }}
            >
              <span className="flex items-center justify-between">
                <b className="font-medium" style={{ color: "var(--pk-ok)" }}>
                  Get started
                </b>
                <TbX className="opacity-50" />
              </span>
              <span className="pk-d23-tile">
                <Thumb kind="levels" />
                <span className="flex flex-col leading-4">
                  <b className="font-medium">Plasmic Levels</b>
                  <span className="pk-faint text-[11px]">Tutorial</span>
                </span>
              </span>
            </div>
            <div
              className="flex min-w-0 flex-1 flex-col gap-3 pl-5"
              data-pk="d23:create"
            >
              <span className="flex items-center gap-2">
                <b className="font-medium">Create a new</b>
                <span className="pk-seg">
                  <span aria-pressed className="px-2.5">
                    App
                  </span>
                  <span className="px-2.5">Website</span>
                </span>
                <span className="flex-1" />
                <span
                  className="flex items-center gap-1"
                  style={{ color: "var(--pk-accent)" }}
                >
                  See more templates <TbArrowUpRight />
                </span>
                <TbX className="ml-2 opacity-50" />
              </span>
              <span className="grid grid-cols-5 gap-3">
                {[
                  ["desktop", "Blank App", "Desktop-first"],
                  ["mobile", "Blank App", "Mobile-first"],
                  ["some", "Some App", ""],
                  ["todo", "Todo", ""],
                  ["blank", "Blank", ""],
                ].map(([k, name, sub]) => (
                  <span
                    key={k}
                    className="pk-d23-tile"
                    data-state={s.hover === k ? "hover" : undefined}
                    data-pk={`d23:tpl:${k}`}
                  >
                    <Thumb kind={k} />
                    <span className="flex items-center gap-1 leading-4">
                      <span className="flex flex-1 flex-col">
                        <b className="font-medium">{name}</b>
                        {sub && (
                          <span className="pk-faint text-[11px]">{sub}</span>
                        )}
                      </span>
                      <TbEye className="opacity-50" />
                    </span>
                  </span>
                ))}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-6" data-pk="d23:rows">
            {(s.created
              ? ([["Untitled app", "just now", ["L"]]] as typeof ROWS)
              : []
            )
              .concat(ROWS)
              .map(([name, age, people], i) => (
                <div
                  key={name + i}
                  className="pk-project-row"
                  style={{
                    height: 64,
                    boxShadow:
                      s.created && i === 0
                        ? "0 0 0 1.5px var(--pk-accent)"
                        : undefined,
                    animation:
                      s.created && i === 0
                        ? "pk-pop-in 0.3s ease-out both"
                        : undefined,
                  }}
                  data-pk={i === 0 && s.created ? "d23:row:new" : undefined}
                >
                  <span className="pk-project-thumb" />
                  <span className="flex flex-1 flex-col">
                    <b className="font-medium">{name}</b>
                    <span className="pk-faint">{age}</span>
                  </span>
                  <Avatars names={people} />
                  <TbDots className="opacity-50" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
