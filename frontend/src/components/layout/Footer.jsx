import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`px-8 py-12 border-t-0.5px transition-colors duration-300 ${isDark ? 'bg-[#0d0d0d] border-slate-800' : 'bg-[#f5f5f0] border-[#c8d5b9]'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isDark ? 'signature-glow' : 'bg-[#2d5a27] text-white shadow-md'}`} style={isDark ? { borderRadius: '2px' } : { borderRadius: '8px' }}>
                <span className="material-symbols-outlined text-white text-sm" 
                      style={{fontVariationSettings: "'FILL' 1"}}>
                  rocket_launch
                </span>
              </div>
              <span className={`font-headline font-bold text-xl tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
                Astra AI
              </span>
            </div>
            <p className={`text-sm leading-relaxed transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-[#4a6741]'}`}>
              Your personal AI-powered interview coach. Master your next interview with data-driven insights and realistic practice sessions.
            </p>
          </div>

          <div>
            <h5 className={`font-headline font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>Features</h5>
            <ul className={`space-y-4 text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-[#4a6741]'}`}>
              <li><a href="/resume" className={`transition-colors ${isDark ? 'hover:text-primary' : 'hover:text-[#2d5a27]'}`}>Resume Analysis</a></li>
              <li><a href="/home" className={`transition-colors ${isDark ? 'hover:text-primary' : 'hover:text-[#2d5a27]'}`}>Mock Interviews</a></li>
              <li><a href="/analytics" className={`transition-colors ${isDark ? 'hover:text-primary' : 'hover:text-[#2d5a27]'}`}>Performance Analytics</a></li>
            </ul>
          </div>

          <div>
            <h5 className={`font-headline font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>Support</h5>
            <ul className={`space-y-4 text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-[#4a6741]'}`}>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-primary' : 'hover:text-[#2d5a27]'}`}>Privacy Policy</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-primary' : 'hover:text-[#2d5a27]'}`}>Terms of Service</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-primary' : 'hover:text-[#2d5a27]'}`}>Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t-0.5px flex flex-col md:flex-row justify-between items-center gap-6 ${isDark ? 'border-slate-800' : 'border-[#c8d5b9]'}`}>
          <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-[#4a6741]'}`}>
            © 2024 Astra AI. All rights reserved.
          </p>
          <div className={`flex gap-6 text-xs transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-[#4a6741]'}`}>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary' : 'bg-[#2d5a27]'}`}></span>
              AI System Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
