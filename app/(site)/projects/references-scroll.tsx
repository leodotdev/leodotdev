"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Reference } from "@/types/Reference";

const REFERENCES_PAGE_SIZE = 2;

interface ReferencesScrollProps {
  references: Reference[];
}

export function ReferencesScroll({ references: allReferences }: ReferencesScrollProps) {
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
          <React.Fragment key={reference._id}>
          <div
            className="group/item cursor-pointer transition-opacity hover:!opacity-100"
            onClick={() => window.open(reference.linkedinUrl, "_blank")}
          >
            <div className="px-6 py-4 md:px-12">
              <div className="flex w-full items-center justify-between gap-6">
                <div className="flex min-w-0 flex-row items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="text-muted-foreground">
                      {reference.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col md:flex-row md:gap-2">
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
                </div>
                <div className="w-[132px] shrink-0 text-end">
                  <p className="text-muted-foreground">{reference.company}</p>
                </div>
              </div>
              <p className="mt-2 pl-11 pr-11 text-sm text-muted-foreground">
                &#34;{reference.quote}&#34;
              </p>
            </div>
          </div>
            {index < displayedReferences.length - 1 && (
              <Separator className="transition-opacity" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-center px-6 py-8 md:px-12">
        {hasMore ? (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setVisibleCount(allReferences.length)}
            className="rounded-full px-6 [corner-shape:round]"
          >
            Show more
          </Button>
        ) : visibleCount > REFERENCES_PAGE_SIZE ? (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setVisibleCount(REFERENCES_PAGE_SIZE)}
            className="rounded-full px-6 [corner-shape:round]"
          >
            Show less
          </Button>
        ) : null}
      </div>
    </div>
  );
}
