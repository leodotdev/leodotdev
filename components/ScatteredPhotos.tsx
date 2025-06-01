"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMemo, useState, useRef } from "react";
import * as React from "react";
import { Loader2 } from "lucide-react";

interface Photo {
  id: number;
  filename: string;
  rotation: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  isPanoramic?: boolean;
}

// Function to fetch available photo filenames from API
const fetchPhotoFilenames = async (): Promise<string[]> => {
  try {
    const response = await fetch('/api/photos');
    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error('Error fetching photos:', error);
    // Fallback to empty array if API fails
    return [];
  }
};

// Function to detect if a photo is likely panoramic based on filename patterns
const isPanoramicPhoto = (filename: string): boolean => {
  // Common panoramic indicators in filenames
  const panoramicIndicators = [
    '_102_o', // Often indicates original/panoramic format
    'pano',
    'panoramic',
    'wide'
  ];
  
  const lowerFilename = filename.toLowerCase();
  return panoramicIndicators.some(indicator => lowerFilename.includes(indicator));
};

// Function to generate random photo positions
const generateRandomPhotos = (photoFilenames: string[]): Photo[] => {
  // First, randomly select a subset of photos (e.g., 8-10 photos from the total)
  const photosToDisplay = Math.min(10, photoFilenames.length); // Number of photos to show
  const shuffledFilenames = [...photoFilenames].sort(() => Math.random() - 0.5);
  const selectedPhotos = shuffledFilenames.slice(0, photosToDisplay);
  
  // Check if mobile (viewport width less than 768px)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Define zones based on device type
  const zones = isMobile
    ? [
        // Mobile zones - strictly bottom half only
        // Zone 1: Bottom area, main content area
        { xMin: 15, xMax: 85, yMin: 65, yMax: 90, weight: 0.8 },
        // Zone 2: Very bottom edges
        { xMin: 5, xMax: 15, yMin: 70, yMax: 95, weight: 0.1 },
        { xMin: 85, xMax: 95, yMin: 70, yMax: 95, weight: 0.1 },
      ]
    : [
        // Desktop zones - avoid top-left text area
        // Zone 1: Right side (safest area, pushed further right)
        { xMin: 70, xMax: 95, yMin: 10, yMax: 90, weight: 0.5 },
        // Zone 2: Bottom area (below text, with higher minimum Y)
        { xMin: 20, xMax: 90, yMin: 80, yMax: 95, weight: 0.35 },
        // Zone 3: Far left edge (very narrow strip, bottom only)
        { xMin: 3, xMax: 10, yMin: 80, yMax: 95, weight: 0.15 },
      ];

  // Calculate cumulative weights for weighted random selection
  let cumulativeWeight = 0;
  const cumulativeWeights = zones.map((zone) => {
    cumulativeWeight += zone.weight;
    return cumulativeWeight;
  });

  // Use each photo only once - no duplicates
  return selectedPhotos.map((filename, i) => {
    // Select a zone based on weights
    const random = Math.random();
    const zoneIndex = cumulativeWeights.findIndex((weight) => random < weight);
    const zone = zones[zoneIndex];

    // Generate position within the selected zone
    let x = Math.random() * (zone.xMax - zone.xMin) + zone.xMin;
    let y = Math.random() * (zone.yMax - zone.yMin) + zone.yMin;

    // Final safety check based on device type
    if (isMobile && y < 65) {
      // On mobile, force to bottom area (65-90%)
      y = 65 + Math.random() * 25;
      x = 15 + Math.random() * 70; // Keep within safe horizontal bounds
    } else if (!isMobile && x < 65 && y < 75) {
      // On desktop, if somehow in text area, push to safe zone
      x = 70 + Math.random() * 25;
      y = 20 + Math.random() * 70;
    }

    const isPanoramic = isPanoramicPhoto(filename);
    
    return {
      id: i + 1,
      filename,
      rotation: Math.floor(Math.random() * 50) - 25, // -25 to 25 degrees
      x,
      y,
      z: Math.floor(Math.random() * 6) + 1, // z-index 1-6
      scale: 1, // Keep all photos at consistent scale
      isPanoramic,
    };
  });
};

