'use client'
import { Switch } from "@/components/ui/shadcnComponents/forms/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


export default function ThemePage() {
    const { theme, setTheme} = useTheme()

    const [updateTheme, setUpdateTheme] = useState<boolean>(false)
    
    useEffect(() => {
        if (theme === 'dark') {
            setUpdateTheme(true)
        }else{
            setUpdateTheme(false)
        }
    }, [theme])

    return (
        <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <Switch
                checked={updateTheme}
                onCheckedChange={()=>setTheme(theme === 'light' ? 'dark' : 'light')}
                id="theme-toggle"
                className="data-[state=checked]:bg-primary"
            />
            <Moon className="h-4 w-4 text-indigo-400" />
        </div>
    )

}