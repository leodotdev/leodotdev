// Shared list editor for experiences and references: one card per row, each
// saved on its own, plus add, delete and move up/down.
import { useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { TbArrowDown, TbArrowUp } from "react-icons/tb"
import { Checkbox, SaveBar, TextArea, TextField, Thumb, UploadButton, useSaver } from "./fields"
import { Button } from "@/components/ui/button"
import {
  adminCreateRow,
  adminDeleteRow,
  adminReorderRows,
  adminSaveRow,
} from "@/server/admin"
import type { RowKind } from "@/server/admin"

export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea"; hint?: string }
  | { key: string; label: string; type: "checkbox" }
  | { key: string; label: string; type: "logo" }

type Row = { id: string } & Record<string, unknown>

export function RowsEditor({
  kind,
  rows,
  fields,
  title,
  subtitle,
}: {
  kind: RowKind
  rows: Array<Row>
  fields: Array<FieldDef>
  title: (row: Row) => string
  subtitle?: (row: Row) => string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState<string | null>(null)

  const reorder = async (from: number, to: number) => {
    if (to < 0 || to >= rows.length) return
    const ids = rows.map((r) => r.id)
    const [id] = ids.splice(from, 1)
    ids.splice(to, 0, id)
    setBusy(true)
    await adminReorderRows({ data: { kind, ids } })
    await router.invalidate()
    setBusy(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        className="w-fit"
        disabled={busy}
        onClick={async () => {
          setBusy(true)
          const { id } = await adminCreateRow({ data: kind })
          await router.invalidate()
          setOpen(id)
          setBusy(false)
        }}
      >
        Add
      </Button>
      <ul className="flex flex-col divide-y border-y">
        {rows.map((row, i) => (
          <li key={row.id} className="flex flex-col gap-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setOpen(open === row.id ? null : row.id)}
              >
                <div className="truncate">{title(row)}</div>
                {subtitle && (
                  <div className="truncate text-xs text-muted-foreground">{subtitle(row)}</div>
                )}
              </button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Move up"
                disabled={busy || i === 0}
                onClick={() => void reorder(i, i - 1)}
              >
                <TbArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Move down"
                disabled={busy || i === rows.length - 1}
                onClick={() => void reorder(i, i + 1)}
              >
                <TbArrowDown className="h-4 w-4" />
              </Button>
            </div>
            {open === row.id && (
              <RowForm
                // Fresh form state after a reload brings new server values.
                key={JSON.stringify(row)}
                kind={kind}
                row={row}
                fields={fields}
                onDeleted={async () => {
                  setOpen(null)
                  await router.invalidate()
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RowForm({
  kind,
  row,
  fields,
  onDeleted,
}: {
  kind: RowKind
  row: Row
  fields: Array<FieldDef>
  onDeleted: () => Promise<void>
}) {
  const router = useRouter()
  const pick = (r: Row) =>
    Object.fromEntries([["id", r.id], ...fields.map((f) => [f.key, r[f.key] ?? (f.type === "checkbox" ? false : "")])])
  const [draft, setDraft] = useState<Record<string, unknown>>(pick(row))
  const [saved, setSaved] = useState(draft)
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const set = (k: string, v: unknown) => setDraft((d) => ({ ...d, [k]: v }))
  const saver = useSaver(async (d: Record<string, unknown>) => {
    await adminSaveRow({ data: { kind, row: d } })
    setSaved(d)
    await router.invalidate()
  })

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => {
          const value = draft[f.key]
          if (f.type === "checkbox")
            return (
              <Checkbox key={f.key} label={f.label} checked={Boolean(value)} onChange={(v) => set(f.key, v)} />
            )
          if (f.type === "logo")
            return (
              <div key={f.key} className="flex items-end gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Thumb image={String(value || "") || null} alt="" />
                </div>
                <div className="min-w-0 flex-1">
                  <TextField label={f.label} value={String(value ?? "")} onChange={(v) => set(f.key, v)} />
                </div>
                <UploadButton
                  prefix="logos"
                  label="Upload"
                  onUploaded={([img]) =>
                    // Logos show at 40px: the smallest stored width is plenty.
                    set(f.key, img.src.replace(/-\d+\.(\w+)$/, `-${img.widths[0]}.$1`))
                  }
                />
              </div>
            )
          const Input = f.type === "textarea" ? TextArea : TextField
          return (
            <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : undefined}>
              <Input label={f.label} hint={f.hint} value={String(value ?? "")} onChange={(v) => set(f.key, v)} />
            </div>
          )
        })}
      </div>
      <SaveBar
        dirty={dirty}
        saving={saver.saving}
        error={saver.error}
        savedAt={saver.savedAt}
        onSave={() => void saver.run(draft)}
      >
        <Button
          type="button"
          variant="ghost"
          className="ml-auto text-red-500 hover:text-red-500"
          onClick={async () => {
            if (!window.confirm("Delete this entry? This can't be undone.")) return
            await adminDeleteRow({ data: { kind, id: row.id } })
            await onDeleted()
          }}
        >
          Delete
        </Button>
      </SaveBar>
    </div>
  )
}
