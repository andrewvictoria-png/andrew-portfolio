import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './index.css';

// Components
import Navbar from './components/Navbar';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';

function App() {
  const [themeColor, setThemeColor] = useState(null);

  // Fetch Global Theme from Supabase
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('theme_color')
          .single();
        
        if (error) throw error;

        if (data && data.theme_color) {
          setThemeColor(data.theme_color);
          
          // Apply to --db-accent if you used the updated CSS logic, 
          // or --accent-color to override everything directly.
          document.documentElement.style.setProperty('--accent-color', data.theme_color);
          document.documentElement.style.setProperty('--db-accent', data.theme_color);
          
          // Optional: If your accent color is very light, you can calculate 
          // a "glow" effect for dark mode programmatically here.
        }
      } catch (err) {
        console.error("Error fetching theme:", err.message);
      }
    };

    fetchTheme();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="container">
                <About />
                <TechStack />
                <Projects />
                <Contact />
              </main>
              <footer style={{ padding: '40px 0', textAlign: 'center', opacity: 0.5, fontSize: '12px' }}>
                © {new Date().getFullYear()} • Custom System Dashboard
              </footer>
            </>
          } />

          {/* Admin Panel Route */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;