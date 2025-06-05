"use client";

import Link from "next/link";
import Image from "next/image";
import { TbChevronRight } from "react-icons/tb";
import { Project } from "@/types/Project";

interface NextProjectLinkProps {
  nextProject: Project;
}

export function NextProjectLink({ nextProject }: NextProjectLinkProps) {
  const handleProjectNavigation = () => {
    sessionStorage.setItem('navigation-source', 'project-page');
  };

  return (
    <Link
      href={`/projects/${nextProject.slug}`}
      onClick={handleProjectNavigation}
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
  );
}