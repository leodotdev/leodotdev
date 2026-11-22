import {
  TbCheck,
  TbChevronDown,
  TbCopy,
  TbDiamond,
  TbLayoutRows,
  TbLink,
  TbPhoto,
  TbRectangle,
  TbTypography,
  TbWorld,
  TbX,
} from "react-icons/tb"
import { Avatars, Search } from "@/components/work/plasmic/kit/studio"

// Menus, popovers, dialogs, and toasts, and the studio's own ones built of
// them: insert, share, code, publish.

export type MenuItem =
  | {
      label: string
      icon?: React.ComponentType<{ className?: string }>
      kbd?: string
      disabled?: boolean
      pk?: string
    }
  | "sep"
  | { heading: string }

export function Menu({
  x,
  y,
  w = 200,
  items,
  hover,
  pk = "menu",
}: {
  x: number
  y: number
  w?: number
  items: Array<MenuItem>
  /** The label of the item under the pointer. */
  hover?: string
  pk?: string
}) {
  return (
    <div
      className="pk-pop pk-menu"
      style={{ left: x, top: y, width: w }}
      data-pk={pk}
    >
      {items.map((it, i) =>
        it === "sep" ? (
          <div key={i} className="pk-menu-sep" />
        ) : "heading" in it ? (
          <div key={i} className="pk-menu-label">
            {it.heading}
          </div>
        ) : (
          <div
            key={i}
            className="pk-menu-item"
            data-pk={it.pk ?? `item:${it.label.toLowerCase()}`}
            aria-disabled={it.disabled || undefined}
            data-state={hover === it.label ? "hover" : undefined}
          >
            {it.icon && <it.icon />}
            {it.label}
            {it.kbd && <kbd>{it.kbd}</kbd>}
          </div>
        )
      )}
    </div>
  )
}

export function Pop({
  x,
  y,
  w,
  pk,
  children,
}: {
  x: number
  y: number
  w: number
  pk?: string
  children: React.ReactNode
}) {
  return (
    <div className="pk-pop" style={{ left: x, top: y, width: w }} data-pk={pk}>
      {children}
    </div>
  )
}

export function Dialog({
  w,
  h,
  title,
  pk = "dialog",
  foot,
  children,
}: {
  w: number
  h?: number
  title: React.ReactNode
  pk?: string
  foot?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <div className="pk-scrim" />
      <div className="pk-dialog" style={{ width: w, height: h }} data-pk={pk}>
        <div className="pk-dialog-head">
          <span>{title}</span>
          <span className="pk-icon-btn">
            <TbX />
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        {foot && <div className="pk-dialog-foot">{foot}</div>}
      </div>
    </>
  )
}

export function Toast({ children }: { children: React.ReactNode }) {
  return (
    <div className="pk-toast" data-pk="toast">
      <TbCheck />
      {children}
    </div>
  )
}

export type InsertEntry = {
  label: string
  kind?: "component" | "element"
  icon?: React.ComponentType<{ className?: string }>
}

const BASICS: Array<InsertEntry> = [
  { label: "Box", icon: TbRectangle },
  { label: "Vertical stack", icon: TbLayoutRows },
  { label: "Text", icon: TbTypography },
  { label: "Image", icon: TbPhoto },
  { label: "Link", icon: TbLink },
]
const COMPONENTS: Array<InsertEntry> = [
  { label: "Button", kind: "component" },
  { label: "Header", kind: "component" },
  { label: "TextInput", kind: "component" },
  { label: "ProjectCard", kind: "component" },
]

/**
 * The insert panel: a search over everything that can go on the canvas,
 * in groups. A query filters it; `selected` is the highlighted entry.
 */
