import { cn } from "@/lib/utils"

// The page around a component shown in use, as a skeleton: plain bars where
// its text, buttons, and pictures would be, so only the component itself is
// drawn for real (Leo, 2026-11-19: "everything that isn't the component can
// be like a minimal skeleton"). A skeleton is still accurate: each piece is
// laid out as the real thing is (the header's logo at the left, its links
// and two buttons at the right, folding at the widths the real header
// folds at), and what surrounds a component is what surrounds it on the
// site's own pages, as the Figma file's templates have them (the proof cards
// come straight after a hero, the accordion sits under a one-line heading
// with link cards after it, a quote sits in a story's two-column body, and so
// on). The styles are `.cds-skel*` in src/claude-ds.css; everything here is
// hidden from screen readers.

/** One bar: a line of text by default, or any block given a size. */
export function Bar({
  w = "100%",
  h,
  r,
  className,
}: {
  w?: number | string
  h?: number
  /** Its corner radius; half its height by default. */
  r?: number
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn("cds-skel", className)}
      style={{ width: w, height: h, borderRadius: r }}
    />
  )
}

/** A paragraph: a few lines, the last one short. */
export function Lines({
  count = 3,
  last = "62%",
  className,
}: {
  count?: number
  last?: string
  className?: string
}) {
  return (
    <span aria-hidden className={cn("cds-skel-lines", className)}>
      {Array.from({ length: count }, (_, i) => (
        <Bar key={i} w={i === count - 1 ? last : "100%"} />
      ))}
    </span>
  )
}

/**
 * The site's header, as the real one is laid out: the logo at the left;
 * at the right its five links, then the outlined button and the filled one;
 * under them the breadcrumb bar. It folds as the real header does: the
 * outlined button goes first, then the links and the other button, leaving
 * the menu button.
 */
export function SkeletonNav() {
  return (
    <div className="cds-skel-nav" aria-hidden>
      <div>
        <Bar w={96} h={24} />
        <div className="cds-skel-nav-links">
          {[84, 68, 76, 58, 52].map((w) => (
            <Bar key={w} w={w} />
          ))}
        </div>
        <div className="cds-skel-nav-actions">
          <Bar w={116} h={36} r={8} className="cds-skel-outline" />
          <Bar w={98} h={36} r={8} className="cds-skel-solid" />
          <span className="cds-skel-nav-toggle">
            <Bar w={20} h={2} />
            <Bar w={20} h={2} />
            <Bar w={12} h={2} />
          </span>
        </div>
      </div>
      <div>
        <span>
          <Bar w={52} h={10} />
          <Bar w={84} h={10} />
        </span>
        <Bar w={72} h={10} />
      </div>
    </div>
  )
}

/**
 * The home page's hero, which the header sits over: a two-line headline, a
 * lead, the prompt input and its three chips, beside the illustration.
 */
export function SkeletonHero() {
  return (
    <div className="cds-skel-hero" aria-hidden>
      <div>
        <Bar w="78%" h={52} />
        <Bar w="96%" h={52} />
        <Lines count={2} last="64%" />
        <Bar w="min(480px, 100%)" h={56} r={12} className="cds-skel-outline" />
        <span className="cds-skel-row">
          <Bar w={76} h={28} r={8} className="cds-skel-outline" />
          <Bar w={76} h={28} r={8} className="cds-skel-outline" />
          <Bar w={72} h={28} r={8} className="cds-skel-outline" />
        </span>
      </div>
      <span className="cds-skel cds-skel-picture" />
    </div>
  )
}

/**
 * A section's header, centered: a pictogram over the headline, then perhaps
 * a line under it and a row of buttons.
 */
export function SkeletonHeader({
  pictogram = true,
  line = false,
  buttons = 0,
}: {
  pictogram?: boolean
  line?: boolean
  /** How many buttons: the first filled, the rest outlined. */
  buttons?: number
}) {
  return (
    <div className="cds-skel-header" aria-hidden>
      {pictogram && <Bar w={80} h={80} r={20} />}
      <Bar w="min(420px, 76%)" h={32} />
      {line && <Bar w="min(320px, 56%)" />}
      {buttons > 0 && (
        <span className="cds-skel-row">
          {Array.from({ length: buttons }, (_, i) => (
            <Bar
              key={i}
              w={i === 0 ? 132 : 108}
              h={36}
              r={8}
              className={i === 0 ? "cds-skel-solid" : "cds-skel-outline"}
            />
          ))}
        </span>
      )}
    </div>
  )
}

/** The end of a centered hero: a two-line headline, a lead, two buttons. */
export function SkeletonHeroEnd() {
  return (
    <div className="cds-skel-header" aria-hidden>
      <Bar w="min(560px, 88%)" h={48} />
      <Bar w="min(400px, 62%)" h={48} />
      <Lines count={2} last="60%" className="cds-skel-lead" />
      <span className="cds-skel-row">
        <Bar w={132} h={40} r={8} className="cds-skel-solid" />
        <Bar w={120} h={40} r={8} className="cds-skel-outline" />
      </span>
    </div>
  )
}

/** A row of three link cards: a title at the top, its kind at the foot. */
export function SkeletonCards() {
  return (
    <div className="cds-skel-cards" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i}>
          <Bar w="72%" h={14} />
          <Bar w="38%" h={10} />
        </span>
      ))}
    </div>
  )
}

