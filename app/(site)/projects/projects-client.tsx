"use client";

import { useState } from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Project } from "@/types/Project";

const categories = [
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const client = createClient({
    projectId: "jyqe7nab",
    dataset: "production",
    apiVersion: "2023-10-07",
  });

  // Calculate category counts
  const categoryCounts = categories.reduce(
    (acc, category) => {
      acc[category.value] = projects.filter((project) =>
        project.categories?.includes(category.value),
      ).length;
      return acc;
    },
    {} as Record<string, number>,
  );

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

  const toggleCategory = (categoryValue: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue],
    );
  };

  const filteredProjects =
    selectedCategories.length === 0
      ? projects
      : projects.filter((project) =>
          project.categories?.some((cat) => selectedCategories.includes(cat)),
        );

  return (
    <div>
      <div className="px-6 pb-12 md:px-12">
        <div className="font-semibold">Projects</div>
        <div className="text-muted-foreground">
          Shots and embeds of my past work.
        </div>

        <div className="mt-6 flex flex-wrap gap-[1px]">
          {categories.map((category) => (
            <label
              key={category.value}
              className={`
                flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 pr-2 text-sm transition-all
                ${
                  selectedCategories.includes(category.value)
                    ? "bg-muted"
                    : " text-foreground hover:bg-accent "
                }
              `}
            >
              <Checkbox
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => toggleCategory(category.value)}
                className="h-4 w-4"
              />
              <div className="flex flex-row gap-1">
                <span>{category.title} </span>
                <span className="text-zinc-500">
                  {" "}
                  ({categoryCounts[category.value] || 0})
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="auto-rows grid grid-cols-1 gap-6 md:grid-cols-2 md:px-12">
        {filteredProjects.map((project) => (
          <Dialog key={project._id}>
            <DialogTrigger className="group flex flex-col items-stretch gap-6 overflow-clip rounded-xl border bg-secondary p-6 hover:bg-secondary/40 dark:bg-secondary/40 dark:hover:bg-secondary">
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
            </DialogTrigger>

            <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-auto rounded-lg md:max-w-5xl">
              <DialogHeader>{project.name}</DialogHeader>
              <Image
                src={project.image}
                alt={project.name}
                width={1200}
                height={800}
                loading="lazy"
                className="w-100 object-cover"
              />
              <div className="text-md flex flex-col gap-6 text-foreground">
                {project.embed && (
                  <iframe
                    height="600"
                    src={project.embed}
                    allowFullScreen
                    className="hidden md:inline"
                  ></iframe>
                )}
                <PortableText value={project.content} components={components} />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