export function InsertPanel({
  query = "",
  focus,
  selected,
  hover,
  groups,
}: {
  query?: string
  focus?: boolean
  selected?: string
  hover?: string
  groups?: Array<[string, Array<InsertEntry>]>
}) {
  const all: Array<[string, Array<InsertEntry>]> = groups ?? [
    ["Basics", BASICS],
    ["Project components", COMPONENTS],
  ]
  const q = query.toLowerCase()
  const shown = all
    .map(
      ([name, items]) =>
        [name, items.filter((i) => i.label.toLowerCase().includes(q))] as const
    )
    .filter(([, items]) => items.length)
  return (
    <div className="flex min-h-0 flex-1 flex-col" data-pk="insert">
      <Search
        value={query}
        focus={focus}
        placeholder="Insert…"
        pk="insert:search"
      />
      <div className="pk-scroll pb-2">
        {shown.map(([name, items]) => (
          <div key={name}>
            <div className="pk-menu-label px-4">{name}</div>
            {items.map((it) => {
              const Icon = it.icon ?? TbDiamond
              return (
                <div
                  key={it.label}
                  className="pk-insert-item"
                  data-kind={it.kind}
                  data-pk={`insert:${it.label.toLowerCase()}`}
                  aria-selected={selected === it.label}
                  data-state={hover === it.label ? "hover" : undefined}
                >
                  <i>
                    <Icon />
                  </i>
                  {it.label}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Share: invite people, set their role, and the project's link. */
export function SharePop({
  x,
  y,
  invite = "",
  focus,
  role,
}: {
  x: number
  y: number
  invite?: string
  focus?: boolean
  /** An open role menu. */
  role?: boolean
}) {
  return (
    <Pop x={x} y={y} w={340} pk="share-pop">
      <div className="pk-head" style={{ minHeight: 44 }}>
        <span>Share project</span>
        <span className="pk-badge">Acme App</span>
      </div>
      <div className="flex gap-2 px-3 pb-3">
        <span
          className="pk-input flex-1"
          data-state={focus ? "focus" : undefined}
          data-pk="share:invite"
        >
          {invite ? invite : <span className="pk-faint">Invite by email…</span>}
          {focus && <i className="pk-caret" />}
        </span>
        <span className="pk-btn" data-pk="share:role">
          Can edit
          <TbChevronDown className="h-3 w-3" />
        </span>
      </div>
      {role && (
        <div className="px-3 pb-2">
          <div className="pk-card pk-menu" data-pk="share:roles">
            {["Owner", "Can edit", "Can view", "Content creator"].map((r) => (
              <div
                key={r}
                className="pk-menu-item"
                data-state={r === "Content creator" ? "hover" : undefined}
              >
                {r}
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        className="flex flex-col gap-1 border-t px-1 py-2"
        style={{ borderColor: "var(--pk-line)" }}
      >
        {[
          ["You", "Owner", "L"],
          ["Design team", "Can edit", "Y"],
          ["Engineering", "Can view", "C"],
        ].map(([who, r, init]) => (
          <div key={who} className="pk-variant">
            <Avatars names={[init]} />
            <span className="flex-1 text-[color:var(--pk-fg)]">{who}</span>
            <span className="pk-faint">{r}</span>
          </div>
        ))}
      </div>
      <div
        className="flex items-center gap-2 border-t px-3 py-3"
        style={{ borderColor: "var(--pk-line)" }}
      >
        <TbWorld className="h-4 w-4 opacity-60" />
        <span className="pk-muted flex-1">Anyone with the link can view</span>
        <span className="pk-btn" data-size="sm" data-pk="share:copy">
          <TbCopy />
          Copy link
        </span>
      </div>
    </Pop>
  )
}

/** Publish: a new version, its number worked out for you. */
export function PublishPop({
  x,
  y,
  note = "",
  focus,
  done,
}: {
  x: number
  y: number
  note?: string
  focus?: boolean
  done?: boolean
}) {
  return (
    <Pop x={x} y={y} w={320} pk="publish-pop">
      <div className="pk-head" style={{ minHeight: 44 }}>
        <span>Publish a version</span>
        <span className="pk-badge" data-kind="new">
          v1.3.0
        </span>
      </div>
      <div className="flex flex-col gap-2 px-3 pb-3">
        <span
          className="pk-input"
          data-state={focus ? "focus" : undefined}
          data-pk="publish:note"
          style={{ height: 56, alignItems: "flex-start", paddingTop: 6 }}
        >
          {note ? note : <span className="pk-faint">What changed?</span>}
          {focus && <i className="pk-caret" />}
        </span>
        <span className="pk-faint text-[11px] leading-4">
          Version numbers follow semantic versioning: a breaking change bumps
          the major number.
        </span>
        <span className="pk-btn" data-kind="primary" data-pk="publish:go">
          {done ? (
            <>
              <TbCheck />
              Published
            </>
          ) : (
            "Publish v1.3.0"
          )}
        </span>
      </div>
    </Pop>
  )
}

/** Code: the design as React, variants as props. */
export function CodeDialog({ tab = "React" }: { tab?: string }) {
  return (
    <Dialog
      w={720}
      h={460}
      title="Code"
      pk="code-dialog"
      foot={
        <>
          <span className="pk-btn" data-kind="ghost">
            <TbCopy />
            Copy
          </span>
          <span className="pk-btn" data-kind="primary">
            Sync with CLI
          </span>
        </>
      }
    >
      <div className="flex h-full">
        <div
          className="flex w-44 flex-none flex-col gap-0.5 border-r p-2"
          style={{ borderColor: "var(--pk-line)" }}
        >
          {[
            "Getting started",
            "React",
            "Install CLI",
            "Tokens",
            "Components",
          ].map((t) => (
            <span
              key={t}
              className="pk-variant"
              aria-checked={t === tab}
              style={
                t === tab ? { background: "var(--pk-panel-2)" } : undefined
              }
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex-1 p-3" data-pk="code:jsx">
          <pre className="pk-code">
            <span className="c">
              {"// LoginPage.tsx — generated by Plasmic"}
            </span>
            {"\n"}
            <span className="t">{"<LoginPage"}</span>{" "}
            <span className="a">screen</span>=
            <span className="s">{'"mobile"'}</span>
            <span className="t">{">"}</span>
            {"\n  "}
            <span className="t">{"<Header"}</span>{" "}
            <span className="a">intent</span>=
            <span className="s">{'"primary"'}</span>
            <span className="t">{">"}</span>
            {"Log in to Acme"}
            <span className="t">{"</Header>"}</span>
            {"\n  "}
            <span className="t">{"<TextInput"}</span>{" "}
            <span className="a">label</span>=
            <span className="s">{'"Email"'}</span>{" "}
            <span className="t">{"/>"}</span>
            {"\n  "}
            <span className="t">{"<Button"}</span>{" "}
            <span className="a">type</span>=
            <span className="s">{'"primary"'}</span>{" "}
            <span className="a">size</span>=
            <span className="s">{'"large"'}</span>
            <span className="t">{">"}</span>
            {"\n    Log in"}
            {"\n  "}
            <span className="t">{"</Button>"}</span>
            {"\n"}
            <span className="t">{"</LoginPage>"}</span>
          </pre>
        </div>
      </div>
    </Dialog>
  )
}
