"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { TbMoon, TbSun } from "react-icons/tb";

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
    <button
      className="cursor-pointer self-center rounded-full bg-stone-200/50 p-3 px-5 hover:bg-stone-200 dark:bg-stone-800/50 dark:hover:bg-stone-800"
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
    </button>
  );
};
