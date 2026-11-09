import React from "react"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { PortableText } from "@portabletext/react"
import type { PortableTextComponents } from "@portabletext/react"
import { BackButton } from "@/components/BackButton"
import { Navigation } from "@/components/Navigation"
import { ProjectMediaGallery } from "@/components/ProjectMediaGallery"
import { NextProjectLink } from "@/components/project/next-project-link"
import { ProjectNavigation } from "@/components/project/project-navigation"
import { ProjectSkeleton } from "@/components/project/project-skeleton"
import { getProjectPage } from "@/server/content"

export const Route = createFileRoute("/_site/projects/$slug")({
  loader: async ({ params }) => {
    const data = await getProjectPage({ data: params.slug })
    if (!data) throw notFound()
    return data
  },
  pendingComponent: ProjectSkeleton,
  component: ProjectPage,
})

// Images are shown by the media gallery, so the text body skips them.
const components: PortableTextComponents = {
  types: {
    image: () => null,
  },
}

function ProjectPage() {
  const { project, prevProject, nextProject } = Route.useLoaderData()

  const contentImages = project.content
    ? project.content
        .filter((block: any) => block._type === "image")
        .map((image: any) => ({
          _key: image._key,
          _type: image._type,
          asset: image.asset,
          alt: image.alt,
        }))
    : []

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
              <h1 className="mb-2 font-semibold">{project.name}</h1>
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
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </div>
            </div>
            {nextProject && <NextProjectLink nextProject={nextProject} />}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="mb-8 max-w-3xl">{project.description}</p>
        )}

        {/* Media Gallery - Hero Image, Embed, and Content Images */}
        <ProjectMediaGallery
          // Fresh gallery state (open lightbox, loading flags) per project.
          key={project._id}
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
                (block: any) => block._type !== "image"
              )}
              components={components}
            />
          </div>
        )}

        {/* Navigation */}
        <ProjectNavigation
          prevProject={prevProject}
          nextProject={nextProject}
        />
      </div>
    </div>
  )
}
