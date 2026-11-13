import { TbArrowLeft } from "react-icons/tb";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
      className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:!opacity-100 ${
        isVisible ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
      }`}
    >
      <Button
        variant="pill"
        render={
          <Link
            to="/"
            onClick={() => {
              // Set flag when navigating back to projects
              sessionStorage.setItem('navigation-source', 'back-button');
            }}
          />
        }
      >
        <TbArrowLeft className="-ml-1 mr-1 h-4 w-4 text-muted-foreground" />
        Back to home
      </Button>
    </div>
  );
}
