import type { Dive, Scene, Shot } from "@/components/work/plasmic/types"

// A scene's versions of one thing (its `explore`) are shown inline, as the
// page scrolls (Leo, 2026-11-22: "i dont like any of the lightbox deep
// dives, turn those into the inline dives"; they used to open in a lightbox
// from a badge on the part). Versions that are the whole app each become a
// scene of their own after the one that names them, with a card listing
// them all; strips as wide as the app (the top bars) share one scene,
// stacked; and smaller pieces (a panel's states) go in the scene's sheet,
// the window beside the browser.

const whole = (shot: Shot) => shot.w >= 900 && shot.h >= 600
const strip = (shot: Shot) => shot.w >= 900

/** Strips stacked in the app, each under its label. */
function Strips({ items }: { items: Array<Shot> }) {
  return (
    <div
      className="flex h-full flex-col justify-center gap-7"
      style={{ padding: "0 72px", background: "var(--pk-bg)" }}
    >
      {items.map((shot, i) => {
        const k = (1440 - 144) / shot.w
        return (
          <figure
            key={shot.label}
            // They come in one after another, down the stack.
            className="pl-rise m-0 flex flex-col gap-2"
            style={{ "--pl-n": i } as React.CSSProperties}
          >
            <figcaption className="pk-faint pk-mono text-[11px]">
              {shot.label}
            </figcaption>
            <div
              className="overflow-hidden rounded-lg"
              style={{
                height: Math.round(shot.h * k),
                boxShadow: "var(--pk-shadow)",
              }}
            >
              <div
                style={{
                  width: shot.w,
                  height: shot.h,
                  scale: k,
                  transformOrigin: "0 0",
                }}
              >
                {shot.view()}
              </div>
            </div>
          </figure>
        )
      })}
    </div>
  )
}

function expand(scene: Scene): Array<Scene> {
  const set = scene.explore
  if (!set) return [scene]
  const { title, items } = set
  const labels = items.map((shot) => shot.label)
  if (items.every(whole)) {
    return [
      scene,
      ...items.map((shot, at): Scene => ({
        view: shot.view,
        url: scene.url,
        notes: shot.notes,
        versions: { title, labels, at },
      })),
    ]
  }
  if (items.every(strip)) {
    return [
      scene,
      {
        view: () => <Strips items={items} />,
        url: scene.url,
        versions: { title, labels },
      },
    ]
  }
  return [
    {
      ...scene,
      sheet: scene.sheet ?? { title, items },
      span: Math.max(scene.span ?? 1, 3),
    },
  ]
}

/** A year's dives with every scene's versions set out inline. */
export const inline = (dives: Array<Dive>): Array<Dive> =>
  dives.map((dive) => ({ ...dive, scenes: dive.scenes.flatMap(expand) }))
