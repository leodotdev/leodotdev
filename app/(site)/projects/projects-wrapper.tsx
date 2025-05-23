'use client';

import { useRestoreScrollPosition, useSaveScrollPosition } from '@/hooks/useScrollPosition';

export function ProjectsWrapper({ children }: { children: React.ReactNode }) {
  useSaveScrollPosition();
  useRestoreScrollPosition();
  
  return <>{children}</>;
}