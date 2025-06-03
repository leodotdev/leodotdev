"use client";

import { useState } from "react";
import Link from "next/link";
import { ScatteredPhotos } from "@/components/ScatteredPhotos";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [hasPhotoBackground, setHasPhotoBackground] = useState(false);

  return (
    <div className="relative -my-12 min-h-[600px]">
      <ScatteredPhotos onBackgroundChange={setHasPhotoBackground} />
      <div className="pointer-events-none relative z-30 flex flex-col px-6 py-24 md:px-12">
        <p
          className={cn(
            "pointer-events-auto font-semibold transition-colors duration-500",
            hasPhotoBackground && "text-white",
          )}
        >
          Leo Succar
        </p>
        <p
          className={cn(
            "pointer-events-auto max-w-xl transition-colors duration-500",
            hasPhotoBackground ? "text-gray-200" : "text-muted-foreground",
          )}
        >
          Product Designer experienced in front-end development, design systems
          and tools, and crafting end-to-end experiences across web and native.
          Currently with{" "}
          <Link href="https://meta.com" target="_blank">
            <span
              className={cn(
                "underline decoration-dotted transition-colors duration-500 hover:decoration-solid",
                hasPhotoBackground ? "text-blue-300" : "text-blue-500",
              )}
            >
              Meta
            </span>
          </Link>{" "}
          and{" "}
          <Link href="https://plasmic.app" target="_blank">
            <span
              className={cn(
                "underline decoration-dotted transition-colors duration-500 hover:decoration-solid",
                hasPhotoBackground ? "text-pink-300" : "text-pink-500",
              )}
            >
              Plasmic
            </span>
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
