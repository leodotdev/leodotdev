import { Link } from "@tanstack/react-router"
import { ROW, ROW_LINK, RowContent } from "@/components/projects/list-row"
import { recentWork } from "@/lib/recent-work"

/**
 * The hand-written "Recent work" list; only rendered at leo.dev/work. Its
 * rows are the Experience list's rows (`RowContent`), with a work's name
 * where a position goes and who it was for where the company goes.
 */
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
            <RowContent
              logo={work.logo}
              roundLogo={work.roundLogo}
              fallback={(work.client ?? work.title).charAt(0)}
              title={work.title}
              detail={work.summary}
              name={
                work.client && (
                  <span className={linked ? ROW_LINK : undefined}>
                    {work.client}
                  </span>
                )
              }
              location={work.location}
              duration={work.year}
            />
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
