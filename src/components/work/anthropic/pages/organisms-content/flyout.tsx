import { useEffect, useRef, useState } from "react"
import { TbArrowRight, TbPlayerPlay } from "react-icons/tb"
import { quiet } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { useDismiss } from "@/components/work/claude/use-dismiss"
import { Section, Specimen } from "@/components/work/claude/ui"
import { CaseStudyCard } from "./cards"
import { ART, SkelHeading, SkelNav, stay } from "./shared"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// Fly-out: the file's "Fly-out" component, a case study in a panel that
// slides in from the side of the page: a label and an arrow to send it back,
// then the case study's title, lede, video, metadata, text, and stats.

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
const LOREM_LONG = `${LOREM} Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
const QUISQUE =
  "Quisque a hendrerit urna. In sed sapien nibh. Mauris elementum mauris a mauris pretium consequat. Cras tempus ligula sit amet nisi semper auctor. In commodo ornare est sit amet commodo. Cras velit quam, facilisis lobortis finibus quis, maximus a risus."
const DUIS =
  "Duis suscipit consequat nulla non sollicitudin. Nam sit amet tempus magna, pretium tincidunt neque. Fusce urna tellus, porttitor eu enim sit amet, condimentum suscipit leo. Duis pellentesque ornare luctus. Donec a luctus erat, vel ullamcorper sem."

/**
 * The file's "Fly-out": a panel at the right edge of the page. Closed, it
 * waits off the edge; open, it slides in over the page. Its arrow, the
 * pointer going down outside it, or Escape sends it back.
 */
export function FlyOut({
  open,
  onClose,
  label = "Label",
}: {
  open: boolean
  onClose: () => void
  label?: string
}) {
  const ref = useDismiss(open, onClose)
  const body = useRef<HTMLDivElement>(null)
  // Each time it opens it starts from the top.
  useEffect(() => {
    if (open && body.current) body.current.scrollTop = 0
  }, [open])
  return (
    <div
      ref={ref}
      className="ads-flyout"
      data-open={open ? "" : undefined}
      inert={!open}
      role="dialog"
      aria-label="Case study"
    >
      <div className="ads-flyout-header">
        <span>{label}</span>
        <button
          type="button"
          className="ads-flyout-close"
          aria-label="Close"
          onClick={onClose}
          {...quiet}
        >
          <TbArrowRight aria-hidden />
        </button>
      </div>
      <div ref={body} className="ads-flyout-body">
        <div className="ads-flyout-intro">
          <h4>Title of the case study here</h4>
          <p>{LOREM}</p>
        </div>
        <div className="ads-flyout-video">
          <img src={`${ART}/office.webp`} alt="" />
          <button
            type="button"
            className="ads-flyout-play"
            aria-label="Play"
            {...quiet}
          >
            <TbPlayerPlay aria-hidden />
          </button>
        </div>
        <dl className="ads-flyout-meta">
          <div>
            <dt>[Company] post</dt>
            <dd>
              <a className="ads-oc-text-link" {...stay}>
                Read post
                <TbArrowRight aria-hidden />
              </a>
            </dd>
          </div>
          <div>
            <dt>Optional metadata</dt>
            <dd>Info</dd>
          </div>
          <div>
            <dt>Optional metadata</dt>
            <dd>Info</dd>
          </div>
        </dl>
        <div className="ads-flyout-text">
          <h5>Optional headline</h5>
          <p>{LOREM_LONG}</p>
          <p>{QUISQUE}</p>
        </div>
        <div className="ads-flyout-stats">
          <div>
            <b>99%</b>
            <span>Optional stat</span>
          </div>
          <div>
            <b>35-50 apps</b>
            <span>Optional stat</span>
          </div>
        </div>
        <div className="ads-flyout-text">
          <p>{DUIS}</p>
        </div>
      </div>
    </div>
  )
}

/** A page of case study cards whose buttons open the fly-out. */
export function FlyOutPage() {
  const [open, setOpen] = useState(false)
  return (
    <div className="ads-flyout-page">
      <SkelNav />
      <SkelHeading center />
      <div className="ads-cases">
        {[0, 1, 2].map((i) => (
          <CaseStudyCard key={i} onRead={() => setOpen(true)} />
        ))}
      </div>
      <FlyOut open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

// It opens a case study, reads down it, and sends it back with the arrow.
const FLYOUT_DEMO: Array<DemoStep> = [
  { on: ".ads-case .ads-btn", nth: 1, rest: 500 },
  { on: ".ads-case .ads-btn", nth: 0, click: true, rest: 900 },
  { on: ".ads-flyout-play", rest: 900 },
  { on: ".ads-flyout-body", scroll: 50, rest: 1200 },
  { on: ".ads-flyout-body", scroll: 100, rest: 1200 },
  { on: ".ads-flyout-close", click: true, rest: 1200 },
]

export function FlyOutDoc() {
  return (
    <Section caption="A case study opens in a panel from the side of the page, over what is there; its arrow sends it back.">
      <Specimen figure>
        <DemoCursor steps={FLYOUT_DEMO} className="relative">
          <FlyOutPage />
        </DemoCursor>
      </Specimen>
    </Section>
  )
}
