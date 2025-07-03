'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);

  // This will be null during SSR
  let isDarkMode = false;
  let toggleDarkMode = () => {};

  try {
    const context = useDarkMode();
    isDarkMode = context.isDarkMode;
    toggleDarkMode = context.toggleDarkMode;
  } catch (error) {
    // Context not available during SSR
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out"
        aria-label="Toggle theme"
      >
        <Moon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
