import {
  TbArrowLeft,
  TbArrowRight,
  TbBold,
  TbBook,
  TbChevronDown,
  TbChevronRight,
  TbClock,
  TbComponents,
  TbDatabase,
  TbDots,
  TbDotsVertical,
  TbH1,
  TbItalic,
  TbLayoutColumns,
  TbLayoutGrid,
  TbLink,
  TbList,
  TbListTree,
  TbMessage,
  TbPhoto,
  TbPlayerPlay,
  TbPlus,
  TbSearch,
  TbShoppingBag,
  TbStar,
  TbTemplate,
  TbTypography,
  TbUnderline,
  TbWorld,
  TbX,
} from "react-icons/tb"
import { Avatars, Mark } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// Early 2022, from the "2021 – 2022 Product" file: the panels as icon tabs
// in the top bar (insert, tree, styles, globals, data), a breadcrumb in its
// middle, the Styles panel's tokens, a text bar floating over the canvas,
// and Insert as a dialog of columns: a category, its items, a preview.
// The pictures are drawn in CSS.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

/** Four pictures, drawn as gradients. */
const PICS: Record<string, string> = {
  "beach-day.png":
    "linear-gradient(#7dd3fc 0 45%, #22d3ee 45% 62%, #fde68a 62%)",
  "scarlet-macaw.png":
    "radial-gradient(circle at 40% 45%, #ef4444 0 22%, #f59e0b 23% 30%, #2563eb 31% 38%, transparent 39%), linear-gradient(#14532d, #166534)",
  "sunset.png":
    "radial-gradient(circle at 50% 72%, #fde047 0 9%, transparent 10%), linear-gradient(#7c3aed, #ec4899 45%, #fb923c 70%, #1e293b 71%)",
  "waterfall.png":
    "linear-gradient(90deg, transparent 42%, #e0f2fe 42% 56%, transparent 56%), linear-gradient(#065f46, #10b981 70%, #0ea5e9 71%)",
}

const CATS: Array<[string, React.ComponentType<{ className?: string }>]> = [
  ["Recent", TbClock],
  ["Common", TbStar],
  ["Text", TbTypography],
  ["Layouts", TbLayoutColumns],
  ["Media", TbPhoto],
  ["Data", TbDatabase],
  ["Components", TbComponents],
  ["Component Store", TbShoppingBag],
  ["Template Store", TbTemplate],
]

const STORE = ["Navbar", "Pricing table", "Testimonial", "Footer"]

/**
 * State keys: tab: the top bar's panel ("insert" | "tree" | "styles" |
 * "globals" | "data"); dialog: Insert open; cat: its category; pick: the
 * item picked; inserted: the picture placed on the page.
 */
