"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";

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
    <Button
      ref={ref}
      size="icon"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="rounded-full [corner-shape:round] bg-transparent hover:bg-transparent"
      {...props}
    >
      <div
        className={`h-5 w-5 rounded-full [corner-shape:round] ${
          currentTheme === "dark" ? "bg-white" : "bg-black"
        }`}
      />
    </Button>
  );
});

ThemeSwitcher.displayName = "ThemeSwitcher";
