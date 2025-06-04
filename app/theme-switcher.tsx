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
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Use resolvedTheme for display but check actual theme for logic
  const currentTheme = resolvedTheme || "light";

  return (
    <Button
      ref={ref}
      size="icon"
      onClick={() => {
        // Simply toggle between light and dark
        setTheme(currentTheme === "dark" ? "light" : "dark");
      }}
      className="rounded-full bg-transparent hover:bg-secondary/80"
      {...props}
    >
      {currentTheme === "light" ? (
        <Image src="/crescent-moon.svg" alt="Dark" width={24} height={24} />
      ) : (
        <Image src="/sun.svg" alt="Light" width={24} height={24} />
      )}
    </Button>
  );
});

ThemeSwitcher.displayName = "ThemeSwitcher";
