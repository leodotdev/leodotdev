import {
  TbArrowLeft,
  TbArrowRight,
  TbBrandFigma,
  TbCheck,
  TbChevronDown,
  TbCircle,
  TbCreditCard,
  TbDotsVertical,
  TbHelp,
  TbList,
  TbMinus,
  TbPlus,
  TbRocket,
  TbSearch,
  TbSparkles,
  TbTrash,
  TbUser,
  TbUsers,
  TbUsersPlus,
  TbX,
} from "react-icons/tb"
import { Avatars, Mark } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// Summer 2021's dashboard and money, from the "2021 Q3" file: teams with
// workspaces and drafts in the dashboard's nav, each project row saying
// where it lives, and the upgrade flow (pick a team, pick a plan, seats,
// checkout, and its error). The plans' names, prices, and features are the
// file's.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

const ROWS: Array<[string, string, Array<string>, string, Array<string>]> = [
  ["🍩", "Blank Project", [], "12m ago", ["L"]],
  ["🌸", "DesignKit", [], "1h ago", ["L", "Y", "C"]],
  ["🥚", "Primitives", [], "2h ago", ["L", "Y", "2+"]],
  [
    "🧰",
    "[DesignKit] Form Controls",
    ["Design", "Workspace"],
    "1d ago",
    ["L", "C"],
  ],
  [
    "🐬",
    "Landing and Pricing Pages",
    ["Marketing", "08/24 Campaign"],
    "1d ago",
    ["L", "Y"],
  ],
  ["🐬", "Test", [], "14d ago", ["C"]],
  ["🍟", "Blank Project", [], "1mo ago", ["L"]],
]

const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/**
 * State keys: upgrade: "team" | "plans" | "checkout"; pick: "list" |
 * "choose" | "create" (the team picker's three drafts); seats: a number;
 * card: what is typed in the card field; cardFocus; error: the card was
 * refused.
 */
