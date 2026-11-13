import { forwardRef } from "react";
import { flushSync } from "react-dom";
import { useHydrated } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { wave } from "@/lib/wave";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * The light/dark toggle: a 20px dot. The button is the dot's size, so it lines
 * up with the text around it; a pseudo-element extends the hit area to 40px.
 * Pass a size in `className` for a bigger button (the life calendar does).
 */
export const ThemeSwitcher = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => {
  const hydrated = useHydrated();
  const { resolved: currentTheme, setPref: setTheme } = useTheme();
  const classes = cn(
    "relative grid h-5 w-5 shrink-0 place-items-center rounded-full bg-transparent [corner-shape:round] outline-none before:absolute before:-inset-2.5 before:content-[''] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className,
  );

  // The theme is only known in the browser: hold the space until hydration
  // so the top bar doesn't shift when the dot appears.
  if (!hydrated) {
    return <span aria-hidden className={classes} />;
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            ref={ref}
            type="button"
            aria-label={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
            data-wave-manual
            data-wave-hover="off"
            onClick={(e) => {
              const next = currentTheme === "dark" ? "light" : "dark";
              // The wave carries the whole page from one theme to the other.
              wave(
                document.getElementById("app"),
                () => flushSync(() => setTheme(next)),
                {
                  source: e.currentTarget,
                  focus: e.nativeEvent,
                  // Keep the dot clear of colour: nothing gathers on it
                  // before the wave leaves, and the glow trailing behind the
                  // wave stays out of a wider zone around it. On a 20px dot
                  // both read as a burst.
                  gatherGlow: 0,
                  gatherDots: 0,
                  holdScale: 5,
                },
              );
            }}
            className={classes}
            {...props}
          >
            <span
              className={cn(
                "h-5 w-5 rounded-full [corner-shape:round]",
                currentTheme === "dark" ? "bg-white" : "bg-black",
              )}
            />
          </button>
        }
      />
      <TooltipContent>Light switch</TooltipContent>
    </Tooltip>
  );
});

ThemeSwitcher.displayName = "ThemeSwitcher";
