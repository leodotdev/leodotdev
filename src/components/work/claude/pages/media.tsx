import { useEffect, useState } from "react"
import { TbPlayerPlayFilled, TbX } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import {
  SkeletonCarouselUi,
  SkeletonContext,
  SkeletonHeader,
} from "@/components/work/claude/skeleton"
import { Section, Specimen } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

const quiet = { "data-wave-hover": "off", "data-wave-manual": true } as const

// The wall's logos, exported from the Figma file as SVGs, in its order.
const LOGOS = [
  ["usf", "University of San Francisco"],
  ["lse", "LSE"],
  ["northeastern", "Northeastern University"],
  ["champlain", "Champlain College"],
  ["northumbria", "Northumbria University"],
  ["decagon", "Decagon"],
  ["intercom", "Intercom"],
  ["gitlab", "GitLab"],
  ["asapp", "ASAPP"],
]

export function Playhead({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="cds-playhead"
      aria-label="Play"
      onClick={onClick}
      {...quiet}
    >
      <TbPlayerPlayFilled aria-hidden />
    </button>
  )
}

/** A video on a page, and the lightbox it opens in. It starts open. */
export function Lightbox({
  skeleton = false,
}: {
  /** Draw the page the video is on, as a skeleton, behind the lightbox. */
  skeleton?: boolean
} = {}) {
  const [open, setOpen] = useState(true)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div className="cds-lightbox-page">
      {skeleton ? (
        <SkeletonContext
          // As on the home page: under the section's header, over a
          // carousel's controls.
          before={<SkeletonHeader line />}
          after={<SkeletonCarouselUi />}
          className="flex justify-center"
        >
          <div className="cds-video">
            <Playhead onClick={() => setOpen(true)} />
          </div>
        </SkeletonContext>
      ) : (
        <div className="cds-video">
          <Playhead onClick={() => setOpen(true)} />
        </div>
      )}
      {open && (
        <div className="cds-lightbox">
          <div>
            <button
              type="button"
              className="cds-lightbox-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
              {...quiet}
            >
              <TbX aria-hidden />
            </button>
            <div className="cds-video" />
          </div>
        </div>
      )}
    </div>
  )
}

// What the demo cursor tries: it closes the lightbox, which shows the video
// on its page, and presses play to open it again.
const LIGHTBOX_DEMO: Array<DemoStep> = [
  { on: ".cds-lightbox-close", click: true, rest: 900 },
  { on: ".cds-playhead", click: true, rest: 900 },
  { on: ".cds-lightbox .cds-video", rest: 1800 },
]

// The reel's playhead grows a little under the cursor.
const REEL_DEMO: Array<DemoStep> = [
  { on: ".cds-playhead", click: true, rest: 900 },
  { on: ".cds-reel", at: [0.5, 0.88], rest: 1800 },
]

export function MediaDoc() {
  return (
    <>
      <Section
        title="Logo Wall"
        caption="More than 150 customer logos live in one component."
      >
        <Specimen figure className="p-6 md:p-8">
          <div className="cds-logo-wall">
            <div>
              {LOGOS.map(([file, name]) => (
                <img
                  key={file}
                  src={`/work/claude/logos/${file}.svg`}
                  alt={name}
                  width={279}
                  height={64}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </Specimen>
      </Section>

      <Section
        title="Video: Lightbox"
        caption="We decided: “Mobile OS? Use OS lightbox. Desktop OS? Use Claude lightbox.”"
      >
        <Specimen figure className="[container-type:inline-size]">
          <DemoCursor steps={LIGHTBOX_DEMO}>
            <Lightbox skeleton />
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Video: Reel"
        caption="Built “to drive traffic to Instagram.”"
      >
        <Specimen figure>
          <DemoCursor
            steps={REEL_DEMO}
            className="flex justify-center p-6 md:p-8"
          >
            <div className="cds-video cds-reel">
              <Playhead />
            </div>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}
