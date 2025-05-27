"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { TbSun, TbMoon } from "react-icons/tb";

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
      {theme === "light" ? (
        <TbMoon className="h-5 w-5" />
      ) : (
        <TbSun className="h-5 w-5" />
      )}
    </Button>
  );
});

ThemeSwitcher.displayName = "ThemeSwitcher";
