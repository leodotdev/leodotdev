import { useId } from "react"
import { cn } from "@/lib/utils"
import { ART } from "./shared"

// The constellation an open table row draws, as anthropic.com draws it (read
// from its research table on 2026-11-19): the post and its related articles
// as round thumbnails, joined by thin lines that stop short of them, the
// post itself ringed. The site lays each post's graph out by force; here a
// post's title seeds the same kind of layout, so every row has its own and
// keeps it. Like the site's, it is fitted to a 280 by 105 field, its width
// first, and centered.

const W = 280
const H = 105
const PAD_X = 29.25
const PAD_Y = 20
const R = Math.sqrt(80)
const RING = R + 2
// Where a line stops short of a node: 4px past the picture, 4.5px past the
// ring.
const GAP = R + 4
const GAP_RING = RING + 4.5

/** A small, steady random sequence from a string. */
function random(seed: string) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1)
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61)
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296
  }
}

type Point = { x: number; y: number }

/** A tree of `count` nodes, laid out by force and fitted to the field. */
export function layout(seed: string, count: number) {
  const rand = random(seed)
  // Most related posts hang from the post itself, some from each other.
  const edges: Array<[number, number]> = []
  for (let i = 1; i < count; i++)
    edges.push([rand() < 0.6 ? 0 : Math.floor(rand() * i), i])
  const p: Array<Point> = Array.from({ length: count }, () => ({
    x: rand() - 0.5,
    y: rand() - 0.5,
  }))
  for (let step = 0; step < 300; step++) {
    const heat = 0.1 * (1 - step / 300) + 0.005
    const force = p.map(() => ({ x: 0, y: 0 }))
    for (let i = 0; i < count; i++)
      for (let j = i + 1; j < count; j++) {
        const dx = p[j].x - p[i].x
        const dy = p[j].y - p[i].y
        const d2 = Math.max(dx * dx + dy * dy, 0.01)
        const f = 0.6 / d2
        force[i].x -= dx * f
        force[i].y -= dy * f
        force[j].x += dx * f
        force[j].y += dy * f
      }
    for (const [a, b] of edges) {
      const dx = p[b].x - p[a].x
      const dy = p[b].y - p[a].y
      const d = Math.hypot(dx, dy) || 0.01
      // Lines of a few lengths, as the site's are.
      const f = (d - (0.8 + ((a * 7 + b * 3) % 5) * 0.12)) * 0.5
      force[a].x += (dx / d) * f
      force[a].y += (dy / d) * f
      force[b].x -= (dx / d) * f
      force[b].y -= (dy / d) * f
    }
    p.forEach((point, i) => {
      const m = Math.hypot(force[i].x, force[i].y)
      const s = m > heat ? heat / m : 1
      point.x += force[i].x * s
      point.y += force[i].y * s
    })
  }
  // Turned so its long side lies along the field.
  const cx = p.reduce((s, q) => s + q.x, 0) / count
  const cy = p.reduce((s, q) => s + q.y, 0) / count
  let sxx = 0
  let syy = 0
  let sxy = 0
  for (const q of p) {
    sxx += (q.x - cx) ** 2
    syy += (q.y - cy) ** 2
    sxy += (q.x - cx) * (q.y - cy)
  }
  const angle = -0.5 * Math.atan2(2 * sxy, sxx - syy)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const turned = p.map((q) => ({
    x: (q.x - cx) * cos - (q.y - cy) * sin,
    y: (q.x - cx) * sin + (q.y - cy) * cos,
  }))
  const xs = turned.map((q) => q.x)
  const ys = turned.map((q) => q.y)
  const w = Math.max(...xs) - Math.min(...xs) || 1
  const h = Math.max(...ys) - Math.min(...ys) || 1
  const scale = Math.min((W - 2 * PAD_X) / w, (H - 2 * PAD_Y) / h)
  const ox = (W - w * scale) / 2 - Math.min(...xs) * scale
  const oy = (H - h * scale) / 2 - Math.min(...ys) * scale
  return {
    nodes: turned.map((q) => ({ x: q.x * scale + ox, y: q.y * scale + oy })),
    edges,
  }
}

/** The pictures the nodes show, the post's first. */
const PICTURES = [1, 2, 3, 4, 5, 6, 7].map((i) => `${ART}/node-${i}.webp`)

