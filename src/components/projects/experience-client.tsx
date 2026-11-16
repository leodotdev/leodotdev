import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ShowMoreButton, useShowMore } from "@/components/projects/show-more"
import { TbArrowUpRight, TbDownload } from "react-icons/tb"
import type { Experience } from "@/server/db/schema"

const EXPERIENCE_PAGE_SIZE = 3

interface ExperienceClientProps {
  experiences: Experience[]
}

function CompanyLink({ exp }: { exp: Experience }) {
  if (!exp.companyUrl) return <span>{exp.company}</span>
  return (
    <a
      className="group-hover/item:text-blue group-hover/item:underline"
      href={exp.companyUrl}
      target="_blank"
      onClick={(e) => e.stopPropagation()}
    >
      {exp.company}
    </a>
  )
}

const splitList = (s: string | null) =>
  (s ?? "").split(",").map((x) => x.trim())

/**
 * "Project: A" or "Projects: A & B". `project` and `projectUrl` hold
 * comma-separated lists, matched by position.
 */
function ProjectLinks({ exp }: { exp: Experience }) {
  const names = splitList(exp.project).filter(Boolean)
  const urls = splitList(exp.projectUrl)
  return (
    <>
      {names.length > 1 ? "Projects: " : "Project: "}
      {names.map((name, i) => (
        <React.Fragment key={name}>
          {i > 0 && (i === names.length - 1 ? " & " : ", ")}
          {urls[i] ? (
            <a
              className="underline decoration-dotted hover:text-blue hover:decoration-solid"
              href={urls[i]}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              {name}
            </a>
          ) : (
            <span>{name}</span>
          )}
        </React.Fragment>
      ))}
    </>
  )
}

export function ExperienceClient({ experiences }: ExperienceClientProps) {
  const { sectionRef, visible, toggle } = useShowMore(
    experiences,
    EXPERIENCE_PAGE_SIZE
  )

  return (
    <div id="experience" ref={sectionRef}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 pb-6 md:px-12">
        <div className="font-semibold">Experience</div>
        <div className="flex flex-wrap gap-2">
          <Button variant="pill" render={<a href="/resume" target="_blank" />}>
            View résumé
            <TbArrowUpRight className="-mr-1 ml-1 h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="pill"
            data-wave-click
            render={
              <a
                href="/Leo-SF-Resume-May-2025.pdf"
                download="Leo-Succar-Resume.pdf"
              />
            }
          >
            Download PDF
            <TbDownload className="-mr-1 ml-1 h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col [&>*+*]:-mt-[0.5px]">
        {visible.map((exp) => (
          <div
            key={exp.id}
            data-wave
            className="group/item cursor-pointer rounded-[20px] border border-transparent bg-background hover:bg-card md:mx-6"
            onClick={() => {
              const url = exp.companyUrl
              if (url) window.open(url, "_blank")
            }}
          >
            <div className="flex w-full items-center justify-between gap-4 p-6">
              <div className="flex min-w-0 flex-row items-center gap-3">
                <Avatar className={exp.roundLogo ? "" : "rounded-md"}>
                  <AvatarImage src={exp.logo} />
                  <AvatarFallback className="text-muted-foreground">
                    {exp.company.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  {exp.position && <div>{exp.position}</div>}
                  {(exp.contract || exp.team || exp.project) && (
                    <div className="text-xs text-muted-foreground">
                      {exp.contract && "Contract"}
                      {exp.contract &&
                        (exp.projectCompany || exp.project || exp.team) &&
                        ", "}
                      {exp.team}
                      {exp.projectCompany && (
                        <>
                          Client:{" "}
                          {exp.projectCompanyUrl ? (
                            <a
                              className="underline decoration-dotted hover:text-blue hover:decoration-solid"
                              href={exp.projectCompanyUrl}
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {exp.projectCompany}
                            </a>
                          ) : (
                            <span>{exp.projectCompany}</span>
                          )}
                          {exp.project && ", "}
                        </>
                      )}
                      {exp.project && <ProjectLinks exp={exp} />}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex max-w-[45%] flex-col items-end text-end md:max-w-none md:shrink-0">
                <div>
                  {exp.displayName ? (
                    <>
                      {exp.displayName} (now <CompanyLink exp={exp} />)
                    </>
                  ) : (
                    <CompanyLink exp={exp} />
                  )}
                </div>
                <div className="flex flex-col items-end text-xs md:flex-row md:gap-2">
                  <p className="text-muted-foreground">{exp.location}</p>
                  {exp.duration && (
                    <>
                      <span className="hidden text-muted-foreground md:inline">
                        ·
                      </span>
                      <p>{exp.duration}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ShowMoreButton toggle={toggle} />
    </div>
  )
}
