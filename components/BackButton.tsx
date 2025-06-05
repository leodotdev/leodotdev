"use client";

import { TbArrowLeft } from "react-icons/tb";
import Link from "next/link";
import { useEffect, useState } from "react";

export function BackButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check sessionStorage for navigation context
    const navigationSource = sessionStorage.getItem('navigation-source');
    const isFromProjectPage = navigationSource === 'project-page';
    
    // Clear the flag
    sessionStorage.removeItem('navigation-source');
    
    if (isFromProjectPage) {
      // Show immediately without animation
      setIsVisible(true);
    } else {
      // Show with animation after delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-out ${
        isVisible ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
      }`}
    >
      <Link
        href="/projects"
        onClick={() => {
          // Set flag when navigating back to projects
          sessionStorage.setItem('navigation-source', 'back-button');
        }}
        className="text-md hover:bg-secondary/90 flex items-center whitespace-nowrap rounded-full bg-secondary px-4 py-2 pr-5 font-medium text-primary"
      >
        <TbArrowLeft className="mr-1 h-4 w-4 text-muted-foreground" />
        Back to Projects
      </Link>
    </div>
  );
}
