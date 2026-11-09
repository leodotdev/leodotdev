import { Link } from "@tanstack/react-router";
import { TbChevronRight } from "react-icons/tb";
import { imageProps } from "@/lib/image";
import type { ProjectLink } from "@/server/content";

interface NextProjectLinkProps {
  nextProject: ProjectLink;
}

export function NextProjectLink({ nextProject }: NextProjectLinkProps) {
  const handleProjectNavigation = () => {
    sessionStorage.setItem('navigation-source', 'project-page');
  };

  return (
    <Link
      to="/projects/$slug"
      params={{ slug: nextProject.slug }}
      onClick={handleProjectNavigation}
      className="group flex max-w-xs flex-row-reverse gap-4 rounded-xl border bg-secondary/50 p-2 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center">
        <TbChevronRight className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>
      <div className="min-w-0 flex-1 text-right">
        <p className="text-xs text-muted-foreground">Next</p>
        <h3 className="truncate font-semibold">
          {nextProject.name}
        </h3>
      </div>
      {nextProject.image && (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm">
          <img
            {...imageProps(nextProject.image, { maxWidth: 256 })}
            sizes="40px"
            alt={nextProject.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}
    </Link>
  );
}