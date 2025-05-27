"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const ThemeSwitcher = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      ref={ref}
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full bg-transparent hover:bg-secondary/80"
      {...props}
    >
      <Image
        src={theme === "light" ? "/new-moon-face.svg" : "/sun-with-face.svg"}
        alt={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        width={20}
        height={20}
        className="transition-opacity"
      />
    </Button>
  );
});

ThemeSwitcher.displayName = "ThemeSwitcher";
