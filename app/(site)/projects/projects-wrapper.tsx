'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_POSITION_KEY = 'projects-scroll-position';

export function ProjectsWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Only save scroll position on the projects page
    if (pathname !== '/projects') return;

    const handleScroll = () => {
      try {
        const scrollPosition = window.scrollY;
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(SCROLL_POSITION_KEY, scrollPosition.toString());
        }
      } catch (error) {
        console.error('Error saving scroll position:', error);
      }
    };

    // Save scroll position with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  useEffect(() => {
    // Only restore on the projects page
    if (pathname !== '/projects') return;

    // Delay restoration to ensure DOM is ready
    const restoreScroll = () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const savedPosition = localStorage.getItem(SCROLL_POSITION_KEY);
          if (savedPosition) {
            const scrollY = parseInt(savedPosition, 10);
            window.scrollTo(0, scrollY);
          }
        }
      } catch (error) {
        console.error('Error restoring scroll position:', error);
      }
    };

    // Use a longer delay to ensure hydration is complete
    const timeoutId = setTimeout(restoreScroll, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);
  
  return <>{children}</>;
}