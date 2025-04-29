
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useProfileMutations } from '@/hooks/useProfileMutations';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuth } from './AuthContext';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { data: profile } = useProfileData(user?.id);
  const { mutate: updateProfile } = useProfileMutations(user?.id);
  
  // Initialize with system preference or saved preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we have a saved preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Default to dark mode
    return true;
  });

  // Load theme from user profile when available
  useEffect(() => {
    if (profile?.dark_mode !== undefined) {
      setIsDarkMode(profile.dark_mode);
    }
  }, [profile]);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Update user profile if logged in
    if (user) {
      updateProfile({ dark_mode: newMode });
    }
  };

  const setTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
    
    // Update user profile if logged in
    if (user) {
      updateProfile({ dark_mode: isDark });
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
