import { useEffect, useRef, useState } from "react"
import { TbChartBar, TbFolders, TbUsers } from "react-icons/tb"
import { Artifact } from "@/components/work/claude/pages/artifacts"
import {
  Footer,
  FooterPrompt,
  Header,
} from "@/components/work/claude/pages/headers"
import { Playhead } from "@/components/work/claude/pages/media"
import { SiteNavigation } from "@/components/work/claude/pages/navigation"
import { Button, CarouselUi } from "@/components/work/claude/specimens"
import {
  TemplateBlock,
  TemplateFigure,
  TemplateSection,
} from "@/components/work/claude/pages/template"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Home template (the "Home" frame on the Figma file's Templates page),
// built from the organisms the other tabs document: the site navigation, the
// section header, the footer's prompt input, feature highlights, the
// artifact, the video reel, the carousel's controls, and the footer. Its
// words are the file's. What is new here is only what the page adds around
// them: the hero, the model cards, and the list of releases.

const ART = "/work/claude/illustrations"

const FEATURES = [
  [
    TbUsers,
    "Break down problems together",
    "Claude builds on your ideas, expands on your logic, and simplifies complexity one step at a time.",
  ],
  [
    TbChartBar,
    "Tackle your toughest work",
    "Claude provides expert-level collaboration on the things you need to get done—from coding a product to critical data analysis.",
  ],
  [
    TbFolders,
    "Explore what’s next",
    "Like an expert in your pocket, collaborating with Claude expands what you can build on your own or with teams.",
  ],
] as const

const MODELS = [
  [
    "Opus 4",
    "Maximum reasoning power for your most complex challenges and strategic decisions",
    ["Deep research", "Complex reasoning", "System architecture"],
  ],
  [
    "Sonnet 4",
    "Smart and efficient designed for the work you do every day",
    ["Writing tasks", "Fast analysis", "Task automation"],
  ],
] as const

const RELEASES = [
  ["Claude Opus 4.1", "Announcement"],
  ["Claude can now connect to your world", "Product"],
  ["Claude Code: Your code’s new collaborator", "Product"],
  ["Claude takes research to new places", "Research"],
  ["Claude can now search the web", "Product"],
] as const

const REELS = 5

/** The row of video reels: it scrolls sideways, a reel at a time. */
function Reels() {
  const row = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [stops, setStops] = useState(REELS)

  const reach = () => {
    const el = row.current
    const [first, second] = el?.children ?? []
    if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement))
      return null
    return {
      el: el!,
      stride: second.offsetLeft - first.offsetLeft,
      max: el!.scrollWidth - el!.clientWidth,
    }
  }

  useEffect(() => {
    const el = row.current
    if (!el) return
    const measure = () => {
      const at = reach()
      if (!at || at.stride <= 0) return
      const count = at.max <= 1 ? 1 : Math.ceil((at.max - 1) / at.stride) + 1
      const last = at.max > 1 && at.max - at.el.scrollLeft <= 1
      setStops(count)
      setCurrent(
        last
          ? count - 1
          : Math.min(count - 1, Math.round(at.el.scrollLeft / at.stride))
      )
    }
    // The observer also reports once when it starts watching.
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    el.addEventListener("scroll", measure, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener("scroll", measure)
    }
  }, [])

  const step = (by: 1 | -1) => {
    const at = reach()
    if (!at) return
    const next = (current + by + stops) % stops
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    at.el.scrollTo({
      left: Math.min(next * at.stride, at.max),
      behavior: still ? "auto" : "smooth",
    })
  }

  return (
    <div className="cds-home-reels">
      <div ref={row}>
        {Array.from({ length: REELS }, (_, i) => (
          <div key={i} className="cds-video cds-reel">
            <Playhead />
          </div>
        ))}
      </div>
      <CarouselUi count={stops} current={current} onStep={step} />
    </div>
  )
}

/**
 * The page. Each section wears a theme of its own, as on the site: Ivory,
 * Neutral 1, and White by turns, over the Dark 3 footer. On the site's dark
 * mode they are Dark 3 and Dark 2.
 */
