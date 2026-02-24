import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Check system preference or local storage on mount could go here
    // If user explicitly prefers light, we could handle it here, but for now default is dark.
    // We keep the check for system preference if we want to respect it, 
    // but the requirement says "Default to Dark Mode", so initializing to 'dark' is key.
    // If we want to strictly enforce dark mode initially regardless of system settings unless changed by user:
    // We can just leave the initialization as 'dark'. 
    // If we want to allow system preference to override 'dark' default to 'light' if system is light, we would add an else block.
    // But usually "Default to Dark Mode" means start in dark.
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
       // Optional: if we wanted to respect light mode system preference, we would set it here.
       // But request says "Default to Dark Mode", so we stick with 'dark' as initial state.
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
