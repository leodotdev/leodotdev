"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TbX, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: "jyqe7nab",
  dataset: "production",
  apiVersion: "2023-10-07",
  useCdn: true,
});

interface ProjectImage {
  _key: string;
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
  alt?: string;
}

interface ProjectImageGridProps {
  images: ProjectImage[];
}

export function ProjectImageGrid({ images }: ProjectImageGridProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(
      selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1,
    );
  };

  const goToNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(
      selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1,
    );
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

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
  }, [selectedImageIndex]);

  const getImageUrl = (image: ProjectImage, width?: number) => {
    const builder = urlBuilder(client).image(image);
    if (width) {
      return builder.width(width).fit("max").auto("format").url();
    }
    return builder.fit("max").auto("format").url();
  };

  const masonryLayout = (index: number) => {
    const patterns = [
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
      "col-span-2 row-span-2",
      "col-span-1 row-span-1",
    ];
    return patterns[index % patterns.length];
  };

  return (
    <>
      <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, index) => (
          <motion.div
            key={image._key}
            className={`${masonryLayout(index)} cursor-pointer overflow-hidden rounded-lg bg-secondary/50`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => openLightbox(index)}
          >
            <div className="relative h-full w-full">
              <Image
                src={getImageUrl(image, 800)}
                alt={image.alt || "Project image"}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImageIndex !== null && (
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
              className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <TbX className="h-6 w-6 text-white" />
            </button>

            {/* Main image */}
            <div
              className="flex flex-1 items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={goToPrevious}
                className="absolute left-4 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <TbChevronLeft className="h-6 w-6 text-white" />
              </button>

              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative max-h-[70vh] max-w-[90vw]"
              >
                <Image
                  src={getImageUrl(images[selectedImageIndex])}
                  alt={images[selectedImageIndex].alt || "Project image"}
                  width={1920}
                  height={1080}
                  className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
                />
              </motion.div>

              <button
                onClick={goToNext}
                className="absolute right-4 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <TbChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="bg-black/50 p-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image._key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded transition-all ${
                      index === selectedImageIndex
                        ? "opacity-100 ring-2 ring-white"
                        : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    <Image
                      src={getImageUrl(image, 200)}
                      alt={image.alt || `Thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
