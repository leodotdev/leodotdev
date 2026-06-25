import { getProjects } from "@/sanity/sanity-utils";
import { getExperiences } from "@/sanity/sanity-utils";
import { getReferences } from "@/sanity/sanity-utils";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/client";
import urlBuilder from "@sanity/image-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { playfairDisplay } from "@/lib/fonts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Link from "next/link";

import { TbArrowUpRight } from "react-icons/tb";
import { ProjectsClient } from "./projects-client";
import { ProjectsWrapper } from "./projects-wrapper";
import { ProjectsPageClient } from "./projects-page-client";
import { ExperienceClient } from "./experience-client";
import { HeroSection } from "./hero-section";
import { ReferencesScroll } from "./references-scroll";

export default async function Home() {
  const projects = await getProjects();
  const experiences = await getExperiences();
  const references = await getReferences();
  const ContentImageComponent = ({ value }: { value: any }) => {
    return (
      <Image
        src={urlBuilder(client).image(value).fit("max").auto("format").url()}
        alt={value.alt || " "}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full"
      />
    );
  };

  const components = {
    types: {
      image: ContentImageComponent,
    },
  };

  return (
    <ProjectsWrapper>
      <ProjectsPageClient>
        {/* unicorn
      <iframe
        src="https://unicorn.studio/embed/AyFghFWYp37UJfD7Sn7P?preview=true"
        // width="1022px"
        height="300px"
        loading="lazy"
        className="-mt-12 w-full mix-blend-exclusion dark:mix-blend-lighten"
      ></iframe> */}

        <div className="flex flex-col">
          {/* Framed top group: hero through references. The left/right page
              frame now lives on each section so the projects section can drop
              it (and go full-bleed) in grid mode. */}
          <div className="flex flex-col gap-12 border-x pb-12">
          {/* Hero section with photos */}
          <HeroSection />

          <Separator />

          {/* experience */}
          <ExperienceClient experiences={experiences} />

          {/* <Card className="rounded-3xl bg-white dark:bg-black/50 shadow-none dark:bg-black/50">
          <CardHeader>
            <CardTitle className=">Favorite Tools</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h4 className=" text-muted-foreground">Design</h4>
              <p>
                Figma, Photoshop, Illustrator, Play, Procreate, FigJam, tldraw
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className=" text-muted-foreground">Low-code</h4>
              <p>Framer, Webflow, Toddle, Plasmic</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className=" text-muted-foreground">Development</h4>
              <p>HTML, CSS, Tailwind CSS, shadcn/ui, Radix, Cody, Copilot</p>
            </div>
          </CardContent>
        </Card> */}

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
                    key={book._id}
                    href={book.url || undefined}
                    target={book.url ? "_blank" : undefined}
                    className="group flex w-24 shrink-0 flex-col gap-2"
                    title={`${book.name}${book.author ? ` — ${book.author}` : ""}`}
                  >
                    {book.image ? (
                      <div className="relative h-36 w-24 overflow-hidden rounded-md bg-secondary outline outline-1 -outline-offset-1 outline-border">
                        <Image
                          src={book.image}
                          alt={book.name}
                          fill
                          sizes="96px"
                          className="object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex h-36 w-24 items-center justify-center rounded-md bg-secondary text-muted-foreground outline outline-1 -outline-offset-1 outline-border">
                        {book.name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="truncate text-sm">{book.name}</div>
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

          <ProjectsClient projects={projects} />

          {/* Framed footer (gains a top border in grid mode, where the
              projects section above it is borderless/full-bleed) */}
          <div className="border-x pt-12 [.projects-grid_&]:border-t">
          <div className="flex flex-col gap-4 p-6 md:p-12">
            <div className=" text-muted-foreground">
              Built using{" "}
              <a
                className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                target="_blank"
                href="https://tailwindcss.com/"
              >
                TailwindCSS
              </a>
              ,{" "}
              <a
                className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                target="_blank"
                href="https://ui.shadcn.com/"
              >
                Shadcn UI
              </a>{" "}
              +{" "}
              <a
                className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                target="_blank"
                href="https://base-ui.com/"
              >
                Base UI
              </a>
              , and{" "}
              <a
                className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                target="_blank"
                href="https://www.sanity.io/"
              >
                SanityCMS
              </a>
              .
            </div>
          </div>
          </div>
        </div>
      </ProjectsPageClient>
    </ProjectsWrapper>
  );
}
