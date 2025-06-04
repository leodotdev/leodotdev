"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  name: string;
  description?: string;
}

interface StickySectionHeaderProps {
  sections: Section[];
  className?: string;
}

export function StickySectionHeader({
  sections,
  className,
}: StickySectionHeaderProps) {
  const [currentSection, setCurrentSection] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getObserverOptions = () => {
      const width = window.innerWidth;
      let rootMargin;

      if (width < 640) {
        // sm breakpoint
        rootMargin = "-15% 0px -75% 0px"; // More aggressive for small screens
      } else if (width < 768) {
        // md breakpoint
        rootMargin = "-10% 0px -80% 0px"; // Mobile
      } else {
        rootMargin = "-5% 0px -90% 0px"; // Desktop
      }

      return {
        rootMargin,
        threshold: 0,
      };
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
          setIsVisible(true);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      getObserverOptions(),
    );

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Handle scroll to show/hide the header
    const handleScroll = () => {
      const navHeight = 64; // Approximate nav height
      const scrollY = window.scrollY;

      // Show the section header when scrolled past the nav
      if (scrollY > navHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  const currentSectionData = sections.find((s) => s.id === currentSection);
  const currentSectionName = currentSectionData?.name || "";
  const currentSectionDescription = currentSectionData?.description || "";

  return (
    <div
      className={cn(
        "sticky top-0 z-40 border-b border-black/10 dark:border-white/10 bg-secondary/20 backdrop-blur-md transition-all duration-200",
        isVisible && currentSectionName
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0",
        className,
      )}
    >
      <div className="mx-auto max-w-[960px] px-6 py-3 md:px-12">
        <div className="font-semibold">{currentSectionName}</div>
        {currentSectionDescription && (
          <div className="text-muted-foreground text-sm">
            {currentSectionDescription}
          </div>
        )}
      </div>
    </div>
  );
}
