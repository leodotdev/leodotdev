import {
  TbArrowLeft,
  TbCalendar,
  TbDots,
  TbFlask,
  TbInfoCircle,
  TbSearch,
  TbTarget,
} from "react-icons/tb"
import { Avatars, Mark } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// 2022's Insights, from the "2021 – 2022 Product" file's Insights surface:
// the optimizations listed at the left (an A/B test, scheduled content,
// targeted content), and an A/B test's results, the original against its
// variant: engagement and conversion events, each charted over the days the
// test has run. The labels and figures are the file's; the curves are
// drawn to its shape.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

/** Two series a chart draws, the original's and the variant's. */
const SERIES: Record<string, [Array<number>, Array<number>]> = {
  impressions: [
    [12, 8, 22, 40, 38, 52, 44, 62, 58, 60, 50, 70, 62, 58, 30, 22],
    [10, 60, 48, 56, 30, 44, 42, 36, 50, 40, 52, 60, 44, 70, 74, 64],
  ],
  clicks: [
    [20, 26, 30, 28, 40, 46, 44, 50, 56, 52, 60, 66, 64, 70, 74, 78],
    [18, 22, 26, 34, 32, 38, 46, 44, 48, 58, 56, 62, 70, 76, 82, 88],
  ],
  ctr: [
    [50, 52, 48, 55, 60, 58, 62, 61, 63, 60, 64, 62, 65, 63, 62, 63],
    [48, 46, 52, 50, 54, 59, 57, 60, 62, 66, 64, 67, 69, 68, 71, 70],
  ],
  "cta-click": [
    [10, 12, 30, 28, 52, 30, 26, 44, 40, 46, 30, 36, 56, 50, 66, 52],
    [8, 14, 20, 18, 42, 18, 22, 32, 34, 36, 24, 28, 40, 30, 38, 44],
  ],
  "secondary-button-click": [
    [30, 34, 40, 38, 44, 50, 48, 52, 50, 56, 60, 58, 62, 66, 64, 70],
    [28, 30, 36, 40, 42, 44, 50, 54, 58, 60, 64, 68, 72, 70, 76, 80],
  ],
  "signup-link": [
    [40, 36, 44, 50, 46, 42, 48, 54, 52, 58, 50, 56, 60, 54, 62, 58],
    [42, 44, 40, 48, 54, 58, 52, 60, 64, 62, 68, 66, 72, 74, 70, 78],
  ],
  "contact-link": [
    [20, 24, 22, 30, 28, 34, 30, 36, 34, 40, 38, 42, 40, 46, 44, 48],
    [22, 20, 26, 24, 30, 28, 32, 30, 36, 34, 38, 36, 42, 40, 44, 42],
  ],
}

