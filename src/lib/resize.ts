// Browser-side image preparation for admin uploads: resize to the stored
// widths as WebP, so the Worker only has to put files in R2.
import { UPLOAD_WIDTHS } from "./image"
import type { Img } from "./image"
import { adminUploadImage } from "@/server/admin"

async function toWebp(bitmap: ImageBitmap, width: number): Promise<Blob> {
  const height = Math.round((bitmap.height * width) / bitmap.width)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available")
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(bitmap, 0, 0, width, height)
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not encode WebP"))),
      "image/webp",
      0.82
    )
  )
}

/**
 * Upload an image under `prefix` (e.g. "projects/hacker"). GIFs keep their
 * animation and are stored as-is; everything else becomes WebP at
 * UPLOAD_WIDTHS (never wider than the original).
 */
export async function uploadImage(file: File, prefix: string): Promise<Img> {
  if (file.type === "image/svg+xml")
    throw new Error("SVG can't be uploaded; export it as PNG or WebP")
  const bitmap = await createImageBitmap(file)
  const form = new FormData()
  form.set("prefix", prefix)
  form.set("width", String(bitmap.width))
  form.set("height", String(bitmap.height))
  if (file.type === "image/gif") {
    form.set(`w${bitmap.width}`, file)
  } else {
    const widths = [
      ...new Set([
        ...UPLOAD_WIDTHS.filter((w) => w < bitmap.width),
        Math.min(bitmap.width, UPLOAD_WIDTHS[UPLOAD_WIDTHS.length - 1]),
      ]),
    ]
    for (const w of widths)
      form.set(`w${w}`, new File([await toWebp(bitmap, w)], `${w}.webp`, { type: "image/webp" }))
  }
  bitmap.close()
  return adminUploadImage({ data: form })
}
