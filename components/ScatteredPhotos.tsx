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
  isVideo?: boolean;
}

// Function to fetch available photo filenames from API
const fetchPhotoFilenames = async (): Promise<string[]> => {
  try {
    const response = await fetch("/api/photos");
    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error("Error fetching photos:", error);
    // Fallback to empty array if API fails
    return [];
  }
};

// Function to detect if a file is a video
const isVideoFile = (filename: string): boolean => {
  const videoExtensions = [".mp4", ".webm", ".mov"];
  const lowerFilename = filename.toLowerCase();
  return videoExtensions.some((ext) => lowerFilename.endsWith(ext));
};

// Function to detect if a photo is likely panoramic based on filename patterns
const isPanoramicPhoto = (filename: string): boolean => {
  // Common panoramic indicators in filenames
  const panoramicIndicators = [
    "_102_o", // Often indicates original/panoramic format
    "pano",
    "panoramic",
    "wide",
  ];

  const lowerFilename = filename.toLowerCase();
  return panoramicIndicators.some((indicator) =>
    lowerFilename.includes(indicator),
  );
};

// Function to generate random photo positions
const generateRandomPhotos = (photoFilenames: string[]): Photo[] => {
  // Select random half of the photos
  const shuffledFilenames = [...photoFilenames].sort(() => Math.random() - 0.5);
  const photosToDisplay = Math.ceil(photoFilenames.length / 2);
  const selectedPhotos = shuffledFilenames.slice(0, photosToDisplay);
  
  // Check if mobile (viewport width less than 768px)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  
  // Create a grid-like distribution with some randomness
  const totalPhotos = selectedPhotos.length;
  
  // Calculate grid dimensions based on total photos
  // Aim for roughly square grid with some extra columns
  const cols = Math.ceil(Math.sqrt(totalPhotos * 1.5));
  const rows = Math.ceil(totalPhotos / cols);
  
  // Define zones for desktop (3x2 grid, excluding top-left and top-center) vs mobile
  const zones = isMobile
    ? [
        // Mobile: all 3 bottom sections
        { xMin: -20, xMax: 40, yMin: 50, yMax: 110 }, // Bottom-left
        { xMin: 40, xMax: 80, yMin: 50, yMax: 110 }, // Bottom-center
        { xMin: 80, xMax: 120, yMin: 50, yMax: 110 }, // Bottom-right
      ]
    : [
        // Desktop: 3x2 grid - exclude top-left and top-center
        { xMin: 67, xMax: 110, yMin: -10, yMax: 50 }, // Top-right (section 3)
        { xMin: -10, xMax: 33, yMin: 50, yMax: 110 }, // Bottom-left (section 4)
        { xMin: 33, xMax: 67, yMin: 50, yMax: 110 }, // Bottom-center (section 5)
        { xMin: 67, xMax: 110, yMin: 50, yMax: 110 }, // Bottom-right (section 6)
      ];
  
  return selectedPhotos.map((filename, i) => {
    // Distribute photos across available zones
    const zoneIndex = i % zones.length;
    const zone = zones[zoneIndex];
    
    // Calculate how many photos per zone
    const photosPerZone = Math.ceil(totalPhotos / zones.length);
    const indexInZone = Math.floor(i / zones.length);
    
    // Create sub-grid within each zone
    const zoneWidth = zone.xMax - zone.xMin;
    const zoneHeight = zone.yMax - zone.yMin;
    const zoneCols = Math.ceil(Math.sqrt(photosPerZone * (zoneWidth / zoneHeight)));
    const zoneRows = Math.ceil(photosPerZone / zoneCols);
    
    // Position within zone
    const gridX = indexInZone % zoneCols;
    const gridY = Math.floor(indexInZone / zoneCols);
    
    // Calculate position with randomness
    const xSpacing = zoneWidth / zoneCols;
    const ySpacing = zoneHeight / zoneRows;
    const randomOffsetX = (Math.random() - 0.5) * xSpacing * 0.6;
    const randomOffsetY = (Math.random() - 0.5) * ySpacing * 0.6;
    
    const x = zone.xMin + gridX * xSpacing + xSpacing / 2 + randomOffsetX;
    const y = zone.yMin + gridY * ySpacing + ySpacing / 2 + randomOffsetY;
    
    const isPanoramic = isPanoramicPhoto(filename);
    const isVideo = isVideoFile(filename);
    
    return {
      id: i + 1,
      filename,
      rotation: Math.floor(Math.random() * 50) - 25, // -25 to 25 degrees
      x,
      y,
      z: Math.floor(Math.random() * totalPhotos) + 1, // More varied z-index
      scale: 1, // Keep all photos at consistent scale
      isPanoramic,
      isVideo,
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

  // Calculate parallax offset - different Y speed for each photo based on index (staggered)
  const parallaxSpeed = 0.02 + (index % 8) * 0.015; // Speed varies from 0.02 to 0.125, cycling every 8 photos
  const parallaxOffsetY = scrollY * parallaxSpeed;

  // When expanded, move photos to bottom in a scattered line
  const expandedPosition = isExpanded
    ? {
        x: (index * 100) / 10, // Spread evenly across full width (0% to 100%)
        y: 90 + (index % 3) * 1, // Roughly same Y with slight variation (90%, 91%, 92%)
        rotation: [
          -15, 10, -5, 12, -8, 15, -10, 5, -12, 8,
          -18, 14, -7, 16, -11, 9, -13, 6, -9, 11
        ][index % 20] || (index % 2 ? 8 : -8), // More rotation variety
        scale: 0.6, // Smaller scale to fit more photos
      }
    : null;

  return (
    <div
      ref={photoRef}
      className={cn(
        "group absolute",
        "w-24 md:w-32", // Smaller size for all photos
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
        translate(-50%, calc(-50% + var(--y-offset) + ${parallaxOffsetY}px))
        rotate(var(--rotation)) 
        scale(var(--scale))
      `,
          zIndex: isHovered
            ? 45
            : isExpanded && photo.id === expandedPhotoId
              ? 45
              : isExpanded
                ? 20 + index
                : photo.z + 10,
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
          {photo.isVideo ? (
            <video
              src={`/photos/${photo.filename}`}
              className={cn(
                "block h-auto w-full transition-opacity duration-300",
                isLoading ? "opacity-0" : "opacity-100",
              )}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsLoading(false)}
              onError={(e) => {
                console.error(`Failed to load video: ${photo.filename}`);
                setIsLoading(false);
              }}
              draggable={false}
            />
          ) : (
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
          )}
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

  // Background photo is either the expanded photo or the first photo as default
  const backgroundPhoto = expandedPhoto || (photos.length > 0 ? photos[0] : null);
  const isExpanded = !!expandedPhoto;

  return (
    <>
      {/* Background photo with parallax - always present, replaced when photo clicked */}
      {backgroundPhoto && (
        <div
          className={`absolute inset-0 overflow-hidden ${isExpanded ? 'z-[15] cursor-pointer' : 'z-[5]'}`}
          onClick={isExpanded ? () => {
            setExpandedPhotoId(null);
            onBackgroundChange?.(false);
          } : undefined}
        >
          {/* Loading indicator */}
          {isBackgroundLoading && isExpanded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          >
            {backgroundPhoto.isVideo ? (
              <video
                src={`/photos/${backgroundPhoto.filename}`}
                className={`h-full w-full object-cover ${isExpanded ? '' : 'opacity-20'}`}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => isExpanded && setIsBackgroundLoading(false)}
                onError={(e) => {
                  console.error(
                    `Failed to load background video: ${backgroundPhoto.filename}`,
                  );
                  isExpanded && setIsBackgroundLoading(false);
                }}
              />
            ) : (
              <Image
                src={`/photos/${backgroundPhoto.filename}`}
                alt={isExpanded ? `Expanded photo ${backgroundPhoto.id}` : "Background"}
                fill
                className={`object-cover ${isExpanded ? '' : 'opacity-20'}`}
                sizes="100vw"
                priority
                onLoad={() => isExpanded && setIsBackgroundLoading(false)}
                onError={(e) => {
                  console.error(
                    `Failed to load background photo: ${backgroundPhoto.filename}`,
                  );
                  isExpanded && setIsBackgroundLoading(false);
                }}
              />
            )}
          </div>
          {/* Dark overlay for text readability - only when expanded */}
          {isExpanded && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
          )}
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