function Chart({ series }: { series: string }) {
  const [a, b] = SERIES[series] ?? SERIES.impressions
  const w = 360
  const h = 130
  const path = (v: Array<number>) =>
    v
      .map(
        (y, i) =>
          `${i ? "L" : "M"}${((i / (v.length - 1)) * w).toFixed(1)} ${(h - (y / 90) * h).toFixed(1)}`
      )
      .join(" ")
  return (
    <span className="flex flex-1 flex-col gap-3">
      <svg
        key={series}
        viewBox={`0 0 ${w} ${h}`}
        className="pk-chart"
        preserveAspectRatio="none"
      >
        {[
          [a, "var(--pk-accent)"],
          [b, "var(--pk-rec)"],
        ].map(([v, c], i) => (
          <g key={i} style={{ color: c as string }}>
            <path
              d={`${path(v as Array<number>)} L${w} ${h} L0 ${h} Z`}
              fill="currentColor"
              className="pk-chart-area"
            />
            <path
              d={path(v as Array<number>)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pathLength={1}
              className="pk-chart-line"
            />
          </g>
        ))}
      </svg>
      <span className="flex gap-6 pl-2 text-[color:var(--pk-fg-2)]">
        <span className="flex items-center gap-1.5">
          <i
            className="block h-0.5 w-3"
            style={{ background: "var(--pk-accent)" }}
          />
          Original
        </span>
        <span className="flex items-center gap-1.5">
          <i
            className="block h-0.5 w-3"
            style={{ background: "var(--pk-rec)" }}
          />
          Variant
        </span>
      </span>
    </span>
  )
}

function Metric({
  value,
  label,
  on,
  pk,
}: {
  value: string
  label: string
  on: boolean
  pk: string
}) {
  return (
    <span className="pk-metric" aria-pressed={on} data-pk={pk}>
      <b className="text-[15px] leading-5 font-medium">{value}</b>
      <span className="pk-muted text-[11px] leading-[14px]">{label}</span>
    </span>
  )
}

/** State keys: metric: the engagement figure charted; event: the event. */
export function Insights({ s }: { s: State }) {
  const metric = str(s.metric, "impressions")
  const event = str(s.event, "cta-click")
  const events: Array<[string, string]> = [
    ["cta-click", "12"],
    ["secondary-button-click", "129"],
    ["signup-link", "99"],
    ["contact-link", "99"],
  ]
  return (
    <div className="pk-page flex flex-col" data-pk="insights">
      <div className="pk-page-bar" style={{ height: 52, gap: 12 }}>
        <Mark size={26} />
        <span className="flex flex-col leading-4">
          <b className="font-semibold text-[color:var(--pk-fg)]">New Website</b>
          <span className="pk-faint text-[11px]">Insights · Acme team</span>
        </span>
        <span className="flex flex-1 items-center justify-center gap-2">
          <span className="pk-faint">View</span>
          <span className="pk-seg">
            <span aria-pressed className="px-3">
              Dashboard
            </span>
            <span className="px-3">Table</span>
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-[color:var(--pk-accent)]">
          <TbArrowLeft /> Back to projects/studio
        </span>
        <Avatars names={["L"]} />
      </div>
      <div className="flex min-h-0 flex-1">
        <div
          className="flex w-[220px] flex-none flex-col gap-1 p-3"
          style={{
            background: "var(--pk-panel)",
            borderRight: "1px solid var(--pk-line)",
          }}
          data-pk="ins:side"
        >
          <span className="flex items-center justify-between px-2 py-2">
            <b className="pk-mono tracking-wide uppercase">Optimizations</b>
            <TbInfoCircle className="opacity-50" />
          </span>
          <span className="pk-input mb-2">
            <TbSearch />
            <span className="pk-faint flex-1">Search…</span>
            <TbDots />
          </span>
          {[
            [TbFlask, "Homepage Test", "A/B test", true],
            [TbCalendar, "Black Friday", "Scheduled content", false],
            [TbTarget, "Demographic", "Targeted content", false],
          ].map(([Icon, name, kind, isNew], i) => {
            const I = Icon as typeof TbFlask
            return (
              <span
                key={name as string}
                className="pk-dash-nav items-start!"
                aria-current={i === 0 || undefined}
              >
                <I className="mt-0.5" />
                <span className="flex flex-col">
                  <b className="font-medium">{name as string}</b>
                  <span className="pk-faint text-[11px]">
                    {kind as string}
                    {isNew && (
                      <span style={{ color: "var(--pk-ok)" }}> · New</span>
                    )}
                  </span>
                </span>
              </span>
            )
          })}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
          <div
            className="pk-ins-card flex items-center gap-8"
            data-pk="ins:header"
          >
            {[
              ["A", "Original", "Original", "var(--pk-accent)"],
              ["B", "Experimental Copy", "Variant", "var(--pk-rec)"],
            ].map(([k, name, kind, c]) => (
              <span key={k} className="flex items-center gap-2.5">
                <span
                  className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold"
                  style={{ boxShadow: `inset 0 0 0 1.5px ${c}`, color: c }}
                >
                  {k}
                </span>
                <span className="flex flex-col leading-4">
                  <b className="text-[14px] font-medium">{name}</b>
                  <span className="pk-faint">{kind}</span>
                </span>
              </span>
            ))}
            <span className="flex-1" />
            {[
              ["12,345", "Unique visitors"],
              ["12,345", "Unique visitors"],
              ["19", "Days running"],
            ].map(([v, l], i) => (
              <span key={i} className="flex flex-col leading-4">
                <b className="pk-mono text-[13px]">{v}</b>
                <span className="pk-faint">{l}</span>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="pk-ins-card flex flex-col gap-4"
              data-pk="ins:engagement"
            >
              <span className="flex items-center justify-between">
                <b className="text-[14px] font-semibold">Engagement</b>
                <TbInfoCircle className="opacity-50" />
              </span>
              <span className="flex gap-4">
                <span className="flex w-[124px] flex-none flex-col gap-1">
                  <Metric
                    value="6,422"
                    label="Total impressions"
                    on={metric === "impressions"}
                    pk="ins:metric:impressions"
                  />
                  <Metric
                    value="408"
                    label="Unique clicks"
                    on={metric === "clicks"}
                    pk="ins:metric:clicks"
                  />
                  <Metric
                    value="62.5%"
                    label="Clickthrough rate (CTR)"
                    on={metric === "ctr"}
                    pk="ins:metric:ctr"
                  />
                </span>
                <Chart series={metric} />
              </span>
            </div>
            <div
              className="pk-ins-card flex flex-col gap-4"
              data-pk="ins:events"
            >
              <span className="flex items-center justify-between">
                <b className="text-[14px] font-semibold">Conversion events</b>
                <TbInfoCircle className="opacity-50" />
              </span>
              <span className="flex gap-4">
                <span className="flex w-[176px] flex-none flex-col gap-1">
                  {events.map(([e, n]) => (
                    <span
                      key={e}
                      className="pk-metric flex-row! items-center justify-between gap-2"
                      aria-pressed={event === e}
                      data-pk={`ins:event:${e}`}
                    >
                      <span className="pk-mono">{e}</span>
                      <b className="pk-mono">{n}</b>
                    </span>
                  ))}
                </span>
                <Chart series={event} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
