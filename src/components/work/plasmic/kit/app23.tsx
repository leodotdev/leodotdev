import {
  TbUser,
  TbArrowRight,
  TbBrandAirtable,
  TbBrandFirebase,
  TbBrandGoogleBigQuery,
  TbBrandSupabase,
  TbCode,
  TbFileSpreadsheet,
  TbChevronDown,
  TbDatabase,
  TbDots,
  TbFingerprint,
  TbPlus,
  TbSearch,
  TbUsersGroup,
  TbX,
} from "react-icons/tb"
import { Avatars, Mark, Tabs } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// 2023's app builder, from the "P2023 H1" file's App Builder page: a new
// page that starts from a template, a query docked under the canvas
// (GUI or SQL, its rows previewed beside it), and the project's Settings,
// where an app gets its sign-in and roles. Names, labels, and sample rows
// are the file's.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

/* ------------------------------------------------------------------ */
/* Start by using a template                                           */

/** A wireframe of each template's layout, as the file draws its thumbnails. */
function Wire({ kind }: { kind: string }) {
  const bar = (w: number | string, dark?: boolean) => (
    <i
      className="block h-[3px] rounded-full"
      style={{
        width: w,
        background: dark ? "var(--pk-fg-2)" : "var(--pk-line-2)",
      }}
    />
  )
  const num = (n: string) => (
    <span
      className="flex flex-col gap-1 rounded-[3px] p-1.5"
      style={{ background: "var(--pk-panel-2)" }}
    >
      <span className="pk-mono text-[10px] leading-3 text-[color:var(--pk-fg-2)]">
        {n}
      </span>
      {bar(14)}
    </span>
  )
  switch (kind) {
    case "Blank":
      return (
        <span className="grid h-full grid-cols-2 gap-1.5">
          <span className="col-span-2">{num("5")}</span>
          {num("7")}
          {num("86")}
        </span>
      )
    case "Cards":
      return (
        <span className="grid h-full grid-cols-2 gap-1.5">
          {num("41")}
          {num("5")}
          {num("7")}
          {num("86")}
        </span>
      )
    case "Inbox":
      return (
        <span className="flex h-full gap-2">
          <span className="flex w-6 flex-col gap-2 pt-1">
            {bar("100%")}
            {bar("100%")}
            {bar("100%")}
          </span>
          <span className="flex flex-1 flex-col gap-1.5">
            <span className="flex gap-1">
              {bar(20, true)}
              <span
                className="h-3 flex-1 rounded-sm"
                style={{ background: "var(--pk-panel-3)" }}
              />
            </span>
            {bar("100%", true)}
            {bar("100%")}
            {bar("80%")}
            {bar("100%")}
          </span>
        </span>
      )
    case "Table":
      return (
        <span className="flex h-full flex-col justify-center gap-2">
          {[true, false, true, false].map((d, i) => (
            <span key={i} className="grid grid-cols-4 gap-1.5">
              {bar("100%", d)}
              {bar("70%")}
              {bar("70%")}
              {bar("70%")}
            </span>
          ))}
        </span>
      )
    case "Kanban board":
      return (
        <span className="grid h-full grid-cols-3 gap-1.5">
          {[3, 2, 3].map((n, c) => (
            <span key={c} className="flex flex-col gap-1">
              {Array.from({ length: n }, (_, i) => (
                <span
                  key={i}
                  className="flex flex-col gap-0.5 rounded-sm p-1"
                  style={{ background: "var(--pk-panel-2)" }}
                >
                  {bar("80%", true)}
                  {bar("50%")}
                </span>
              ))}
            </span>
          ))}
        </span>
      )
    case "List":
      return (
        <span className="flex h-full flex-col justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 rounded-sm p-1.5"
              style={{ background: "var(--pk-panel-2)" }}
            >
              <i
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--pk-fg-3)" }}
              />
              {bar("70%", i === 0)}
            </span>
          ))}
        </span>
      )
    case "Form":
      return (
        <span className="flex h-full flex-col justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="grid grid-cols-[1fr_2fr] items-center gap-2"
            >
              {bar("80%", true)}
              <span
                className="h-2 rounded-sm"
                style={{ background: "var(--pk-panel-3)" }}
              />
            </span>
          ))}
          <span
            className="ml-auto h-2 w-7 rounded-sm"
            style={{ background: "var(--pk-accent)" }}
          />
        </span>
      )
    default:
      return (
        <span className="flex h-full flex-col gap-1.5">
          <span className="flex gap-2">
            <span className="flex flex-1 flex-col gap-1">
              {bar("70%", true)}
              {bar("50%", true)}
            </span>
            <span
              className="h-5 w-8 rounded-sm"
              style={{ background: "var(--pk-panel-3)" }}
            />
          </span>
          {bar("100%")}
          {bar("100%")}
          {bar("90%")}
          {bar("100%")}
        </span>
      )
  }
}