// Individual photo component to manage its own loading state
function ScatteredPhoto({
  photo,
  onPhotoClick,
  isClickable,
  index,
  isExpanded,
  expandedPhotoId,
  scrollY,
}: {
  photo: Photo;
  onPhotoClick: (id: number) => void;
  isClickable: boolean;
  index: number;
  isExpanded: boolean;
  expandedPhotoId: number | null;
  scrollY: number;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!isClickable) return;
    
    e.preventDefault();
    e.stopPropagation();
    onPhotoClick(photo.id);
  };

  // Animate in on mount with stagger
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimatedIn(true);
    }, index * 80); // 80ms stagger between photos (slower)

    return () => clearTimeout(timer);
  }, [index]);

  // Reset animation when expanded state changes
  React.useEffect(() => {
    if (!isExpanded && hasAnimatedIn) {
      // Photos should be visible when not expanded
      setHasAnimatedIn(true);
    }
  }, [isExpanded]);


  // Calculate positions for animations
  const yOffset = !hasAnimatedIn ? "400%" : "0%";
  
  // Calculate parallax offset - different speed for each photo based on index
  const parallaxSpeed = 0.1 + (index * 0.05); // Speed varies from 0.1 to 0.55
  const parallaxOffset = scrollY * parallaxSpeed;

  // When expanded, move photos to bottom in a scattered line
  const expandedPosition = isExpanded
    ? {
        x: 2 + index * 10.5, // Start from 2%, spacing of 10.5 to push rightmost photo past edge
        y: 92 - (index % 3) * 2, // Staggered heights for depth (92%, 90%, 88%)
        rotation: [-15, 10, -5, 12, -8, 15, -10, 5, -12, 8][index] || 0, // Varied rotations for each photo
        scale: 0.7, // Even smaller scale to show more overlap and depth
      }
    : null;

  return (
    <div
      ref={photoRef}
      className={cn(
        "group absolute",
        photo.isPanoramic 
          ? "w-52 md:w-64" // Even larger for panoramic photos
          : "w-28 md:w-36", // Smaller for regular photos
        isClickable ? "cursor-pointer" : "cursor-default",
        "transition-all ease-out",
      )}
      style={
        {
          "--rotation": `${expandedPosition ? expandedPosition.rotation : photo.rotation}deg`,
          "--scale": `${expandedPosition ? expandedPosition.scale : photo.scale}`,
          "--y-offset": yOffset,
          left: `${expandedPosition ? expandedPosition.x : photo.x}%`,
          top: `${expandedPosition ? expandedPosition.y : photo.y}%`,
          transform: `
        translate(-50%, calc(-50% + var(--y-offset) - ${parallaxOffset}px))
        rotate(var(--rotation)) 
        scale(var(--scale))
      `,
          zIndex: isHovered ? 100 : isExpanded && photo.id === expandedPhotoId ? 100 : isExpanded ? 50 + index : photo.z + 20,
          transition: `transform ${600 + index * 80}ms cubic-bezier(0.34, 1.56, 0.64, 1), left ${600 + index * 80}ms cubic-bezier(0.34, 1.56, 0.64, 1), top ${600 + index * 80}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
        } as React.CSSProperties
      }
      onClick={handleClick}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.setProperty("--rotation", "0deg");
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        const rotation = expandedPosition
          ? expandedPosition.rotation
          : photo.rotation;
        e.currentTarget.style.setProperty("--rotation", `${rotation}deg`);
      }}
    >
      {/* Photo with matte border */}
      <div
        className="pointer-events-none rounded-sm bg-white p-1.5 dark:bg-gray-200 md:p-2"
        style={{
          boxShadow: `0 ${4 + photo.z * 2}px ${8 + photo.z * 3}px rgba(0, 0, 0, 0.15), 0 ${2 + photo.z}px ${4 + photo.z * 2}px rgba(0, 0, 0, 0.08)`,
        }}
      >
        <div className="pointer-events-none relative overflow-hidden bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300">
          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          )}
          <Image
            src={`/photos/${photo.filename}`}
            alt={`Photo ${photo.id}`}
            width={400}
            height={400}
            className={cn(
              "block h-auto w-full transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100",
            )}
            onLoad={() => setIsLoading(false)}
            onError={(e) => {
              console.error(`Failed to load photo: ${photo.filename}`);
              setIsLoading(false);
            }}
            draggable={false}
          />
          {/* Subtle overlay for depth */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        </div>
        {/* Inner shadow for photo depth */}
        <div className="pointer-events-none absolute inset-[6px] rounded-sm shadow-inner md:inset-[8px]" />
      </div>
    </div>
  );
}

export function ScatteredPhotos({
  onBackgroundChange,
}: {
  onBackgroundChange?: (isExpanded: boolean) => void;
}) {
  // Generate random photos on component mount and manage their positions
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [expandedPhotoId, setExpandedPhotoId] = useState<number | null>(null);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Generate photos on mount and handle resize
  React.useEffect(() => {
    const generateAndSetPhotos = async () => {
      const photoFilenames = await fetchPhotoFilenames();
      if (photoFilenames.length > 0) {
        setPhotos(generateRandomPhotos(photoFilenames));
      }
    };

    // Initial generation
    generateAndSetPhotos();

    // Handle resize events
    const handleResize = () => {
      // Debounce to avoid too many regenerations
      const timeoutId = setTimeout(generateAndSetPhotos, 300);
      return () => clearTimeout(timeoutId);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Track scroll position for parallax
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handlePhotoClick = (photoId: number) => {
    // If clicking a different photo while one is expanded, switch to the new one
    if (expandedPhotoId && expandedPhotoId !== photoId) {
      setIsBackgroundLoading(true);
      setExpandedPhotoId(photoId);
      // Background stays active, just switching photos
    } else {
      // Toggle expansion
      const isExpanding = expandedPhotoId !== photoId;
      if (isExpanding) {
        setIsBackgroundLoading(true);
      }
      setExpandedPhotoId(isExpanding ? photoId : null);
      onBackgroundChange?.(isExpanding);
    }
  };

  const expandedPhoto = photos.find((p) => p.id === expandedPhotoId);

  return (
    <>
      {/* Expanded photo background */}
      {expandedPhoto && (
        <div
          className="absolute inset-0 z-[15] cursor-pointer overflow-hidden"
          onClick={() => {
            setExpandedPhotoId(null);
            onBackgroundChange?.(false);
          }}
        >
          {/* Loading indicator */}
          {isBackgroundLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          )}
          <div 
            className="absolute inset-0 scale-110"
            style={{
              transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
            }}
          >
            <Image
              src={`/photos/${expandedPhoto.filename}`}
              alt={`Expanded photo ${expandedPhoto.id}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              onLoad={() => setIsBackgroundLoading(false)}
              onError={(e) => {
                console.error(`Failed to load expanded photo: ${expandedPhoto.filename}`);
                setIsBackgroundLoading(false);
              }}
            />
          </div>
          {/* Dark overlay for text readability - gradient darker at top */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      {/* Scattered photos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full">
          {photos.map((photo, index) => (
            <ScatteredPhoto
              key={photo.id}
              photo={photo}
              onPhotoClick={handlePhotoClick}
              isClickable={true}
              index={index}
              isExpanded={!!expandedPhotoId}
              expandedPhotoId={expandedPhotoId}
              scrollY={scrollY}
            />
          ))}
        </div>
      </div>
    </>
  );
}