/**
 * The graph of a post and its related articles. `active` is the related
 * article under the pointer (its node grows); `onActive` reports a node the
 * pointer is on, by the related article's index.
 */
export function PostGraph({
  seed,
  related,
  active = null,
  onActive,
  className,
}: {
  seed: string
  /** How many related articles. */
  related: number
  active?: number | null
  onActive?: (index: number | null) => void
  className?: string
}) {
  const clip = useId()
  const { nodes, edges } = layout(seed, related + 1)
  const offset = seed.length % PICTURES.length
  return (
    <div className={cn("ads-graph", className)} aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id={clip}>
            <circle r={R} />
          </clipPath>
        </defs>
        {edges.map(([a, b]) => {
          const p = nodes[a]
          const q = nodes[b]
          const d = Math.hypot(q.x - p.x, q.y - p.y) || 1
          const ux = (q.x - p.x) / d
          const uy = (q.y - p.y) / d
          const ga = a === 0 ? GAP_RING : GAP
          const gb = b === 0 ? GAP_RING : GAP
          if (d <= ga + gb) return null
          return (
            <line
              key={`${a}-${b}`}
              className="ads-graph-edge"
              x1={p.x + ux * ga}
              y1={p.y + uy * ga}
              x2={q.x - ux * gb}
              y2={q.y - uy * gb}
            />
          )
        })}
        {nodes.map((n, i) => (
          <g
            key={i}
            transform={`translate(${n.x} ${n.y})`}
            onPointerEnter={i ? () => onActive?.(i - 1) : undefined}
            onPointerLeave={i ? () => onActive?.(null) : undefined}
          >
            <g
              className="ads-graph-node"
              data-active={i > 0 && active === i - 1 ? "" : undefined}
            >
              <circle r={R} className="ads-graph-node-bg" />
              <image
                href={PICTURES[(i + offset) % PICTURES.length]}
                x={-R}
                y={-R}
                width={2 * R}
                height={2 * R}
                clipPath={`url(#${clip})`}
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
            {i === 0 && <circle r={RING} className="ads-graph-ring" />}
          </g>
        ))}
      </svg>
    </div>
  )
}

/**
 * The little constellation over the table's last column: five dots that
 * gather into one arrangement after another every six seconds, the lines
 * between them drawing in, as the site's does.
 */
export function GraphIcon({ className }: { className?: string }) {
  const dots = [
    [-9, 2, -11.5, 1.5, -10.5, -3.5, 1.75],
    [-8, -5, -5, 5, -8, 4, 1.75],
    [0, 0, -4, -4, 1.5, 4, 2.5],
    [9, -2, 4.5, -1, 10.5, 2, 1.75],
    [8, 5, 11.5, -4.5, 6, -4, 1.75],
  ]
  const lines = {
    a: "M15.07 9.65L11.2 10.51M15.46 7.41L11.91 5.19M20.93 8.35L24.8 7.49M20.54 10.59L24.09 12.81",
    b: "M8.31 9.17L11.58 6.77M13.67 7.98L13.25 11.76M16.83 6L20.38 7.25M24.51 6.99L27.49 5.51",
    c: "M8.21 7.63L9.29 10.87M12.25 13L16.5 13M22.43 12.35L26.3 11.49M20.97 10.39L22.9 6.96",
  }
  return (
    <svg
      viewBox="0 0 36 18"
      width="36"
      height="18"
      aria-hidden
      className={cn("ads-graph-icon", className)}
    >
      {Object.entries(lines).map(([stage, d]) => (
        <path
          key={stage}
          className="ads-graph-icon-lines"
          data-stage={stage}
          d={d}
        />
      ))}
      {dots.map(([ax, ay, bx, by, cx, cy, r], i) => (
        <g
          key={i}
          className="ads-graph-icon-dot"
          style={
            {
              "--ax": `${ax}px`,
              "--ay": `${ay}px`,
              "--bx": `${bx}px`,
              "--by": `${by}px`,
              "--cx": `${cx}px`,
              "--cy": `${cy}px`,
            } as React.CSSProperties
          }
        >
          <circle cx="18" cy="9" r={r} />
        </g>
      ))}
    </svg>
  )
}
