import { TbChevronRight } from "react-icons/tb"
import { Avatars } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// 2020's Activity panel, from the 2020 file's Versioning page: the
// project's history as a feed, newest last, from its creation through
// a share, an import from Figma, visits, autosaves folded away, a branch,
// a publish, a fork, a merge, and comments. The people in the file are
// left out (made-up initials here), and so is the visitor's address.

type Item = {
  icon: string
  title: string
  sub?: string
  who?: string
  fold?: string
  nested?: boolean
  pk?: string
}

const FEED: Array<Item> = [
  { icon: "✨", title: "New project created", sub: "1w ago", who: "L" },
  { icon: "👋", title: "Project shared", sub: "with Maya and 2 others" },
  {
    icon: "📥",
    title: "Figma import",
    sub: "143 layers, 3 errors",
    pk: "act:figma",
  },
  { icon: "", title: "", fold: "+12 more…" },
  { icon: "😎", title: "Maya visited", sub: "6d ago", who: "M" },
  { icon: "", title: "", fold: "8 autosaves…", pk: "act:autosaves" },
  {
    icon: "🌿",
    title: "Project branched",
    sub: "Visit…",
    nested: true,
    pk: "act:branched",
  },
  {
    icon: "📦",
    title: "Project assets published",
    sub: "12 tokens, 2 mixins, 1 font, 28 images",
    pk: "act:published",
  },
  { icon: "🕵️", title: "Anonymous visited", sub: "2d ago" },
  { icon: "🍴", title: "Project forked", sub: "Visit…", nested: true },
  {
    icon: "🤝",
    title: "Project merged",
    sub: "1d ago",
    who: "S",
    nested: true,
    pk: "act:merged",
  },
]

/** State keys: comment: the new comment arrived; open: a fold opened. */
export function Activity20({ s }: { s: State }) {
  const items = FEED.concat(
    s.comment
      ? [
          {
            icon: "💬",
            title: "New comment",
            sub: "What do you think about adding a border and a 4px radius? I looked into the style…",
            pk: "act:comment",
          },
        ]
      : []
  )
  return (
    <div className="pk-scroll flex flex-col" data-pk="activity">
      <div className="pk-head" style={{ minHeight: 48 }}>
        <span className="text-[14px]">Activity</span>
      </div>
      {items.map((it, i) =>
        it.fold ? (
          <span
            key={i}
            className="pk-faint flex h-9 items-center gap-2 px-4"
            style={{ borderTop: "1px solid var(--pk-line)" }}
            data-pk={it.pk}
          >
            <TbChevronRight className="h-3.5 w-3.5" />
            {s.open === it.pk ? "8 autosaves, 6d ago to 3d ago" : it.fold}
          </span>
        ) : (
          <span
            key={i}
            className="pk-act"
            data-nested={it.nested || undefined}
            data-new={it.pk === "act:comment" || undefined}
            data-pk={it.pk}
          >
            <span className="w-5 flex-none text-center text-[15px] leading-5">
              {it.icon}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium">{it.title}</span>
              {it.sub && <span className="pk-faint leading-4">{it.sub}</span>}
              {it.pk === "act:comment" && (
                <span className="flex items-center justify-between pt-1">
                  <span className="pk-faint">4 replies…</span>
                  <Avatars names={["M", "S", "K"]} />
                </span>
              )}
            </span>
            {it.who && <Avatars names={[it.who]} />}
            {it.nested && it.sub === "Visit…" && (
              <TbChevronRight className="opacity-50" />
            )}
          </span>
        )
      )}
    </div>
  )
}
