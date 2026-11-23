import {
  Cell,
  Section,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"
import { PlayButton } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The atoms that are type and pictures more than controls: Caption and
// Footnote, Powered by Claude, Media, and Rich Text: Headline.
// The words in them are the file's own samples.

const muted = { color: "var(--ads-fg-3)" }

const CAPTION =
  "Our most capable model yet. Claude Opus 4.5 sets a new standard for coding, agents, and computer use—built for the work that matters most."

const DOUBLE = [
  "New research shows Claude models can sometimes recognize and report on their own internal thought processes. Using concept injection techniques, researchers found that Claude Opus 4 and 4.1 can detect when specific concepts are",
  "artificially introduced into their neural activity, suggesting a rudimentary form of introspective awareness that may grow more sophisticated as models become more capable",
]

const PHOTO = "/work/anthropic/atoms/media-office.webp"

/** One of the four types, with its mono prefix where it has one. */
function Caption({
  type,
  prefix = "Step 1a",
}: {
  type: "default" | "footnote" | "double" | "title"
  prefix?: string | null
}) {
  if (type === "double")
    return (
      <div className="ads-caption-row" data-type="double">
        {DOUBLE.map((text) => (
          <p key={text} className="ads-caption-2">
            {text}
          </p>
        ))}
      </div>
    )
  if (type === "title")
    return (
      <div className="ads-caption-row" data-type="title">
        <p>A conversation with Anthropic’s CEO</p>
      </div>
    )
  return (
    <div className="ads-caption-row" data-type={type}>
      {prefix && <span className="ads-caption-2-mono">{prefix}</span>}
      <p className="ads-caption-1">{CAPTION}</p>
    </div>
  )
}

export function CaptionsDoc() {
  return (
    <Section caption="Four types: Default, Double, Title, and the footer’s footnote, set vertically. Default and the footnote can lead with a mono prefix.">
      <Specimen figure>
        <div className="grid gap-10 p-6 md:grid-cols-2 md:p-8">
          <Cell label="Default" className="flex-col !items-stretch">
            <div className="ads-media aspect-[3/2]">
              <img src={PHOTO} alt="" loading="lazy" decoding="async" />
            </div>
            <Caption type="default" />
          </Cell>
          <Cell label="Title" className="flex-col !items-stretch">
            <div className="ads-media aspect-[3/2]">
              <img src={PHOTO} alt="" loading="lazy" decoding="async" />
            </div>
            <Caption type="title" />
          </Cell>
          <Cell label="Double" className="flex-col !items-stretch">
            <Caption type="double" />
          </Cell>
          <Cell
            label="Footer Footnote (Vertical)"
            className="flex-col !items-stretch"
          >
            <Caption type="footnote" />
          </Cell>
        </div>
      </Specimen>
    </Section>
  )
}

/** "Powered by" in small sans and Claude in serif. */
export function PoweredByClaude() {
  return (
    <span className="ads-powered">
      <span>Powered by</span>
      <span>Claude</span>
    </span>
  )
}

export function PoweredDoc() {
  return (
    <Section caption="One size: “Powered by” in small sans and Claude in serif, both in the quaternary foreground.">
      <ThemeStrip figure>
        <div className="py-2">
          <PoweredByClaude />
        </div>
      </ThemeStrip>
    </Section>
  )
}

const RATIOS = [
  ["Square 1:1", "1/1"],
  ["5:4", "5/4"],
  ["4:5", "4/5"],
  ["4:3", "4/3"],
  ["3:2", "3/2"],
  ["16:9", "16/9"],
  ["2:1", "2/1"],
] as const

// The cursor presses the play button. Its note is the Media component's
// two boolean properties in the file.
const MEDIA_DEMO: Array<DemoStep> = [
  {
    on: ".ads-play",
    click: true,
    rest: 1600,
    note: {
      kind: "concept",
      title: "Play button",
      text: "Two toggles on the Media component: Show XXL Play Button and Show LG Play Button.",
    },
  },
]

/** A picture in one of the system's aspect ratios, a video where it plays. */
export function Media({
  ratio = "16/9",
  src = PHOTO,
  alt = "",
  play,
}: {
  ratio?: string
  src?: string
  alt?: string
  play?: "small" | "large"
}) {
  return (
    <div className="ads-media" style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {play && <PlayButton size={play} />}
    </div>
  )
}

export function MediaDoc() {
  return (
    <Section caption="Seven aspect ratios, from square to 2:1, each able to show a play button over its middle.">
      <Specimen figure className="max-lg:overflow-x-auto">
        <div className="grid w-max min-w-full grid-cols-[repeat(7,7.5rem)] items-start justify-center gap-x-4 gap-y-3 p-6 md:p-8">
          {RATIOS.map(([name]) => (
            <div key={name} className="ads-caption" style={muted}>
              {name}
            </div>
          ))}
          {RATIOS.map(([name, ratio]) => (
            <Media key={name} ratio={ratio} />
          ))}
        </div>
      </Specimen>
      <Specimen figure>
        <DemoCursor
          steps={MEDIA_DEMO}
          className="mx-auto max-w-[40rem] p-6 md:p-8"
        >
          <Media ratio="16/9" play="large" />
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

const HEADLINES = [
  ["H1", "h1", "ads-heading-3"],
  ["H2", "h2", "ads-heading-4"],
  ["H3", "h3", "ads-heading-5"],
  ["H4", "h4", "ads-heading-6"],
  ["H4 Alt", "h4-alt", ""],
  ["Caption heading", "caption", ""],
] as const

export function RichTextDoc() {
  return (
    <Section caption="Six sizes: H1 to H4, H4 Alt, and a caption heading. In an article’s text H1 takes the Heading 3 style, and each level steps down one; each has room above it and less below.">
      <Specimen figure>
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-10 px-6 pb-8 md:px-8">
          {HEADLINES.map(([name, size, type]) => (
            <div key={size} className="contents">
              <div className="ads-caption" style={muted}>
                {name}
              </div>
              <p className={`ads-headline ${type}`} data-size={size}>
                Headline text here
              </p>
            </div>
          ))}
        </div>
      </Specimen>
    </Section>
  )
}
