import { createImageUrlBuilder } from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url"
import { dataset, projectId } from "./config"

const builder = createImageUrlBuilder({ projectId, dataset })

/** URL builder for a Sanity image block, asset, or cdn.sanity.io URL. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** Widths offered in srcset, matching what next/image used to generate. */
const WIDTHS = [256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]

function isSanityUrl(src: unknown): boolean {
  return typeof src === "string" && src.startsWith("https://cdn.sanity.io/")
}

/**
 * `src` and `srcSet` for an <img> from a Sanity image. Pass `maxWidth` to cap
 * the largest candidate (thumbnails), and `square` to crop thumbnails to 1:1.
 * Non-Sanity strings (local /public files) pass through untouched.
 */
export function sanityImageProps(
  source: SanityImageSource,
  opts: { maxWidth?: number; square?: boolean } = {}
): { src: string; srcSet?: string } {
  if (typeof source === "string" && !isSanityUrl(source)) return { src: source }
  const max = opts.maxWidth ?? 3840
  const widths = WIDTHS.filter((w) => w <= max)
  if (!widths.includes(max)) widths.push(max)
  const url = (w: number) => {
    const b = urlFor(source).width(w).auto("format")
    return (opts.square ? b.height(w).fit("crop") : b.fit("max")).url()
  }
  return {
    src: url(Math.min(max, 1080)),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(", "),
  }
}
