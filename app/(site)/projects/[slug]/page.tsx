import { getProject, getProjects } from "@/sanity/sanity-utils";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import Link from "next/link";
import React from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { BackButton } from "@/components/BackButton";
import { Navigation } from "@/components/Navigation";
import { ProjectMediaGallery } from "@/components/ProjectMediaGallery";
import { ProjectNavigation } from "./project-navigation";
import { NextProjectLink } from "./next-project-link";

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

  const contentImages = project.content
    ? project.content
        .filter((block: any) => block._type === "image")
        .map((image: any) => ({
          _key: image._key,
          _type: image._type,
          asset: image.asset,
          alt: image.alt,
        }))
    : [];

  const ContentImageComponent = ({ value }: { value: any }) => {
    return null;
  };

  const components = {
    types: {
      image: ContentImageComponent,
    },
  };

  return (
    <div>
      {/* Navigation */}
      <Navigation>
        <BackButton />
      </Navigation>

      {/* Project Content */}
      <div className="mx-auto px-6 py-12 md:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-12">
            <div>
              <h1 className="mb-2 text-6xl font-bold">{project.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <span>{project.client}</span>
                <span>·</span>
                <span>{project.year}</span>
                {project.categories && project.categories.length > 0 && (
                  <>
                    {project.categories.map((category: string) => (
                      <React.Fragment key={category}>
                        <span>·</span>
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
                    ))}
                  </>
                )}
              </div>
            </div>
            {nextProject && (
              <NextProjectLink nextProject={nextProject} />
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="mb-8 max-w-3xl text-base">{project.description}</p>
        )}

        {/* Media Gallery - Hero Image, Embed, and Content Images */}
        <ProjectMediaGallery
          heroImage={project.image}
          heroImageAlt={project.name}
          embedUrl={project.embed}
          contentImages={contentImages}
          projectName={project.name}
        />

        {/* Content Text */}
        {project.content && (
          <div className="mb-12 flex max-w-none flex-col gap-8">
            <PortableText
              value={project.content.filter(
                (block: any) => block._type !== "image",
              )}
              components={components}
            />
          </div>
        )}

        {/* Navigation */}
        <ProjectNavigation prevProject={prevProject} nextProject={nextProject} />
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
