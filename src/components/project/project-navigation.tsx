import { Link } from "@tanstack/react-router";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { sanityImageProps } from "@/sanity/image";
import type { ProjectLink } from "@/server/content";

interface ProjectNavigationProps {
  prevProject: ProjectLink | null;
  nextProject: ProjectLink | null;
}

export function ProjectNavigation({ prevProject, nextProject }: ProjectNavigationProps) {
  const handleProjectNavigation = () => {
    sessionStorage.setItem('navigation-source', 'project-page');
  };

  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Previous Project */}
        {prevProject ? (
          <Link
            to="/projects/$slug"
            params={{ slug: prevProject.slug }}
            onClick={handleProjectNavigation}
            className="group flex gap-4 rounded-xl border bg-secondary/50 p-4 transition-colors hover:bg-secondary"
          >
            <div className="flex items-center">
              <TbChevronLeft className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs text-muted-foreground">Previous</p>
              <h3 className="truncate font-semibold">{prevProject.name}</h3>
              <p className="truncate text-muted-foreground">
                {prevProject.client}
              </p>
            </div>
            {prevProject.image && (
              <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-sm">
                <img
                  {...sanityImageProps(prevProject.image, { maxWidth: 256 })}
                  sizes="80px"
                  alt={prevProject.name}
                  className="absolute inset-0 h-full w-full object-cover"
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
            to="/projects/$slug"
            params={{ slug: nextProject.slug }}
            onClick={handleProjectNavigation}
            className="group flex items-center gap-4 rounded-xl border bg-secondary/50 p-4 transition-colors hover:bg-secondary md:flex-row-reverse"
          >
            <div className="flex items-center">
              <TbChevronRight className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
            <div className="min-w-0 flex-1 gap-0 text-right">
              <p className="text-xs text-muted-foreground">Next</p>
              <h3 className="truncate font-semibold">{nextProject.name}</h3>
              <p className="truncate text-muted-foreground">
                {nextProject.client}
              </p>
            </div>
            {nextProject.image && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm">
                <img
                  {...sanityImageProps(nextProject.image, { maxWidth: 256 })}
                  sizes="80px"
                  alt={nextProject.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}