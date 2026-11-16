import { Separator } from "@/components/ui/separator"
import { ExperienceClient } from "@/components/projects/experience-client"
import { HeroSection } from "@/components/projects/hero-section"
import { ProjectsWrapper } from "@/components/projects/projects-wrapper"
import { ReferencesScroll } from "@/components/projects/references-scroll"
// import { ProjectsClient } from "@/components/projects/projects-client"
import type { getHomePage } from "@/server/content"

type PageData = Awaited<ReturnType<typeof getHomePage>>

/** The home page, rendered at `/` and (for old links) at `/projects`. */
export function HomePage({ experiences, references }: PageData) {
  return (
    <ProjectsWrapper>
      <div className="flex flex-col">
        {/* Top group: hero through references. The page frame in __root
              draws the side borders. Only in the projects grid mode, where
              the frame's borders are hidden so the projects section can go
              full-bleed, does this group draw its own. */}
        <div className="flex flex-col gap-12 pb-12 min-[961px]:[.projects-grid_&]:border-x">
          <HeroSection />

          <Separator />

          <ExperienceClient experiences={experiences} />

          <Separator />

          <ReferencesScroll references={references} />
        </div>

        {/* Book Shelf section hidden for now
          <Separator />

          <div id="books">
            <div className="px-6 pb-12 md:px-12">
              <div className="font-semibold">Book Shelf</div>
              <div className="text-muted-foreground">
                Books I keep coming back to.
              </div>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 px-6 pb-4 md:px-12">
                {books.map((book) => (
                  <a
                    key={book.id}
                    href={book.url || undefined}
                    target={book.url ? "_blank" : undefined}
                    className="group flex w-24 shrink-0 flex-col gap-2"
                    title={`${book.name}${book.author ? ` — ${book.author}` : ""}`}
                  >
                    {book.image ? (
                      <div className="relative h-36 w-24 overflow-hidden rounded-md bg-secondary outline outline-1 -outline-offset-1 outline-border">
                        <img
                          {...imageProps(book.image, { maxWidth: 384 })}
                          sizes="96px"
                          alt={book.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex h-36 w-24 items-center justify-center rounded-md bg-secondary text-muted-foreground outline outline-1 -outline-offset-1 outline-border">
                        {book.name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="truncate">{book.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {book.author}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          */}

        {/* Projects section hidden for now (also restore the import above,
              add `projects` to getHomePage in src/server/content.ts, and pass
              it through both routes as a `projects` prop)
          <ProjectsClient projects={projects} />
          */}

        {/* "Built using" footer hidden for now. (Framed footer; gains a
              top border in grid mode, where the projects section above it is
              borderless/full-bleed.)
          <div className="border-x pt-12 [.projects-grid_&]:border-t">
          <div className="flex flex-col gap-4 p-6 md:p-12">
            <div className=" text-muted-foreground">
              Built using{" "}
              <a
                className="underline decoration-dotted hover:text-blue hover:decoration-solid"
                target="_blank"
                href="https://tailwindcss.com/"
              >
                TailwindCSS
              </a>
              ,{" "}
              <a
                className="underline decoration-dotted hover:text-blue hover:decoration-solid"
                target="_blank"
                href="https://ui.shadcn.com/"
              >
                Shadcn UI
              </a>{" "}
              +{" "}
              <a
                className="underline decoration-dotted hover:text-blue hover:decoration-solid"
                target="_blank"
                href="https://base-ui.com/"
              >
                Base UI
              </a>
              , and{" "}
              <a
                className="underline decoration-dotted hover:text-blue hover:decoration-solid"
                target="_blank"
                href="https://workers.cloudflare.com/"
              >
                Cloudflare
              </a>
              .
            </div>
          </div>
          </div>
          */}
      </div>
    </ProjectsWrapper>
  )
}
