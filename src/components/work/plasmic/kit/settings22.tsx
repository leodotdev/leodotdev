import { TbCircleCheckFilled, TbClipboard, TbUpload, TbX } from "react-icons/tb"
import type { State } from "@/components/work/plasmic/types"

// Late 2022's Project settings, from the "2021 – 2022 Product" file: one
// long column (the project's name, the site's details with a preview of how
// it reads in a search, its domains, its images, and, behind an upgrade, a
// password and custom code), scrolled through. The labels and help text are
// the file's.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

function Row({
  label,
  help,
  pk,
  children,
}: {
  label: string
  help?: React.ReactNode
  pk?: string
  children: React.ReactNode
}) {
  return (
    <div className="pk-s22-row" data-pk={pk}>
      <div className="flex flex-col gap-1.5">
        <span>{label}</span>
        {children}
      </div>
      {help && <span className="pk-faint leading-4">{help}</span>}
    </div>
  )
}

function Field({
  value,
  focus,
  tall,
  pk,
  after,
}: {
  value: string
  focus?: boolean
  tall?: boolean
  pk?: string
  after?: React.ReactNode
}) {
  return (
    <span
      className="pk-input"
      style={
        tall
          ? { height: 56, alignItems: "flex-start", paddingTop: 7 }
          : { height: 32 }
      }
      data-state={focus ? "focus" : undefined}
      data-pk={pk}
    >
      <span className="truncate">
        {value || (!focus && <span className="pk-faint">Enter…</span>)}
        {focus && <i className="pk-caret" />}
      </span>
      {after}
    </span>
  )
}

function Upload({ label }: { label: string }) {
  return (
    <div
      className="flex flex-1 flex-col gap-2 rounded-lg p-3"
      style={{ background: "var(--pk-panel-2)" }}
    >
      <b className="font-medium">{label}</b>
      <span className="pk-s22-drop">
        <TbUpload /> Click or drag-and-drop…
      </span>
      <span>Paste image from clipboard</span>
      <span className="pk-s22-drop">
        <TbClipboard /> Select and paste here…
      </span>
      <span>Or enter image URL</span>
      <span className="pk-input" style={{ height: 30 }}>
        <span className="pk-faint">Enter URL…</span>
      </span>
    </div>
  )
}

/**
 * State keys: title, desc (typed into Site details), sub (the subdomain),
 * titleFocus, subFocus, scroll (how far down the column, in px).
 */
export function Settings22({ s }: { s: State }) {
  const title = str(s.title, "My Plasmic Project")
  const desc = str(s.desc, "An all new project, made in Plasmic.")
  const sub = str(s.sub, "blank-project")
  return (
    <>
      <div className="pk-scrim" />
      <section
        className="pk-dialog"
        style={{ width: 600, height: 780 }}
        data-pk="s22"
      >
        <div className="pk-dialog-head" style={{ height: 56 }}>
          <span className="text-[14px] font-semibold">Project settings</span>
          <span className="pk-icon-btn">
            <TbX />
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <div
            className="flex flex-col"
            style={{
              translate: `0 ${-(Number(s.scroll) || 0)}px`,
              transition: "translate 0.9s cubic-bezier(0.3,0,0.2,1)",
            }}
          >
            <div className="pk-s22-group">
              <Row
                label="Project name"
                help="This is the project’s name within Plasmic."
              >
                <Field value="Blank Project" />
              </Row>
            </div>
            <div className="pk-s22-group" data-pk="s22:details">
              <b className="font-semibold">Site details</b>
              <Row
                label="Site title"
                help="Text displayed in the browser tab. You can update what people see in each page’s settings."
              >
                <Field
                  value={title}
                  focus={Boolean(s.titleFocus)}
                  pk="s22:title"
                />
              </Row>
              <Row label="Site description">
                <Field value={desc} tall />
              </Row>
              <div className="flex flex-col gap-1.5" data-pk="s22:preview">
                <span>Preview</span>
                <span className="pk-s22-card">
                  <span className="pk-faint">{sub}.plasmic.app</span>
                  <b
                    className="text-[15px] leading-5 font-medium"
                    style={{ color: "var(--pk-accent)" }}
                  >
                    {title}
                  </b>
                  <span>{desc}</span>
                </span>
              </div>
            </div>
            <div className="pk-s22-group" data-pk="s22:domains">
              <b className="font-semibold">Site domains</b>
              <Row
                label="Plasmic subdomain"
                help="Must be alphanumeric (a-z, 0-9) with dashes between words."
              >
                <Field
                  value={`${sub}.plasmic.app`}
                  focus={Boolean(s.subFocus)}
                  pk="s22:sub"
                  after={
                    !s.subFocus && (
                      <TbCircleCheckFilled
                        className="ml-auto flex-none"
                        style={{ color: "var(--pk-ok)" }}
                      />
                    )
                  }
                />
              </Row>
              <Row
                label="Custom domain"
                help={
                  <>
                    Set up your domain to point to this published project.{" "}
                    <span style={{ color: "var(--pk-accent)" }}>
                      Learn more.
                    </span>
                  </>
                }
              >
                <Field value="" />
              </Row>
            </div>
            <div className="pk-s22-group" data-pk="s22:images">
              <b className="font-semibold">Site images</b>
              <div className="flex gap-4">
                <Upload label="Favicon" />
                <Upload label="Webclip" />
              </div>
            </div>
            <div
              className="pk-s22-group"
              style={{ opacity: 0.55 }}
              data-pk="s22:security"
            >
              <span className="flex items-center justify-between">
                <b className="font-semibold">Site security (disabled)</b>
                <span
                  className="pk-btn"
                  style={{
                    color: "var(--pk-accent)",
                    background: "var(--pk-accent-bg)",
                  }}
                >
                  Upgrade plan
                </span>
              </span>
              <Row
                label="Site password"
                help="Publish your project to activate a password for this site."
              >
                <Field value="" />
              </Row>
            </div>
            <div className="pk-s22-group" style={{ opacity: 0.55 }}>
              <span className="flex items-center justify-between">
                <b className="font-semibold">Custom code (disabled)</b>
                <span
                  className="pk-btn"
                  style={{
                    color: "var(--pk-accent)",
                    background: "var(--pk-accent-bg)",
                  }}
                >
                  Upgrade plan
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
