import { getProject, getProjects } from "@/sanity/sanity-utils";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import Link from "next/link";
import React from "react";
import {
  TbArrowLeft,
  TbArrowRight,
  TbChevronLeft,
  TbChevronRight,
  TbArrowUpRight,
  TbChevronDown,
  TbCopy,
} from "react-icons/tb";
import { ThemeSwitcher } from "../../../theme-switcher";
import CopyToClipboard from "@/components/CopyToClipboard";
import { BackButton } from "@/components/BackButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);
  const allProjects = await getProjects();

  // Find current project index
  const currentIndex = allProjects.findIndex((p) => p.slug === params.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const client = createClient({
    projectId: "jyqe7nab",
    dataset: "production",
    apiVersion: "2023-10-07",
    useCdn: true,
  });

  const ContentImageComponent = ({ value }: { value: any }) => {
    return (
      <Image
        src={urlBuilder(client).image(value).fit("max").auto("format").url()}
        alt={value.alt || " "}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full rounded-lg"
      />
    );
  };

  const components = {
    types: {
      image: ContentImageComponent,
    },
  };

  return (
    <div>
      {/* Navigation */}
      <div className="sticky left-4 right-4 top-4 z-50 px-6 md:px-12">
        <div className="flex w-full justify-between rounded-3xl border bg-secondary/20 p-1 backdrop-blur-md">
          <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-1">
            <BackButton />
            <Link
              href="https://twitter.com/leosuccarferre"
              target="_blank"
              className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
            >
              My Twitter
              <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/leosuccarferre/"
              target="_blank"
              className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
            >
              My LinkedIn
              <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
            </Link>
            <Link
              href="https://cal.com/leo.dev/20min"
              target="_blank"
              className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
            >
              Let's Chat
              <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
            </Link>
            <Link
              href=""
              className="text-md flex cursor-pointer items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
            >
              <CopyToClipboard className="flex" textToCopy="leo@leo.dev">
                Copy my email
                <TbCopy className="h-4 w-4 self-start text-muted-foreground" />
              </CopyToClipboard>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary hover:no-underline">
                My résumés
                <TbChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    href="/Leo-SF-Resume-May-2025.pdf"
                    target="_blank"
                    className="flex pr-0"
                  >
                    Adobe PDF
                    <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/Leo-SF-Resume-May-2025.docx"
                    target="_blank"
                    className="flex pr-0"
                  >
                    Word DOCX
                    <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="https://docs.google.com/document/d/17uK2emyv7p8VYtYV5M36g3mxQ0CvbhDanzWVnVvtIiE/edit?usp=sharing"
                    target="_blank"
                    className="flex pr-0"
                  >
                    Google DOC
                    <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="https://read.cv/leo.dev"
                    target="_blank"
                    className="flex pr-0"
                  >
                    Read.cv
                    <TbArrowUpRight className="h-4 w-4 self-start text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ThemeSwitcher />
              </TooltipTrigger>
              <TooltipContent side="bottom">Theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Project Content */}
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold">{project.name}</h1>
              <div className="flex flex-wrap gap-1 text-muted-foreground">
                <span>{project.client}</span>
                <span className="mx-2">•</span>
                <span>{project.year}</span>
                {project.categories && project.categories.length > 0 && (
                  <>
                    {project.categories.map(
                      (category: string, index: number) => (
                        <React.Fragment key={category}>
                          <span className="mx-2">•</span>
                          <span>
                            {category
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")}
                          </span>
                        </React.Fragment>
                      ),
                    )}
                  </>
                )}
              </div>
            </div>
            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex max-w-xs flex-row-reverse gap-4 rounded-xl border bg-secondary/50 p-2 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center">
                  <TbChevronRight className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <p className="text-sm text-muted-foreground">Next</p>
                  <h3 className="truncate text-sm font-semibold">
                    {nextProject.name}
                  </h3>
                  {/* <p className="truncate text-sm text-muted-foreground">
                    {nextProject.client}
                  </p> */}
                </div>
                {nextProject.image && (
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src={nextProject.image}
                      alt={nextProject.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                )}
              </Link>
            )}
          </div>

          {project.description && (
            <p className="mt-4 text-lg text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>

        {/* Hero Image */}
        {project.image && (
          <div className="mb-12">
            <Image
              src={project.image}
              alt={project.name}
              width={1200}
              height={800}
              className="w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* Embed */}
        {project.embed && (
          <div className="mb-12">
            <iframe
              src={project.embed}
              className="aspect-video w-full rounded-lg"
              allowFullScreen
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <PortableText value={project.content} components={components} />
        </div>

        {/* Navigation */}
        <div className="mt-24 border-t pt-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Previous Project */}
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex gap-4 rounded-xl border bg-secondary/50 p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center">
                  <TbChevronLeft className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-sm text-muted-foreground">Previous</p>
                  <h3 className="truncate font-semibold">{prevProject.name}</h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {prevProject.client}
                  </p>
                </div>
                {prevProject.image && (
                  <div className="relative aspect-[4/3] flex-shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src={prevProject.image}
                      alt={prevProject.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
              </Link>
            ) : (
              <div />
            )}

            {/* Next Project */}
            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex items-center gap-4 rounded-xl border bg-secondary/50 p-4 transition-colors hover:bg-secondary md:flex-row-reverse"
              >
                <div className="flex items-center">
                  <TbChevronRight className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
                <div className="min-w-0 flex-1 gap-0 text-right">
                  <p className="text-sm text-muted-foreground">Next</p>
                  <h3 className="truncate font-semibold">{nextProject.name}</h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {nextProject.client}
                  </p>
                </div>
                {nextProject.image && (
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src={nextProject.image}
                      alt={nextProject.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const client = createClient({
    projectId: "jyqe7nab",
    dataset: "production",
    apiVersion: "2023-10-07",
  });

  const projects = await client.fetch(
    `*[_type == "project"]{ "slug": slug.current }`,
  );

  return projects.map((project: { slug: string }) => ({
    slug: project.slug,
  }));
}
