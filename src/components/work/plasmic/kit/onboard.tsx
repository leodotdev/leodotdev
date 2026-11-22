import {
  TbArrowLeft,
  TbArrowRight,
  TbBook,
  TbBrandGatsby,
  TbBrandNextjs,
  TbBrandReact,
  TbCheck,
  TbChevronDown,
  TbCopy,
  TbFlask,
  TbFolder,
  TbTerminal2,
} from "react-icons/tb"
import { Dialog } from "@/components/work/plasmic/kit/overlays"
import type { State } from "@/components/work/plasmic/types"

// Q3 2021's onboarding, from the "2021 Q3" file: a new project asks where
// its code will live (a test repo made for it, or one of yours), then hands
// over the one command that scaffolds the app, by flavor.

const str = (v: State[string], d = "") => (typeof v === "string" ? v : d)

const FLAVORS: Array<
  [string, string, React.ComponentType<{ className?: string }>]
> = [
  ["react", "React", TbBrandReact],
  ["nextjs", "NextJS", TbBrandNextjs],
  ["gatsby", "Gatsby", TbBrandGatsby],
]

/**
 * State keys: wizard: "repo" | "flavor"; repo: "test" | "existing";
 * flavor: "nextjs" | "gatsby" | "react"; copied: the command copied.
 */
export function Connect({ s }: { s: State }) {
  const step = str(s.wizard, "repo")
  const repo = str(s.repo, "test")
  const flavor = str(s.flavor, "nextjs")
  return (
    <Dialog
      w={440}
      title={
        <span className="flex items-center gap-2">
          <span className="text-[18px] leading-5">🧙</span>
          Welcome to Plasmic!
        </span>
      }
      pk="wizard"
      foot={
        step === "repo" ? (
          <>
            <span className="pk-btn" data-kind="ghost">
              Connect later
            </span>
            <span className="pk-btn" data-kind="primary" data-pk="wizard:next">
              Next <TbArrowRight />
            </span>
          </>
        ) : (
          <>
            <span className="pk-btn" data-kind="ghost">
              <TbArrowLeft /> Previous
            </span>
            <span className="pk-btn" data-kind="primary" data-pk="wizard:done">
              Done
            </span>
          </>
        )
      }
    >
      {step === "repo" ? (
        <div className="flex flex-col gap-3 p-4">
          <span className="pk-muted text-[13px] leading-5">
            Now let’s connect this project to a codebase.
          </span>
          <span
            className="pk-choice"
            data-state={repo === "test" ? "focus" : undefined}
            data-pk="choice:test"
          >
            <TbFlask />
            Create a test repo <span className="pk-faint">(default)</span>
          </span>
          <span
            className="pk-choice"
            data-state={repo === "existing" ? "focus" : undefined}
            data-pk="choice:existing"
          >
            <TbFolder />
            Use existing repo
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          <span className="pk-choice" data-state="focus">
            {repo === "test" ? <TbFlask /> : <TbFolder />}
            {repo === "test" ? (
              <>
                Create a new repo <span className="pk-faint">(default)</span>
              </>
            ) : (
              "Use existing repo"
            )}
          </span>
          <span className="pk-muted pt-1">Choose a flavor</span>
          <span className="pk-seg" data-pk="flavor">
            {FLAVORS.filter(([k]) => repo === "existing" || k !== "react").map(
              ([k, label, Icon]) => (
                <span
                  key={k}
                  aria-pressed={flavor === k}
                  className="flex! items-center gap-1.5"
                  style={{ height: 28 }}
                  data-pk={`flavor:${k}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              )
            )}
            <span className="flex! items-center gap-1" style={{ height: 28 }}>
              Other <TbChevronDown className="h-3 w-3" />
            </span>
          </span>
          <div className="flex flex-col gap-2 rounded-lg bg-[#0b0c0e] p-3 text-[#c9d1e0]">
            <span className="flex items-center gap-2">
              <TbTerminal2 className="h-3.5 w-3.5 opacity-70" />
              <span className="flex-1">
                Open terminal and run the following:
              </span>
              <span
                className="pk-btn"
                data-size="sm"
                style={{ height: 22 }}
                data-pk="wizard:copy"
              >
                {s.copied ? <TbCheck /> : <TbCopy />}
                {s.copied ? "Copied" : "Copy"}
              </span>
            </span>
            <pre
              className="pk-code"
              style={{ padding: 0, whiteSpace: "pre-wrap" }}
              data-pk="wizard:command"
            >
              {repo === "existing" ? (
                <span className="s">
                  {
                    "npm install -g @plasmicapp/cli\nplasmic auth\nplasmic sync --projects a1B2c3D4e5"
                  }
                </span>
              ) : (
                <span className="s">
                  npx create-plasmic-app -p a1B2c3D4e5 --platform={flavor}
                </span>
              )}
            </pre>
            <span>
              Then run:{" "}
              <span className="pk-mono text-[#7fd3a8]">yarn start</span>
            </span>
          </div>
          <span
            className="flex gap-2.5 rounded-lg p-3 leading-[18px]"
            style={{ background: "var(--pk-panel-2)" }}
            data-pk="wizard:sync"
          >
            <TbBook className="mt-0.5 h-4 w-4 flex-none opacity-60" />
            <span>
              Now make some changes in the studio and see your updates sync!
              Finally, integrate into your actual codebase.{" "}
              <span className="text-[color:var(--pk-accent)]">
                Read the docs.
              </span>
            </span>
          </span>
        </div>
      )}
    </Dialog>
  )
}
