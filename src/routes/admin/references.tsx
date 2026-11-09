import { createFileRoute } from "@tanstack/react-router"
import { RowsEditor } from "@/components/admin/rows-editor"
import type { FieldDef } from "@/components/admin/rows-editor"
import { adminListRows } from "@/server/admin"

export const Route = createFileRoute("/admin/references")({
  loader: () => adminListRows({ data: "references" }),
  component: ReferencesAdmin,
})

const FIELDS: Array<FieldDef> = [
  { key: "name", label: "Name", type: "text" },
  { key: "initials", label: "Initials", type: "text", hint: "Shown when there's no photo" },
  { key: "title", label: "Title", type: "text" },
  { key: "company", label: "Company", type: "text" },
  { key: "linkedinUrl", label: "LinkedIn link", type: "text" },
  { key: "quote", label: "Quote", type: "textarea" },
]

function ReferencesAdmin() {
  const { rows } = Route.useLoaderData()
  return (
    <RowsEditor
      kind="references"
      rows={rows}
      fields={FIELDS}
      title={(r) => String(r.name)}
      subtitle={(r) => `${String(r.title)} · ${String(r.company)}`}
    />
  )
}
