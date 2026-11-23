import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ShowMoreButton, useShowMore } from "@/components/projects/show-more"
import type { Reference } from "@/server/db/schema"

interface ReferencesScrollProps {
  references: Reference[]
}

export function ReferencesScroll({ references }: ReferencesScrollProps) {
  const { sectionRef, visible, toggle, reveal } = useShowMore(references)

  return (
    <div id="references" ref={sectionRef}>
      <div className="px-6 pb-6 md:px-12">
        <div className="font-semibold">References</div>
      </div>

      <div className="flex flex-col [&>*+*]:-mt-[0.5px]">
        {visible.map((reference, i) => (
          <div
            key={reference.id}
            {...reveal(i)}
            data-wave
            className="group/item cursor-pointer rounded-[20px] border border-transparent bg-background hover:bg-card md:mx-6"
            onClick={() => window.open(reference.linkedinUrl, "_blank")}
          >
            <div className="p-6">
              <div className="flex w-full items-center justify-between gap-6">
                <div className="flex shrink-0 flex-row items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="text-muted-foreground">
                      {reference.initials}
                    </AvatarFallback>
                  </Avatar>
                  <a
                    className="group-hover/item:text-tint group-hover/item:underline"
                    href={reference.linkedinUrl}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {reference.name}
                  </a>
                </div>
                <p className="min-w-0 text-end text-muted-foreground">
                  {[reference.title, reference.company]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <p className="mt-2 pr-11 pl-11 text-muted-foreground">
                &#34;{reference.quote}&#34;
              </p>
            </div>
          </div>
        ))}
      </div>

      <ShowMoreButton toggle={toggle} />
    </div>
  )
}
