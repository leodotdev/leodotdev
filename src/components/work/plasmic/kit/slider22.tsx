import {
  TbBook,
  TbChartBar,
  TbChevronDown,
  TbDatabase,
  TbDeviceDesktop,
  TbDotsVertical,
  TbExternalLink,
  TbEye,
  TbEyeOff,
  TbFileText,
  TbH1,
  TbHelp,
  TbLayoutRows,
  TbListTree,
  TbMessage,
  TbPhoto,
  TbPlayerPlay,
  TbPlus,
  TbSearch,
  TbSettings,
  TbSlideshow,
  TbSquareDot,
  TbTriangle,
  TbTypography,
  TbWorld,
} from "react-icons/tb"
import { Avatars, Mark } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// Late 2022, from the "2021 – 2022 Product" file: a Slider, a component
// that acts. Selected, the right panel gives it Actions as well as props:
// go to a slide, step through them, append one. The slides are drawn in CSS.

const SLIDES = [
  "radial-gradient(circle at 20% 40%, #f43f5e 0 3%, transparent 3.5%), radial-gradient(circle at 34% 62%, #facc15 0 3%, transparent 3.5%), radial-gradient(circle at 48% 30%, #22d3ee 0 3%, transparent 3.5%), radial-gradient(circle at 30% 80%, #a855f7 0 3%, transparent 3.5%), linear-gradient(90deg, #fde68a 0 55%, #5eead4 55% 62%, #0d9488 62%)",
  "linear-gradient(160deg, transparent 50%, #334155 50%), linear-gradient(200deg, transparent 55%, #475569 55%), linear-gradient(#fda4af, #fef3c7)",
  "radial-gradient(circle at 70% 60%, #fde047 0 8%, transparent 9%), linear-gradient(#4c1d95, #db2777 55%, #f97316 75%, #0f172a 76%)",
]

/**
 * State keys: slide: the slide showing (0-based); slides: how many there
 * are; auto: Auto-play on; press: an action button being pressed.
 */