const TEMPLATES = [
  "Blank",
  "Cards",
  "Inbox",
  "Table",
  "Kanban board",
  "List",
  "Form",
  "Data details",
]

/** The card a new page opens on, over the empty page. */
export function TemplatePick({ hover }: { hover?: string }) {
  return (
    <div
      className="absolute inset-6 grid place-items-center rounded-lg"
      style={{
        background: "var(--pk-panel)",
        boxShadow: "0 0 0 1px var(--pk-line)",
      }}
    >
      <div className="flex w-[440px] flex-col gap-4" data-pk="tpl">
        <span className="flex items-center justify-between">
          <b className="text-[15px] leading-5 font-semibold">
            Start by using a template
          </b>
          <TbX className="h-4 w-4 opacity-50" />
        </span>
        <div className="grid grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <span
              key={t}
              className="pk-tpl"
              data-state={hover === t ? "hover" : undefined}
              data-pk={`tpl:${t.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span className="pk-tpl-art">
                <Wire kind={t} />
              </span>
              <span className="py-2 text-center">{t}</span>
            </span>
          ))}
        </div>
        <span className="grid grid-cols-[auto_1fr] gap-2">
          <span className="pk-btn h-8">Project settings</span>
          <span className="pk-btn h-8" data-kind="primary">
            <TbPlus /> See more…
          </span>
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* A query, docked under the canvas                                     */

const ROWS: Array<[string, string, string, string, number, number, number]> = [
  [
    "Bluth Company",
    "michael@bluth.co",
    "Newport Beach, CA",
    "01/20/2021",
    48,
    129,
    552,
  ],
  ["Dunder Mifflin", "mike@dm.com", "Scranton, PA", "12/11/2020", 156, 87, 189],
  [
    "Greendale Community College",
    "ahbed@bluth.com",
    "Los Angeles, CA",
    "10/31/2022",
    22,
    12,
    79,
  ],
  [
    "Nakatomi Corporation",
    "john@nc.com",
    "Los Angeles, CA",
    "04/08/2019",
    9,
    91,
    412,
  ],
  [
    "Paddy’s Pub",
    "dennis@paddys.co",
    "Philadelphia, PA",
    "01/20/2021",
    48,
    129,
    552,
  ],
  ["Pied Piper", "rich@pp.app", "Palo Alto, CA", "01/01/2018", 99, 1, 128],
  [
    "Vandelay Industries",
    "art@vandelay.com",
    "New York City, NY",
    "01/01/2022",
    220,
    19,
    271,
  ],
]

/**
 * State keys: sql: the query in SQL; json: the preview as JSON; ran: the
 * query saved and run (its rows flash in).
 */
export function QueryDrawer({ s }: { s: State }) {
  const sql = Boolean(s.sql)
  // Once run, a where clause on the state keeps only its rows.
  const where = s.ran ? str(s.where) : ""
  return (
    <div className="pk-drawer" data-pk="query">
      <div
        className="flex w-[268px] flex-none flex-col"
        style={{ borderRight: "1px solid var(--pk-line)" }}
      >
        <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{
              background: "var(--pk-accent-bg)",
              color: "var(--pk-accent)",
            }}
          >
            <TbSearch className="h-3.5 w-3.5" />
          </span>
          <span className="flex flex-1 flex-col leading-4">
            <b className="text-[13px] font-semibold">Get Accounts</b>
            <span className="pk-faint text-[11px]">Query</span>
          </span>
          <TbDots className="opacity-50" />
        </div>
        <Tabs items={["General", "Response", "Advanced"]} active="General" />
        <div className="flex flex-col gap-2 p-3" data-pk="query:form">
          <span className="pk-query-row">
            <span className="pk-muted">Data</span>
            <span className="pk-input">
              <TbDatabase />
              {str(s.source, "Demo Data")}
              <TbChevronDown className="ml-auto" />
            </span>
          </span>
          <span className="pk-query-row" data-pk="query:mode">
            <span className="pk-muted">Mode</span>
            <span className="pk-seg">
              <span aria-pressed={!sql}>GUI</span>
              <span aria-pressed={sql} data-pk="query:sql">
                SQL
              </span>
            </span>
          </span>
          <span className="pk-query-row">
            <span className="pk-muted">Run</span>
            <span className="pk-seg">
              <span aria-pressed>Auto</span>
              <span>Manual</span>
            </span>
          </span>
          {sql ? (
            <pre
              className="pk-code"
              style={{ padding: "8px 10px", whiteSpace: "pre-wrap" }}
              data-pk="query:code"
            >
              <span className="t">select</span> *{" "}
              <span className="t">from</span> accounts
              {str(s.where) && (
                <>
                  {"\n"}
                  <span className="t">where</span> {str(s.where)}
                </>
              )}
              {Boolean(s.sqlFocus) && <i className="pk-caret" />}
            </pre>
          ) : (
            <>
              <span className="pk-query-row">
                <span className="pk-muted">Table</span>
                <span className="pk-input">
                  Accounts <TbChevronDown className="ml-auto" />
                </span>
              </span>
              <span className="pk-query-row">
                <span className="pk-muted">Filters</span>
                <TbPlus className="ml-auto opacity-60" />
              </span>
              <span className="pk-query-row">
                <span className="pk-muted">Sort</span>
                <TbPlus className="ml-auto opacity-60" />
              </span>
            </>
          )}
        </div>
        <span className="flex-1" />
        <span className="flex justify-end gap-2 p-3">
          <span className="pk-btn">Preview</span>
          <span className="pk-btn" data-kind="primary" data-pk="query:run">
            Save &amp; Run <TbArrowRight />
          </span>
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col" data-pk="query:preview">
        <div
          className="flex h-11 flex-none items-center gap-5 px-4"
          style={{ borderBottom: "1px solid var(--pk-line)" }}
        >
          <span className="flex items-center gap-1 font-medium">
            Preview <TbChevronDown className="h-3 w-3" />
          </span>
          <span className="pk-muted">Reference</span>
          <span className="flex-1" />
          <span className="pk-muted">View as</span>
          <span className="pk-seg" data-pk="query:view">
            <span aria-pressed={!s.json}>Table</span>
            <span aria-pressed={Boolean(s.json)}>JSON</span>
          </span>
          <TbX className="opacity-50" />
        </div>
        {s.json ? (
          <pre
            className="pk-code flex-1 overflow-hidden"
            style={{ whiteSpace: "pre", margin: 12 }}
          >
            {ROWS.slice(0, 3).map(([n, e, l], i) => (
              <span key={n}>
                {i === 0 ? "[" : ""}
                {"\n  { "}
                <span className="a">"id"</span>: {i},{" "}
                <span className="a">"name"</span>:{" "}
                <span className="s">"{n}"</span>,{" "}
                <span className="a">"email"</span>:{" "}
                <span className="s">"{e}"</span>,{" "}
                <span className="a">"location"</span>:{" "}
                <span className="s">"{l}"</span> {"},"}
              </span>
            ))}
            {"\n  …\n]"}
          </pre>
        ) : (
          <table
            className="pk-table"
            key={String(s.ran)}
            data-ran={s.ran ? "" : undefined}
          >
            <thead>
              <tr>
                {[
                  "id",
                  "name",
                  "email",
                  "location",
                  "created",
                  "credits_used",
                  "credits_alloted",
                  "cost",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => [r, i] as const)
                .filter(([r]) => !where.includes("CA") || r[2].endsWith("CA"))
                .map(([r, i]) => (
                  <tr key={r[0]}>
                    <td>{i}</td>
                    {r.map((c, j) => (
                      <td key={j}>{c}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Settings › Authentication                                            */

function Switch({ on, pk }: { on: boolean; pk?: string }) {
  return (
    <span className="pk-switch" aria-checked={on} role="switch" data-pk={pk} />
  )
}

/** State keys: google: Google sign-in allowed; loginNeeded. */
export function SettingsModal({ s }: { s: State }) {
  const nav = [
    "Data sources",
    "Authentication",
    "Publishing",
    "App host",
    "Localization",
    "Default spacing",
    "Custom code",
  ]
  return (
    <>
      <div className="pk-scrim" />
      <section
        className="pk-dialog w-[640px] flex-row!"
        style={{ height: 800 }}
        data-pk="settings"
      >
        <nav
          className="flex w-[150px] flex-none flex-col gap-0.5 p-3"
          style={{ borderRight: "1px solid var(--pk-line)" }}
          data-pk="settings:nav"
        >
          <b className="px-2 pt-1 pb-3 text-[15px] font-semibold">Settings</b>
          {nav.map((n) => (
            <span
              key={n}
              className="pk-dash-nav"
              aria-current={n === "Authentication" || undefined}
              style={{ minHeight: 30 }}
            >
              {n}
            </span>
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start gap-3 px-6 pt-5">
            <span
              className="grid h-8 w-8 place-items-center rounded-full"
              style={{
                background: "var(--pk-accent-bg)",
                color: "var(--pk-accent)",
              }}
            >
              <TbFingerprint className="h-4 w-4" />
            </span>
            <span className="flex flex-1 flex-col">
              <b className="text-[15px] leading-5 font-semibold">
                Authentication
              </b>
              <span className="pk-muted">
                Configure how users login to your app.
              </span>
            </span>
            <TbX className="h-4 w-4 opacity-50" />
          </div>
          <div className="px-4 pt-3">
            <Tabs
              items={["Permissions", "Settings", "Activity"]}
              active={str(s.authTab, "Settings")}
            />
          </div>
          {s.authTab === "Permissions" ? (
            <Permissions />
          ) : (
            <div className="flex flex-col px-6">
              <div className="pk-set-row" data-pk="auth:provider">
                <span>Provider</span>
                <span className="pk-input flex-1">
                  <Mark size={16} />
                  Plasmic Auth
                  <TbChevronDown className="ml-auto" />
                </span>
              </div>
              <div className="pk-set-group" data-pk="auth:registration">
                <b className="font-semibold">Registration</b>
                <div className="pk-set-row">
                  <span>Allow signups</span>
                  <Switch on />
                </div>
                <div className="pk-set-row">
                  <span className="flex flex-col">
                    Restrict signups
                    <span className="pk-faint text-[11px]">
                      e.g. “@domain.com”
                    </span>
                  </span>
                  <span className="pk-input flex-1">
                    <span className="pk-chip">@acme.com</span>
                    <TbChevronDown className="ml-auto" />
                  </span>
                </div>
                <div className="pk-set-row items-start!">
                  <span className="pt-1">Allow</span>
                  <span className="flex flex-col gap-2.5">
                    <span className="flex items-center gap-2.5">
                      <Switch on />
                      Email and password
                    </span>
                    <span
                      className="flex items-center gap-2.5"
                      data-pk="auth:google"
                    >
                      <Switch on={Boolean(s.google)} />
                      Google
                    </span>
                  </span>
                </div>
              </div>
              <div className="pk-set-group">
                <div className="pk-set-row" data-pk="auth:directory">
                  <b className="font-semibold">Directory</b>
                  <span className="pk-input flex-1">
                    <TbUsersGroup />
                    Main users
                    <TbChevronDown className="ml-auto" />
                  </span>
                  <span className="flex items-center gap-1">
                    Manage <TbArrowRight />
                  </span>
                </div>
              </div>
              <div className="pk-set-group">
                <div className="pk-set-row items-start!" data-pk="auth:roles">
                  <b className="pt-1.5 font-semibold">Roles</b>
                  <span className="pk-roles flex-1">
                    {["Admin", "Power", "Normal"].map((r, i) => (
                      <span key={r} style={{ paddingLeft: 12 + i * 16 }}>
                        {r}
                      </span>
                    ))}
                  </span>
                  <TbPlus className="mt-1.5 opacity-60" />
                </div>
              </div>
              <div className="pk-set-group" data-pk="auth:defaults">
                <div className="pk-set-row items-start!">
                  <span className="flex flex-col">
                    <b className="font-semibold">Defaults</b>
                    <span className="pk-faint text-[11px]">For new pages</span>
                  </span>
                  <span className="flex flex-col gap-2.5">
                    <span
                      className="flex items-center gap-2.5"
                      data-pk="auth:login"
                    >
                      <Switch on={Boolean(s.loginNeeded)} />
                      Login needed
                    </span>
                    <span className="flex items-center gap-2.5">
                      <Switch on={false} />
                      Role needed
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Page settings                                                        */

/**
 * A page's settings, from the P2023 H1 file's four frames: its path (with
 * a parameter, previewed with a value), SEO, metadata and props, and who
 * may edit it. State keys: pageSet: the section showing; month: the
 * preview's value for [month]; desc: the SEO description, typed.
 */
export function PageSettings({ s }: { s: State }) {
  const tab = str(s.pageSet, "Page path")
  const month = str(s.month, "Jan")
  const desc = str(s.desc)
  return (
    <section
      className="pk-pop flex"
      style={{ left: 330, top: 54, width: 600, height: 340 }}
      data-pk="pageset"
    >
      <nav
        className="flex w-[150px] flex-none flex-col gap-0.5 p-3"
        style={{ borderRight: "1px solid var(--pk-line)" }}
      >
        <b className="px-2 pt-1 pb-3 text-[15px] font-semibold">Settings</b>
        {["Page path", "SEO", "Metadata and props", "More…"].map((t) => (
          <span
            key={t}
            className="pk-dash-nav"
            aria-current={t === tab || undefined}
            style={{ minHeight: 30 }}
            data-pk={`pageset:${t.split(" ")[0].replace("…", "").toLowerCase()}`}
          >
            {t}
          </span>
        ))}
      </nav>
      <div className="flex min-w-0 flex-1 flex-col">
        {tab === "Page path" && (
          <>
            <div
              className="flex flex-col gap-3 p-4"
              style={{ borderBottom: "1px solid var(--pk-line)" }}
              data-pk="pageset:route"
            >
              <span className="pk-set-row">
                <b className="font-medium">Path</b>
                <span className="pk-input flex-1">
                  /posts/
                  <span className="pk-chip">[month]</span>
                  <TbChevronDown className="ml-auto" />
                </span>
              </span>
              <span className="pk-set-row">
                <span className="pk-faint">Preview</span>
                <span
                  style={{ color: "var(--pk-accent)" }}
                  data-pk="pageset:preview"
                >
                  /posts/{month}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4" data-pk="pageset:params">
              <span className="flex flex-col leading-4">
                <b className="font-medium">Preview parameters</b>
                <span className="pk-faint text-[11px]">
                  Defined in path, e.g. [param]
                </span>
              </span>
              <span className="pk-set-row">
                <span>month</span>
                <span
                  className="pk-input flex-1"
                  data-state={s.monthFocus ? "focus" : undefined}
                  data-pk="pageset:month"
                >
                  {month}
                  {Boolean(s.monthFocus) && <i className="pk-caret" />}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between p-4 pt-0">
              <span className="flex flex-col leading-4">
                <b className="font-medium">Preview query parameters</b>
                <span className="pk-faint text-[11px]">e.g. ?key=value</span>
              </span>
              <TbPlus className="opacity-60" />
            </div>
          </>
        )}
        {tab === "SEO" && (
          <div className="flex flex-col gap-3 p-4" data-pk="pageset:seo-body">
            <b className="font-medium">Basic information</b>
            <span className="pk-set-row">
              <span>Title</span>
              <span className="pk-input flex-1">Posts from {month}</span>
            </span>
            <span className="pk-set-row items-start!">
              <span className="pt-1.5">Content</span>
              <span className="flex flex-1 flex-col gap-1">
                <span
                  className="pk-input h-16! items-start! py-1.5 leading-4 whitespace-normal"
                  data-state={s.descFocus ? "focus" : undefined}
                  data-pk="pageset:desc"
                >
                  <span>
                    {desc ||
                      (!s.descFocus && (
                        <span className="pk-faint">Enter…</span>
                      ))}
                    {Boolean(s.descFocus) && <i className="pk-caret" />}
                  </span>
                </span>
                <span
                  className="pk-faint flex justify-between text-[11px]"
                  data-pk="pageset:count"
                >
                  <span>
                    Count
                    <br />
                    Recommended
                  </span>
                  <span className="pk-mono text-right">
                    {desc.length}
                    <br />
                    160
                  </span>
                </span>
              </span>
            </span>
            <span className="pk-set-row">
              <span>Image</span>
              <span className="pk-input flex-1">
                <span className="pk-faint">Upload…</span>
                <TbChevronDown className="ml-auto" />
              </span>
            </span>
          </div>
        )}
        {tab === "Metadata and props" && (
          <div className="flex flex-col">
            {[
              ["Metadata", "Key-value pairs"],
              ["Meta props", "Key-value pairs"],
            ].map(([t, sub]) => (
              <div
                key={t}
                className="flex items-center justify-between p-4"
                style={{ borderBottom: "1px solid var(--pk-line)" }}
              >
                <span className="flex flex-col leading-4">
                  <b className="font-medium">{t}</b>
                  <span className="pk-faint text-[11px]">{sub}</span>
                </span>
                <TbPlus className="opacity-60" />
              </div>
            ))}
          </div>
        )}
        {tab === "More…" && (
          <div className="flex flex-col gap-3 p-4" data-pk="pageset:editable">
            <b className="font-medium">Page editable by…</b>
            <span className="flex items-center justify-between">
              Content editors
              <Switch on />
            </span>
            <span className="flex items-center justify-between">
              Viewers
              <Switch on={false} />
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Integrations                                                         */

const SOURCES: Array<
  [string, React.ComponentType<{ className?: string }>, string]
> = [
  ["Airtable", TbBrandAirtable, "#f59e0b"],
  ["BigQuery", TbBrandGoogleBigQuery, "#3b82f6"],
  ["Elasticsearch", TbSearch, "#14b8a6"],
  ["Firebase", TbBrandFirebase, "#f97316"],
  ["Google Sheets", TbFileSpreadsheet, "#16a34a"],
  ["Generic HTTP", TbCode, "var(--pk-fg-2)"],
  ["PostgreSQL", TbDatabase, "#3b82f6"],
  ["Supabase", TbBrandSupabase, "#22c55e"],
]

/** “Get started by connecting data”: the data sources, as tiles. */
export function Integrations({ hover }: { hover?: string }) {
  return (
    <>
      <div className="pk-scrim" />
      <section className="pk-dialog w-[460px]" data-pk="integrations">
        <div
          className="flex items-center gap-3 p-5"
          style={{ borderBottom: "1px solid var(--pk-line)" }}
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: "var(--pk-panel-2)" }}
          >
            <TbDatabase />
          </span>
          <span className="flex flex-1 flex-col leading-4">
            <b className="text-[15px] leading-5 font-medium">Integrations</b>
            <span className="pk-muted">Get started by connecting data.</span>
          </span>
          <span className="pk-btn">Invite admin user to help</span>
        </div>
        <div className="grid grid-cols-3 gap-4 p-5">
          {SOURCES.map(([name, I, c]) => (
            <span
              key={name}
              className="pk-source"
              data-state={hover === name ? "hover" : undefined}
              data-pk={`src:${name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span
                className="grid h-12 place-items-center"
                style={{ color: c }}
              >
                <I className="h-6 w-6" />
              </span>
              <span className="py-2.5 text-center">{name}</span>
            </span>
          ))}
        </div>
        <div className="flex justify-between px-5 pb-5">
          <span className="pk-btn">Suggest more…</span>
          <span className="pk-btn">Skip</span>
        </div>
      </section>
    </>
  )
}

