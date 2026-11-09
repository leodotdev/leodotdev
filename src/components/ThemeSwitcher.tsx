import { forwardRef } from "react";
import { useHydrated } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ThemeSwitcher = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  // The theme is only known in the browser, so render nothing on the server
  // and during hydration (as with next-themes before).
  const hydrated = useHydrated();
  const { resolved: currentTheme, setPref: setTheme } = useTheme();

  if (!hydrated) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            ref={ref}
            size="icon"
            onClick={() =>
              setTheme(currentTheme === "dark" ? "light" : "dark")
            }
            className="rounded-full bg-transparent hover:bg-transparent"
            {...props}
          >
            <div
              className={`h-5 w-5 rounded-full ${
                currentTheme === "dark" ? "bg-white" : "bg-black"
              }`}
            />
          </Button>
        }
      />
      <TooltipContent>Light switch</TooltipContent>
    </Tooltip>
  );
});

ThemeSwitcher.displayName = "ThemeSwitcher";
