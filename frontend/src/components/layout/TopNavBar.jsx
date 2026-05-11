import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MobileMenu from './MobileMenu';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const TopNavBar = ({ onLoginClick, onSignupClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    // Keep auth UX consistent: landing page + login modal if needed
    navigate('/', { replace: true });
  };

  const themeToggleVariants = {
    initial: { scale: 0.8, opacity: 0, rotate: -90 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0.8, opacity: 0, rotate: 90 },
  };

  // If user object doesn't have fullName but localStorage has userName
  const userName = user?.fullName || user?.name || localStorage.getItem('userName') || 'User';
  const initial = userName.charAt(0).toUpperCase();

  const navLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-blue-400 transition-all duration-200 font-label text-sm py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full ${isActive ? 'after:w-full text-indigo-600 dark:text-blue-400 font-bold' : ''}`;
  };

  return (
    <nav className={`fixed top-0 right-0 left-0 h-16 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 border-b border-slate-300 dark:border-slate-700 transition-all duration-300 ${scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.06)] dark:shadow-black/20' : ''}`}>
      <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2 group transition-opacity duration-150">
        <motion.div 
          className="w-8 h-8 signature-glow rounded-lg flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="material-symbols-outlined text-white text-sm" 
                style={{fontVariationSettings: "'FILL' 1"}}>
            rocket_launch
          </span>
        </motion.div>
        <span className="font-headline font-bold text-xl tracking-tight text-indigo-600 dark:text-blue-400 transition-colors duration-300">
          Astra AI
        </span>
      </Link>

      {isAuthenticated && (
        <div className="hidden md:flex items-center gap-8">
          <Link to="/home" className={navLinkClasses('/home')}>
            Home
          </Link>
          <Link to="/dashboard" className={navLinkClasses('/dashboard')}>
            Dashboard
          </Link>
          <Link to="/analytics" className={navLinkClasses('/analytics')}>
            Analytics
          </Link>
          <Link to="/interview" className={navLinkClasses('/interview')}>
            Interview
          </Link>
          <Link to="/history" className={navLinkClasses('/history')}>
            History
          </Link>
        </div>
      )}

      {!isAuthenticated && (
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-blue-400 transition-all duration-200 font-label text-sm py-1">
            Features
          </a>
          <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-blue-400 transition-all duration-200 font-label text-sm py-1">
            How It Works
          </a>
        </div>
      )}

      <button 
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 transition-colors duration-200">
          {mobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      <div className="hidden md:flex items-center gap-4">
        {/* Theme Toggle */}
        <motion.button 
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all duration-300 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-blue-400"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span 
              className="material-symbols-outlined inline-block"
              key={isDark ? 'light' : 'dark'}
              variants={themeToggleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {isDark ? 'light_mode' : 'dark_mode'}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* User Menu */}
        {isAuthenticated ? (
          <div className="relative">
            <motion.button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-blue-900/40">
                {initial}
              </div>
              <span className="hidden md:inline text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors duration-300">
                {userName.split(' ')[0]}
              </span>
              <motion.span 
                className="material-symbols-outlined text-xs text-slate-600 dark:text-slate-400"
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
              >
                expand_more
              </motion.span>
            </motion.button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-black/40 border border-slate-300 dark:border-slate-700 transition-colors duration-300 z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                >
                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-150 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700"
                  >
                    <span className="material-symbols-outlined text-sm">settings</span>
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-all duration-150 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {onLoginClick ? (
              <motion.button 
                onClick={onLoginClick} 
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-blue-400 transition-colors duration-200 font-label text-sm font-bold"
                whileHover={{ y: -1 }}
              >
                Login
              </motion.button>
            ) : (
              <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-blue-400 transition-colors duration-200 font-label text-sm font-bold">
                Login
              </Link>
            )}
            
            {onSignupClick ? (
              <motion.button 
                onClick={onSignupClick}
                className="bg-indigo-600 dark:bg-blue-600 text-white px-5 py-2 rounded-xl font-label text-sm font-semibold shadow-md shadow-indigo-200 dark:shadow-blue-900/20"
                whileHover={{ y: -2, scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            ) : (
              <motion.button 
                onClick={() => navigate('/signup')}
                className="bg-indigo-600 dark:bg-blue-600 text-white px-5 py-2 rounded-xl font-label text-sm font-semibold shadow-md shadow-indigo-200 dark:shadow-blue-900/20"
                whileHover={{ y: -2, scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 shadow-lg border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 md:hidden z-40 overflow-hidden"
          >
            {isAuthenticated ? (
              <>
                <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800">Home</Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800">Dashboard</Link>
                <Link to="/analytics" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800">Analytics</Link>
                <Link to="/interview" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800">Interview</Link>
                <Link to="/history" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800">History</Link>
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800">Settings</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="py-2 text-left font-bold text-red-600">Logout</button>
              </>
            ) : (
              <>
                {onLoginClick ? (
                  <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 text-left">Login</button>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800">Login</Link>
                )}
                {onSignupClick ? (
                  <button onClick={() => { onSignupClick(); setMobileMenuOpen(false); }} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 text-left">Get Started</button>
                ) : (
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800">Get Started</Link>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default TopNavBar;