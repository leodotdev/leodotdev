"use client";

import { useState } from "react";
import Image from "next/image";
import { Project } from "@/types/Project";
import Link from "next/link";

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
  };

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) =>
          project.categories?.includes(selectedCategory),
        );

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
        {filteredProjects.map((project) => (
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
    </div>
  );
}
