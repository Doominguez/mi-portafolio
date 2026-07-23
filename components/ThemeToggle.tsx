"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="p-2 rounded-md hover:bg-[var(--surface)] transition-colors"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-[var(--text-2)]" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--text-2)]" />
      )}
    </button>
  );
}
