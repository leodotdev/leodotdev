'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_POSITION_KEY = 'projects-scroll-position';

export function useSaveScrollPosition() {
  const pathname = usePathname();

  useEffect(() => {
    // Only save scroll position on the projects page
    if (pathname !== '/projects') return;

    const handleScroll = () => {
      try {
        const scrollPosition = window.scrollY;
        localStorage.setItem(SCROLL_POSITION_KEY, scrollPosition.toString());
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
}

export function useRestoreScrollPosition() {
  const pathname = usePathname();

  useEffect(() => {
    // Only restore on the projects page
    if (pathname !== '/projects') return;

    try {
      const savedPosition = localStorage.getItem(SCROLL_POSITION_KEY);
      if (savedPosition) {
        const scrollY = parseInt(savedPosition, 10);
        
        // Use setTimeout to ensure DOM is ready after hydration
        setTimeout(() => {
          window.scrollTo(0, scrollY);
        }, 0);
      }
    } catch (error) {
      console.error('Error restoring scroll position:', error);
    }
  }, [pathname]);
}

export function clearScrollPosition() {
  localStorage.removeItem(SCROLL_POSITION_KEY);
}