"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Helper to type 'startViewTransition'
interface ViewTransition {
  start: (callback: () => void) => void;
}

declare global {
  interface Document {
    startViewTransition?: (callback: () => void) => void;
  }
}


// Override 'setTheme' to use the View Transitions API
function useThemeWithTransition() {
  const theme = useTheme();
  const setTheme = (newTheme: string) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        theme.setTheme(newTheme);
      });
    } else {
      theme.setTheme(newTheme);
    }
  };

  return { ...theme, setTheme };
}


export { ThemeProvider, useThemeWithTransition as useTheme };
