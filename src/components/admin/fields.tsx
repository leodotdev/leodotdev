// Small form primitives for /admin. Inputs are 16px (text-base) so iOS
// doesn't zoom on focus.
import { useId, useRef, useState } from "react"
import { TbPhotoUp } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { imageProps } from "@/lib/image"
import type { Img } from "@/lib/image"
import { uploadImage } from "@/lib/resize"
import { cn } from "@/lib/utils"

const control =
  "w-full rounded-md border bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: (id: string) => React.ReactNode
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string
  hint?: string
  value: string | null | undefined
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <input
          id={id}
          className={control}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  )
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  hint?: string
  value: string | null | undefined
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <textarea
          id={id}
          rows={rows}
          className={cn(control, "resize-y")}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  )
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  )
}

/** Pick one or more image files, upload them, and hand back the stored images. */
export function UploadButton({
  prefix,
  multiple,
  label = "Upload",
  onUploaded,
}: {
  prefix: string
  multiple?: boolean
  label?: string
  onUploaded: (images: Array<Img>) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-1">
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple={multiple}
        className="hidden"
        onChange={async (e) => {
          const files = [...(e.target.files ?? [])]
          e.target.value = ""
          if (!files.length) return
          setBusy(true)
          setError(null)
          try {
            const out: Array<Img> = []
            for (const f of files) out.push(await uploadImage(f, prefix))
            onUploaded(out)
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed")
          } finally {
            setBusy(false)
          }
        }}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="w-fit gap-2"
      >
        <TbPhotoUp className="h-4 w-4" />
        {busy ? "Uploading…" : label}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function Thumb({ image, alt }: { image: Img | string | null | undefined; alt: string }) {
  if (!image) return null
  return (
    <img
      {...imageProps(image, { maxWidth: 320 })}
      sizes="160px"
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  )
}

/** Save button plus status line, shared by every editor. */
export function SaveBar({
  dirty,
  saving,
  error,
  savedAt,
  onSave,
  children,
}: {
  dirty: boolean
  saving: boolean
  error: string | null
  savedAt: Date | null
  onSave: () => void
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" disabled={!dirty || saving} onClick={onSave}>
        {saving ? "Saving…" : "Save"}
      </Button>
      {children}
      <span className={cn("text-xs", error ? "text-red-500" : "text-muted-foreground")}>
        {error ??
          (dirty
            ? "Unsaved changes"
            : savedAt
              ? `Saved ${savedAt.toLocaleTimeString()}`
              : "")}
      </span>
    </div>
  )
}

export function useSaver<T>(save: (value: T) => Promise<unknown>) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  return {
    saving,
    error,
    savedAt,
    run: async (value: T) => {
      setSaving(true)
      setError(null)
      try {
        await save(value)
        setSavedAt(new Date())
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed")
        return false
      } finally {
        setSaving(false)
      }
    },
  }
}
