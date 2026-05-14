import React from 'react';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      ></div>

      {/* Menu */}
      <div className="fixed top-16 left-0 right-0 bg-surface-container-lowest dark:bg-[#0a0a0a] shadow-xl dark:shadow-xl dark:shadow-black/50 z-50 md:hidden">
        <nav className="px-6 py-4 space-y-2">
          <Link 
            to="/dashboard"
            className="block px-4 py-3 rounded-lg text-[#2d5a27] dark:text-[#c8e6c0] font-bold bg-[#e8f0e0] dark:bg-[#0d3d1a]"
            onClick={onClose}
          >
            Dashboard
          </Link>
          <Link 
            to="/interviews"
            className="block px-4 py-3 rounded-lg text-[#1a3d16] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
          >
            Interviews
          </Link>
          <Link 
            to="/resume"
            className="block px-4 py-3 rounded-lg text-[#1a3d16] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
          >
            Resume
          </Link>
          <Link 
            to="/analytics"
            className="block px-4 py-3 rounded-lg text-[#1a3d16] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
          >
            Analytics
          </Link>
          <Link 
            to="/settings"
            className="block px-4 py-3 rounded-lg text-[#1a3d16] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
          >
            Settings
          </Link>
          
          <div className="pt-4 border-t border-outline-variant/20">
            <button className="w-full bg-[#2d5a27] text-white px-5 py-3 rounded-xl font-label text-sm font-semibold hover:bg-[#1a3d16] transition-colors">
              Start Free Trial
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;