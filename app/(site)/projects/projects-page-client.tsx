"use client";

import { Navigation } from "@/components/Navigation";

interface ProjectsPageClientProps {
  children: React.ReactNode;
}

export function ProjectsPageClient({ children }: ProjectsPageClientProps) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
