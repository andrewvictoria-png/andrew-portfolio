import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to apply the theme class to the body tag
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="header-wrapper">
      <div className="container nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <a href="/" className="logo">Andrew Victoria</a>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'inherit',
              padding: '5px',
              borderRadius: '50%',
              transition: 'background 0.3s'
            }}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun size={20} className="sun-icon" />
            ) : (
              <Moon size={20} className="moon-icon" />
            )}
          </button>
        </div>

        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#tech">TechStack</a>
          <a href='#projects'>Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;