import { TbArrowLeft, TbMenu2, TbSearch } from "react-icons/tb"

// The sample app the files design on their artboards: "Acme", a login page
// and a home page, with the Header, TextInput, and Button components the
// story makes, edits, and records variants of. It is the user's design, so
// it stays light whatever the studio's theme.

export type AcmeVariant = {
  /** The header's color (its Intent). */
  accent?: string
  /** The button's variant. */
  button?: "primary" | "secondary" | "hover" | "disabled"
  /** Screen width: a narrower layout on mobile. */
  screen?: "mobile" | "desktop"
  /** A dragged-in component shown in place. */
  extra?: boolean
  /** The title's text (a slot's content). */
  title?: string
}

export function AcmeLogin({
  accent = "#2563eb",
  button = "primary",
  extra,
  title = "Log in to Acme",
}: AcmeVariant) {
  return (
    <div
      className="pk-acme"
      style={{ "--acme": accent } as React.CSSProperties}
    >
      <div className="pk-acme-header" data-pk="acme:header">
        <TbArrowLeft />
        <span data-pk="acme:title">{title}</span>
      </div>
      <div className="pk-acme-body">
        <p className="pk-acme-title">Welcome back</p>
        <p className="pk-acme-text">Log in to keep building.</p>
        <div className="pk-acme-field" data-pk="acme:email">
          Email
          <span>you@acme.com</span>
        </div>
        <div className="pk-acme-field" data-pk="acme:password">
          Password
          <span>••••••••</span>
        </div>
        <div
          className="pk-acme-btn"
          data-kind={button === "primary" ? undefined : button}
          data-pk="acme:button"
        >
          Log in
        </div>
        {extra && (
          <div
            className="pk-acme-btn"
            data-kind="secondary"
            data-pk="acme:dropped"
          >
            Sign up
          </div>
        )}
      </div>
    </div>
  )
}

export function AcmeHome({ accent = "#2563eb" }: { accent?: string }) {
  return (
    <div
      className="pk-acme"
      style={{ "--acme": accent } as React.CSSProperties}
    >
      <div className="pk-acme-header">
        <TbMenu2 />
        <span className="flex-1">Acme</span>
        <TbSearch />
      </div>
      <div className="pk-acme-body">
        <p className="pk-acme-title">Projects</p>
        {["Onboarding", "Billing", "Landing page"].map((t) => (
          <div key={t} className="pk-acme-card">
            <i />
            <div>
              <div className="font-semibold">{t}</div>
              <div className="pk-acme-text text-[12px]">Edited 2h ago</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** A component on its own artboard: the Button in one of its variants. */
export function AcmeButton({
  accent = "#2563eb",
  kind = "primary",
  label = "Log in",
}: {
  accent?: string
  kind?: "primary" | "secondary" | "hover" | "disabled"
  label?: string
}) {
  return (
    <div
      className="pk-acme place-items-center"
      style={
        {
          "--acme": accent,
          background: "#f8fafc",
          display: "grid",
        } as React.CSSProperties
      }
    >
      <div
        className="pk-acme-btn w-[140px]"
        data-kind={kind === "primary" ? undefined : kind}
      >
        {label}
      </div>
    </div>
  )
}