/**
 * Authentication's Permissions, from the file's frame: who may use the app,
 * by rule (anonymous visitors, anyone logged in, a domain, a group) and by
 * person, each with a role. The people are the file's sample accounts.
 */
function Permissions() {
  const rules: Array<
    [React.ComponentType<{ className?: string }>, React.ReactNode, string]
  > = [
    [TbUser, "Anonymous visitors", "Denied"],
    [TbUser, "Logged in users", "Normal"],
    [
      TbUsersGroup,
      <>
        Anyone from <span className="pk-chip">@consultants.com</span>
      </>,
      "Power",
    ],
    [
      TbUsersGroup,
      <>
        Group <span className="pk-chip">mgmt</span>
      </>,
      "Power",
    ],
  ]
  const people: Array<[string, string, string]> = [
    ["mike@dundermifflin.com", "2d ago · mgmt", "Normal"],
    ["russ@sv.com", "2d ago", "Power"],
    ["jian@aviato.com", "2d ago · eng", "Normal"],
  ]
  return (
    <div className="flex flex-col gap-4 px-6 pt-4" data-pk="auth:permissions">
      <span className="pk-input" style={{ height: 34 }}>
        <TbSearch />
        <span className="pk-faint">Add people, groups, or @domains…</span>
      </span>
      <span className="grid grid-cols-[1fr_110px] px-3 font-medium">
        <span>Users</span>
        <span>Role</span>
      </span>
      <div className="pk-perm" data-pk="auth:rules">
        {rules.map(([I, who, role], i) => (
          <span key={i} className="pk-perm-row">
            <I className="h-4 w-4 opacity-60" />
            <span className="flex flex-1 items-center gap-1.5">{who}</span>
            <span
              className="flex w-[100px] items-center gap-1"
              style={role === "Denied" ? { color: "var(--pk-rec)" } : undefined}
            >
              {role} <TbChevronDown className="h-3 w-3" />
            </span>
          </span>
        ))}
      </div>
      <div className="pk-perm" data-pk="auth:people">
        {people.map(([who, sub, role], i) => (
          <span key={who} className="pk-perm-row">
            <Avatars names={[who[0].toUpperCase()]} key={i} />
            <span className="flex flex-1 flex-col leading-4">
              {who}
              <span className="pk-faint text-[11px]">{sub}</span>
            </span>
            <span className="flex w-[100px] items-center gap-1">
              {role} <TbChevronDown className="h-3 w-3" />
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Welcome, and Insert                                                  */

/** A tile's small picture: a button, a table, a board, a form, a field. */
function TileArt({ kind }: { kind: string }) {
  if (kind === "Button" || kind === "Board")
    return (
      <span
        className="rounded px-4 py-1 text-[11px] text-white"
        style={{ background: "#2563eb" }}
      >
        Click
      </span>
    )
  if (kind === "Table" || kind === "Edit Form")
    return (
      <span className="flex w-16 flex-col gap-1 rounded bg-white p-1.5">
        {[1, 0.7, 0.85].map((k, i) => (
          <i
            key={i}
            className="block h-0.5 rounded-full bg-[#9ca3af]"
            style={{ width: `${k * 100}%` }}
          />
        ))}
      </span>
    )
  if (kind === "Select")
    return (
      <span className="flex w-16 items-center justify-between rounded bg-white px-1.5 py-1">
        <i className="block h-0.5 w-8 rounded-full bg-[#6b7280]" />
        <TbChevronDown className="h-2.5 w-2.5 text-[#6b7280]" />
      </span>
    )
  if (kind === "C:Button")
    return (
      <span className="h-4 w-14 rounded" style={{ background: "#2563eb" }} />
    )
  return <span className="h-4 w-16 rounded bg-white" />
}

/**
 * The 2023 file's Insert panel as a new project opens it: a welcome with
 * resources, then templates, then components, then basic elements.
 */
export function WelcomeInsert({ hover }: { hover?: string }) {
  const tile = (label: string, art: string, pk: string) => (
    <span
      className="pk-wtile"
      data-state={hover === label ? "hover" : undefined}
      data-pk={pk}
    >
      <span className="grid h-12 place-items-center">
        <TileArt kind={art} />
      </span>
      <span className="py-1.5 text-center">{label}</span>
    </span>
  )
  return (
    <section className="pk-pop pk-welcome" data-pk="welcome">
      <div className="pk-welcome-hero" data-pk="welcome:hero">
        <span className="flex items-start justify-between">
          <span className="flex flex-col leading-4">
            <b className="text-[14px] leading-5 font-semibold">
              Welcome to Plasmic!
            </b>
            <span className="pk-muted">Resources to get started:</span>
          </span>
          <TbX className="opacity-50" />
        </span>
        {["Documentation", "Video tutorials", "Community forums"].map((r) => (
          <span
            key={r}
            className="flex items-center gap-2 pl-2"
            style={{ color: "var(--pk-accent)" }}
          >
            <i
              className="block h-1 w-1 rounded-full"
              style={{ background: "var(--pk-accent)" }}
            />
            {r}
          </span>
        ))}
      </div>
      <div
        className="flex flex-col gap-2 px-4 pt-4"
        data-pk="welcome:templates"
      >
        <span className="flex items-start justify-between">
          <span className="flex flex-col leading-4">
            <b className="text-[14px] leading-5 font-medium">Templates</b>
            <span className="pk-faint">Start by using pre-built examples…</span>
          </span>
          <TbX className="opacity-50" />
        </span>
        <span className="grid grid-cols-2 gap-2">
          {tile("Button", "Button", "wt:button")}
          {tile("Table", "Table", "wt:table")}
          {tile("Board", "Board", "wt:board")}
          {tile("Edit Form", "Edit Form", "wt:form")}
        </span>
        <span
          className="flex items-center justify-end gap-1 py-1"
          style={{ color: "var(--pk-accent)" }}
        >
          View all templates… <TbArrowRight className="-rotate-45" />
        </span>
      </div>
      <div
        className="flex flex-col gap-2 px-4 pt-3"
        style={{ borderTop: "1px solid var(--pk-line)" }}
        data-pk="welcome:components"
      >
        <span className="flex flex-col leading-4">
          <b className="text-[14px] leading-5 font-medium">Components</b>
          <span className="pk-faint">
            …or start by inserting pre-built components.
          </span>
        </span>
        <span className="grid grid-cols-2 gap-2">
          {tile("Button ", "C:Button", "wc:button")}
          {tile("Text Input", "Input", "wc:input")}
          {tile("Select", "Select", "wc:select")}
          {tile("Text Input ", "Input", "wc:input2")}
        </span>
      </div>
      <div className="px-4 py-3">
        <b className="text-[14px] font-medium">Basic elements</b>
      </div>
    </section>
  )
}

/** A new page: one empty vertical stack, selected. */
export function EmptyStack({ drop }: { drop?: boolean }) {
  return (
    <div
      className="absolute inset-6 rounded-lg"
      style={{ background: "var(--pk-panel)" }}
    >
      <div
        className="absolute rounded"
        style={{
          left: "30%",
          top: "14%",
          width: "56%",
          height: "64%",
          background: drop ? "var(--pk-accent-bg)" : "#fff",
          outline: "1.5px solid var(--pk-accent)",
          transition: "background 0.2s",
        }}
        data-pk="stack"
      >
        <span className="pk-sel-tag" style={{ top: -24, left: -1 }}>
          Vertical Stack
        </span>
      </div>
    </div>
  )
}
