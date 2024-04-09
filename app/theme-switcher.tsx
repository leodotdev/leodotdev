"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { TbMoon, TbSun } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import Image from "next/image";

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
      variant="secondary"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
    >
      {theme === "light" ? (
        <Image src="new-moon-face.svg" alt="Dark" width={24} height={24} />
      ) : (
        <Image src="sun-with-face.svg" alt="Dark" width={24} height={24} />
      )}
    </Button>
  );
};
