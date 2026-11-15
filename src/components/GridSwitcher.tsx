import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GRID_CLASS = "show-grid";

// The class on <html> is the state, so every switcher on the page (and one
// mounted later by another route) agrees with it.
const listeners = new Set<() => void>();
const isOn = () => document.documentElement.classList.contains(GRID_CLASS);
const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => void listeners.delete(notify);
};

/**
 * Toggles the layout overlay: a 0.5px blue outline on every element and the 12
 * columns of the page grid (`html.show-grid` in styles.css). Same 20px dot and
 * 40px hit area as the theme switcher it sits next to, filled with the
 * columns' blue.
 */
export function GridSwitcher({ className }: { className?: string }) {
  const on = useSyncExternalStore(subscribe, isOn, () => false);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label="Show grid and columns"
            aria-pressed={on}
            data-wave-manual
            data-wave-hover="off"
            onClick={() => {
              document.documentElement.classList.toggle(GRID_CLASS, !on);
              listeners.forEach((notify) => notify());
            }}
            className={cn(
              "relative h-5 w-5 shrink-0 rounded-full border-[1.5px] border-grid bg-grid/14 [corner-shape:round] outline-none before:absolute before:-inset-2.5 before:content-[''] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              className,
            )}
          />
        }
      />
      <TooltipContent>Grid and columns</TooltipContent>
    </Tooltip>
  );
}