export function Slider22({ s }: { s: State }) {
  const count = Number(s.slides) || 3
  const slide = Math.min(Number(s.slide) || 0, count - 1)
  const press = typeof s.press === "string" ? s.press : ""
  const strip = (h: number, w: number) => (
    <div className="relative overflow-hidden" style={{ height: h, width: w }}>
      <div
        className="flex h-full"
        style={{
          width: w * count,
          translate: `${-slide * w}px 0`,
          transition: "translate 0.6s cubic-bezier(0.3,0,0.2,1)",
        }}
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="grid h-full flex-none place-items-center"
            style={{
              width: w,
              background:
                SLIDES[i] ??
                "repeating-linear-gradient(135deg,#f1f5f9 0 8px,#e2e8f0 8px 16px)",
            }}
          >
            {i >= SLIDES.length && (
              <span className="rounded bg-white/80 px-2 py-1 text-[11px] text-[#64748b]">
                Slide {i + 1}: drop content here
              </span>
            )}
          </div>
        ))}
      </div>
      <span className="absolute right-0 bottom-2 left-0 flex justify-center gap-1.5">
        {Array.from({ length: count }, (_, i) => (
          <i
            key={i}
            className="block h-1.5 w-1.5 rounded-full"
            style={{
              background: i === slide ? "#fff" : "rgb(255 255 255 / 0.5)",
            }}
          />
        ))}
      </span>
    </div>
  )
  const page = (w: number, h: number) => (
    <div className="pk-acme" style={{ padding: 0 }}>
      {strip(h, w)}
      <div
        className="flex flex-col gap-2"
        style={{ padding: w > 300 ? "16px 80px" : "14px" }}
      >
        <b style={{ fontSize: w > 300 ? 28 : 22 }}>Welcome</b>
        {[1, 0.9, 1, 0.7].map((k, i) => (
          <i
            key={i}
            className="block h-1.5 rounded-full bg-[#e5e7eb]"
            style={{ width: `${k * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
  return (
    <div
      className="pk-studio"
      style={{
        gridTemplateRows: "48px minmax(0,1fr)",
        gridTemplateColumns: "48px 250px minmax(0,1fr) 300px",
        gridTemplateAreas: '"top top top top" "rail left canvas right"',
      }}
    >
      <header className="pk-top pk-area-top" style={{ gap: 4 }} data-pk="top">
        <span className="pk-logo">
          <Mark />
        </span>
        <b className="pr-3 font-semibold">Blank Project</b>
        <span className="pk-btn" data-kind="ghost">
          <TbFileText /> Homepage <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-tool">
          <TbSettings />
        </span>
        <span className="pk-btn" data-kind="ghost">
          <TbTriangle /> Variants <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="flex-1" />
        <span className="pk-btn" data-kind="ghost">
          <TbDeviceDesktop /> Desktop <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-zoom">
          25% <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-tool" style={{ color: "var(--pk-ok)" }}>
          <TbPlayerPlay />
        </span>
        <span className="pk-tool">
          <TbExternalLink />
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
      <nav className="pk-rail pk-area-rail">
        {[
          TbPlus,
          TbListTree,
          TbBook,
          TbWorld,
          TbDatabase,
          TbChartBar,
          TbSettings,
        ].map((I, i) => (
          <span key={i} className="pk-tool" aria-pressed={i === 1}>
            <I />
          </span>
        ))}
        <span className="pk-rail-end" />
        <Avatars names={["L", "Y"]} />
        <span className="pk-tool">
          <TbMessage />
        </span>
        <span className="pk-tool">
          <TbHelp />
        </span>
      </nav>
      <div
        className="pk-panel pk-area-left"
        style={{ borderRight: "1px solid var(--pk-line)" }}
        data-pk="left"
      >
        <div className="pk-head" style={{ minHeight: 44 }}>
          <span>Tree</span>
          <TbPlus />
        </div>
        <div className="pk-search">
          <TbSearch className="h-3.5 w-3.5" />
          <span>Search…</span>
        </div>
        {(
          [
            [TbLayoutRows, "Root", 0, false],
            [TbLayoutRows, "Section", 1, false],
            [TbSlideshow, "Slider", 1, true],
            [TbSquareDot, "Slot Children", 2, true],
            ...Array.from(
              { length: count },
              () => [TbPhoto, "Image", 3, true] as const
            ),
            [TbH1, "“Welcome”", 1, false],
            [TbTypography, "“If you haven’t alr…”", 1, false],
          ] as const
        ).map(([I, label, depth, inSel], i) => (
          <div
            key={i}
            className="pk-row"
            style={{
              paddingLeft: 10 + depth * 14,
              background: inSel ? "var(--pk-accent-bg)" : undefined,
              borderRadius: 0,
              margin: 0,
            }}
            data-pk={label === "Slider" ? "tree:slider" : undefined}
          >
            <I />
            <span
              style={
                label === "Slider"
                  ? { color: "var(--pk-component)" }
                  : undefined
              }
            >
              {label}
            </span>
          </div>
        ))}
        <span className="flex-1" />
        {["Input Properties", "Local Variables"].map((t) => (
          <div
            key={t}
            className="pk-head"
            style={{ minHeight: 44, borderTop: "1px solid var(--pk-line)" }}
          >
            <span>{t}</span>
            <TbPlus />
          </div>
        ))}
      </div>
      <main
        className="pk-canvas pk-area-canvas"
        data-pk="canvas"
        style={{ background: "var(--pk-panel-2)" }}
      >
        <div
          className="pk-board"
          style={{ left: 70, top: 110, width: 450, height: 320 }}
          data-pk="board:desktop"
        >
          <span className="pk-board-label">Desktop</span>
          <div className="pk-board-body">{page(450, 140)}</div>
        </div>
        <span
          className="absolute"
          style={{
            left: 70,
            top: 110,
            width: 450,
            height: 140,
            outline: "1.5px solid var(--pk-accent)",
          }}
          data-pk="slider"
        >
          <span
            className="pk-sel-tag"
            style={{ background: "var(--pk-component)" }}
          >
            <TbSlideshow className="h-3 w-3" /> Slider
          </span>
        </span>
        <div
          className="pk-board"
          style={{ left: 560, top: 110, width: 130, height: 260 }}
          data-pk="board:mobile"
        >
          <span className="pk-board-label" style={{ color: "var(--pk-rec)" }}>
            Mobile-only
          </span>
          <div className="pk-board-body">{page(130, 92)}</div>
        </div>
      </main>
      <div
        className="pk-panel pk-area-right"
        style={{ borderLeft: "1px solid var(--pk-line)" }}
        data-pk="right"
      >
        <div className="pk-head" style={{ minHeight: 56 }}>
          <span className="flex items-center gap-2.5">
            <span
              className="grid h-8 w-8 place-items-center rounded-full"
              style={{
                background: "var(--pk-component-bg)",
                color: "var(--pk-component)",
              }}
            >
              <TbSlideshow />
            </span>
            <span className="flex flex-col leading-4">
              <b className="font-semibold">Unnamed slider</b>
              <span
                className="text-[11px]"
                style={{ color: "var(--pk-component)" }}
              >
                Slider component
              </span>
            </span>
          </span>
          <span className="pk-btn" data-kind="ghost">
            Apply <TbChevronDown className="h-3 w-3" />
          </span>
        </div>
        <div
          className="pk-field"
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid var(--pk-line)",
          }}
        >
          <label className="font-medium">Visibility</label>
          <span className="flex gap-2">
            <span className="pk-input w-16">100%</span>
            <span className="pk-seg">
              <span aria-pressed className="px-1.5">
                <TbEye />
              </span>
              <span className="px-1.5">
                <TbEyeOff />
              </span>
            </span>
          </span>
        </div>
        <div
          className="flex flex-col gap-2 p-3"
          style={{ borderBottom: "1px solid var(--pk-line)" }}
          data-pk="actions"
        >
          <b className="font-semibold">Actions</b>
          <span className="flex items-center gap-2">
            <span className="pk-muted w-16 leading-4">Current slide:</span>
            <span className="pk-input flex-1" data-pk="act:current">
              Slide {slide + 1} <TbChevronDown className="ml-auto" />
            </span>
          </span>
          <span className="grid grid-cols-2 gap-2">
            <span
              className="pk-btn h-8"
              data-state={press === "prev" ? "hover" : undefined}
              data-pk="act:prev"
            >
              Prev
            </span>
            <span
              className="pk-btn h-8"
              data-state={press === "next" ? "hover" : undefined}
              data-pk="act:next"
            >
              Next
            </span>
          </span>
          <span
            className="pk-btn h-8"
            data-state={press === "append" ? "hover" : undefined}
            data-pk="act:append"
          >
            Append new slide
          </span>
          <span className="pk-btn h-8 opacity-50">Delete current slide</span>
          <span className="pk-faint text-[11px] leading-4" data-pk="act:tip">
            *To re-arrange slides, use the outline panel (alt+1).
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3" data-pk="props">
          <b className="pb-1 font-semibold">Props</b>
          {(
            [
              ["Accessibility", true],
              ["Adaptive height", false],
              ["Arrows", true],
              ["Auto-play", Boolean(s.auto)],
              ["Center mode", false],
              ["Draggable", true],
            ] as const
          ).map(([k, on]) => (
            <span
              key={k}
              className="flex h-8 items-center justify-between"
              data-pk={`prop:${k.toLowerCase()}`}
            >
              <span>{k}</span>
              <span className="pk-switch" role="switch" aria-checked={on} />
            </span>
          ))}
          <span className="flex h-8 items-center justify-between">
            <span>Easing</span>
            <span className="pk-input w-28">
              Linear <TbChevronDown className="ml-auto" />
            </span>
          </span>
          <span className="pk-faint flex items-center gap-1 pt-1">
            <TbDotsVertical /> Expand more props…
          </span>
        </div>
      </div>
    </div>
  )
}
