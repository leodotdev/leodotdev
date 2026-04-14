"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Project } from "@/types/Project";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { motion, AnimatePresence } from "framer-motion";
import { TbX, TbChevronLeft, TbChevronRight } from "react-icons/tb";

const clientLogos: Record<string, string> = {
  "Anthropic": "/logo-dbco.jpg",
  "Meta": "/logo-me.svg",
  "Facebook": "/logo-fb.svg",
  "BitGo": "/logo-bg.svg",
  "Plasmic": "/logo-pl.svg",
  "Sourcegraph": "/logo-sg.svg",
  "Zenefits": "/logo-ze.svg",
  "Sapien": "/logo-sania.jpg",
};

const client = createClient({
  projectId: "jyqe7nab",
  dataset: "production",
  apiVersion: "2023-10-07",
});

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

function getContentImageThumbs(project: Project): string[] {
  if (!project.content) return [];
  return project.content
    .filter((block: any) => block._type === "image" && block.asset)
    .map((block: any) =>
      urlBuilder(client).image(block).width(200).height(200).fit("crop").auto("format").url()
    );
}

function getFullResImages(project: Project): string[] {
  const images: string[] = [];
  if (project.image) images.push(project.image);
  if (project.content) {
    project.content
      .filter((block: any) => block._type === "image" && block.asset)
      .forEach((block: any) => {
        images.push(
          urlBuilder(client).image(block).fit("max").auto("format").url()
        );
      });
  }
  return images;
}

const PROJECTS_PAGE_SIZE = 8;

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PAGE_SIZE);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setImageLoaded(false);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setLightboxImages([]);
    setImageLoaded(false);
    document.body.style.overflow = "";
  }, []);

  const goToPrevious = useCallback(() => {
    if (lightboxIndex === null) return;
    setImageLoaded(false);
    setLightboxIndex(lightboxIndex === 0 ? lightboxImages.length - 1 : lightboxIndex - 1);
  }, [lightboxIndex, lightboxImages.length]);

  const goToNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setImageLoaded(false);
    setLightboxIndex(lightboxIndex === lightboxImages.length - 1 ? 0 : lightboxIndex + 1);
  }, [lightboxIndex, lightboxImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, goToPrevious, goToNext]);

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
    setVisibleCount(PROJECTS_PAGE_SIZE);
  };

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) =>
          project.categories?.includes(selectedCategory),
        );

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

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
              className={`flex cursor-pointer items-center rounded-full [corner-shape:round] px-4 py-2 text-sm transition-all ${
                selectedCategory === category.value
                  ? "bg-muted"
                  : "text-foreground hover:bg-accent"
              }`}
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

      <div className="flex flex-col [&:hover>*]:opacity-50">
        {visibleProjects.map((project, index) => {
          const contentThumbs = getContentImageThumbs(project);
          const allThumbs = [
            ...(project.image ? [project.image] : []),
            ...contentThumbs,
          ].slice(0, 6);
          const fullResImages = getFullResImages(project);

          return (
            <React.Fragment key={project._id}>
            <div className="transition-opacity hover:!opacity-100">
              <Link
                href={`/projects/${project.slug}`}
                className="block px-6 py-4 md:px-12"
              >
                <div className="flex w-full items-start justify-between gap-6">
                  <div className="flex flex-row items-start gap-3">
                    <Avatar className="mt-0.5 rounded-md">
                      <AvatarImage src={clientLogos[project.client]} />
                      <AvatarFallback className="rounded-md text-muted-foreground">
                        {project.client?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex flex-col md:flex-row md:gap-2">
                        <div>{project.name}</div>
                        <span className="hidden text-muted-foreground md:inline">
                          ·
                        </span>
                        <div className="italic text-muted-foreground">
                          {project.client}
                        </div>
                      </div>
                      {project.description && (
                        <div className="text-sm text-muted-foreground">
                          {project.description}
                        </div>
                      )}

                      {allThumbs.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto [&:hover>*]:opacity-50">
                          {allThumbs.map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-secondary transition-opacity hover:!opacity-100"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openLightbox(fullResImages, imgIndex);
                              }}
                            >
                              <Image
                                src={img}
                                alt={`${project.name} thumbnail ${imgIndex + 1}`}
                                fill
                                sizes="96px"
                                className="object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex w-[132px] shrink-0 flex-col items-end text-end">
                    <p className="text-muted-foreground">{project.year}</p>
                  </div>
                </div>
              </Link>

            </div>
              {index < visibleProjects.length - 1 && (
                <Separator className="transition-opacity" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="px-6 md:px-12">
        {hasMore ? (
          <button
            onClick={() => setVisibleCount((prev) => prev + PROJECTS_PAGE_SIZE)}
            className="group mt-4 flex w-full items-center justify-center py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="opacity-50 transition-opacity group-hover:opacity-100">
              Show more
            </span>
          </button>
        ) : visibleCount > PROJECTS_PAGE_SIZE ? (
          <button
            onClick={() => setVisibleCount(PROJECTS_PAGE_SIZE)}
            className="group mt-4 flex w-full items-center justify-center py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="opacity-50 transition-opacity group-hover:opacity-100">
              Show less
            </span>
          </button>
        ) : null}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-50 rounded-full [corner-shape:round] bg-white/10 p-2 transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <TbX className="h-6 w-6 text-white" />
            </button>

            <div
              className="relative flex flex-1 items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full [corner-shape:round] border-2 border-white/20 border-t-white" />
                </div>
              )}

              {lightboxImages.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 rounded-full [corner-shape:round] bg-white/10 p-2 transition-colors hover:bg-white/20"
                  aria-label="Previous"
                >
                  <TbChevronLeft className="h-6 w-6 text-white" />
                </button>
              )}

              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative max-h-[70vh] max-w-[90vw]"
              >
                <Image
                  src={lightboxImages[lightboxIndex]}
                  alt={`Image ${lightboxIndex + 1}`}
                  width={1920}
                  height={1080}
                  className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
                  onLoad={() => setImageLoaded(true)}
                  priority
                />
              </motion.div>

              {lightboxImages.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 rounded-full [corner-shape:round] bg-white/10 p-2 transition-colors hover:bg-white/20"
                  aria-label="Next"
                >
                  <TbChevronRight className="h-6 w-6 text-white" />
                </button>
              )}
            </div>

            {lightboxImages.length > 1 && (
              <div className="bg-black/50 p-4">
                <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                  {lightboxImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageLoaded(false);
                        setLightboxIndex(i);
                      }}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded transition-all ${
                        i === lightboxIndex
                          ? "opacity-100 ring-2 ring-white"
                          : "opacity-50 hover:opacity-75"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
