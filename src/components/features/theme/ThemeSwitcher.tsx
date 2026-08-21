"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/shadcnComponents/forms/button";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resolvedTheme) {
      setIsDark(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  const handleToggle = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setIsDark(newTheme === "dark");
  };

  // 水合前固定渲染太阳，避免首帧闪烁
  const showMoon = mounted && isDark;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="cursor-pointer rounded-md"
    >
      {showMoon ? (
        <Moon className="size-5 text-brand-blue" />
      ) : (
        <Sun className="size-5 text-brand-pink-deep" />
      )}
    </Button>
  );
}
