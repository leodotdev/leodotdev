"use client";

import Link from "next/link";
import Image from "next/image";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { Project } from "@/types/Project";

interface ProjectNavigationProps {
  prevProject: Project | null;
  nextProject: Project | null;
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
            href={`/projects/${prevProject.slug}`}
            onClick={handleProjectNavigation}
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
            onClick={handleProjectNavigation}
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
  );
}