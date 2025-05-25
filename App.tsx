import React, { useState, useEffect, useCallback } from 'react';
import { ProfileCard } from './components/ProfileCard';
import { DarkModeToggle } from './components/DarkModeToggle';
import { SOCIAL_LINKS } from './constants';
import ArrowBackground from './components/ArrowBackground'; // Yeni bileşeni import et

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('bg-custom-light-bg');
        document.body.classList.add('bg-custom-dark-bg');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-custom-dark-bg');
        document.body.classList.add('bg-custom-light-bg');
      }
      localStorage.setItem('darkMode', String(isDarkMode));
    }
  }, [isDarkMode]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      // Set initial mouse position to center of screen for smoother first paint
      setMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [handleMouseMove]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <ArrowBackground mousePosition={mousePosition} isDarkMode={isDarkMode} />
      <div className="absolute top-4 right-4 z-10"> {/* Ensure toggle is above background */}
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      </div>
      <div className="relative z-0"> {/* Ensure profile card is above background */}
        <ProfileCard
          name="Enes Aksu"
          imageUrl="https://r.resimlink.com/gltCIu9QX.jpg"
          socialLinks={SOCIAL_LINKS}
        />
      </div>
      <footer className="absolute bottom-4 text-center text-xs text-gray-500 dark:text-gray-400 z-10">
        <p>© 2025 Enes Aksu. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;