export function Dashboard21({ s }: { s: State }) {
  const upgrade = str(s.upgrade)
  return (
    <div className="pk-page flex flex-col" data-pk="dashboard">
      <div
        className="pk-page-bar"
        style={{ height: 48, justifyContent: "center", padding: 0 }}
      >
        <div className="flex w-[1000px] items-center gap-3">
          <Mark size={26} />
          <span
            className="pk-plan-tag"
            style={{ "--plan": "var(--pk-component)" } as React.CSSProperties}
          >
            Free Starter
          </span>
          <span className="flex-1" />
          <span className="flex items-center gap-1 text-[color:var(--pk-accent)]">
            <TbPlus className="h-3.5 w-3.5" />
            New project
          </span>
        </div>
      </div>
      <div className="mx-auto flex min-h-0 w-[1000px] flex-1">
        <nav
          className="flex w-[176px] flex-none flex-col gap-0.5 py-3 pr-3"
          style={{ borderRight: "1px solid var(--pk-line)" }}
          data-pk="dash:nav"
        >
          <NavItem icon={TbList} label="All projects" selected />
          <NavItem icon={TbUser} label="My projects" />
          <div className="flex flex-col gap-0.5" data-pk="dash:teams">
            <NavItem
              icon={TbCircle}
              label="Design"
              sub="Team"
              pk="dash:team:design"
            />
            <NavItem label="Workspace" child />
            <NavItem label="Drafts" child />
            <hr className="pk-dash-rule" />
            <NavItem icon={TbCircle} label="Marketing" sub="Team" />
            <NavItem label="08/24 Campaign" child />
          </div>
          <hr className="pk-dash-rule" />
          <NavItem icon={TbSparkles} label="Starters" />
          <NavItem icon={TbTrash} label="Deleted" />
          <span className="flex-1" />
          <span
            className="pk-dash-nav mb-1 self-start"
            data-kind="upgrade"
            data-state={s.hover === "upgrade" || upgrade ? "hover" : undefined}
            data-pk="dash:upgrade"
          >
            <TbRocket />
            Upgrade
          </span>
          <NavItem icon={TbUsersPlus} label="New team" />
          <NavItem icon={TbBrandFigma} label="Get plugin" />
          <NavItem icon={TbHelp} label="Help" />
          <span className="pk-dash-nav mt-1">
            <Avatars names={["L"]} />
            <span className="flex-1">leo</span>
            <TbChevronDown className="opacity-60" />
          </span>
        </nav>
        <div className="flex min-w-0 flex-1 flex-col gap-2 py-3 pl-4">
          <div className="mb-1 flex items-center gap-4 text-[color:var(--pk-fg-2)]">
            <span className="flex items-center gap-1">
              All projects <TbChevronDown className="h-3 w-3" />
            </span>
            <span className="flex-1" />
            <span className="flex items-center gap-1">
              Last modified <TbChevronDown className="h-3 w-3" />
            </span>
            <span className="pk-input w-[200px]">
              <TbSearch />
              <span className="pk-faint">Search projects…</span>
            </span>
          </div>
          {ROWS.map(([emoji, name, crumbs, age, people], i) => (
            <div
              key={name + i}
              className="pk-project-row"
              style={{ height: 68 }}
              data-pk={`dash:row:${slug(name)}`}
            >
              <span className="w-7 text-center text-[20px] leading-7">
                {emoji}
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <b className="text-[14px] leading-5 font-semibold">{name}</b>
                <span
                  className="pk-dash-crumbs"
                  data-pk={
                    crumbs.length ? `dash:crumbs:${slug(name)}` : undefined
                  }
                >
                  <span>v0.0</span>
                  {crumbs.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </span>
              </span>
              <span className="pk-faint">{age}</span>
              <Avatars names={people} />
              <TbDotsVertical className="h-4 w-4 opacity-60" />
            </div>
          ))}
        </div>
      </div>
      {upgrade && <div className="pk-scrim" />}
      {upgrade === "team" && (
        <TeamPick pick={str(s.pick, "list")} hover={str(s.hover)} />
      )}
      {(upgrade === "plans" || upgrade === "checkout") && <Plans s={s} />}
    </div>
  )
}

function NavItem({
  icon: Icon,
  label,
  sub,
  selected,
  child,
  pk,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  sub?: string
  selected?: boolean
  child?: boolean
  pk?: string
}) {
  return (
    <span
      className="pk-dash-nav"
      aria-current={selected || undefined}
      data-child={child || undefined}
      data-pk={pk}
    >
      {Icon ? <Icon /> : <i className="pk-dash-dot" />}
      <span className="flex flex-col">
        {label}
        {sub && (
          <span className="pk-faint text-[11px] leading-[13px]">{sub}</span>
        )}
      </span>
    </span>
  )
}

/** "Select a team to upgrade", in its three drafts. */
function TeamPick({ pick, hover }: { pick: string; hover: string }) {
  const teams = ["Design", "Marketing"]
  return (
    <section className="pk-dialog w-[360px] p-6" data-pk="team-pop">
      <span className="absolute top-3 right-3 opacity-50">
        <TbX />
      </span>
      <div className="flex flex-col items-center gap-1 pb-5 text-center">
        <b className="text-[15px] leading-5 font-semibold">
          {pick === "create"
            ? "Create a team to upgrade."
            : "Select a team to upgrade."}
        </b>
        <span className="pk-muted">
          Upgrade account to unlock more features.{" "}
          <span className="text-[color:var(--pk-accent)]">Learn more.</span>
        </span>
      </div>
      {pick !== "create" && (
        <div className="flex flex-col gap-2" data-pk="team:list">
          {teams.map((t, i) => (
            <span
              key={t}
              className="pk-team-row"
              data-state={
                hover === `team:${t}` || (pick === "choose" && i === 0)
                  ? "focus"
                  : undefined
              }
              data-pk={`team:${slug(t)}`}
            >
              {pick === "choose" && (
                <TbCheck
                  className="h-4 w-4"
                  style={{ visibility: i === 0 ? "visible" : "hidden" }}
                />
              )}
              <TbUsers className="h-4 w-4 opacity-60" />
              <span className="flex-1 font-medium">{t}</span>
              <span
                className="pk-plan-tag"
                style={
                  { "--plan": "var(--pk-component)" } as React.CSSProperties
                }
              >
                Starter
              </span>
              {pick === "list" && <TbArrowRight className="opacity-60" />}
            </span>
          ))}
          {pick === "choose" && (
            <span
              className="pk-btn mt-2 h-10 justify-center text-[14px]"
              data-kind="primary"
            >
              Next <TbArrowRight />
            </span>
          )}
        </div>
      )}
      {pick !== "create" && (
        <div className="pk-dash-or">
          <span>or</span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <span
          className="pk-input h-9"
          data-state={pick === "create" ? "focus" : undefined}
        >
          <TbUsers />
          <span className="pk-faint">Enter team name…</span>
        </span>
        <span
          className="pk-btn h-9 justify-center"
          data-kind={pick === "create" ? "primary" : undefined}
        >
          Create new team
          {pick === "create" && <TbArrowRight />}
        </span>
      </div>
    </section>
  )
}

type Plan = {
  name: string
  color: string
  price: string
  per?: boolean
  cta: string
  features: Array<string>
}

const PLANS: Array<Plan> = [
  {
    name: "Starter",
    color: "var(--pk-component)",
    price: "Free forever",
    cta: "Current plan",
    features: [
      "Unlimited projects",
      "Unlimited code-gen",
      "Up to 3 editors per team",
      "Up to 3 editors per project",
      "Unlimited viewers",
      "10K monthly page views",
      "30-day version history",
    ],
  },
  {
    name: "Pro",
    color: "var(--pk-rec)",
    price: "$12",
    per: true,
    cta: "Select plan",
    features: [
      "Everything in Starter",
      "Up to 10 collaborators per team",
      "250K monthly page views",
      "90-day version history",
      "Standard support",
      "Shared workspaces",
      "Image optimization",
    ],
  },
  {
    name: "Growth",
    color: "var(--pk-ok)",
    price: "$40",
    per: true,
    cta: "Select plan",
    features: [
      "Everything in Pro",
      "Up to 30 collaborators per team",
      "500K monthly page views",
      "Optimization features",
      "Segmented content",
      "Scheduled content",
      "Team permission groups",
      "Advanced team roles",
    ],
  },
  {
    name: "Enterprise",
    color: "var(--pk-accent)",
    price: "Custom price",
    cta: "Contact",
    features: [
      "Everything in Growth",
      "Unlimited users",
      "Unlimited page views",
      "Unlimited version history",
      "Premium support",
      "Uptime SLA",
      "Custom feature priority",
      "Centralized admin",
    ],
  },
]

function PlanCard({
  plan,
  raised,
  back,
}: {
  plan: Plan
  raised?: boolean
  back?: boolean
}) {
  const pk = `plan:${slug(plan.name)}`
  return (
    <div
      className="pk-plan"
      data-raised={raised || undefined}
      style={{ "--plan": plan.color } as React.CSSProperties}
      data-pk={pk}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="pk-plan-tag">{plan.name}</span>
        {plan.per ? (
          <span className="flex flex-col items-end text-right text-[color:var(--plan)]">
            <b className="text-[20px] leading-6 font-medium">{plan.price}</b>
            <span className="text-[11px] leading-[14px]">/collaborator</span>
            <span className="text-[11px] leading-[14px]">/month</span>
          </span>
        ) : (
          <span className="text-[color:var(--plan)]">{plan.price}</span>
        )}
      </div>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0 pt-4">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <TbCheck className="mt-px h-3.5 w-3.5 flex-none text-[color:var(--plan)]" />
            {f}
          </li>
        ))}
      </ul>
      <span className="flex-1" />
      {back ? (
        <span className="pk-plan-cta">
          <TbArrowLeft /> Switch
        </span>
      ) : plan.name === "Starter" ? (
        <span className="pk-plan-cta" data-kind="link">
          {plan.cta}
        </span>
      ) : (
        <span className="pk-plan-cta" data-pk={`${pk}:cta`}>
          {plan.cta} <TbArrowRight />
        </span>
      )}
    </div>
  )
}

