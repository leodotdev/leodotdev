import { useEffect, useState } from "react"
import { TbPlayerPlayFilled, TbX } from "react-icons/tb"
import { Section, Specimen } from "@/components/work/claude/ui"

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

function Playhead({ onClick }: { onClick?: () => void }) {
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
function Lightbox() {
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
      <div className="cds-video">
        <Playhead onClick={() => setOpen(true)} />
      </div>
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

export function MediaDoc() {
  return (
    <>
      <Section title="Logo Wall">
        <Specimen className="p-6 md:p-8">
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

      <Section title="Video: Lightbox">
        <Specimen className="[container-type:inline-size]">
          <Lightbox />
        </Specimen>
      </Section>

      <Section title="Video: Reel">
        <Specimen className="flex justify-center p-6 md:p-8">
          <div className="cds-video cds-reel">
            <Playhead />
          </div>
        </Specimen>
      </Section>
    </>
  )
}
