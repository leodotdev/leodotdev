"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { forwardRef } from "react";
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
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = resolvedTheme || "light";

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
