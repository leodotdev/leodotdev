// Images live in the `leodotdev-media` R2 bucket and are served at /images/*
// (src/server.ts). Each image is stored at a few widths, named
// `<base>-<width>.<ext>`; `src` is the largest one.

export type Img = {
  /** Path of the largest variant, e.g. /images/projects/hacker/cover-1920.webp */
  src: string
  /** Original dimensions, for aspect ratio. */
  width: number
  height: number
  /** Widths stored for this image, ascending. */
  widths: Array<number>
}

/** Widths the admin generates on upload (and the Sanity export used). */
export const UPLOAD_WIDTHS = [320, 960, 1920]

const VARIANT = /-(\d+)\.(\w+)$/

function variant(img: Img, w: number) {
  return img.src.replace(VARIANT, `-${w}.$2`)
}

/**
 * `src` and `srcSet` for an <img>. Pass `maxWidth` to drop candidates wider
 * than a thumbnail needs. Plain strings (files in public/, like /horse.png)
 * pass through untouched.
 */
export function imageProps(
  source: Img | string | null | undefined,
  opts: { maxWidth?: number } = {}
): { src: string; srcSet?: string } {
  if (!source) return { src: "" }
  if (typeof source === "string") return { src: source }
  if (!VARIANT.test(source.src) || source.widths.length < 2)
    return { src: source.src }
  const max = opts.maxWidth ?? Infinity
  const fits = source.widths.filter((w) => w <= max)
  // Always keep at least the smallest variant.
  const widths = fits.length ? fits : [source.widths[0]]
  const src = variant(source, widths.find((w) => w >= 960) ?? widths[widths.length - 1])
  return {
    src,
    srcSet: widths.map((w) => `${variant(source, w)} ${w}w`).join(", "),
  }
}
