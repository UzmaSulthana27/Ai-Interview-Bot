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
    navigate('/', { replace: true });
  };

  const themeToggleVariants = {
    initial: { scale: 0.5, opacity: 0, y: 8 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.5, opacity: 0, y: -8 },
  };

  const userName = user?.fullName || user?.name || localStorage.getItem('userName') || 'User';
  const initial = userName.charAt(0).toUpperCase();

  const navLinkClasses = (path) => {
    const isActive = location.pathname === path;
    if (isDark) {
      return `transition-all duration-200 py-1 relative font-mono text-sm uppercase text-slate-400 hover:text-[#00ffa3] ${isActive ? 'font-bold text-[#00ffa3]' : ''}`;
    } else {
      return `text-[#4a6741] hover:text-[#2d5a27] transition-all duration-200 font-label text-sm py-1 relative font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#2d5a27] after:transition-all after:duration-300 hover:after:w-full ${isActive ? 'after:w-full text-[#1a3d16] font-bold' : ''}`;
    }
  };

  return (
    <nav className={`fixed top-0 right-0 left-0 h-16 z-50 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${!isDark ? 'bg-[rgba(245,245,240,0.92)] backdrop-blur-xl border-b border-[#c8d5b9]' : ''} ${scrolled && !isDark ? 'shadow-[0_2px_20px_rgba(45,90,39,0.08)]' : ''}`}
         style={isDark ? { background: '#000000', borderBottom: '1px solid #1e293b', boxShadow: '0 2px 20px rgba(0,0,0,0.4)', borderRadius: '0px' } : { borderRadius: '0px' }}>

      {/* Logo */}
      <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2 group transition-opacity duration-150">
        <motion.div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={isDark
            ? { background: 'transparent', border: '1px solid #00ffa3', boxShadow: '0 0 10px rgba(0,255,163,0.3)' }
            : { background: 'linear-gradient(135deg, #2d5a27, #1a3d16)', boxShadow: '0 2px 12px rgba(45,90,39,0.3)' }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="material-symbols-outlined text-sm"
                style={isDark ? { color: '#00ffa3', fontVariationSettings: "'FILL' 1" } : { color: 'white', fontVariationSettings: "'FILL' 1" }}>
            rocket_launch
          </span>
        </motion.div>
        <span className={`font-headline font-bold text-xl tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
          Astra AI
        </span>
      </Link>

      {/* Desktop Nav Links */}
      {isAuthenticated && (
        <div className="hidden md:flex items-center gap-8">
          <Link to="/home" className={navLinkClasses('/home')}>{isDark ? '~/home' : 'Home'}</Link>
          <Link to="/dashboard" className={navLinkClasses('/dashboard')}>{isDark ? '~/dashboard' : 'Dashboard'}</Link>
          <Link to="/analytics" className={navLinkClasses('/analytics')}>{isDark ? '~/analytics' : 'Analytics'}</Link>
          <Link to="/interview" className={navLinkClasses('/interview')}>{isDark ? '~/interview' : 'Interview'}</Link>
          <Link to="/history" className={navLinkClasses('/history')}>{isDark ? '~/history' : 'History'}</Link>
        </div>
      )}

      {!isAuthenticated && (
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className={`transition-all duration-200 font-label text-sm py-1 ${isDark ? 'text-slate-500 hover:text-[#00ffa3]' : 'text-[#4a6741] hover:text-[#2d5a27] font-semibold'}`}>Features</a>
          <a href="#how-it-works" className={`transition-all duration-200 font-label text-sm py-1 ${isDark ? 'text-slate-500 hover:text-[#00ffa3]' : 'text-[#4a6741] hover:text-[#2d5a27] font-semibold'}`}>How It Works</a>
        </div>
      )}

      {/* Mobile hamburger */}
      <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <span className={`material-symbols-outlined transition-colors duration-200 ${isDark ? 'text-[#00ffa3]' : 'text-[#2d5a27]'}`}>
          {mobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      <div className="hidden md:flex items-center gap-4">

        {/* ── Theme Toggle: unique pill with icon, no box ── */}
        <motion.button
          onClick={toggleTheme}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
            isDark
              ? 'bg-[#0a0a0a] border border-[#1e293b] hover:border-[#00ffa3]'
              : 'bg-[#e8f0e0] border border-[#c8d5b9] hover:border-[#2d5a27]'
          }`}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? 'to-light' : 'to-dark'}
              className="material-symbols-outlined text-[18px] leading-none"
              style={isDark
                ? { color: '#94a3b8', fontVariationSettings: "'FILL' 0" }
                : { color: '#2d5a27', fontVariationSettings: "'FILL' 1" }}
              variants={themeToggleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              {isDark ? 'light_mode' : 'dark_mode'}
            </motion.span>
          </AnimatePresence>
          <span className={`text-xs font-semibold leading-none ${isDark ? 'text-slate-400' : 'text-[#4a6741]'}`}>
            {isDark ? 'Light' : 'Dark'}
          </span>
        </motion.button>

        {/* User Menu */}
        {isAuthenticated ? (
          <div className="relative">
            <motion.button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-[#e8f0e0]'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${isDark ? 'bg-primary/10 text-primary' : 'bg-[#2d5a27] text-white'}`}>
                {initial}
              </div>
              <span className={`hidden md:inline text-sm font-medium transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-[#2d5a27]'}`}>
                {userName.split(' ')[0]}
              </span>
              <motion.span
                className={`material-symbols-outlined text-xs ${isDark ? 'text-slate-600' : 'text-[#4a6741]'}`}
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
              >
                expand_more
              </motion.span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#050505] border-slate-800 shadow-black/60' : 'bg-white border-[#c8d5b9] shadow-[#2d5a27]/10'}`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                >
                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 border-b transition-all duration-150 ${isDark ? 'text-slate-300 hover:bg-slate-800 border-slate-800' : 'text-[#2d5a27] hover:bg-[#f0f7ec] border-[#e8f0e0]'}`}
                  >
                    <span className="material-symbols-outlined text-sm">settings</span>
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-all duration-150 flex items-center gap-2"
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
                className={`transition-colors duration-200 font-label text-sm font-bold ${isDark ? 'text-slate-400 hover:text-[#00ffa3]' : 'text-[#4a6741] hover:text-[#1a3d16]'}`}
                whileHover={{ y: -1 }}
              >
                Login
              </motion.button>
            ) : (
              <Link to="/login" className={`transition-colors duration-200 font-label text-sm font-bold ${isDark ? 'text-slate-400 hover:text-[#00ffa3]' : 'text-[#4a6741] hover:text-[#1a3d16]'}`}>
                Login
              </Link>
            )}

            {onSignupClick ? (
              <motion.button
                onClick={onSignupClick}
                className={`px-5 py-2 rounded-xl font-label text-sm font-semibold shadow-md ${isDark ? 'bg-[#00ffa3] text-black' : 'bg-[#2d5a27] text-white'}`}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            ) : (
              <motion.button
                onClick={() => navigate('/signup')}
                className={`px-5 py-2 rounded-xl font-label text-sm font-semibold shadow-md ${isDark ? 'bg-[#00ffa3] text-black' : 'bg-[#2d5a27] text-white'}`}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`absolute top-16 left-0 right-0 shadow-lg border-b p-4 flex flex-col gap-4 md:hidden z-40 overflow-hidden ${isDark ? 'bg-[#0d0d0d] border-slate-800' : 'bg-[#f5f5f0] border-[#c8d5b9]'}`}
          >
            {isAuthenticated ? (
              <>
                <Link to="/home" onClick={() => setMobileMenuOpen(false)} className={`py-2 font-bold border-b ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>Home</Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`py-2 font-bold border-b ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>Dashboard</Link>
                <Link to="/analytics" onClick={() => setMobileMenuOpen(false)} className={`py-2 font-bold border-b ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>Analytics</Link>
                <Link to="/interview" onClick={() => setMobileMenuOpen(false)} className={`py-2 font-bold border-b ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>Interview</Link>
                <Link to="/history" onClick={() => setMobileMenuOpen(false)} className={`py-2 font-bold border-b ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>History</Link>
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className={`py-2 font-bold border-b ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>Settings</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="py-2 text-left font-bold text-red-600">Logout</button>
              </>
            ) : (
              <>
                {onLoginClick ? (
                  <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className={`py-2 font-bold border-b text-left ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>Login</button>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={`py-2 font-bold border-b ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>Login</Link>
                )}
                {onSignupClick ? (
                  <button onClick={() => { onSignupClick(); setMobileMenuOpen(false); }} className={`py-2 font-bold border-b text-left ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>Get Started</button>
                ) : (
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className={`py-2 font-bold border-b ${isDark ? 'text-[#00ffa3] border-slate-800' : 'text-[#2d5a27] border-[#e8f0e0]'}`}>Get Started</Link>
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