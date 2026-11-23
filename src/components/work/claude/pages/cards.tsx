import { useEffect, useState } from "react"
import {
  TbArrowUp,
  TbCheck,
  TbCopy,
  TbPaperclip,
  TbVideo,
} from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import {
  SkeletonContext,
  SkeletonFooter,
  SkeletonHeader,
  SkeletonTabs,
} from "@/components/work/claude/skeleton"
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
export function LinkCard({
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
export function ClipboardCopy({ command }: { command: string }) {
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
// The notes here and on the next two figures are the file's own, from the
// text beside each card on its Organisms page.
const LINKS_DEMO: Array<DemoStep> = [
  {
    on: ".cds-card-links",
    at: [0.5, 1.08],
    idle: true,
    rest: 1200,
    note: {
      kind: "direction",
      title: "Width limits",
      text: "Without an image the card keeps one layout, held “never too wide, never too narrow.”",
    },
  },
  {
    on: ".cds-card-link",
    nth: 0,
    rest: 1000,
    note: {
      kind: "concept",
      title: "Hover",
      text: "It takes the “Lift Small” shadow; the others change their fill to “Background Primary.”",
    },
  },
  { on: ".cds-card-link", nth: 1, rest: 1000 },
  { on: ".cds-card-link", nth: 2, rest: 1000 },
]

// It narrows the card with an image: a row down to its least width, then a
// column, down to a phone's width, and lets it out again.
const ADAPT_DEMO: Array<DemoStep> = [
  {
    on: ".cds-card-link",
    rest: 700,
    note: {
      kind: "concept",
      title: "With an image",
      text: "“A column layout at smaller breakpoints and a row layout at larger ones.”",
    },
  },
  { on: ".cds-resize-grip", nth: 1, drag: 460 },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 400,
    note: {
      kind: "concept",
      title: "Container queries",
      text: "They trigger the shift, “allowing the component to respond to its parent’s width.”",
      on: ".cds-card-link",
    },
  },
  { on: ".cds-resize-grip", nth: 1, drag: 326 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

// And presses the video card's two buttons, narrows it until the video goes
// above the text, as on a phone, and lets it out again.
const VIDEO_DEMO: Array<DemoStep> = [
  {
    on: ".cds-play",
    click: true,
    note: {
      kind: "concept",
      title: "Video card",
      text: "It presents “video-based resources like webinars or presentations” with metadata and registration.",
      on: ".cds-card-video",
    },
  },
  { on: ".cds-card-video .cds-btn", click: true, rest: 700 },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 326,
    note: {
      kind: "concept",
      title: "Two variants",
      text: "Desktop, a row, and Mobile, a column.",
      on: ".cds-card-video",
    },
  },
  { on: ".cds-play", click: true, rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

// It looks over the prompts (the others step back), sends the second as
// written, rewrites the third, and copies the command. The copy is for show:
// nothing is written to the visitor's clipboard. The notes are the
// designers' own, beside the Prompt Box's three states and the Clipboard
// Copy's on the file's Organisms page.
const PROMPTS_DEMO: Array<DemoStep> = [
  {
    on: ".cds-prompt",
    nth: 0,
    at: [0.5, 0.3],
    rest: 900,
    note: {
      kind: "concept",
      title: "Hover",
      text: "“Text darkens, light shadow added, and button expands to reveal ‘Ask Claude’.”",
    },
  },
  {
    on: ".cds-prompt",
    nth: 1,
    at: [0.5, 0.3],
    rest: 900,
    note: {
      kind: "concept",
      title: "Dimmed",
      text: "“When another sibling is hovered, all others dim to create emphasis.”",
      on: ".cds-prompts > :nth-child(3)",
    },
  },
  { on: ".cds-prompt .cds-btn", nth: 1, click: true },
  {
    on: ".cds-prompt",
    nth: 2,
    at: [0.5, 0.3],
    type: "Turn this week's reading into five quiz questions.",
    note: {
      kind: "concept",
      title: "Editable",
      text: "“Editable templates”: send a suggestion as written, or customize it before submission.",
    },
  },
  {
    on: ".cds-copy button",
    click: true,
    rest: 500,
    note: {
      kind: "concept",
      title: "Clipboard copy",
      text: "“On icon click. Hold for 3s.” Then: “Return to default.”",
      on: ".cds-copy",
    },
  },
  { on: ".cds-copy code", rest: 1800 },
]

export function CardsDoc() {
  return (
    <>
      <Section
        title="Link & Video Cards"
        caption="Hovering one card lifts it and dims its siblings. With an image or a video, the card is a row where it has room and a column where it does not."
      >
        <Specimen figure>
          <DemoCursor steps={LINKS_DEMO} className="p-6 md:p-8">
            <SkeletonContext>
              <div className="cds-card-links">
                {LINKS.map(([title, kind]) => (
                  <LinkCard key={title} title={title} kind={kind} />
                ))}
              </div>
            </SkeletonContext>
          </DemoCursor>
        </Specimen>
        <Specimen figure>
          <DemoCursor steps={ADAPT_DEMO} className="p-6 md:p-8">
            {/* Each card in a figure of its own, on its own skeleton, as
                tall as the card at its narrowest, so the figure keeps one
                height while it is resized. */}
            <Resizable
              label="Card width"
              sizes={[["Desktop"], ["Mobile", 459]]}
              className="flex min-h-[744px] flex-col justify-center sm:h-[744px]"
            >
              <SkeletonContext className="flex justify-center">
                <div className="cds-card-link-fit">
                  <LinkCard image title={STORY[0]} kind={STORY[1]} />
                </div>
              </SkeletonContext>
            </Resizable>
          </DemoCursor>
        </Specimen>
        <Specimen figure>
          <DemoCursor steps={VIDEO_DEMO} className="p-6 md:p-8">
            <Resizable
              label="Card width"
              sizes={[["Desktop"], ["Mobile", 560]]}
              className="flex min-h-[960px] flex-col justify-center sm:h-[960px]"
            >
              <SkeletonContext className="flex justify-center">
                <div className="cds-card-video-wrap">
                  <div className="cds-card-video">
                    <div className="cds-card-video-media">
                      <button
                        type="button"
                        className="cds-play"
                        aria-label="Play"
                        {...quiet}
                      >
                        {/* The file's own triangle: an outline with rounded
                          corners, not a filled one. */}
                        <svg
                          viewBox="0 0 17.2816 20.2652"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M0.363636 17.57V2.69521C0.363636 0.867287 2.37429 -0.247109 3.92437 0.721689L15.8242 8.15909C17.2826 9.0706 17.2826 11.1946 15.8242 12.1061L3.92436 19.5435C2.37428 20.5123 0.363636 19.3979 0.363636 17.57Z"
                            stroke="currentColor"
                            strokeWidth="0.727273"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
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
              </SkeletonContext>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Prompt Box & Clipboard Copy"
        caption="Prompts are editable, and a copy holds “Copied!” for three seconds."
      >
        <Specimen figure>
          <DemoCursor steps={PROMPTS_DEMO} className="p-6 md:p-8">
            {/* As on the Education page: under the section's header and
                its tabs, and last on the page, over the footer. */}
            <SkeletonContext
              before={
                <>
                  <SkeletonHeader line />
                  <SkeletonTabs />
                </>
              }
              after={<SkeletonFooter />}
              className="flex flex-col items-center gap-8"
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
            </SkeletonContext>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
