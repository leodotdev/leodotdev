"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Project } from "@/types/Project";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { client } from "@/sanity/client";
import urlBuilder from "@sanity/image-url";
import { motion, AnimatePresence } from "framer-motion";
import { TbX, TbChevronLeft, TbChevronRight, TbList, TbLayoutGrid } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { EditableDescription } from "@/components/EditableDescription";
import { useSanityAdmin } from "@/hooks/useSanityAdmin";

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
const GRID_PAGE_SIZE = PROJECTS_PAGE_SIZE * 2;

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const isAdmin = useSanityAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(GRID_PAGE_SIZE);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const pageSize = viewMode === "grid" ? GRID_PAGE_SIZE : PROJECTS_PAGE_SIZE;

  const handleViewModeChange = useCallback((mode: "list" | "grid") => {
    setViewMode(mode);
    setVisibleCount(mode === "grid" ? GRID_PAGE_SIZE : PROJECTS_PAGE_SIZE);
    if (typeof window !== "undefined") {
      localStorage.setItem("projects-view-mode", mode);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("projects-view-mode");
    if (saved === "list") {
      setViewMode("list");
      setVisibleCount(PROJECTS_PAGE_SIZE);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "projects-grid",
      viewMode === "grid",
    );
    return () => document.documentElement.classList.remove("projects-grid");
  }, [viewMode]);

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
    setVisibleCount(pageSize);
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
    <div
      id="projects"
      className={`border-t pt-12 ${
        viewMode === "grid"
          ? "mx-[calc(50%_-_50vw)] overflow-x-hidden"
          : "border-x"
      }`}
    >
      <div className="px-6 pb-12 md:px-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold">Projects</div>
            <div className="text-muted-foreground">
              Shots and embeds of my past work.
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              onClick={() => handleViewModeChange("list")}
              className={viewMode === "list" ? "bg-muted hover:bg-muted" : ""}
            >
              <TbList className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              onClick={() => handleViewModeChange("grid")}
              className={viewMode === "grid" ? "bg-muted hover:bg-muted" : ""}
            >
              <TbLayoutGrid className="h-4 w-4" />
            </Button>
          </div>
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

      {viewMode === "list" ? (
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
                  className="group/item block px-6 py-4 md:px-12"
                >
                  <div className="flex w-full items-center justify-between gap-6">
                    <div className="flex flex-row items-center gap-3">
                      <Avatar className="rounded-md">
                        <AvatarImage src={clientLogos[project.client]} />
                        <AvatarFallback className="rounded-md text-muted-foreground">
                          {project.client?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col md:flex-row md:gap-2">
                        <div className="underline decoration-dotted group-hover/item:text-blue-500 group-hover/item:decoration-solid">
                          {project.name}
                        </div>
                        <span className="hidden text-muted-foreground md:inline">
                          ·
                        </span>
                        <div className="italic text-muted-foreground">
                          {project.client}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-[132px] shrink-0 flex-col items-end text-end">
                      <p className="text-muted-foreground">{project.year}</p>
                    </div>
                  </div>

                  <EditableDescription
                    projectId={project._id}
                    description={project.description}
                    isAdmin={isAdmin}
                    className="mt-2 pl-11 text-sm text-muted-foreground"
                  />

                  {allThumbs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 [&:hover>*]:opacity-50">
                      {allThumbs.map((img, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-lg bg-secondary outline outline-1 -outline-offset-1 outline-border transition duration-300 hover:scale-[1.02] hover:!opacity-100"
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
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
      ) : (
        <div className="grid grid-cols-2 gap-4 px-6 md:grid-cols-3 md:px-12 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 [&:hover>*]:opacity-50">
          {visibleProjects.map((project) => {
            const contentThumbs = getContentImageThumbs(project);
            const coverImage = project.image || contentThumbs[0] || null;

            return (
              <Link
                key={project._id}
                href={`/projects/${project.slug}`}
                className="group min-w-0 transition-opacity hover:!opacity-100"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary outline outline-1 -outline-offset-1 outline-border transition-transform duration-300 group-hover:scale-[1.02]">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl text-muted-foreground">
                      {project.client?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-8 opacity-0 transition-opacity group-hover:opacity-100 md:block">
                    <div className="truncate text-white underline decoration-dotted group-hover:text-blue-400 group-hover:decoration-solid">
                      {project.name}
                    </div>
                    <div className="truncate text-sm text-white/70">
                      {project.client} · {project.year}
                    </div>
                  </div>
                </div>
                <div className="mt-2 md:hidden">
                  <div className="truncate underline decoration-dotted group-hover:text-blue-500 group-hover:decoration-solid">
                    {project.name}
                  </div>
                  <div className="truncate text-sm text-muted-foreground">
                    {project.client} · {project.year}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="flex justify-center px-6 py-8 md:px-12">
        {hasMore ? (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setVisibleCount((prev) => prev + pageSize)}
            className="rounded-full px-6 [corner-shape:round]"
          >
            Show more
          </Button>
        ) : visibleCount > PROJECTS_PAGE_SIZE ? (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setVisibleCount(pageSize)}
            className="rounded-full px-6 [corner-shape:round]"
          >
            Show less
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
                        className={`group relative h-24 overflow-hidden rounded-lg p-0 outline outline-1 -outline-offset-1 outline-border transition-all duration-300 hover:scale-[1.02] hover:bg-transparent ${
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
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
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
