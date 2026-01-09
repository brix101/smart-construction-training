import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | undefined>(undefined)

  // Set theme from localStorage or defaultTheme on client only
  useEffect(() => {
    const storedTheme = (typeof window !== 'undefined' &&
      window.localStorage.getItem(storageKey)) as Theme | null
    setTheme(storedTheme || defaultTheme)
  }, [defaultTheme, storageKey])

  useEffect(() => {
    if (!theme) return
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme: theme || defaultTheme,
    setTheme: (t: Theme) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, t)
      }
      setTheme(t)
    },
  }

  // Only render children when theme is set (prevents hydration mismatch)
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {theme ? children : null}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
