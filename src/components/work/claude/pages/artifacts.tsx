import { useState } from "react"
import {
  TbArrowsExchange,
  TbCompass,
  TbCopy,
  TbDownload,
  TbFileDownload,
  TbMarkdown,
  TbPaperclip,
  TbPlayerPlayFilled,
  TbPrompt,
  TbSparkles,
} from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Button } from "@/components/work/claude/specimens"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

const ROLES = [
  "Founders",
  "Developers",
  "Marketers",
  "Sales",
  "Product Management",
]

const PROMPT =
  "You are an AI assistant specialized in classifying customer support tickets. Your task is to analyze the content of a given ticket and assign it to the most appropriate..."

/**
 * The artifact viewer. The tabs pick an audience; the stage shows a prompt
 * and its attachments beside the artifact they produced. The Figma file has
 * the one example, so every tab shows it.
 */
function Artifact() {
  const [role, setRole] = useState(ROLES[0])
  // Narrow, the stage shows one side at a time.
  const [view, setView] = useState<"result" | "prompt">("result")

  return (
    <div className="cds-artifact" data-view={view}>
      <div className="cds-tabs" role="tablist">
        {ROLES.map((label) => (
          <button
            key={label}
            type="button"
            role="tab"
            className="cds-tab"
            aria-selected={role === label}
            onClick={() => setRole(label)}
            {...quiet}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="cds-artifact-stage">
        <button
          type="button"
          className="cds-artifact-toggle"
          onClick={() => setView(view === "result" ? "prompt" : "result")}
          {...quiet}
        >
          <TbArrowsExchange aria-hidden />
          {view === "result" ? "View prompt" : "View result"}
        </button>

        <div className="cds-artifact-side">
          <div className="cds-artifact-card">
            <header>
              <TbPrompt aria-hidden />
              Prompt
            </header>
            <p>{PROMPT}</p>
            View more…
          </div>
          <div className="cds-artifact-card">
            <header>
              <TbPaperclip aria-hidden />
              Attachments
            </header>
            <div className="cds-artifact-files">
              {["Lecture #1", "Lecture #2"].map((name) => (
                <div key={name}>
                  <span>
                    <b>{name}</b>
                    <small>1,113 lines</small>
                  </span>
                  <i>PDF</i>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cds-artifact-sheet">
          <div>
            <h4>Psychology 101: Comprehensive Study Guide</h4>
            <h5>Introduction to Psychology</h5>
            <h6>Definition and Core Concepts</h6>
            <div>
              <p>
                Psychology: The scientific study of behavior and mental
                processes.
              </p>
              <p>Key Components:</p>
              <ul>
                <li>Behavior: Observable actions of humans and animals</li>
                <li>
                  Mental processes: Internal, subjective experiences such as
                  thoughts, feelings, perceptions, memories, and dreams
                </li>
              </ul>
              <p>Important Characteristics of Psychology:</p>
              <ul>
                <li>It is a science using empirical methods</li>
                <li>Studies both overt behavior and internal mental states</li>
                <li>Examines both humans and animals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* The device size showing; its text comes from the styles. */}
      <div className="cds-artifact-size" aria-hidden />
    </div>
  )
}

const ACTIONS = [
  ["Copy as markdown", TbCopy],
  ["Download PDF", TbDownload],
  ["View as markdown", TbMarkdown],
  ["Ask about this page", TbSparkles],
] as const

const STORY =
  "How Intercom uses Claude to deliver higher-quality customer AI agent experiences"

function Marginalia() {
  return (
    <div className="cds-marginalia">
      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">
            <TbCompass aria-hidden />
            Explore here
          </div>
          <div className="cds-margin-menu">
            {ACTIONS.map(([label, Icon]) => (
              <button key={label} type="button" {...quiet}>
                <Icon aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">Deep work productivity</div>
          <div className="cds-margin-stat">
            <b>47%</b>
            Increase in complex problem-solving sessions for Max users
          </div>
        </div>
      </div>

      <div className="cds-margin">
        <div className="cds-margin-head">
          <TbFileDownload aria-hidden />
          Download a PDF
        </div>
        <div className="cds-margin-card">
          <div className="cds-margin-media">
            <div className="cds-margin-file">
              <i>PDF</i>
              <div>
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="cds-margin-page" />
          </div>
          <p>Ready to bring Claude to your company? Take this PDF.</p>
        </div>
      </div>

      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">Webinar</div>
          <p>How Anthropic and Asana Transform Work at Scale with AI Agents</p>
          <div>
            <Button size="small" variant="secondary">
              Watch webinar
            </Button>
          </div>
        </div>
      </div>

      <div className="cds-margin">
        <div className="cds-margin-head">Clay + Claude</div>
        <div className="cds-margin-card">
          <div>
            <div className="cds-margin-stat">
              <b>89%</b>
              AI adoption across all employees
            </div>
            <div className="cds-margin-stat">
              <b>750+</b>
              Increase in complex problem-solving sessions for Max users
            </div>
          </div>
        </div>
      </div>

      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">Customer story</div>
          <div className="cds-margin-media" data-type="video">
            <button
              type="button"
              className="cds-play"
              aria-label="Play"
              {...quiet}
            >
              <TbPlayerPlayFilled aria-hidden />
            </button>
          </div>
          <p>{STORY}</p>
        </div>
      </div>

      <div className="cds-margin">
        <div className="cds-margin-card">
          <div className="cds-margin-head">How can I help?</div>
          <p>
            Hey Claude, help me forecast the upcoming year so I can make some
            informed plans
          </p>
          <div>
            <Button size="small" variant="clay" icon="none">
              Ask Claude
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// What the demo cursor does on the artifact: it takes the right-hand grip
// and pulls the figure through its five device sizes, pausing on each, and
// where the stage shows one side at a time it switches to the prompt and
// back. Then it lets the figure out to full width and tries the tabs.
const ARTIFACT_DEMO: Array<DemoStep> = [
  { on: ".cds-resize-grip", nth: 1, drag: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 600 },
  { on: ".cds-resize-grip", nth: 1, drag: 480 },
  { on: ".cds-artifact-toggle", click: true, rest: 500 },
  { on: ".cds-artifact-toggle", click: true, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 340 },
  { on: ".cds-artifact-toggle", click: true, rest: 500 },
  { on: ".cds-artifact-toggle", click: true, rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
  { on: ".cds-tab", text: "Developers", click: true },
  { on: ".cds-tab", text: "Marketers", click: true },
  { on: ".cds-tab", text: "Founders", click: true, rest: 800 },
]

export function ArtifactsDoc() {
  return (
    <>
      <Section
        title="Artifacts"
        description="Something Claude made, beside the prompt and attachments that made it, drawn for five device sizes."
      >
        <Specimen>
          <DemoCursor steps={ARTIFACT_DEMO} className="p-6 md:p-8">
            {/* As tall as its tallest size (the square phablet stage), so
                the figure keeps one height while it is resized and nothing
                below it on the page moves. */}
            <Resizable label="Artifact width" className="min-h-[640px]">
              <Artifact />
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Marginalia"
        description="Small cards beside key content: related resources, case studies and statistics, without interrupting the reading."
      >
        <Specimen className="p-6 md:p-8">
          <Marginalia />
        </Specimen>
      </Section>
    </>
  )
}
