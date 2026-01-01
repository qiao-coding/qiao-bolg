'use client'
import { Switch } from "@/components/ui/shadcnComponents/forms/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";


export default function ThemePage() {
    const { theme, setTheme} = useTheme()

      const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
    return (
        <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                id="theme-toggle"
                className="data-[state=checked]:bg-primary"
            />
            <Moon className="h-4 w-4 text-indigo-400" />
        </div>
    )

}