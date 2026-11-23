import { Link } from "@tanstack/react-router"
import { GROUPS } from "@/components/work/anthropic/docs"
import { ANTHROPIC_MEDIA } from "@/components/work/anthropic/media"
import { MediaStrip } from "@/components/work/claude/media"
import { NextTab } from "@/components/work/claude/next-tab"

/** The docs' contents: each group with its topics, linked. */
export function OverviewDoc() {
  return (
    <>
      {/* The studio's clips and stills of the work, as the Claude overview
          opens with its own. */}
      <MediaStrip items={ANTHROPIC_MEDIA} />
      {GROUPS.map((group) => (
        <section
          key={group.slug}
          className="grid gap-x-6 gap-y-4 pb-12 lg:grid-cols-12"
        >
          <h3 className="font-medium lg:col-span-3">{group.name}</h3>
          {/* One topic a row, read straight down: the title in the first
              three of the figure's nine columns, its summary in the other
              six. A row behaves like a row of the home page's lists: under
              the pointer it becomes a panel, its title takes the accent and
              the wave plays over it (`data-wave`; these rows are the one
              exception to the docs' no-wave rule). The panel's padding hangs
              outside the columns, so the text stays on them and the first
              title on the group's name. A line divides the rows; the lines
              above and below a row's panel are hidden while it shows.
              Narrower, the summary goes under the title. */}
          <ul className="-my-3 min-w-0 lg:col-span-9">
            {group.docs.map((doc) => (
              <li
                key={doc.slug}
                className="border-b last:border-b-0 hover:border-transparent has-[+li:hover]:border-transparent"
              >
                <Link
                  to="/work/anthropic/$doc"
                  params={{ doc: group.slug }}
                  hash={doc.slug}
                  data-wave
                  className="group/item -mx-4 grid gap-x-6 gap-y-1 rounded-2xl bg-background px-4 py-3 hover:bg-card lg:grid-cols-9 lg:items-baseline"
                >
                  {/* A title that wraps sets tight, 20px a line; the 2px above
                      and below keep a one-line title 24px tall, on the same
                      line as the group's name. */}
                  <span className="py-0.5 leading-5 group-hover/item:text-tint group-hover/item:underline lg:col-span-3">
                    {doc.title}
                  </span>
                  {doc.summary && (
                    <span className="text-xs text-pretty text-muted-foreground lg:col-span-6">
                      {doc.summary}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <NextTab
        to="/work/anthropic/$doc"
        params={{ doc: GROUPS[0].slug }}
        name={GROUPS[0].name}
      />
    </>
  )
}