function Home() {
  return (
    <>
      <TemplateBlock theme={["ivory", "dark-3"]}>
        <SiteNavigation />
        <div className="cds-home-hero">
          <div>
            <h3>
              Meet your
              <br />
              thinking partner
            </h3>
            <p>Tackle any big, bold, bewildering challenge with Claude.</p>
            <FooterPrompt overlay />
          </div>
          <img src={`${ART}/hand-head-node.svg`} alt="" />
        </div>
      </TemplateBlock>

      <TemplateSection theme={["neutral-1", "dark-2"]}>
        <Header
          size="p1"
          title="The AI for problem solvers"
          subtitle={null}
          pictogram={`${ART}/node-sequence-coding.svg`}
          actions={null}
        />
        <div className="cds-home-downloads">
          <span>Download the desktop app:</span>
          {["macOS", "Windows", "Windows (arm64)"].map((name) => (
            <Button key={name} variant="tertiary" icon="none">
              {name}
            </Button>
          ))}
        </div>
        <div className="cds-home-split">
          <div>
            {FEATURES.map(([Icon, title, text]) => (
              <div key={title} className="cds-home-feature">
                <h4>
                  <Icon aria-hidden />
                  {title}
                </h4>
                <p>{text}</p>
              </div>
            ))}
          </div>
          {/* The picture the file leaves empty here: a moving one, on the
              site. */}
          <div className="cds-home-media" aria-hidden />
        </div>
      </TemplateSection>

      <TemplateSection theme={["white", "dark-3"]}>
        <Header
          size="p1"
          title="How you can use Claude"
          subtitle={null}
          pictogram={`${ART}/hand-bolt.svg`}
          actions={null}
        />
        <div className="cds-home-artifact">
          <Artifact />
          <div className="cds-home-about">
            <h4>Learn</h4>
            <p>
              Learn anything through conversation. Upload docs or images for
              deeper insights or create visual study aids with artifacts. Voice
              makes complex topics easier to digest, while projects keeps your
              learning organized.
            </p>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-2"]}>
        <Header
          size="p2"
          title="What people say about Claude"
          subtitle="From grocery shopping to building their business, these folks have figured out how to get the most out of their AI collaborator."
          pictogram={`${ART}/object-megaphone.svg`}
          actions={null}
        />
        <Reels />
      </TemplateSection>

      <TemplateSection theme={["ivory", "dark-3"]} tone={2}>
        <Header
          size="p2"
          title="Opus 4 and Sonnet 4"
          subtitle="Our most powerful models yet push the frontier for coding and AI agents, and enable Claude to handle hours of work across Claude and Claude Code."
          pictogram={null}
          actions={<Button icon="none">Read announcement</Button>}
        />
        <div className="cds-home-models">
          {MODELS.map(([name, text, uses]) => (
            <div key={name} className="cds-home-model">
              <h4>{name}</h4>
              <div>
                <p>{text}</p>
                <small>{uses.join("   •   ")}</small>
                <Button size="small" variant="secondary">
                  Model details
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="cds-home-releases">
          <h4>
            <img src={`${ART}/object-confetti.svg`} alt="" />
            Explore the latest releases
          </h4>
          <div>
            {RELEASES.map(([title, kind]) => (
              <a key={title} href="#" className="cds-home-release">
                <span>{title}</span>
                <small>{kind}</small>
              </a>
            ))}
          </div>
        </div>
      </TemplateSection>

      <TemplateBlock theme={["dark-3", "dark-3"]}>
        <Footer />
      </TemplateBlock>
    </>
  )
}

// The page's own things for the demo cursor: the hero's prompt and a chip,
// wide and again at a phone's width. The scrolling and resizing around them
// are the template figure's (`around` in template.tsx).
const HOME_DEMO: Array<DemoStep> = [
  { on: ".cds-home-hero .cds-input", rest: 900 },
  { on: ".cds-home-hero .cds-chip", text: "Learn", rest: 700 },
  { on: ".cds-resize-grip", nth: 1, drag: 760 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".cds-home-hero .cds-input", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

export function HomeDoc() {
  return (
    <Section>
      <TemplateFigure steps={HOME_DEMO}>
        <Home />
      </TemplateFigure>
    </Section>
  )
}
