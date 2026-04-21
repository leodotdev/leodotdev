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
import { Button } from "@/components/ui/button";

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
      urlBuilder(client).image(block).width(256).height(256).fit("crop").auto("format").url(),
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
            <Button
              key={category.value}
              variant="ghost"
              size="sm"
              onClick={() => handleCategoryClick(category.value)}
              className={`h-auto rounded-full [corner-shape:round] px-4 py-2 ${
                selectedCategory === category.value
                  ? "bg-muted hover:bg-muted"
                  : ""
              }`}
            >
              <div className="flex items-baseline">
                <span>{category.title}</span>
                <sup className="ml-0.5 text-xs text-zinc-500">
                  {categoryCounts[category.value] || 0}
                </sup>
              </div>
            </Button>
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
                <div className="flex w-full items-center justify-between gap-6">
                  <div className="flex flex-row items-center gap-3">
                    <Avatar className="rounded-md">
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
                    </div>
                  </div>
                  <div className="flex w-[132px] shrink-0 flex-col items-end text-end">
                    <p className="text-muted-foreground">{project.year}</p>
                  </div>
                </div>

                {allThumbs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 [&:hover>*]:opacity-50">
                    {allThumbs.map((img, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-lg bg-secondary transition-opacity hover:!opacity-100"
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
                          sizes="(max-width: 768px) 15vw, 128px"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
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
          <Button
            variant="ghost"
            onClick={() => setVisibleCount((prev) => prev + PROJECTS_PAGE_SIZE)}
            className="group mt-4 h-auto w-full py-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <span className="opacity-50 transition-opacity group-hover:opacity-100">
              Show more
            </span>
          </Button>
        ) : visibleCount > PROJECTS_PAGE_SIZE ? (
          <Button
            variant="ghost"
            onClick={() => setVisibleCount(PROJECTS_PAGE_SIZE)}
            className="group mt-4 h-auto w-full py-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <span className="opacity-50 transition-opacity group-hover:opacity-100">
              Show less
            </span>
          </Button>
        ) : null}
      </div>

      {/* Lightbox drawer */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-2xl"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative flex flex-1 flex-col"
              onClick={closeLightbox}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="absolute right-4 top-4 z-50 rounded-full [corner-shape:round] bg-white/10 text-white hover:bg-white/20 hover:text-white"
                aria-label="Close"
              >
                <TbX className="h-6 w-6" />
              </Button>

              <div className="relative flex flex-1 items-center justify-center p-4">
                {!imageLoaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full [corner-shape:round] border-2 border-white/20 border-t-white" />
                  </div>
                )}

                {lightboxImages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-4 z-20 rounded-full [corner-shape:round] bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    aria-label="Previous"
                  >
                    <TbChevronLeft className="h-6 w-6" />
                  </Button>
                )}

                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative max-h-[80vh] max-w-[90vw]"
                >
                  <Image
                    src={lightboxImages[lightboxIndex]}
                    alt={`Image ${lightboxIndex + 1}`}
                    width={1920}
                    height={1080}
                    className="h-auto max-h-[80vh] w-auto max-w-full object-contain"
                    onLoad={() => setImageLoaded(true)}
                    priority
                  />
                </motion.div>

                {lightboxImages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 z-20 rounded-full [corner-shape:round] bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    aria-label="Next"
                  >
                    <TbChevronRight className="h-6 w-6" />
                  </Button>
                )}
              </div>

              {lightboxImages.length > 1 && (
                <div className="p-4" onClick={(e) => e.stopPropagation()}>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${lightboxImages.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {lightboxImages.map((img, i) => (
                      <Button
                        key={i}
                        variant="ghost"
                        onClick={() => {
                          setImageLoaded(false);
                          setLightboxIndex(i);
                        }}
                        className={`relative h-24 overflow-hidden rounded-lg p-0 transition-all hover:bg-transparent ${
                          i === lightboxIndex
                            ? "opacity-100 ring-2 ring-white"
                            : "opacity-50 hover:opacity-75"
                        }`}
                        aria-label={`View image ${i + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${i + 1}`}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
