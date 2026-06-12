"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types/Experience";

const EXPERIENCE_PAGE_SIZE = 4;

interface ExperienceClientProps {
  experiences: Experience[];
}

export function ExperienceClient({ experiences }: ExperienceClientProps) {
  const [visibleCount, setVisibleCount] = useState(EXPERIENCE_PAGE_SIZE);
  const displayedExperiences = experiences.slice(0, visibleCount);
  const hasMore = visibleCount < experiences.length;

  return (
    <div id="experience">
      <div className="px-6 pb-12 md:px-12">
        <div className="font-semibold">Experience</div>
        <div className="text-muted-foreground">
          My work and employment history.
        </div>
      </div>

      <div className="flex flex-col [&:hover>*]:opacity-50">
        {displayedExperiences.map((exp, index) => (
          <React.Fragment key={exp._id}>
          <div
            className="group/item cursor-pointer transition-opacity hover:!opacity-100"
            onClick={() => {
              const url = exp.companyUrl;
              if (url) window.open(url, "_blank");
            }}
          >
            <div className="flex w-full items-center justify-between px-6 py-4 md:px-12">
              <div className="flex flex-row items-center gap-3">
                <Avatar className={exp.roundLogo ? "" : "rounded-md"}>
                  <AvatarImage src={exp.logo} />
                  <AvatarFallback className="text-muted-foreground">
                    {exp.company.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex flex-col md:flex-row md:gap-2">
                    {exp.displayName ? (
                      <div>
                        {exp.displayName}{" "}
                        (now{" "}
                        {exp.companyUrl ? (
                          <a
                            className="underline decoration-dotted group-hover/item:text-blue-500 group-hover/item:decoration-solid"
                            href={exp.companyUrl}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {exp.company}
                          </a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                        )
                      </div>
                    ) : (
                      <>
                        {exp.companyUrl ? (
                          <a
                            className="underline decoration-dotted group-hover/item:text-blue-500 group-hover/item:decoration-solid"
                            href={exp.companyUrl}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {exp.company}
                          </a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                      </>
                    )}
                    <span className="hidden text-muted-foreground md:inline">
                      ·
                    </span>
                    <div className="flex flex-col">
                      <div className="italic text-muted-foreground">
                        {exp.position}
                      </div>
                    </div>
                  </div>
                  {(exp.contract || exp.team || exp.project) && (
                    <div className="text-sm text-muted-foreground">
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
                      {exp.project && (
                        <>
                          {!exp.projectCompany && "Project: "}
                          {exp.projectCompany && "Project: "}
                          {exp.projectUrl ? (
                            <a
                              className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                              href={exp.projectUrl}
                              target="_blank"
                            >
                              {exp.project}
                            </a>
                          ) : (
                            <span>{exp.project}</span>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end text-end md:flex-row md:gap-2">
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
            {index < displayedExperiences.length - 1 && (
              <Separator className="transition-opacity" />
            )}
          </React.Fragment>
        ))}
      </div>

      {hasMore ? (
        <Button
          variant="ghost"
          onClick={() => setVisibleCount((prev) => prev + EXPERIENCE_PAGE_SIZE)}
          className="group mt-4 h-auto w-full py-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          <span className="opacity-50 transition-opacity group-hover:opacity-100">
            Show more
          </span>
        </Button>
      ) : visibleCount > EXPERIENCE_PAGE_SIZE ? (
        <Button
          variant="ghost"
          onClick={() => setVisibleCount(EXPERIENCE_PAGE_SIZE)}
          className="group mt-4 h-auto w-full py-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          <span className="opacity-50 transition-opacity group-hover:opacity-100">
            Show less
          </span>
        </Button>
      ) : null}
    </div>
  );
}
