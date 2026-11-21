import { useEffect, useRef, useState } from "react"
import {
  TbArrowsDiagonal,
  TbArrowsDiagonalMinimize2,
  TbCheck,
  TbCopy,
} from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Section, Specimen } from "@/components/work/claude/ui"
import { Button } from "@/components/work/anthropic/specimens"
import { cn } from "@/lib/utils"
import { ArticleContext, FigCaption, ROBODOG } from "./article"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// Code Block and Claude Terminal (the Figma file's Organisms page, "Article-
// related organisms"): its "Code Block" component set has three types, Code
// Block, Code Snippet, and Claude Terminal. The code and the terminal's
// session are the file's own samples; the colors of the code are the ones
// the file gives each kind of word.

export const SAMPLE_CODE = `import os
from typing import Optional

# Constants
MAX_RETRIES = 3
API_URL = "https://api.example.com/v1"

class Config:
    """App configuration."""
    def __init__(self, name: str, debug: bool = False):
        self.name = name
        self.debug = debug

async def fetch(url: str, retries: int = 0) -> dict:
    result = {"status": None, "data": [], "count": 0}
    try:
        response = await make_request(url, timeout=30.0)
        if response.status == 200:
            result["data"] = response.json()
        elif response.status == 429:
            wait = 2 ** retries  # exponential backoff
            await sleep(wait)
    except TimeoutError as e:
        print(f"Request failed: {e}")
        raise`

export const SAMPLE_SNIPPET = SAMPLE_CODE.split("\n").slice(0, 6).join("\n")

// Python, colored as the file colors it: keywords, operators, numbers and
// constants (and a class's name), strings and types, comments, and names
// being defined or called.
const KEYWORDS = new Set(
  "import from class def async await try if elif else except as raise return for in while with not and or is pass lambda yield".split(
    " "
  )
)
const CONSTANTS = new Set(["True", "False", "None"])
const TYPES = new Set(["str", "bool", "int", "dict", "float", "list"])
const TOKEN =
  /(#[^\n]*)|(f?(?:"""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"))|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(->|\*\*|==|[=+\-*/<>])/g

type Kind = "comment" | "string" | "number" | "keyword" | "type" | "name" | "op"

function highlight(code: string): Array<[text: string, kind?: Kind]> {
  const out: Array<[string, Kind?]> = []
  let at = 0
  let previous = ""
  for (const match of code.matchAll(TOKEN)) {
    const [text, comment, string, number, word] = match
    const index = match.index
    if (index > at) out.push([code.slice(at, index)])
    let kind: Kind | undefined
    if (comment) kind = "comment"
    else if (string) kind = "string"
    else if (number) kind = "number"
    else if (word) {
      if (KEYWORDS.has(word)) kind = "keyword"
      else if (CONSTANTS.has(word)) kind = "number"
      else if (TYPES.has(word)) kind = "type"
      else if (previous === "class") kind = "number"
      else if (previous === "def" || code[index + word.length] === "(")
        kind = "name"
    } else kind = "op"
    out.push([text, kind])
    if (word) previous = word
    at = index + text.length
  }
  if (at < code.length) out.push([code.slice(at)])
  return out
}

/**
 * The header's Copy button. It copies for a visitor and says so for a
 * moment; a click from the demo cursor (not a trusted event) only shows
 * that, so the visitor's clipboard is left alone.
 */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])
  return (
    <Button
      variant="tertiary"
      size="small"
      icon="leading"
      glyph={copied ? <TbCheck aria-hidden /> : <TbCopy aria-hidden />}
      data-action="copy"
      onClick={(e) => {
        if (e.isTrusted)
          void navigator.clipboard.writeText(text).catch(() => {})
        setCopied(true)
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}

/**
 * A block of code: a header with its file name (and a note after it, in
 * a lighter gray), Copy and Expand; under it the code, which scrolls inside
 * the block until it is expanded. As a snippet (no `name`) the header has
 * only Copy, and the code is short enough to show whole.
 */
export function CodeBlock({
  code = SAMPLE_CODE,
  name,
  note,
  expand = true,
}: {
  code?: string
  /** The file name or language in the header. */
  name?: string
  /** A note after the name, as the file's "(optional)". */
  note?: string
  /** Offer Expand (a block); a snippet has only Copy. */
  expand?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="ads-code" data-expanded={open || undefined}>
      <div className="ads-code-header">
        {name && (
          <span className="ads-code-name">
            {name}
            {note && <span> {note}</span>}
          </span>
        )}
        <div className="ads-code-actions">
          <CopyButton text={code} />
          {expand && (
            <Button
              variant="tertiary"
              size="small"
              icon="leading"
              glyph={
                open ? (
                  <TbArrowsDiagonalMinimize2 aria-hidden />
                ) : (
                  <TbArrowsDiagonal aria-hidden />
                )
              }
              aria-expanded={open}
              data-action="expand"
              onClick={() => setOpen((now) => !now)}
            >
              {open ? "Collapse" : "Expand"}
            </Button>
          )}
        </div>
      </div>
      <pre className="ads-code-body" tabIndex={0}>
        <code>
          {highlight(code).map(([text, kind], i) =>
            kind ? (
              <span key={i} data-token={kind}>
                {text}
              </span>
            ) : (
              text
            )
          )}
        </code>
      </pre>
    </div>
  )
}

// The terminal's session, as the file has it: the prompt typed in, then
// Claude's answer.
export const SAMPLE_PROMPT =
  "Refactor the permission request components to share common UI elements and behavior."

export const SAMPLE_SESSION = `● I'll analyze the Excalidraw codebase structure and provide a high-level overview.

● Analyze(what: "Excalidraw codebase structure and provide a high-level overview of what it is, its main components, and how they're organized. Focus on understanding the project's purpose, architecture, and key features.")

Excalidraw is an open-source virtual whiteboard application with a hand-drawn style. It's designed for creating diagrams, wireframes, and collaborative drawings.

## Purpose
- Web-based drawing tool with infinite canvas
- Hand-drawn aesthetic with support for shapes, arrows, text
- End-to-end encrypted collaboration
- Works offline as a PWA (Progressive Web App)

## Architecture
The project is organized as a monorepo with these main components:

1. Core Package (packages/excalidraw)
- React component library for embedding Excalidraw in any application
- Handles drawing, rendering, and core functionality
- Uses roughjs for the hand-drawn style`

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms))

