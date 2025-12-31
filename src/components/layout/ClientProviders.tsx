'use client'
import ReduxProvider from "@/lib/store/ReduxProvider";
import { ThemeProvider } from "next-themes";

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ReduxProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
        themes={['light', 'dark']}
      >
          {children}
      </ThemeProvider>
    </ReduxProvider>
  )
}