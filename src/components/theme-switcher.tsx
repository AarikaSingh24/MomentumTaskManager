'use client'

import * as React from 'react'
import { Check, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'

const themes = [
  { name: 'zinc', color: 'hsl(210 40% 98%)' },
  { name: 'green', color: 'hsl(142.1 76.2% 36.3%)' },
  { name: 'orange', color: 'hsl(24.6 95% 53.1%)' },
  { name: 'rose', color: 'hsl(346.8 77.2% 49.8%)' },
  { name: 'violet', color: 'hsl(262.1 83.3% 57.8%)' },
] as const;

type ColorTheme = "zinc" | "rose" | "green" | "orange" | "violet";


export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>(
    () => (typeof window !== 'undefined' ? (localStorage.getItem("color-theme") as ColorTheme) || "zinc" : "zinc")
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement
    root.classList.remove("theme-zinc", "theme-rose", "theme-green", "theme-orange", "theme-violet")
    root.classList.add(`theme-${colorTheme}`)
    localStorage.setItem("color-theme", colorTheme)
  }, [colorTheme])


  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode-switch" className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
            <span>Dark Mode</span>
        </Label>
        <Switch
            id="dark-mode-switch"
            checked={theme === 'dark'}
            onCheckedChange={handleThemeChange}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {themes.map((themeInfo) => (
          <Button
            key={themeInfo.name}
            variant="outline"
            size="icon"
            className={cn(
              'h-8 w-8 rounded-full',
              colorTheme === themeInfo.name && 'border-2 border-primary'
            )}
            style={{ backgroundColor: themeInfo.color }}
            onClick={() => setColorTheme(themeInfo.name)}
          >
            {colorTheme === themeInfo.name && <Check className="h-4 w-4 text-primary-foreground" />}
            <span className="sr-only">{themeInfo.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
