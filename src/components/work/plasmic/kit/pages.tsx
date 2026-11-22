import { TbBrandGoogle, TbChevronDown, TbPlus, TbSchool } from "react-icons/tb"
import { Avatars, Mark } from "@/components/work/plasmic/kit/studio"
import type { State } from "@/components/work/plasmic/types"

// The pages around the editor: logging in, and the projects list.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

export function LoginPage({ s }: { s: State }) {
  return (
    <div className="pk-page grid place-items-center" data-pk="login">
      <div className="pk-card flex w-[400px] flex-col gap-4 p-8">
        <span className="mx-auto">
          <Mark size={48} />
        </span>
        <p className="text-center text-[18px] leading-6 font-semibold">
          Log in to Plasmic
        </p>
        <span
          className="pk-btn"
          style={{ height: 40 }}
          data-pk="login:google"
          data-state={s.hover === "google" ? "hover" : undefined}
        >
          <TbBrandGoogle />
          Continue with Google
        </span>
        <span className="pk-faint text-center">or</span>
        <span
          className="pk-input"
          style={{ height: 40 }}
          data-state={s.emailFocus ? "focus" : undefined}
          data-pk="login:email"
        >
          {str(s.email) || <span className="pk-faint">Email address</span>}
          {s.emailFocus && <i className="pk-caret" />}
        </span>
        <span
          className="pk-btn"
          data-kind="primary"
          style={{ height: 40 }}
          data-pk="login:go"
        >
          Log in
        </span>
      </div>
    </div>
  )
}

const PROJECTS: Array<[string, string, Array<string>]> = [
  ["Acme App", "v1.2.0 · edited just now", ["L", "Y", "C"]],
  ["Component Kit", "v0.4.1 · edited 2h ago", ["Y"]],
  ["Marketing Site", "v3.0.0 · edited yesterday", ["C", "L"]],
  ["Color Kit", "v0.0.3 · edited last week", ["L"]],
]

export function ProjectsPage({ s }: { s: State }) {
  return (
    <div className="pk-page flex flex-col" data-pk="projects">
      <div className="pk-page-bar">
        <Mark />
        <span aria-current="page">Projects</span>
        <span>Tutorials</span>
        <span>Trash</span>
        <span className="flex-1" />
        <Avatars names={["L"]} />
      </div>
      <div className="mx-auto flex w-[860px] flex-col gap-3 pt-10">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex-1 text-[22px] leading-7 font-semibold">
            Projects
          </span>
          <span className="pk-btn" data-kind="ghost">
            Sort by: Recent
            <TbChevronDown />
          </span>
          <span
            className="pk-btn"
            data-kind="primary"
            data-pk="projects:new"
            data-state={s.hover === "new" ? "hover" : undefined}
          >
            <TbPlus />
            New project
          </span>
        </div>
        {s.created && (
          <div
            className="pk-project-row"
            data-pk="project:new"
            style={{ boxShadow: "0 0 0 1.5px var(--pk-accent)" }}
          >
            <span className="pk-project-thumb" />
            <span className="flex flex-1 flex-col">
              <b className="font-semibold">Untitled project</b>
              <span className="pk-faint">v0.0.0 · created just now</span>
            </span>
            <span className="pk-badge" data-kind="new">
              New
            </span>
          </div>
        )}
        {PROJECTS.map(([name, meta, people]) => (
          <div
            key={name}
            className="pk-project-row"
            data-pk={`project:${name.toLowerCase().replace(/\s+/g, "-")}`}
            data-state={s.hover === name ? "hover" : undefined}
          >
            <span className="pk-project-thumb" />
            <span className="flex flex-1 flex-col">
              <b className="font-semibold">{name}</b>
              <span className="pk-faint">{meta}</span>
            </span>
            <Avatars names={people} />
          </div>
        ))}
        <div
          className="pk-card mt-4 flex items-center gap-3 p-4"
          data-pk="tutorials"
        >
          <TbSchool className="h-5 w-5 opacity-60" />
          <span className="flex-1">
            <b className="font-semibold">Tutorials</b>
            <span className="pk-faint"> · Plasmic basics, a to-do app</span>
          </span>
          <span className="pk-faint">Click to duplicate</span>
        </div>
      </div>
    </div>
  )
}
