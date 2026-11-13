import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/types/Experience";

const EXPERIENCE_PAGE_SIZE = 4;

interface ExperienceClientProps {
  experiences: Experience[];
}

function CompanyLink({ exp }: { exp: Experience }) {
  if (!exp.companyUrl) return <span>{exp.company}</span>;
  return (
    <a
      className="group-hover/item:text-blue-500 group-hover/item:underline"
      href={exp.companyUrl}
      target="_blank"
      onClick={(e) => e.stopPropagation()}
    >
      {exp.company}
    </a>
  );
}

const splitList = (s: string | null) =>
  (s ?? "").split(",").map((x) => x.trim());

/**
 * "Project: A" or "Projects: A & B". `project` and `projectUrl` hold
 * comma-separated lists, matched by position.
 */
function ProjectLinks({ exp }: { exp: Experience }) {
  const names = splitList(exp.project).filter(Boolean);
  const urls = splitList(exp.projectUrl);
  return (
    <>
      {names.length > 1 ? "Projects: " : "Project: "}
      {names.map((name, i) => (
        <React.Fragment key={name}>
          {i > 0 && (i === names.length - 1 ? " & " : ", ")}
          {urls[i] ? (
            <a
              className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
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
  );
}

export function ExperienceClient({ experiences }: ExperienceClientProps) {
  const [visibleCount, setVisibleCount] = useState(EXPERIENCE_PAGE_SIZE);
  const displayedExperiences = experiences.slice(0, visibleCount);
  const hasMore = visibleCount < experiences.length;

  return (
    <div id="experience">
      <div className="px-6 pb-12 md:px-12">
        <div className="font-semibold">Experience</div>
      </div>

      <div className="flex flex-col [&:hover>*]:opacity-50">
        {displayedExperiences.map((exp, index) => (
          <React.Fragment key={exp.id}>
          <div
            className="group/item cursor-pointer transition-opacity hover:!opacity-100"
            onClick={() => {
              const url = exp.companyUrl;
              if (url) window.open(url, "_blank");
            }}
          >
            <div className="flex w-full items-center justify-between gap-4 px-6 py-4 md:px-12">
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
                      {exp.contract && (exp.projectCompany || exp.project || exp.team) && ", "}
                      {exp.team && exp.team}
                      {exp.projectCompany && (
                        <>
                          Client:{" "}
                          {exp.projectCompanyUrl ? (
                            <a
                              className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                              href={exp.projectCompanyUrl}
                              target="_blank"
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
            {index < displayedExperiences.length - 1 && (
              <Separator className="transition-opacity" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-center px-6 pt-8 md:px-12">
        {hasMore ? (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setVisibleCount(experiences.length)}
            className="rounded-full px-6 [corner-shape:round]"
          >
            Show more
          </Button>
        ) : visibleCount > EXPERIENCE_PAGE_SIZE ? (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setVisibleCount(EXPERIENCE_PAGE_SIZE)}
            className="rounded-full px-6 [corner-shape:round]"
          >
            Show less
          </Button>
        ) : null}
      </div>
    </div>
  );
}
