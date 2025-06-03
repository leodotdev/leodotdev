import { getProjects } from "@/sanity/sanity-utils";
import { getBooks } from "@/sanity/sanity-utils";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { createClient } from "next-sanity";
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
  const books = await getBooks();
  const client = createClient({
    projectId: "jyqe7nab",
    dataset: "production",
    apiVersion: "2023-10-07",
  });

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

        <div className="flex flex-col gap-12">
          {/* Hero section with photos */}
          <HeroSection />

          <Separator />

          {/* experience */}
          <ExperienceClient />

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

          <ReferencesScroll />

          {/* <div className="px-6 font-semibold md:px-12">Book Shelf</div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex overflow-x-auto">
          {books.map((book) => (
            // book card
            <div key={book._id}>
              <div className="group flex shrink-0">
                {book.image && (
                  <Image
                    src={book.image}
                    alt={book.name}
                    width={100}
                    height={200}
                    loading="lazy"
                    className="flex h-20 w-20 rounded-xl object-cover transition group-hover:scale-[1.5]"
                  />
                )}
                <div className="flex items-end justify-between">
                <div className="flex flex-col text-left font-medium text-zinc-950 dark:text-zinc-50">
                  <div>{book.name}</div>
                  <div className=" text-muted-foreground">{book.client}</div>
                </div>
                <div className=" text-muted-foreground">{book.year}</div>
              </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea> */}

          <Separator />

          <ProjectsClient projects={projects} />

          <div className="flex flex-col gap-4 p-6 md:p-12">
            <div className=" text-muted-foreground">
              Built using{" "}
              <a
                className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                target="_blank"
                href="https://nextjs.org/"
              >
                NextJS
              </a>
              ,{" "}
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
                ShadcnUI
              </a>{" "}
              +{" "}
              <a
                className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                target="_blank"
                href="https://www.radix-ui.com/"
              >
                RadixUI
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
      </ProjectsPageClient>
    </ProjectsWrapper>
  );
}
