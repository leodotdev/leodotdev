import { FrameGallery } from "@/components/work/frame-gallery"
import type { Doc } from "@/components/work/claude/docs"

/** A docs page that shows its part of the system as frames from Figma. */
export function FramesDoc({ doc }: { doc: Doc & { kind: "frames" } }) {
  return (
    <>
      <FrameGallery
        bare
        base="/work/claude"
        chapters={[
          {
            title: doc.title,
            description: doc.summary,
            ratio: doc.ratio,
            frames: doc.frames,
          },
        ]}
      />
    </>
  )
}