/** The plans, then (once one is picked) its seats and checkout. */
function Plans({ s }: { s: State }) {
  const checkout = s.upgrade === "checkout"
  const seats = Number(s.seats) || 1
  const total = `$${(144 * seats).toFixed(2)}`
  const pro = PLANS[1]
  return (
    <section className="pk-dialog w-[960px] px-8 pt-8 pb-8" data-pk="plans">
      <span className="absolute top-4 right-4 opacity-50">
        <TbX />
      </span>
      <div
        className="flex flex-col items-center gap-1 text-center"
        data-pk="plans:head"
      >
        <span className="text-[15px] leading-5">
          Upgrade <b className="font-semibold">Design</b> to create a shared
          workspace
        </span>
        <span className="pk-muted">
          This team’s current plan does not support shared workspaces. Select a
          new plan to upgrade.{" "}
          <span className="text-[color:var(--pk-accent)]">Learn more.</span>
        </span>
      </div>
      <div className="flex justify-center py-6">
        <span className="pk-seg" data-pk="plans:billing">
          <span aria-pressed className="px-3 whitespace-nowrap">
            Bill yearly (save 20%)
          </span>
          <span className="px-3 whitespace-nowrap">Bill monthly</span>
        </span>
      </div>
      {checkout ? (
        <div className="grid h-[360px] grid-cols-3 gap-6">
          <PlanCard plan={pro} back />
          <div
            className="pk-plan"
            style={{ "--plan": "var(--pk-fg-3)" } as React.CSSProperties}
            data-pk="seats"
          >
            <div className="flex items-center justify-center gap-4 pb-6">
              <span className="pk-icon-btn">
                <TbMinus />
              </span>
              <span
                className="flex h-9 items-center gap-2 rounded-full px-4"
                style={{ background: "var(--pk-panel-2)" }}
              >
                <b className="text-[18px] font-medium">{seats}</b>
                {seats === 1 ? "seat" : "seats"}
              </span>
              <span className="pk-icon-btn" data-pk="seats:plus">
                <TbPlus />
              </span>
            </div>
            <div
              className="flex justify-between pb-4"
              style={{ borderBottom: "1px solid var(--pk-line)" }}
            >
              <span className="flex flex-col">
                <span>
                  {seats} Pro {seats === 1 ? "seat" : "seats"}
                </span>
                <span className="pk-faint">
                  $144 × {seats} {seats === 1 ? "seat" : "seats"}
                </span>
              </span>
              <span className="flex flex-col items-end">
                <span className="pk-mono">{total}</span>
                <span className="pk-faint">/year</span>
              </span>
            </div>
            <div
              className="flex justify-between pt-4 font-semibold"
              data-pk="seats:total"
            >
              <span>Total</span>
              <span className="flex flex-col items-end">
                <span className="pk-mono">{total}</span>
                <span className="pk-faint font-normal">/year</span>
              </span>
            </div>
          </div>
          <div
            className="pk-plan gap-3"
            style={{ "--plan": "var(--pk-fg-3)" } as React.CSSProperties}
            data-pk="checkout"
          >
            <b className="pb-1 text-center text-[14px] font-semibold">
              Checkout
            </b>
            {Boolean(s.error) && (
              <span className="pk-dash-error" data-pk="checkout:error">
                Your card number is incomplete.
              </span>
            )}
            <span
              className="pk-input h-10 text-[14px]"
              data-state={s.cardFocus ? "focus" : undefined}
              data-pk="card"
            >
              <TbCreditCard />
              {str(s.card) ? (
                <span className="pk-mono">{str(s.card)}</span>
              ) : (
                !s.cardFocus && <span className="pk-faint">Card number</span>
              )}
              {Boolean(s.cardFocus) && <i className="pk-caret" />}
            </span>
            {[
              ["Expiration", "MM/YY"],
              ["Security code", "CVC"],
            ].map(([l, p]) => (
              <span key={l} className="flex items-center justify-between">
                <span className="pk-muted">{l}</span>
                <span className="pk-input h-9 w-[110px] text-[13px]">
                  <span className="pk-faint">{p}</span>
                </span>
              </span>
            ))}
            <span className="flex-1" />
            <span className="grid grid-cols-2 gap-3">
              <span className="pk-btn h-9 justify-center">Cancel</span>
              <span
                className="pk-btn h-9 justify-center text-[13px]"
                data-kind="primary"
                data-pk="checkout:submit"
              >
                Submit
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className="grid h-[400px] grid-cols-4 gap-5">
          {PLANS.map((p) => (
            <PlanCard key={p.name} plan={p} raised={p.name === "Pro"} />
          ))}
        </div>
      )}
    </section>
  )
}
