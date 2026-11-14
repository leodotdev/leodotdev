import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { isTap, stopWaves, wave } from "@/lib/wave";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Reference } from "@/types/Reference";

const REFERENCES_PAGE_SIZE = 2;

interface ReferencesScrollProps {
  references: Reference[];
}

export function ReferencesScroll({ references: allReferences }: ReferencesScrollProps) {
  const [visibleCount, setVisibleCount] = useState(REFERENCES_PAGE_SIZE);
  const sectionRef = useRef<HTMLDivElement>(null);
  const showCount = (count: number, e: React.MouseEvent<HTMLElement>) => {
    const update = () => flushSync(() => setVisibleCount(count));
    // On touch the tap plays the wave: it leaves the button and carries the
    // list to its new length. With a mouse the wave is hover-only, so the
    // list just changes (after ending the button's own hover wave, whose
    // snapshot would otherwise sit where the button used to be).
    if (isTap(e)) {
      wave(sectionRef.current, update, {
        source: e.currentTarget,
        focus: e.nativeEvent,
      });
    } else {
      stopWaves(e.currentTarget);
      update();
    }
  };
  const displayedReferences = allReferences.slice(0, visibleCount);
  const hasMore = visibleCount < allReferences.length;

  return (
    <div id="references" ref={sectionRef}>
      <div className="px-6 pb-6 md:px-12">
        <div className="font-semibold">References</div>
      </div>

      <div className="flex flex-col [&>*+*]:-mt-[0.5px]">
        {displayedReferences.map((reference) => (
          <div
            key={reference.id}
            data-wave
            className="group/item mx-3 cursor-pointer rounded-[20px] border border-transparent bg-background hover:bg-card md:mx-6"
            onClick={() => window.open(reference.linkedinUrl, "_blank")}
          >
            <div className="px-3 py-6 md:px-6">
              <div className="flex w-full items-center justify-between gap-6">
                <div className="flex shrink-0 flex-row items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="text-muted-foreground">
                      {reference.initials}
                    </AvatarFallback>
                  </Avatar>
                  <a
                    className="group-hover/item:text-blue-500 group-hover/item:underline"
                    href={reference.linkedinUrl}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {reference.name}
                  </a>
                </div>
                <p className="min-w-0 text-end text-muted-foreground">
                  {[reference.title, reference.company].filter(Boolean).join(", ")}
                </p>
              </div>
              <p className="mt-2 pl-11 pr-11 text-muted-foreground">
                &#34;{reference.quote}&#34;
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center px-6 pt-8 md:px-12">
        {hasMore ? (
          <Button
            variant="pill"
            data-wave-manual
            onClick={(e) => showCount(allReferences.length, e)}
          >
            Show more
          </Button>
        ) : visibleCount > REFERENCES_PAGE_SIZE ? (
          <Button
            variant="pill"
            data-wave-manual
            onClick={(e) => showCount(REFERENCES_PAGE_SIZE, e)}
          >
            Show less
          </Button>
        ) : null}
      </div>
    </div>
  );
}
