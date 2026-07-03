import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import { isAuthenticated } from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check authentication for protected routes
    const publicRoutes = ['/login', '/register', '/'];
    const isPublic = publicRoutes.includes(router.pathname);

    if (!isPublic && !isAuthenticated()) {
      router.push('/login');
    }

    // Check dark mode preference
    const savedDarkMode = localStorage.getItem('ikangoo_dark_mode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    setLoading(false);
  }, [router.pathname]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('ikangoo_dark_mode', newMode.toString());
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Component {...pageProps} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#1a1a36' : '#fff',
            color: darkMode ? '#fff' : '#1f2937',
            border: `1px solid ${darkMode ? '#2d2d4e' : '#e5e7eb'}`,
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: darkMode ? '#1a1a36' : '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: darkMode ? '#1a1a36' : '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default MyApp;
