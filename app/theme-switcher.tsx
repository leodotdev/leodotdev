"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { TbMoon, TbSun } from "react-icons/tb";

import { Button } from "@/components/ui/button";

export const ThemeSwitcher = () => {
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
      variant="link"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? (
        <TbMoon title="Dark" className="h-5 w-5 stroke-stone-950" />
      ) : (
        <TbSun
          title="Light"
          className="h-5 w-5 stroke-stone-950 dark:stroke-stone-50"
        />
      )}
    </Button>
  );
};
