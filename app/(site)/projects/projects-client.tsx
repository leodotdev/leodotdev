"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Project } from "@/types/Project";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const categories = [
  { title: "All", value: "all" },
  { title: "Product Design", value: "product-design" },
  { title: "Visual Design", value: "visual-design" },
  { title: "Prototyping", value: "prototyping" },
  { title: "Ideating & Wireframing", value: "ideating-wireframing" },
  { title: "Web Design", value: "web-design" },
  { title: "No-code Web Development", value: "web-development" },
  { title: "Graphic Design", value: "graphic-design" },
  { title: "Design System", value: "design-system" },
];

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Calculate category counts
  const categoryCounts = categories.reduce(
    (acc, category) => {
      if (category.value === "all") {
        acc[category.value] = projects.length;
      } else {
        acc[category.value] = projects.filter((project) =>
          project.categories?.includes(category.value),
        ).length;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleCategoryClick = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setVisibleCount(9); // Reset to show first 9 when category changes
  };

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) =>
          project.categories?.includes(selectedCategory),
        );

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;

  // Load more projects when scrolling near the bottom
  useEffect(() => {
    if (!loadingRef.current || !hasMoreProjects) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMoreProjects) {
          setIsLoading(true);
          
          // Simulate a small delay for loading
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + 9, filteredProjects.length));
            setIsLoading(false);
          }, 500);
        }
      },
      {
        rootMargin: "100px", // Start loading when 100px away from the trigger
      }
    );

    observer.observe(loadingRef.current);

    return () => observer.disconnect();
  }, [hasMoreProjects, isLoading, filteredProjects.length]);

  // Reset visible count when filtered projects change
  useEffect(() => {
    setVisibleCount(9);
  }, [filteredProjects.length]);

  return (
    <div id="projects">
      <div className="px-6 pb-12 md:px-12">
        <div className="font-semibold">Projects</div>
        <div className="text-muted-foreground">
          Shots and embeds of my past work.
        </div>

        <div className="mt-6 flex flex-wrap gap-1">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              className={`
                flex cursor-pointer items-center rounded-sm py-2 pl-3 pr-2.5 text-sm transition-all
                ${
                  selectedCategory === category.value
                    ? "bg-muted"
                    : " text-foreground hover:bg-accent "
                }
              `}
            >
              <div className="flex items-baseline">
                <span>{category.title}</span>
                <sup className="ml-0.5 text-xs text-zinc-500">
                  {categoryCounts[category.value] || 0}
                </sup>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="auto-rows grid grid-cols-1 gap-6 md:grid-cols-2 md:px-12">
        {visibleProjects.map((project) => (
          <Link
            key={project._id}
            href={`/projects/${project.slug}`}
            className="group flex flex-col items-stretch gap-6 overflow-clip rounded-xl border bg-secondary p-6 transition-colors hover:bg-secondary/40 dark:bg-secondary/40 dark:hover:bg-secondary"
          >
            <div className="flex flex-col text-left text-foreground">
              <div className="truncate">{project.name}</div>
              <div className="flex flex-row justify-between text-muted-foreground">
                <div className="flex-1">{project.client}</div>
                <div className="text-right">{project.year}</div>
              </div>
            </div>

            {project.image && (
              <Image
                src={project.image}
                alt={project.name}
                width={800}
                height={400}
                loading="lazy"
                className="-mb-40 aspect-[4/3] rounded-sm object-cover transition group-hover:-translate-y-[44px] group-hover:shadow-2xl md:-mb-28"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Loading trigger and indicator */}
      {hasMoreProjects && (
        <div 
          ref={loadingRef}
          className="flex justify-center py-8"
        >
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more projects...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
