"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TbX, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [loadingProgress, setLoadingProgress] = useState<Record<number, number>>({});

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
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    const newIndex = selectedIndex === 0 ? allMedia.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setLoadingStates({ ...loadingStates, [newIndex]: true });
    setLoadingProgress({ ...loadingProgress, [newIndex]: 0 });
    simulateProgress(newIndex);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    const newIndex = selectedIndex === allMedia.length - 1 ? 0 : selectedIndex + 1;
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
      setLoadingProgress(prev => ({ ...prev, [index]: Math.min(progress, 90) }));
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
    setLoadingProgress(prev => ({ ...prev, [index]: 100 }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [index]: false }));
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
            className="relative cursor-pointer group"
            onClick={() => openLightbox(heroImage ? 1 : 0)}
          >
            <iframe
              src={embedUrl}
              className="aspect-video w-full rounded-lg pointer-events-none"
              allowFullScreen
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Images Grid */}
      {contentImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {contentImages.map((image, index) => {
            const gridIndex = (heroImage ? 1 : 0) + (embedUrl ? 1 : 0) + index;
            return (
              <motion.div
                key={image._key}
                className="cursor-pointer overflow-hidden rounded-lg bg-secondary/50 aspect-[4/3]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(gridIndex)}
              >
                <div className="relative w-full h-full">
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

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <TbX className="w-6 h-6 text-white" />
            </button>

            {/* Main content area */}
            <div
              className="flex-1 flex items-center justify-center p-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Single loading indicator for all content */}
              {loadingStates[selectedIndex] && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <div className="bg-black/80 rounded-lg p-8">
                    <Progress 
                      value={loadingProgress[selectedIndex] || 0} 
                      className="w-48 h-2"
                    />
                    <p className="mt-3 text-white/80 text-sm text-center">
                      Loading... {Math.round(loadingProgress[selectedIndex] || 0)}%
                    </p>
                  </div>
                </div>
              )}
              {allMedia.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Previous"
                >
                  <TbChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}

              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-[90vw] max-h-[70vh] flex items-center justify-center"
              >

                {/* Content */}
                <div className={cn(
                  "transition-opacity duration-300",
                  loadingStates[selectedIndex] ? "opacity-0" : "opacity-100"
                )}>
                  {allMedia[selectedIndex].type === "image" ? (
                    <Image
                      src={getImageUrl(allMedia[selectedIndex])}
                      alt={allMedia[selectedIndex].alt || "Project image"}
                      width={1920}
                      height={1080}
                      className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                      onLoad={() => handleImageLoad(selectedIndex)}
                      priority
                    />
                  ) : (
                    <div className="w-[90vw] max-w-6xl">
                      <div className="relative aspect-video">
                        <iframe
                          src={allMedia[selectedIndex].embedUrl}
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                          onLoad={() => handleImageLoad(selectedIndex)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {allMedia.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Next"
                >
                  <TbChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Thumbnail strip - only show if more than 1 item */}
            {allMedia.length > 1 && (
              <div className="p-4 bg-black/50">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allMedia.map((item, index) => (
                  <button
                    key={item._key || index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(index);
                      setLoadingStates({ ...loadingStates, [index]: true });
                      setLoadingProgress({ ...loadingProgress, [index]: 0 });
                      simulateProgress(index);
                    }}
                    className={`relative flex-shrink-0 w-20 h-20 rounded overflow-hidden transition-all ${
                      index === selectedIndex
                        ? "ring-2 ring-white opacity-100"
                        : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    {item.type === "image" ? (
                      <Image
                        src={getImageUrl(item, 200)}
                        alt={item.alt || `Thumbnail ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}