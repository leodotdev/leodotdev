"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ExperienceItem {
  logo: string;
  company: string;
  companyUrl?: string;
  position: string;
  location: string;
  duration: string;
  displayName?: string;
  altCompany?: string;
  altCompanyUrl?: string;
}

const experiences: ExperienceItem[] = [
  {
    logo: "/logo-me.svg",
    company: "Meta",
    companyUrl: "https://www.meta.com",
    position: "Product Designer (Contract)",
    location: "Remote",
    duration: "2024–Present",
  },
  {
    logo: "/logo-pl.svg",
    company: "Plasmic",
    companyUrl: "https://plasmic.app",
    position: "Founding Designer",
    location: "Remote",
    duration: "2020–Present",
  },
  {
    logo: "/logo-bg.svg",
    company: "BitGo",
    companyUrl: "https://www.bitgo.com/",
    position: "Senior Product & Design Systems Designer (Contract)",
    location: "Remote",
    duration: "2023–'24",
  },
  {
    logo: "/logo-fb.svg",
    displayName: "Facebook",
    company: "Meta",
    companyUrl: "https://www.meta.com",
    position: "Product & Design Systems Designer",
    location: "Menlo Park, CA",
    duration: "2018–'20",
  },
  {
    logo: "/logo-sg.svg",
    company: "Sourcegraph",
    companyUrl: "https://sourcegraph.com",
    position: "Lead Product Designer",
    location: "San Francisco, CA",
    duration: "2017–'18",
  },
  {
    logo: "/logo-ze.svg",
    displayName: "Zenefits",
    company: "TriNet",
    companyUrl: "https://zenefits.com",
    position: "Senior Product Designer",
    location: "San Francisco, CA",
    duration: "2016",
  },
];

// Additional experiences (duplicating some for demo purposes)
const additionalExperiences: ExperienceItem[] = [
  {
    logo: "/logo-sd.svg",
    displayName: "SeamlessDocs",
    company: "GovOS",
    companyUrl: "https://govos.com",
    position: "Product Designer",
    location: "Miami, FL",
    duration: "2014–'15",
  },
  {
    logo: "/horse.svg",
    company: "Freelance",
    position: "Web, App, Visual Designer",
    location: "Miami, FL",
    duration: "2010–'14",
  },
  {
    logo: "/logo-sa.svg",
    displayName: "Sapient",
    company: "Publicis Sapient",
    companyUrl: "https://www.meta.com",
    position: "Flash Designer",
    location: "Miami, FL",
    duration: "2007–'09",
  },
  {
    logo: "/logo-em.svg",
    company: "Emerson College",
    companyUrl: "https://emerson.edu",
    position: "Education, BA: New Media",
    location: "Boston, MA",
    duration: "2003–'07",
  },
];

export function ExperienceClient() {
  const [showMore, setShowMore] = useState(false);
  const displayedExperiences = showMore
    ? [...experiences, ...additionalExperiences]
    : experiences;

  return (
    <div id="experience">
      <div className="px-6 pb-12 md:px-12">
        <div className="font-semibold">Experience</div>
        <div className="text-muted-foreground">
          My work and employment history.
        </div>
      </div>

      <div className="flex flex-col gap-4 px-6 md:px-12">
        {displayedExperiences.map((exp, index) => (
          <div key={index}>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <Avatar className="rounded-md">
                  <AvatarImage src={exp.logo} />
                  <AvatarFallback className="text-muted-foreground">
                    {exp.company.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col md:flex-row md:gap-2">
                  {exp.displayName ? (
                    <div>
                      {exp.displayName} (now{" "}
                      {exp.companyUrl ? (
                        <a
                          className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                          href={exp.companyUrl}
                          target="_blank"
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
                          className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                          href={exp.companyUrl}
                          target="_blank"
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
                  <div className="italic text-muted-foreground">
                    {exp.position}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end md:flex-row md:gap-2">
                <p className="text-muted-foreground">{exp.location}</p>
                <span className="hidden text-muted-foreground md:inline">
                  ·
                </span>
                <p>{exp.duration}</p>
              </div>
            </div>
            {index < displayedExperiences.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}

        <button
          onClick={() => setShowMore(!showMore)}
          className="group mt-4 flex items-center justify-center py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="opacity-50 transition-opacity group-hover:opacity-100">
            {showMore ? "Show less" : "Show more"}
          </span>
        </button>
      </div>
    </div>
  );
}
