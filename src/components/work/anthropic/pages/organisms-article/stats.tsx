import { useEffect, useRef, useState } from "react"
import { TbArrowLeft, TbArrowRight } from "react-icons/tb"
import { Button } from "@/components/work/anthropic/specimens"

// Stats on Anthropic.com, from the Figma file's "Stats" section (Organisms
// page): the "Stat Item" component (three types, Center, Left, and Single, in
// two sizes) and the "Stats" row of them, with its pagination. The sample
// words are the file's own. Styles: `.ads-stat*` in
// src/anthropic/organisms-article.css.

export type StatType = "center" | "left" | "single"
export type StatSize = "medium" | "large"

export type Stat = { value: string; description: string; caption: string }

export const SAMPLE_STAT: Stat = {
  value: "123%",
  description: "Stat Description",
  caption: "Stat Caption",
}

/**
 * One stat: the figure, then its description and a caption. Center and Left
 * stack the three, centered or at the left, ruled at the left; Single sets
 * the figure beside the other two.
 */
export function StatItem({
  type = "center",
  size = "medium",
  stat = SAMPLE_STAT,
}: {
  type?: StatType
  size?: StatSize
  stat?: Stat
}) {
  return (
    <div className="ads-stat" data-type={type} data-size={size}>
      <div
        className={
          size === "large"
            ? "ads-display-1 ads-stat-value"
            : "ads-heading-1 ads-stat-value"
        }
      >
        {stat.value}
      </div>
      <div className="ads-stat-text">
        <div className="ads-body-2">{stat.description}</div>
        <div className="ads-caption-2 ads-stat-caption">{stat.caption}</div>
      </div>
    </div>
  )
}

/** Stats on a page: as many as there is room for, three at most. */
const perPage = (width: number) => (width >= 720 ? 3 : width >= 432 ? 2 : 1)

/**
 * A row of stats. With more than fit, they turn in pages, with the file's
 * pagination under them: arrows either side of the page's number. As many
 * show as the row has room for: three, two in a long piece's column, one on
 * a phone. The arrows go round: past the last page is the first.
 */
export function Stats({
  stats = Array.from({ length: 12 }, () => SAMPLE_STAT),
  type = "center",
  size = "medium",
  pagination = true,
}: {
  stats?: Array<Stat>
  type?: StatType
  size?: StatSize
  pagination?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const [per, setPer] = useState(2)
  const [page, setPage] = useState(0)
  useEffect(() => {
    const el = root.current
    if (!el) return
    // The width as laid out, which a scaled figure does not change.
    const observer = new ResizeObserver(([entry]) =>
      setPer(perPage(entry.contentRect.width))
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const shown = pagination ? per : stats.length
  const pages = Math.max(1, Math.ceil(stats.length / shown))
  const at = Math.min(page, pages - 1)
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    <div
      ref={root}
      className="ads-stats"
      style={{ "--per": shown } as React.CSSProperties}
    >
      <div className="ads-stats-window">
        <div
          className="ads-stats-track"
          style={{ transform: `translateX(${-100 * at}%)` }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="ads-stats-cell"
              data-first={i % shown === 0 ? "" : undefined}
              aria-hidden={
                i < at * shown || i >= (at + 1) * shown ? true : undefined
              }
            >
              <StatItem type={type} size={size} stat={stat} />
            </div>
          ))}
        </div>
      </div>
      {pagination && pages > 1 && (
        <div className="ads-stats-pages">
          <Button
            variant="tertiary"
            size="small"
            icon="only"
            glyph={<TbArrowLeft aria-hidden />}
            onClick={() => setPage((at - 1 + pages) % pages)}
          >
            Previous
          </Button>
          <span className="ads-caption-2-mono" aria-live="polite">
            {pad(at + 1)} / {pad(pages)}
          </span>
          <Button
            variant="tertiary"
            size="small"
            icon="only"
            glyph={<TbArrowRight aria-hidden />}
            onClick={() => setPage((at + 1) % pages)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