export function EditorTabs({ s }: { s: State }) {
  const tab = str(s.tab, "styles")
  const inserted = str(s.inserted)
  return (
    <div
      className="pk-studio"
      style={{
        gridTemplateRows: "48px minmax(0,1fr)",
        gridTemplateColumns: "256px minmax(0,1fr) 256px",
        gridTemplateAreas: '"top top top" "left canvas right"',
      }}
    >
      <header
        className="pk-top pk-area-top"
        style={{ gap: 2, padding: "0 8px" }}
        data-pk="top"
      >
        <span className="pk-logo mr-2">
          <Mark />
        </span>
        <span className="flex items-center gap-0.5" data-pk="tabs">
          {(
            [
              ["insert", TbPlus],
              ["tree", TbListTree],
              ["styles", TbBook],
              ["globals", TbWorld],
              ["data", TbDatabase],
            ] as const
          ).map(([id, I]) => (
            <span
              key={id}
              className="pk-tool"
              style={{ width: 40, height: 40 }}
              aria-pressed={
                id === "insert" ? Boolean(s.dialog) : tab === id && !s.dialog
              }
              data-pk={`tab:${id}`}
            >
              <I />
            </span>
          ))}
        </span>
        <span
          className="mx-2 h-5 w-px"
          style={{ background: "var(--pk-line-2)" }}
        />
        <span className="pk-tool">
          <TbArrowLeft />
        </span>
        <span className="pk-tool">
          <TbArrowRight />
        </span>
        <span
          className="flex flex-1 items-center justify-center gap-2 text-[color:var(--pk-fg-2)]"
          data-pk="crumbs"
        >
          Blank Project <TbChevronDown className="h-3 w-3" />
          <span className="pk-faint">/</span>
          <span className="text-[color:var(--pk-fg)]">Home</span>{" "}
          <TbChevronDown className="h-3 w-3" />
          <span className="pk-faint">/</span>
          Desktop <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-zoom">
          25% <TbChevronDown className="h-3 w-3" />
        </span>
        <span className="pk-tool" style={{ color: "var(--pk-ok)" }}>
          <TbPlayerPlay />
        </span>
        <span className="pk-tool">
          <TbMessage />
        </span>
        <Avatars names={["L", "Y"]} />
        <span className="pk-btn" data-kind="ghost">
          Share
        </span>
        <span className="pk-btn" data-kind="ghost">
          Code
        </span>
        <span
          className="pk-btn"
          data-kind="ghost"
          style={{ color: "var(--pk-accent)" }}
        >
          Publish
        </span>
      </header>
      <div
        className="pk-panel pk-area-left"
        style={{ borderRight: "1px solid var(--pk-line)" }}
        data-pk="left"
      >
        <div className="pk-tabs" style={{ padding: "8px 8px 0" }}>
          {["Styles", "Uploads", "Components"].map((t) => (
            <span key={t} className="pk-tab" aria-selected={t === "Styles"}>
              {t}
            </span>
          ))}
        </div>
        <div className="pk-tabs" style={{ padding: "4px 8px 0" }}>
          {["Defaults", "Tokens", "Mixins", "Fonts"].map((t) => (
            <span key={t} className="pk-tab" aria-selected={t === "Tokens"}>
              {t}
            </span>
          ))}
        </div>
        <span
          className="pk-input"
          // The kit's own height and padding are for a one-line field.
          style={{
            height: 46,
            margin: "8px 8px 0",
            padding: "0 10px",
            gap: 10,
          }}
        >
          <TbWorld style={{ width: 16, height: 16 }} />
          <span className="flex flex-col leading-4">
            Base
            <span className="pk-faint text-[11px]">Global variant</span>
          </span>
          <TbChevronDown className="ml-auto" />
        </span>
        <div className="pk-search" style={{ marginTop: 8 }}>
          <TbSearch className="h-3.5 w-3.5" />
          <span>Search tokens…</span>
        </div>
        <div className="pk-tokens-tip" data-pk="tokens:tip">
          <span>
            Create and reuse <u>tokens</u> for foundational design values like
            colors and measurements. A token can also reference another token.
          </span>
          <TbX className="flex-none opacity-60" />
        </div>
        {[
          "Colors",
          "Spaces",
          "Fonts",
          "Font sizes",
          "Line heights",
          "Opacities",
        ].map((g) => (
          <div
            key={g}
            className="pk-group-label"
            style={{ height: 40, borderTop: "1px solid var(--pk-line)" }}
          >
            <TbChevronRight />
            <span className="flex-1 tracking-wide uppercase">{g}</span>
            <TbPlus />
          </div>
        ))}
      </div>
      <main className="pk-canvas pk-area-canvas" data-pk="canvas">
        <div
          className="pk-board"
          style={{ left: 40, top: 70, width: 600, height: 560 }}
          data-pk="board"
        >
          <div className="pk-board-body">
            <div className="pk-acme" style={{ padding: "56px 48px", gap: 18 }}>
              <h1
                className="m-0"
                style={{
                  fontSize: 44,
                  lineHeight: "50px",
                  fontWeight: 700,
                  color: "#3730a3",
                  outline: "1.5px dashed var(--pk-accent)",
                  outlineOffset: 4,
                }}
                data-pk="h1"
              >
                Welcome to your first page.
              </h1>
              <p className="m-0" style={{ color: "#6b7280", fontSize: 16 }}>
                Test link.
              </p>
              {inserted && (
                <span
                  className="block h-[220px] rounded-xl"
                  style={{
                    background: PICS[inserted],
                    animation: "pk-pop-in 0.35s ease-out both",
                  }}
                  data-pk="placed"
                />
              )}
            </div>
          </div>
        </div>
        <div className="pk-textbar" data-pk="textbar">
          <span className="flex items-center gap-1">
            <TbH1 /> H1 <TbChevronDown className="h-3 w-3" />
          </span>
          <span className="flex items-center gap-1">
            72 <TbChevronDown className="h-3 w-3" />
          </span>
          {[TbBold, TbItalic, TbUnderline, TbLink].map((I, i) => (
            <span key={i} className="pk-icon-btn" aria-pressed={i === 0}>
              <I />
            </span>
          ))}
        </div>
        {Boolean(s.dialog) && <InsertDialog s={s} />}
      </main>
      <div
        className="pk-panel pk-area-right"
        style={{ borderLeft: "1px solid var(--pk-line)" }}
        data-pk="right"
      >
        <div className="pk-head" style={{ minHeight: 52 }}>
          <span className="flex flex-col leading-4">
            <b className="font-semibold">H1</b>
            <span className="pk-faint text-[11px]">Heading text</span>
          </span>
        </div>
        <div className="pk-tabs" style={{ padding: "0 8px" }}>
          {["Normal", "Hover", "Pressed", "Focus"].map((t) => (
            <span key={t} className="pk-tab" aria-selected={t === "Normal"}>
              {t}
            </span>
          ))}
        </div>
        {[
          ["Tag", "H1 <h1>"],
          ["Mixins", "primary-text"],
          ["Text", "Welcome to your first page."],
          ["Color", "indigo11"],
          ["Font", "Inter"],
          ["Size", "16 · 400"],
        ].map(([k, v]) => (
          <div key={k} className="pk-field" style={{ padding: "6px 12px" }}>
            <label className="tracking-wide uppercase">{k}</label>
            <span
              className="pk-input"
              data-set={k === "Color" || k === "Size" ? "" : undefined}
            >
              {k === "Color" && (
                <i
                  className="block h-3 w-3 rounded-full"
                  style={{ background: "#4338ca" }}
                />
              )}
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Insert, as columns: categories, the category's items, the item. */
function InsertDialog({ s }: { s: State }) {
  const cat = str(s.cat, "Recent")
  const pick = str(s.pick)
  const media = cat === "Media"
  const store = cat === "Component Store"
  return (
    <section className="pk-pop pk-ins3" data-pk="ins3">
      <div
        className="flex h-12 items-center gap-4 px-3"
        style={{ borderBottom: "1px solid var(--pk-line)" }}
      >
        <span className="pk-input w-[200px]" data-state="focus">
          <TbSearch />
          <span className="pk-faint">Search…</span>
        </span>
        <span
          className="flex flex-1 items-center justify-center gap-4"
          data-pk="ins3:where"
        >
          <b className="font-semibold">Insert</b>
          {["Before", "Inside", "After"].map((w) => (
            <span
              key={w}
              className="rounded-md px-2.5 py-1"
              style={
                w === "Inside"
                  ? { background: "var(--pk-current)", color: "var(--pk-fg)" }
                  : { color: "var(--pk-fg-2)" }
              }
            >
              {w}
            </span>
          ))}
        </span>
        <span className="pk-seg">
          <span aria-pressed className="px-1.5">
            <TbList />
          </span>
          <span className="px-1.5">
            <TbLayoutGrid />
          </span>
        </span>
        <TbX className="opacity-60" />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="pk-ins3-col w-[200px]" data-pk="ins3:cats">
          {CATS.map(([c, I], i) => (
            <span key={c}>
              {i === 7 && <hr className="pk-dash-rule" />}
              <span
                className="pk-ins3-row"
                aria-selected={c === cat}
                data-pk={`cat:${c.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <I />
                <span className="flex-1">{c}</span>
                {c === "Media" && <TbChevronRight />}
              </span>
              {c === "Media" && media && (
                <>
                  <span className="pk-ins3-row pl-9!" aria-selected>
                    <TbPhoto /> Images
                  </span>
                  <span className="pk-ins3-row pl-9!">
                    <TbWorld /> Icons
                  </span>
                </>
              )}
            </span>
          ))}
        </div>
        <div className="pk-ins3-col w-[200px]" data-pk="ins3:items">
          {media ? (
            <>
              {Object.keys(PICS).map((p) => (
                <span
                  key={p}
                  className="pk-ins3-row h-11!"
                  aria-selected={p === pick}
                  data-pk={`pic:${p.split(".")[0]}`}
                >
                  <i
                    className="block h-8 w-8 flex-none rounded"
                    style={{ background: PICS[p] }}
                  />
                  <span className="flex-1 truncate">{p}</span>
                  {p === pick && <TbDotsVertical />}
                </span>
              ))}
              <span className="pk-btn mx-2 mt-2 h-8">Upload image</span>
              <span className="pk-faint mt-2 text-center">
                Insert &lt;image&gt; element
              </span>
            </>
          ) : store ? (
            STORE.map((c) => (
              <span
                key={c}
                className="pk-ins3-row"
                aria-selected={c === pick}
                data-pk={`store:${c.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <TbComponents style={{ color: "var(--pk-component)" }} />
                {c}
              </span>
            ))
          ) : (
            ["Heading", "Text", "Link", "Button", "Vertical stack"].map((c) => (
              <span key={c} className="pk-ins3-row">
                <TbDots />
                {c}
              </span>
            ))
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col" data-pk="ins3:preview">
          {media && pick ? (
            <>
              <span
                className="block h-[200px] flex-none"
                style={{ background: PICS[pick] }}
              />
              <span className="flex flex-col gap-3 p-4">
                <span className="flex flex-col leading-4">
                  <b className="font-medium">{pick}</b>
                  <span className="pk-faint">1.1 mb, PNG image</span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="pk-btn"
                    style={{ background: "var(--pk-component)", color: "#fff" }}
                    data-pk="ins3:insert"
                  >
                    Insert
                  </span>
                  <TbDotsVertical className="opacity-50" />
                </span>
              </span>
            </>
          ) : store && pick ? (
            <span className="flex flex-col gap-3 p-4">
              <span className="pk-store-card">
                <i />
                <i />
                <i />
              </span>
              <b className="font-medium">{pick}</b>
              <span
                className="pk-btn self-start"
                style={{ background: "var(--pk-component)", color: "#fff" }}
              >
                Insert
              </span>
            </span>
          ) : (
            <span className="pk-faint grid flex-1 place-items-center">
              Pick something to see it here.
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
