import { Link, useRouter } from "@tanstack/react-router"
import { ROW, ROW_LINK, RowContent } from "@/components/projects/list-row"
import { ShowMoreButton, useShowMore } from "@/components/projects/show-more"
import { recentWork } from "@/lib/recent-work"
import { wave } from "@/lib/wave"
import type { RecentWork } from "@/lib/recent-work"

/**
 * The hand-written "Recent work" list; only rendered at leo.dev/work. Its
 * rows are the Experience list's rows (`RowContent`), with a work's name
 * where a position goes and who it was for where the company goes.
 */
export function RecentWorkSection() {
  // A work's own page arrives in a wave over the whole page, starting from
  // its row: the wave plays on the page (`#app`, as the theme switch's does)
  // while the router goes there, and the new page is taken from its top. A
  // click with a modifier key keeps its browser meaning (a new tab, a new
  // window).
  const router = useRouter()
  const open = (
    e: React.MouseEvent<HTMLAnchorElement>,
    to: NonNullable<RecentWork["to"]>
  ) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    e.preventDefault()
    void wave(
      document.getElementById("app"),
      async () => {
        await router.navigate({ to })
        // A frame for the new page to be on screen before it is captured.
        await new Promise((done) => requestAnimationFrame(done))
        window.scrollTo({ top: 0, behavior: "instant" })
      },
      { source: e.currentTarget, focus: e.nativeEvent }
    )
  }

  // Like the page's other sections: its first rows, then Show more.
  const { sectionRef, visible, toggle, reveal } = useShowMore(recentWork)

  return (
    <div id="recent-work" ref={sectionRef}>
      <div className="px-6 pb-6 md:px-12">
        <div className="font-semibold">Recent work</div>
      </div>

      <div className="flex flex-col [&>*+*]:-mt-[0.5px]">
        {visible.map((work, i) => {
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
              duration={work.year}
            />
          )
          // A row is the link itself: to the work's own page, or to an
          // outside address. A row with neither is plain.
          if (work.to)
            return (
              <Link
                key={work.title}
                to={work.to}
                {...reveal(i)}
                data-wave
                // Its click is the page's wave, above, not a tap wave on
                // the row.
                data-wave-manual
                className={ROW}
                onClick={(e) => open(e, work.to!)}
              >
                {content}
              </Link>
            )
          if (work.href)
            return (
              <a
                key={work.title}
                {...reveal(i)}
                data-wave
                className={ROW}
                href={work.href}
                target="_blank"
              >
                {content}
              </a>
            )
          return (
            <div key={work.title} {...reveal(i)} data-wave className={ROW}>
              {content}
            </div>
          )
        })}
      </div>

      <ShowMoreButton toggle={toggle} />
    </div>
  )
}
