import { Lines } from "@/components/work/claude/skeleton"
import { cn } from "@/lib/utils"

// The article page these organisms sit on, as a skeleton: its column of
// running text as plain bars, so only the organism is drawn for real. In the
// file's responsive frames ("desktop LG", "mobile xs") every one of them
// sits between paragraphs of an article; the video playlist reaches wider
// than the text. The styles are `.ads-om-*` in src/anthropic/organisms-media.css.

/** A paragraph of the article's running text. */
export function ArticleText({ count = 3 }: { count?: number }) {
  return (
    <div className="ads-om-column" aria-hidden>
      <Lines count={count} last="58%" />
    </div>
  )
}

/**
 * An organism in its place in an article: a paragraph before it and one
 * after. `wide` lets it reach past the text column, as the playlist does.
 */
export function ArticleContext({
  wide = false,
  className,
  children,
}: {
  wide?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("ads-om-page", className)}>
      <div className="ads-om-article">
        <ArticleText />
        <div className={wide ? "ads-om-wide" : "ads-om-column"}>{children}</div>
        <ArticleText count={4} />
      </div>
    </div>
  )
}

/**
 * The line under a figure of an article (the file's "Caption or Footnote"
 * and "Fig Caption"): a label in mono beside its text, above it on a phone.
 */
export function FigCaption({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="ads-fig-caption">
      <span className="ads-caption-2-mono">{label}</span>
      <p className="ads-caption-1">{children}</p>
    </div>
  )
}

// The file's sample caption, under every figure of its article.
export const ROBODOG =
  "Yet as the mechanical whirring and rubberized footfalls grew louder, the humans startled. They had been trying, without success, to establish a connection between their computers and a robotic quadruped—a “robodog.”"