/**
 * Claude at work in a terminal window: the window's three lights, its title
 * in the middle, and Copy. It is dark on every theme (it wears Slate). When
 * it comes into view the prompt is typed in, a letter at a time, and the
 * answer comes after it a line at a time, following its end down the
 * window; then it rests, and starts over. Off screen it waits, and for
 * anyone who prefers reduced motion it shows the whole session at once.
 */
export function ClaudeTerminal({
  name,
  note,
  prompt = SAMPLE_PROMPT,
  session = SAMPLE_SESSION,
}: {
  name?: string
  note?: string
  prompt?: string
  session?: string
}) {
  const lines = session.split("\n")
  const [typed, setTyped] = useState(prompt.length)
  const [shown, setShown] = useState(lines.length)
  const root = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLPreElement>(null)
  // While the answer streams in, the window keeps its end in sight.
  const follow = useRef(false)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let run = 0
    let inView = false
    const play = async (me: number) => {
      const live = () => me === run && inView
      while (live()) {
        setTyped(0)
        setShown(0)
        if (body.current) body.current.scrollTop = 0
        await sleep(700)
        for (let i = 1; i <= prompt.length && live(); i++) {
          setTyped(i)
          await sleep(28 + Math.random() * 40)
        }
        await sleep(900)
        follow.current = true
        for (let i = 1; i <= lines.length && live(); i++) {
          setShown(i)
          await sleep(lines[i - 1] === "" ? 120 : 260)
        }
        follow.current = false
        await sleep(5000)
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      run++
      // Back on screen, it starts from the top; off screen it shows the
      // whole session, as a still.
      if (inView) void play(run)
      else {
        follow.current = false
        setTyped(prompt.length)
        setShown(lines.length)
        if (body.current) body.current.scrollTop = 0
      }
    })
    observer.observe(el)
    return () => {
      run++
      observer.disconnect()
    }
    // The session is the same for the life of the figure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, session])

  // The window follows the end of the answer as it comes in.
  useEffect(() => {
    const el = body.current
    if (el && follow.current) el.scrollTop = el.scrollHeight
  }, [shown])

  return (
    <div ref={root} className="ads ads-terminal" data-theme="slate">
      <div className="ads-code-header">
        <span className="ads-terminal-lights" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        {name && (
          <span className="ads-code-name">
            {name}
            {note && <span> {note}</span>}
          </span>
        )}
        <div className="ads-code-actions">
          <CopyButton text={`> ${prompt}\n\n${session}`} />
        </div>
      </div>
      <pre ref={body} className="ads-code-body" tabIndex={0}>
        <span className="ads-terminal-prompt">
          <span aria-hidden>&gt;</span>
          <span>{prompt.slice(0, typed)}</span>
        </span>
        <span className={cn("ads-terminal-answer", shown === 0 && "hidden")}>
          {lines.slice(0, shown).join("\n")}
        </span>
      </pre>
    </div>
  )
}

// What the demo cursor does on the block: it scrolls down the code and
// back, and presses Copy.
const BLOCK_DEMO: Array<DemoStep> = [
  { on: ".ads-code-body", scroll: 70, rest: 900 },
  { on: ".ads-code-body", scroll: 0, rest: 600 },
  { on: '[data-action="copy"]', click: true, rest: 1800 },
]
const SNIPPET_DEMO: Array<DemoStep> = [
  { on: ".ads-code-body", idle: true, at: [0.5, 0.5], rest: 1400 },
  { on: '[data-action="copy"]', click: true, rest: 1800 },
]
const TERMINAL_DEMO: Array<DemoStep> = [
  { on: ".ads-code-body", idle: true, at: [0.6, 0.7], rest: 9000 },
  { on: '[data-action="copy"]', click: true, rest: 1800 },
]

export function CodeDoc() {
  return (
    <>
      <Section
        title="Code Block & Code Snippet"
        caption="Two of the component’s three types. A Code Block has its file name, Copy, and Expand, and a caption under it; a Code Snippet has only Copy."
      >
        <Specimen figure>
          <DemoCursor steps={BLOCK_DEMO}>
            <ArticleContext>
              <CodeBlock name="package.json" note="(optional)" />
              <FigCaption label="Step 1a">(optional) {ROBODOG}</FigCaption>
            </ArticleContext>
          </DemoCursor>
        </Specimen>
        <Specimen figure>
          <DemoCursor steps={SNIPPET_DEMO}>
            <ArticleContext>
              <CodeBlock code={SAMPLE_SNIPPET} expand={false} />
            </ArticleContext>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Claude Terminal"
        caption="The third type: Claude at work in a terminal window, dark whatever the page around it."
      >
        <Specimen figure>
          <DemoCursor steps={TERMINAL_DEMO}>
            <ArticleContext>
              <ClaudeTerminal name="package.json" note="(optional)" />
              <FigCaption label="Step 1a">(optional) {ROBODOG}</FigCaption>
            </ArticleContext>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
