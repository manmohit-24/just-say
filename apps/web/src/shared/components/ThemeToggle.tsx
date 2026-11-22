"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full border border-neutral-600 p-2 hover:bg-neutral-700"
    >
      {/* both icons are rendered and CSS shows one, so server and browser markup stay equal */}
      <Sun className="hidden h-5 w-5 text-yellow-400 transition-all dark:block" />
      <Moon className="h-5 w-5 text-slate-500 transition-all dark:hidden" />
    </button>
  );
};

export { ThemeToggle };
