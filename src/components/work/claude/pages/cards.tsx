import { useEffect, useState } from "react"
import {
  TbArrowUp,
  TbCheck,
  TbCopy,
  TbPaperclip,
  TbPlayerPlayFilled,
  TbVideo,
} from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Button } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

// The file's own sample cards: its row of three, and the story its card
// with an image carries.
const LINKS = [
  ["Claude Code documentation", "Developer doc"],
  ["Claude Code tutorials", "Developer doc"],
  ["How Anthropic teams use Claude Code", "Case study"],
]
const STORY = [
  "Gradient Labs transforms financial services customer support with Claude",
  "Customer story",
]

/**
 * A link card: a title over the kind of thing it leads to. With `image` it
 * also carries an illustration on a tile, above the text or, where the card
 * has the width for it, beside it.
 */
function LinkCard({
  title,
  kind,
  image = false,
}: {
  title: string
  kind: string
  image?: boolean
}) {
  return (
    <a
      className="cds-card-link"
      data-image={image ? "" : undefined}
      href="#cards"
      onClick={(e) => e.preventDefault()}
      {...quiet}
    >
      {image && (
        <span className="cds-card-link-art">
          <img src="/work/claude/illustrations/node-cursor.svg" alt="" />
        </span>
      )}
      <span className="cds-card-link-text">
        <span>{title}</span>
        <span className="cds-meta-link">
          <TbPaperclip aria-hidden />
          {kind}
        </span>
      </span>
    </a>
  )
}

const PROMPT =
  "Create discussion questions that build on yesterday's lecture about supply chain disruption."

/** A command that copies itself: the field says "Copied!" for three seconds. */
function ClipboardCopy({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 3000)
    return () => clearTimeout(timer)
  }, [copied])
  return (
    <div className="cds-copy">
      <code aria-live="polite">{copied ? "Copied!" : command}</code>
      <button
        type="button"
        aria-label="Copy"
        onClick={(e) => {
          // Only a visitor's own click copies. The docs' demo cursor presses
          // this button too, and must not write to anyone's clipboard.
          if (e.nativeEvent.isTrusted)
            void navigator.clipboard.writeText(command)
          setCopied(true)
        }}
        {...quiet}
      >
        {copied ? <TbCheck aria-hidden /> : <TbCopy aria-hidden />}
      </button>
    </div>
  )
}

// What the demo cursor tries. It waits under the middle of the cards, off
// all of them, so they show at rest, then looks over each: the one under it
// lifts and the others step back. Each time round it starts from there.
const LINKS_DEMO: Array<DemoStep> = [
  { on: ".cds-card-links", at: [0.5, 1.08], idle: true, rest: 1200 },
  { on: ".cds-card-link", nth: 0, rest: 1000 },
  { on: ".cds-card-link", nth: 1, rest: 1000 },
  { on: ".cds-card-link", nth: 2, rest: 1000 },
]

// It looks at the card with an image and presses the video card's two
// buttons, then narrows the pair: the video goes above its text, then the
// image above its title, down to a phone's width, and it lets them out again.
const ADAPT_DEMO: Array<DemoStep> = [
  { on: ".cds-card-link", rest: 700 },
  { on: ".cds-play", click: true },
  { on: ".cds-card-video .cds-btn", click: true, rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 520 },
  { on: ".cds-resize-grip", nth: 1, drag: 400 },
  { on: ".cds-resize-grip", nth: 1, drag: 326 },
  { on: ".cds-play", click: true, rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

// It looks over the prompts (the others step back), sends the second as
// written, rewrites the third, and copies the command. The copy is for show:
// nothing is written to the visitor's clipboard.
const PROMPTS_DEMO: Array<DemoStep> = [
  { on: ".cds-prompt", nth: 0, at: [0.5, 0.3], rest: 900 },
  { on: ".cds-prompt", nth: 1, at: [0.5, 0.3], rest: 900 },
  { on: ".cds-prompt .cds-btn", nth: 1, click: true },
  {
    on: ".cds-prompt",
    nth: 2,
    at: [0.5, 0.3],
    type: "Turn this week's reading into five quiz questions.",
  },
  { on: ".cds-copy button", click: true, rest: 500 },
  { on: ".cds-copy code", rest: 1800 },
]

export function CardsDoc() {
  return (
    <>
      <Section title="Link & Video Cards">
        <Specimen caption="Hovering one card lifts it and dims its siblings.">
          <DemoCursor steps={LINKS_DEMO} className="p-6 md:p-8">
            <div className="cds-card-links">
              {LINKS.map(([title, kind]) => (
                <LinkCard key={title} title={title} kind={kind} />
              ))}
            </div>
          </DemoCursor>
        </Specimen>
        <Specimen caption="With an image or a video, the card is a row where it has room and a column where it does not.">
          <DemoCursor steps={ADAPT_DEMO} className="p-6 md:p-8">
            {/* As tall as the two cards at their narrowest, so the figure
                keeps one height while it is resized. */}
            <Resizable
              label="Card width"
              // The video goes above its text first, then the image above
              // its title.
              sizes={[["Desktop"], ["Tablet", 560], ["Mobile", 459]]}
              className="flex min-h-[800px] flex-col items-center justify-center gap-8"
            >
              <div className="cds-card-link-fit">
                <LinkCard image title={STORY[0]} kind={STORY[1]} />
              </div>
              <div className="cds-card-video-wrap">
                <div className="cds-card-video">
                  <div className="cds-card-video-media">
                    <button
                      type="button"
                      className="cds-play"
                      aria-label="Play"
                      {...quiet}
                    >
                      <TbPlayerPlayFilled aria-hidden />
                    </button>
                  </div>
                  <div className="cds-card-video-body">
                    <span className="cds-meta-link">
                      <TbVideo aria-hidden />
                      Webinar
                    </span>
                    <div className="cds-card-title">
                      How NBIM transformed the world&rsquo;s largest sovereign
                      wealth fund with agentic AI
                    </div>
                    <Button variant="tertiary" icon="none">
                      Register and watch
                    </Button>
                  </div>
                </div>
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section title="Prompt Box & Clipboard Copy">
        <Specimen caption="Prompts are editable, and a copy holds “Copied!” for three seconds.">
          <DemoCursor
            steps={PROMPTS_DEMO}
            className="flex flex-col items-center gap-8 p-6 md:p-8"
          >
            <div className="cds-prompts w-full">
              {[0, 1, 2].map((i) => (
                <label key={i} className="cds-prompt">
                  <textarea
                    defaultValue={PROMPT}
                    aria-label="Prompt"
                    spellCheck={false}
                  />
                  <span className="cds-prompt-controls">
                    <button
                      type="button"
                      className="cds-btn"
                      data-variant="clay"
                      data-icon="only"
                      {...quiet}
                    >
                      <span>Ask Claude</span>
                      <TbArrowUp aria-hidden />
                    </button>
                  </span>
                </label>
              ))}
            </div>
            <ClipboardCopy command="npm install -g @anthropic-ai/claude-code" />
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
