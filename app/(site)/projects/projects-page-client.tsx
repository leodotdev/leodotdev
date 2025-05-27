"use client";

import { StickySectionHeader } from "@/components/StickySectionHeader";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

const sections = [
  {
    id: "experience",
    name: "Experience",
    description: "My work and employment history.",
  },
  {
    id: "references",
    name: "References",
    description: "Folks I've had the pleasure of working with.",
  },
  {
    id: "projects",
    name: "Projects",
    description: "Shots and embeds of my past work.",
  },
];

interface ProjectsPageClientProps {
  children: React.ReactNode;
}

export function ProjectsPageClient({ children }: ProjectsPageClientProps) {
  return (
    <div>
      <Navigation />

      <StickySectionHeader sections={sections} />

      {children}
    </div>
  );
}
