import React, { useEffect, useState } from 'react';
import {
  Contact,
  Footer,
  Intro,
  Portfolio,
  Timeline,
  Navbar,
  TechStack,
} from './components';

function App() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-300 min-h-screen font-inter">
      <Navbar theme={theme} handleThemeSwitch={handleThemeSwitch} />

      <div className="max-w-5xl w-11/12 mx-auto">
        <Intro />
        <Portfolio />
        <Timeline />
        <TechStack />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
