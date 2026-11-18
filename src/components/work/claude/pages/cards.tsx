import { useEffect, useState } from "react"
import {
  TbArrowUp,
  TbCheck,
  TbCopy,
  TbPaperclip,
  TbPlayerPlayFilled,
  TbVideo,
} from "react-icons/tb"
import { Button } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

const LINKS = [
  ["Claude Code documentation", "Developer doc"],
  ["How Anthropic teams use Claude Code", "Case study"],
]

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
        onClick={() => {
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

export function CardsDoc() {
  return (
    <>
      <Section
        title="Link & Video Cards"
        description="A link card lifts on hover. A video card stacks when it gets narrow."
      >
        <Specimen className="flex flex-col gap-8 p-6 md:p-8">
          {/* Two abreast at most: a card needs its width, or its title sets
              a word to a line. */}
          <div className="grid gap-6 sm:grid-cols-2">
            {LINKS.map(([title, kind]) => (
              <a
                key={title}
                className="cds-card-link !w-auto"
                href="#cards"
                onClick={(e) => e.preventDefault()}
                {...quiet}
              >
                {title}
                <span className="cds-meta-link">
                  <TbPaperclip aria-hidden />
                  {kind}
                </span>
              </a>
            ))}
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
        </Specimen>
      </Section>

      <Section
        title="Prompt Box & Clipboard Copy"
        description="Prompts to send as written or change first, and a command that copies in one click."
      >
        <Specimen className="flex flex-col gap-8 p-6 md:p-8">
          <div className="cds-prompts">
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
        </Specimen>
      </Section>
    </>
  )
}
