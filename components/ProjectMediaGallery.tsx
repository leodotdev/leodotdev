"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbX,
  TbChevronLeft,
  TbChevronRight,
  TbEye,
  TbBrandFigma,
} from "react-icons/tb";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const client = createClient({
  projectId: "jyqe7nab",
  dataset: "production",
  apiVersion: "2023-10-07",
  useCdn: true,
});

interface MediaItem {
  _key?: string;
  type: "image" | "embed";
  url?: string; // For hero image or embed URL
  asset?: {
    _ref: string;
    _type: string;
  };
  alt?: string;
  embedUrl?: string;
}

interface ProjectMediaGalleryProps {
  heroImage?: string;
  heroImageAlt?: string;
  embedUrl?: string;
  contentImages: any[];
  projectName: string;
}

export function ProjectMediaGallery({
  heroImage,
  heroImageAlt,
  embedUrl,
  contentImages,
  projectName,
}: ProjectMediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {},
  );
  const [loadingProgress, setLoadingProgress] = useState<
    Record<number, number>
  >({});
  const [originalBodyOverflow, setOriginalBodyOverflow] = useState<string>("");

  // Combine all media into a single array
  const allMedia: MediaItem[] = [];

  // Add hero image if exists
  if (heroImage) {
    allMedia.push({
      type: "image",
      url: heroImage,
      alt: heroImageAlt || projectName,
      _key: "hero",
    });
  }

  // Add embed if exists
  if (embedUrl) {
    allMedia.push({
      type: "embed",
      embedUrl: embedUrl,
      _key: "embed",
    });
  }

  // Add content images
  contentImages.forEach((image) => {
    allMedia.push({
      ...image,
      type: "image",
    });
  });

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    // Save the original overflow value
    setOriginalBodyOverflow(document.body.style.overflow || "");
    document.body.style.overflow = "hidden";
    setLoadingStates({ [index]: true });
    setLoadingProgress({ [index]: 0 });
    simulateProgress(index);
  };

  const closeLightbox = () => {
    // Clear any running progress intervals
    allMedia.forEach((_, index) => {
      const intervalId = (window as any)[`progressInterval_${index}`];
      if (intervalId) {
        clearInterval(intervalId);
        delete (window as any)[`progressInterval_${index}`];
      }
    });

    setSelectedIndex(null);
    // Restore the original overflow value
    document.body.style.overflow = originalBodyOverflow;
  };

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    const newIndex =
      selectedIndex === 0 ? allMedia.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setLoadingStates({ ...loadingStates, [newIndex]: true });
    setLoadingProgress({ ...loadingProgress, [newIndex]: 0 });
    simulateProgress(newIndex);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    const newIndex =
      selectedIndex === allMedia.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setLoadingStates({ ...loadingStates, [newIndex]: true });
    setLoadingProgress({ ...loadingProgress, [newIndex]: 0 });
    simulateProgress(newIndex);
  };

  // Simulate loading progress
  const simulateProgress = (index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) {
        progress = 90; // Hold at 90% until actual load
      }
      setLoadingProgress((prev) => ({
        ...prev,
        [index]: Math.min(progress, 90),
      }));
    }, 200);

    // Store interval ID for cleanup
    (window as any)[`progressInterval_${index}`] = interval;
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  const getImageUrl = (item: MediaItem, width?: number) => {
    if (item.url) return item.url; // For hero image
    if (item.asset) {
      const builder = urlBuilder(client).image(item);
      if (width) {
        return builder.width(width).fit("max").auto("format").url();
      }
      return builder.fit("max").auto("format").url();
    }
    return "";
  };

  const handleImageLoad = (index: number) => {
    // Clear the progress interval
    const intervalId = (window as any)[`progressInterval_${index}`];
    if (intervalId) {
      clearInterval(intervalId);
      delete (window as any)[`progressInterval_${index}`];
    }

    // Set progress to 100% and hide loading
    setLoadingProgress((prev) => ({ ...prev, [index]: 100 }));
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
    }, 200);
  };


  return (
    <>
      {/* Hero Image - Clickable */}
      {heroImage && (
        <div className="mb-8 cursor-pointer" onClick={() => openLightbox(0)}>
          <Image
            src={heroImage}
            alt={heroImageAlt || projectName}
            width={1200}
            height={800}
            className="w-full rounded-lg object-cover transition-transform hover:scale-[1.02]"
            priority
          />
        </div>
      )}

      {/* Embed - Clickable */}
      {embedUrl && (
        <div className="mb-8">
          <div
            className="group relative cursor-pointer"
            onClick={() => openLightbox(heroImage ? 1 : 0)}
          >
            <iframe
              src={embedUrl}
              className="pointer-events-none aspect-video w-full rounded-lg"
              allowFullScreen
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/10">
              <div className="rounded-full [corner-shape:round] bg-white/90 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <TbEye className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Images Grid */}
      {contentImages.length > 0 && (
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {contentImages.map((image, index) => {
            const gridIndex = (heroImage ? 1 : 0) + (embedUrl ? 1 : 0) + index;
            return (
              <motion.div
                key={image._key}
                className="aspect-[4/3] cursor-pointer overflow-hidden rounded-lg border bg-secondary/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(gridIndex)}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={getImageUrl(image, 800)}
                    alt={image.alt || "Project image"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox drawer */}
      <AnimatePresence>
        {selectedIndex !== null && (
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
                {loadingStates[selectedIndex] && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full [corner-shape:round] border-2 border-white/20 border-t-white" />
                  </div>
                )}
                {allMedia.length > 1 && (
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
                  key={selectedIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "relative flex items-center justify-center",
                    allMedia[selectedIndex].type === "image"
                      ? "max-h-[80vh] max-w-[90vw]"
                      : "max-h-[85vh] max-w-[90vw]",
                  )}
                  onClick={(e) => {
                    if (allMedia[selectedIndex].type !== "image") e.stopPropagation();
                  }}
                >
                  <div
                    className={cn(
                      "transition-opacity duration-300",
                      loadingStates[selectedIndex] ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {allMedia[selectedIndex].type === "image" ? (
                      <Image
                        src={getImageUrl(allMedia[selectedIndex])}
                        alt={allMedia[selectedIndex].alt || "Project image"}
                        width={1920}
                        height={1080}
                        className="h-auto max-h-[80vh] w-auto max-w-full object-contain"
                        onLoad={() => handleImageLoad(selectedIndex)}
                        priority
                      />
                    ) : (
                      <iframe
                        src={allMedia[selectedIndex].embedUrl}
                        className={`w-[90vw] max-w-7xl rounded-lg ${
                          allMedia.length > 1
                            ? "h-[calc(100vh-theme(spacing.36))]"
                            : "h-[calc(100vh-theme(spacing.8))]"
                        }`}
                        allowFullScreen
                        onLoad={() => handleImageLoad(selectedIndex)}
                      />
                    )}
                  </div>
                </motion.div>

                {allMedia.length > 1 && (
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

              {allMedia.length > 1 && (
                <div className="p-4" onClick={(e) => e.stopPropagation()}>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${allMedia.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {allMedia.map((item, index) => (
                      <Button
                        key={item._key || index}
                        variant="ghost"
                        onClick={() => {
                          setSelectedIndex(index);
                          setLoadingStates({ ...loadingStates, [index]: true });
                          setLoadingProgress({ ...loadingProgress, [index]: 0 });
                          simulateProgress(index);
                        }}
                        className={`relative h-24 overflow-hidden rounded-lg p-0 transition-all hover:bg-transparent ${
                          index === selectedIndex
                            ? "opacity-100 ring-2 ring-white"
                            : "opacity-50 hover:opacity-75"
                        }`}
                        aria-label={`View item ${index + 1}`}
                      >
                        {item.type === "image" ? (
                          <Image
                            src={getImageUrl(item, 200)}
                            alt={item.alt || `Thumbnail ${index + 1}`}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-secondary">
                            <TbBrandFigma className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