/** The first rows of a list of questions: each a line and a plus. */
export function SkeletonQuestions() {
  return (
    <div className="cds-skel-questions" aria-hidden>
      {["58%", "44%", "66%"].map((w) => (
        <span key={w}>
          <Bar w={w} h={14} />
          <Bar w={14} h={14} r={3} />
        </span>
      ))}
    </div>
  )
}

/** The page's closing call: a rule, a large two-line headline, two buttons. */
export function SkeletonPrefooter() {
  return (
    <div className="cds-skel-header cds-skel-prefooter" aria-hidden>
      <Bar w="min(520px, 84%)" h={40} />
      <Bar w="min(340px, 56%)" h={40} />
      <span className="cds-skel-row">
        <Bar w={132} h={40} r={8} className="cds-skel-solid" />
        <Bar w={120} h={40} r={8} className="cds-skel-outline" />
      </span>
    </div>
  )
}

/** The top of the footer: the logo and prompt input, then columns of links. */
export function SkeletonFooter() {
  return (
    <div className="cds-skel-footer" aria-hidden>
      <span>
        <Bar w={96} h={24} />
        <Bar w="100%" h={40} r={10} className="cds-skel-outline" />
      </span>
      {[0, 1, 2, 3].map((i) => (
        <span key={i}>
          <Bar w="46%" h={8} />
          <Bar w="78%" h={10} />
          <Bar w="62%" h={10} />
          <Bar w="70%" h={10} />
        </span>
      ))}
    </div>
  )
}

/** A set of tabs: the track, with the current tab filled in. */
export function SkeletonTabs() {
  return (
    <span className="cds-skel cds-skel-tabs" aria-hidden>
      <Bar w="22%" h={36} r={8} className="cds-skel-solid" />
    </span>
  )
}

/** A carousel's controls: a button, the bullets, a button. */
export function SkeletonCarouselUi() {
  return (
    <span className="cds-skel-row cds-skel-carousel-ui" aria-hidden>
      <Bar w={36} h={36} r={8} className="cds-skel-outline" />
      <span>
        {[0, 1, 2, 3, 4].map((i) => (
          <Bar
            key={i}
            w={5}
            h={5}
            className={i === 0 ? "cds-skel-solid" : ""}
          />
        ))}
      </span>
      <Bar w={36} h={36} r={8} className="cds-skel-outline" />
    </span>
  )
}

/**
 * A stretch of a story's body: its part's name in the left column, the
 * running text in the right, where `children` (an inline quote) sit between
 * paragraphs.
 */
export function SkeletonBody({ children }: { children?: React.ReactNode }) {
  return (
    <div className="cds-skel-body">
      <span aria-hidden>
        <Bar w={24} h={24} r={6} />
        <Bar w="42%" h={16} />
      </span>
      <div>
        <Lines count={4} />
        {children}
        <Lines count={3} />
      </div>
    </div>
  )
}

/** A story's picture, the width of its text. */
export function SkeletonImage() {
  return <span className="cds-skel cds-skel-image" aria-hidden />
}

/** A story's closing part: an illustration beside a title and its text. */
export function SkeletonAside() {
  return (
    <div className="cds-skel-aside" aria-hidden>
      <span className="cds-skel" />
      <span>
        <Bar w="56%" h={20} />
        <Lines count={5} />
      </span>
    </div>
  )
}

/** A row of five customer logos between two rules. */
export function SkeletonLogos() {
  return (
    <div className="cds-skel-logos" aria-hidden>
      {[118, 96, 132, 88, 124].map((w) => (
        <Bar key={w} w={w} h={26} />
      ))}
    </div>
  )
}

/** A section's opening: its headline at the left, its text at the right. */
export function SkeletonCopy() {
  return (
    <div className="cds-skel-copy" aria-hidden>
      <span>
        <Bar w="88%" h={32} />
        <Bar w="56%" h={32} />
      </span>
      <Lines count={3} />
    </div>
  )
}

/** Three features in columns, ruled at the left: icon, title, text. */
export function SkeletonFeatures() {
  return (
    <div className="cds-skel-features" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i}>
          <Bar w={28} h={28} r={6} />
          <Bar w="58%" h={16} />
          <Lines />
        </span>
      ))}
    </div>
  )
}

/**
 * A component in its place on a page, for a figure that is not a whole
 * page: what comes before it on the site's own pages, and what comes after,
 * both as bars. By default, the header of its section and the page's closing
 * call. `className` is for the box the component itself sits in.
 */
export function SkeletonContext({
  before = <SkeletonHeader />,
  after = <SkeletonPrefooter />,
  className,
  children,
}: {
  before?: React.ReactNode
  after?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="cds-skel-context">
      <div className="cds-skel-before">{before}</div>
      <div className={className}>{children}</div>
      <div className="cds-skel-after">{after}</div>
    </div>
  )
}

/**
 * A page with a component on it: the site's header above (unless the
 * component is one from further down a page), the component, and what comes
 * after it on such a page, cut off by the bottom of the figure as a window
 * cuts off a page. By default, what follows a hero on a Solutions page: the
 * row of customer logos, then a section's opening and its three features.
 */
export function SkeletonPage({
  nav = true,
  rest,
  children,
}: {
  nav?: boolean
  rest?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="cds-skel-page">
      {nav && <SkeletonNav />}
      {children}
      <div className="cds-skel-rest">
        {rest ?? (
          <>
            <SkeletonLogos />
            <SkeletonCopy />
            <SkeletonFeatures />
          </>
        )}
      </div>
    </div>
  )
}
