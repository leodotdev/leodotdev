"use client";

import { TbArrowLeft } from "react-icons/tb";
import Link from "next/link";
import { useEffect, useState } from "react";

export function BackButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth animation after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-out ${
        isVisible ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
      }`}
    >
      <Link
        href="/projects"
        className="text-md hover:bg-secondary/90 flex items-center whitespace-nowrap rounded-full bg-secondary px-4 py-2 pr-5 font-medium text-primary"
      >
        <TbArrowLeft className="mr-1 h-4 w-4 text-muted-foreground" />
        Back to Projects
      </Link>
    </div>
  );
}
