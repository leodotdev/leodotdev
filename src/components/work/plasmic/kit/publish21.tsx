import {
  TbArrowRight,
  TbCheck,
  TbChevronDown,
  TbChevronLeft,
  TbDotsVertical,
  TbX,
} from "react-icons/tb"
import type { State } from "@/components/work/plasmic/types"

// Q1 2021's Publish dialog, from the "2021 Q1" file: the project's status,
// then the steps a publish takes, each switched on or off: save a new
// version, push and deploy, and call webhooks. Publishing runs them in
// order, its git output in a console. The hook URLs are made up.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

const HOOKS: Array<[string, string]> = [
  ["GET", "https://api.acme.dev/www/user"],
  ["POST", "https://api.acme.dev/v1/deploy/QmcwKGEbAyFtfybXB"],
]

const LOG = [
  "$ git checkout -b plasmic-0.0.1",
  "$ plasmic sync --projects acme",
  "  ✓ Synced 14 components, 3 pages",
  "$ git commit -m “Plasmic: version 0.0.1”",
  "$ git push origin plasmic-0.0.1",
  "# Creating pull request...",
]

function Step({
  on,
  title,
  open,
  done,
  pk,
  children,
}: {
  on: boolean
  title: React.ReactNode
  open?: boolean
  done?: boolean
  pk: string
  children?: React.ReactNode
}) {
  return (
    <div className="pk-p21-step" data-on={on || undefined} data-pk={pk}>
      <span className="pk-p21-box" data-done={done || undefined}>
        {(on || done) && <TbCheck />}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="flex h-6 items-center gap-2">
          <b className="flex-1 font-medium">{title}</b>
          {children !== undefined && (
            <span className="pk-faint flex items-center gap-1">
              {open ? "Hide" : "Show"}
              {open ? <TbChevronDown /> : <TbChevronLeft />}
            </span>
          )}
        </span>
        {open && children}
      </div>
    </div>
  )
}

/**
 * State keys: deploy: Push and deploy switched on; hook: a third webhook's
 * URL, typed; hookFocus; phase: "" | "running" | "done", and lines: how
 * much of the log has printed.
 */
export function Publish21({ s }: { s: State }) {
  const phase = str(s.phase)
  const lines = Number(s.lines) || 0
  const deploy = Boolean(s.deploy)
  return (
    <>
      <div className="pk-scrim" />
      <section
        className="pk-dialog w-[420px]"
        style={{ maxHeight: 800 }}
        data-pk="p21"
      >
        <div className="pk-dialog-head">
          <span>
            <b className="font-semibold">Publish</b> Project Acme
          </span>
          <span className="pk-icon-btn">
            <TbX />
          </span>
        </div>
        <div
          className="mx-4 grid grid-cols-3 rounded-lg p-3"
          style={{ boxShadow: "0 0 0 1px var(--pk-line-2)" }}
          data-pk="p21:status"
        >
          <span className="flex flex-col leading-4">
            <span className="pk-mono">
              {phase === "done" ? "0.0.1" : "0.0.0"}
            </span>
            <span className="pk-faint">Version</span>
          </span>
          <span className="flex flex-col leading-4">
            <b className="flex items-center gap-1.5 font-medium">
              <i
                className="block h-1.5 w-1.5 rounded-full"
                style={{
                  background:
                    phase === "done"
                      ? "var(--pk-ok)"
                      : phase === "running"
                        ? "var(--pk-warn)"
                        : "var(--pk-rec)",
                }}
              />
              {phase === "done"
                ? "Published"
                : phase === "running"
                  ? "Publishing…"
                  : "Unpublished"}
            </b>
            <span className="pk-faint">Status</span>
          </span>
          <span className="flex flex-col items-end leading-4">
            <span>{phase === "done" && deploy ? "GitHub" : "n/a"}</span>
            <span className="pk-faint">Destination</span>
          </span>
        </div>
        {phase ? (
          <div className="flex flex-col gap-3 p-4">
            <span className="flex items-center gap-2" data-pk="p21:saved">
              <TbCheck style={{ color: "var(--pk-ok)" }} />
              Version 0.0.1 saved!
            </span>
            <span className="flex items-center gap-2">
              {phase === "done" ? (
                <TbCheck style={{ color: "var(--pk-ok)" }} />
              ) : (
                <i className="pk-spin" />
              )}
              {phase === "done" ? "Pushed to GitHub" : "Pushing to GitHub"}
            </span>
            <pre
              className="pk-code"
              style={{ minHeight: 168, whiteSpace: "pre-wrap" }}
              data-pk="p21:log"
            >
              {LOG.slice(0, phase === "done" ? LOG.length : lines).map(
                (l, i) => (
                  <span
                    key={i}
                    className={
                      l.startsWith("#")
                        ? "c"
                        : l.startsWith(" ")
                          ? "s"
                          : undefined
                    }
                  >
                    {l}
                    {"\n"}
                  </span>
                )
              )}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col p-4 pt-3">
            <Step on title="Save a new version" pk="p21:version">
              <span />
            </Step>
            <Step
              on={deploy}
              title="Push and deploy"
              pk="p21:deploy"
              open={deploy}
            >
              <span className="pk-muted leading-4">
                Opens a pull request with the new code, in{" "}
                <span className="pk-mono">acme/storefront</span>.
              </span>
            </Step>
            <Step on title="Custom webhooks" pk="p21:hooks" open>
              <div
                className="flex flex-col gap-2 rounded-lg p-2"
                style={{ background: "var(--pk-panel-2)" }}
              >
                <span className="pk-muted px-1 leading-4">
                  Delivers updated code to other applications when you publish.
                </span>
                {HOOKS.concat(
                  s.hookFocus || str(s.hook) ? [["GET", str(s.hook)]] : []
                ).map(([m, url], i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5"
                    data-pk={i === 2 ? "p21:hook:new" : undefined}
                  >
                    <span className="pk-p21-box" data-done>
                      <TbCheck />
                    </span>
                    <span className="pk-input w-[72px] flex-none">
                      {m} <TbChevronDown className="ml-auto" />
                    </span>
                    <span
                      className="pk-input min-w-0 flex-1 truncate"
                      data-state={i === 2 && s.hookFocus ? "focus" : undefined}
                    >
                      <span className="pk-mono truncate">
                        {url || <span className="pk-faint">URL…</span>}
                      </span>
                      {i === 2 && Boolean(s.hookFocus) && (
                        <i className="pk-caret" />
                      )}
                    </span>
                    <TbDotsVertical className="flex-none opacity-50" />
                  </span>
                ))}
                <span className="flex items-center justify-end gap-3 px-1 pt-1">
                  <span className="pk-faint flex items-center gap-1">
                    View history <TbArrowRight />
                  </span>
                  <span
                    className="pk-btn"
                    data-size="sm"
                    style={{
                      color: "var(--pk-accent)",
                      background: "var(--pk-accent-bg)",
                    }}
                    data-pk="p21:newhook"
                  >
                    New webhook
                  </span>
                </span>
              </div>
            </Step>
          </div>
        )}
        <div className="pk-dialog-foot">
          <span className="pk-btn" data-kind="ghost">
            {phase ? "Start over" : "Cancel"}
          </span>
          <span className="pk-btn" data-kind="primary" data-pk="p21:publish">
            {phase === "done" ? "Done" : "Publish"}
          </span>
        </div>
      </section>
    </>
  )
}
