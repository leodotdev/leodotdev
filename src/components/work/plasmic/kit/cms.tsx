import {
  TbArrowLeft,
  TbBold,
  TbChevronDown,
  TbDots,
  TbFileText,
  TbHistory,
  TbItalic,
  TbLink,
  TbList,
  TbPlus,
  TbTable,
} from "react-icons/tb"
import { Avatars, Mark, Search } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// 2022 beyond the editor, from the "2021 – 2022 Product" file: a hosted
// CMS (types, their entries, and an entry's editor with its own publish)
// and the team dashboard it lives beside.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

const TYPES = ["Blog Posts", "Categories", "Products", "FAQs"]
const ENTRIES: Array<[string, string, boolean]> = [
  ["How do I connect my codebase?", "2h ago", true],
  ["Can I use my own components?", "yesterday", true],
  ["Does Plasmic host my site?", "3 days ago", false],
]

export function Cms({ s }: { s: State }) {
  const type = str(s.type, "FAQs")
  const entry = Number(s.entry) || 0
  const published = Boolean(s.published)
  return (
    <div className="pk-page flex flex-col" data-pk="cms">
      <div className="pk-page-bar" style={{ height: 48, gap: 14 }}>
        <Mark />
        <span className="flex flex-col leading-4">
          <b className="font-semibold text-[color:var(--pk-fg)]">
            Acme Content
          </b>
          <span className="pk-faint text-[11px]">CMS · Acme team</span>
        </span>
        <span className="flex flex-1 justify-center gap-1">
          {["Entries", "Types", "Settings"].map((t) => (
            <span
              key={t}
              className="pk-ribbon-tab"
              aria-selected={t === "Entries"}
            >
              {t}
            </span>
          ))}
        </span>
        <span className="pk-seg">
          <span aria-pressed={!s.table}>
            <TbList />
          </span>
          <span aria-pressed={Boolean(s.table)}>
            <TbTable />
          </span>
        </span>
        <span className="pk-btn" data-kind="ghost">
          <TbArrowLeft />
          Back to projects
        </span>
        <Avatars names={["L"]} />
      </div>
      <div className="flex min-h-0 flex-1">
        <div
          className="flex w-52 flex-col"
          style={{
            background: "var(--pk-panel)",
            borderRight: "1px solid var(--pk-line)",
          }}
          data-pk="cms:types"
        >
          <div className="pk-group-label">Types</div>
          {TYPES.map((t) => (
            <div
              key={t}
              className="pk-row"
              aria-selected={t === type}
              style={{ paddingLeft: 12 }}
              data-pk={`type:${t.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <TbFileText />
              {t}
            </div>
          ))}
          <div className="pk-row pk-faint" style={{ paddingLeft: 12 }}>
            <TbPlus />
            New type
          </div>
        </div>
        <div
          className="flex w-[380px] flex-col"
          style={{ borderRight: "1px solid var(--pk-line)" }}
          data-pk="cms:entries"
        >
          <div className="pk-head" style={{ minHeight: 48 }}>
            <span>
              {type} <span className="pk-faint font-normal">· 3 entries</span>
            </span>
            <span className="pk-btn" data-size="sm" data-kind="primary">
              <TbPlus />
              New entry
            </span>
          </div>
          <Search placeholder="Search entries…" />
          {ENTRIES.map(([t, age, pub], i) => (
            <div
              key={t}
              className="mx-2 flex flex-col gap-1 rounded-lg px-3 py-2.5"
              style={{
                background: i === entry ? "var(--pk-accent-bg)" : undefined,
              }}
              data-pk={`entry:${i}`}
            >
              <span className="font-medium">{t}</span>
              <span className="flex items-center gap-2 text-[11px]">
                <span className="pk-faint">{age}</span>
                <span
                  className="pk-badge"
                  data-kind={pub || (i === 2 && published) ? "ok" : undefined}
                >
                  {pub || (i === 2 && published) ? "Published" : "Draft"}
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col" data-pk="cms:editor">
          <div
            className="flex items-center gap-2 px-5"
            style={{ height: 52, borderBottom: "1px solid var(--pk-line)" }}
          >
            <span className="flex flex-col leading-4">
              <b className="pk-mono">A123B456C789</b>
              <span className="pk-faint text-[11px]">Auto-saved</span>
            </span>
            <span className="flex-1" />
            <span className="pk-btn" data-kind="ghost" data-pk="cms:locale">
              English <TbChevronDown className="h-3 w-3" />
            </span>
            <span className="pk-btn" data-kind="ghost">
              <TbHistory />
              History
            </span>
            <span className="pk-btn" data-kind="primary" data-pk="cms:publish">
              {published ? "Published" : "Publish"}
            </span>
          </div>
          <div className="flex flex-col gap-4 p-6" style={{ maxWidth: 620 }}>
            <label className="flex flex-col gap-1.5" data-pk="cms:question">
              <span className="pk-muted">Question *</span>
              <span
                className="pk-input"
                style={{ height: 36 }}
                data-state={s.qFocus ? "focus" : undefined}
              >
                {str(s.question, ENTRIES[entry][0])}
                {s.qFocus && <i className="pk-caret" />}
              </span>
            </label>
            <label className="flex flex-col gap-1.5" data-pk="cms:answer">
              <span className="pk-muted">Answer *</span>
              <span className="pk-card flex flex-col">
                <span
                  className="flex gap-1 p-1.5"
                  style={{ borderBottom: "1px solid var(--pk-line)" }}
                >
                  {[TbBold, TbItalic, TbLink, TbList, TbDots].map((I, i) => (
                    <span key={i} className="pk-icon-btn">
                      <I />
                    </span>
                  ))}
                </span>
                <span className="p-3 leading-5">
                  Yes. Plasmic hosts your pages, or exports them to your own
                  codebase, where your engineers keep full control.
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
