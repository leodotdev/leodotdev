import { Link } from "@tanstack/react-router"
import { recentWork } from "@/lib/recent-work"
import { cn } from "@/lib/utils"

const ROW =
  "group/item block rounded-[20px] border border-transparent bg-background hover:bg-card md:mx-6"

/** The hand-written "Recent work" list; only rendered at leo.dev/work. */
export function RecentWorkSection() {
  return (
    <div id="recent-work">
      <div className="px-6 pb-6 md:px-12">
        <div className="font-semibold">Recent work</div>
      </div>

      <div className="flex flex-col [&>*+*]:-mt-[0.5px]">
        {recentWork.map((work) => {
          const linked = Boolean(work.to ?? work.href)
          const content = (
            <div className="flex w-full items-center justify-between gap-4 p-6">
              <div className="flex min-w-0 flex-col gap-1">
                <div
                  className={cn(
                    linked &&
                      "group-hover/item:text-tint group-hover/item:underline"
                  )}
                >
                  {work.title}
                </div>
                <div className="text-xs text-pretty text-muted-foreground">
                  {work.summary}
                </div>
              </div>
              <div className="flex max-w-[45%] flex-col items-end gap-1 text-end md:max-w-none md:shrink-0">
                {work.client && <div>{work.client}</div>}
                <div className="text-xs text-muted-foreground">{work.year}</div>
              </div>
            </div>
          )
          // A row is the link itself: to the work's own page, or to an
          // outside address. A row with neither is plain.
          if (work.to)
            return (
              <Link key={work.title} to={work.to} data-wave className={ROW}>
                {content}
              </Link>
            )
          if (work.href)
            return (
              <a
                key={work.title}
                data-wave
                className={ROW}
                href={work.href}
                target="_blank"
              >
                {content}
              </a>
            )
          return (
            <div key={work.title} data-wave className={ROW}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
