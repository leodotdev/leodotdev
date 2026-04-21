"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface Reference {
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  initials: string;
  quote: string;
}

const references: Reference[] = [
  {
    name: "James Yu",
    title: "Senior Software Engineer",
    company: "Meta",
    linkedinUrl: "https://www.linkedin.com/in/smarts2013/",
    initials: "JY",
    quote:
      "Leo volunteered to design for the Sticker Admin Tool for the Story Creation Team, which is one of our most important tools, to be used to deploy/manage sticker assets in sticker tray for public users. Historically, it has been a huge pain point as the old tool is lacking a lot of functionalities and very inefficient to use. Leo dedicated himself to this project with full passion and went full speed. After several iterations, the design was perfected and received very positive feedback from people across the whole Story Creation Team, which also made it to the 'Story of the Week.'",
  },
  {
    name: "Alexander Lambert",
    title: "Design Director",
    company: "BitGo",
    linkedinUrl: "https://www.linkedin.com/in/abldotdesign/",
    initials: "AL",
    quote:
      "Leo is a deep thinker who lives in between design and code. While at BitGo, Leo took ownership of the design system by streamlining components, testing new UI elements within the product, and bridging those components with our UI repository. He's excited to live in these two worlds by supporting both the design and front-end engineering teams. Previously, he led some of BitGo's newest market growing spaces, including BitGo Prime and Go products, helping connect our users with partner services. Leo has a level head and pragmatic style required to design, build, launch, and maintain complex systems.",
  },
  {
    name: "Justin Harsch",
    title: "Design Director",
    company: "Inktel",
    linkedinUrl: "https://www.linkedin.com/in/justinharsch",
    initials: "JH",
    quote:
      "Rarely do you meet a creative with such a lethal combination of technical skills and fundamental design ability. Leo can handle any project from classic graphic design to robust web projects using the latest technology with ease. It was a pleasure to work with someone who was never out of their element.",
  },
];

const additionalReferences: Reference[] = [
  {
    name: "Melissa Bazillion",
    title: "Marketing Strategist",
    company: "Emerson College",
    linkedinUrl: "https://www.linkedin.com/in/melissabazillion",
    initials: "MB",
    quote:
      "I can't stress the relief I felt every time Leo and I worked together. He is one of the most reliable partners and brings an incredible amount of creativity and expertise to every project.",
  },
  {
    name: "Bryce Trueman",
    title: "Product Manager",
    company: "BitGo",
    linkedinUrl: "https://www.linkedin.com/in/brycetrueman/",
    initials: "BT",
    quote:
      "Leo is killing it on the design front! Thank you so much for your hard work and always pushing for what's best for the customer! It's been super fun working together and I'm beyond excited to get [our project] out to the world!",
  },
];

const allReferences = [...references, ...additionalReferences];
const REFERENCES_PAGE_SIZE = 4;

export function ReferencesScroll() {
  const [visibleCount, setVisibleCount] = useState(REFERENCES_PAGE_SIZE);
  const displayedReferences = allReferences.slice(0, visibleCount);
  const hasMore = visibleCount < allReferences.length;

  return (
    <div id="references">
      <div className="px-6 pb-12 md:px-12">
        <div className="font-semibold">References</div>
        <div className="text-muted-foreground">
          Folks I&#39;ve had the pleasure of working with.
        </div>
      </div>

      <div className="flex flex-col [&:hover>*]:opacity-50">
        {displayedReferences.map((reference, index) => (
          <React.Fragment key={reference.name}>
          <div
            className="group/item cursor-pointer transition-opacity hover:!opacity-100"
            onClick={() => window.open(reference.linkedinUrl, "_blank")}
          >
            <div className="flex w-full items-start gap-6 px-6 py-4 md:px-12">
              <div className="flex min-w-0 flex-1 flex-row items-start gap-3">
                <Avatar>
                  <AvatarFallback className="text-muted-foreground">
                    {reference.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-col md:flex-row md:gap-2">
                    <a
                      className="underline decoration-dotted group-hover/item:text-blue-500 group-hover/item:decoration-solid"
                      href={reference.linkedinUrl}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {reference.name}
                    </a>
                    <span className="hidden text-muted-foreground md:inline">
                      ·
                    </span>
                    <div className="italic text-muted-foreground">
                      {reference.title}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    &#34;{reference.quote}&#34;
                  </p>
                </div>
              </div>
              <div className="w-[132px] shrink-0 text-end">
                <p className="text-muted-foreground">{reference.company}</p>
              </div>
            </div>
          </div>
            {index < displayedReferences.length - 1 && (
              <Separator className="transition-opacity" />
            )}
          </React.Fragment>
        ))}
      </div>

      {hasMore ? (
        <Button
          variant="ghost"
          onClick={() => setVisibleCount((prev) => prev + REFERENCES_PAGE_SIZE)}
          className="group mt-4 h-auto w-full py-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          <span className="opacity-50 transition-opacity group-hover:opacity-100">
            Show more
          </span>
        </Button>
      ) : visibleCount > REFERENCES_PAGE_SIZE ? (
        <Button
          variant="ghost"
          onClick={() => setVisibleCount(REFERENCES_PAGE_SIZE)}
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
