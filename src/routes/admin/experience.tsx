import { createFileRoute } from "@tanstack/react-router"
import { RowsEditor } from "@/components/admin/rows-editor"
import type { FieldDef } from "@/components/admin/rows-editor"
import { adminListRows } from "@/server/admin"

export const Route = createFileRoute("/admin/experience")({
  loader: () => adminListRows({ data: "experiences" }),
  component: ExperienceAdmin,
})

const FIELDS: Array<FieldDef> = [
  { key: "company", label: "Company", type: "text" },
  { key: "companyUrl", label: "Company link", type: "text" },
  { key: "displayName", label: "Display name", type: "text", hint: "Shown instead of the company name, if set" },
  { key: "position", label: "Role", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "duration", label: "Dates", type: "text", hint: "e.g. 2024–'25" },
  { key: "logo", label: "Logo", type: "logo" },
  { key: "team", label: "Team", type: "text" },
  { key: "project", label: "Projects", type: "text", hint: "Separate several with commas" },
  { key: "projectUrl", label: "Project links", type: "text", hint: "Comma-separated, in the same order" },
  { key: "projectCompany", label: "Client", type: "text" },
  { key: "projectCompanyUrl", label: "Client link", type: "text" },
  { key: "altCompany", label: "Alternate company", type: "text" },
  { key: "altCompanyUrl", label: "Alternate company link", type: "text" },
  { key: "contract", label: "Contract", type: "checkbox" },
  { key: "roundLogo", label: "Round logo", type: "checkbox" },
]

function ExperienceAdmin() {
  const { rows } = Route.useLoaderData()
  return (
    <RowsEditor
      kind="experiences"
      rows={rows}
      fields={FIELDS}
      title={(r) => `${String(r.displayName || r.company)} · ${String(r.position)}`}
      subtitle={(r) => `${String(r.location)} · ${String(r.duration)}`}
    />
  )
}
