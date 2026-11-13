import { useEffect } from "react";

interface ProjectsPageClientProps {
  children: React.ReactNode;
}

export function ProjectsPageClient({ children }: ProjectsPageClientProps) {
  useEffect(() => {
    document.documentElement.classList.add("projects-frame");
    return () => document.documentElement.classList.remove("projects-frame");
  }, []);

  return (
    <div>
      {children}
    </div>
  );
}
