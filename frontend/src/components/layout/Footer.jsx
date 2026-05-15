import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#f0f5ec] dark:bg-[#0d0d0d] px-8 py-12 border-t-0.5px border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 signature-glow rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" 
                      style={{fontVariationSettings: "'FILL' 1"}}>
                  psychology
                </span>
              </div>
              <span className="font-headline font-bold text-xl tracking-tight text-white transition-colors duration-300">
                Astra AI
              </span>
            </div>
            <p className="text-sm text-[#6b7c63] dark:text-slate-400 leading-relaxed transition-colors duration-300">
              Your personal AI-powered interview coach. Master your next interview with data-driven insights and realistic practice sessions.
            </p>
          </div>

          <div>
            <h5 className="font-headline font-bold mb-6 text-white transition-colors duration-300">Features</h5>
            <ul className="space-y-4 text-sm text-[#6b7c63] dark:text-slate-400 transition-colors duration-300">
              <li><a href="/resume" className="hover:text-primary transition-colors">Resume Analysis</a></li>
              <li><a href="/home" className="hover:text-primary transition-colors">Mock Interviews</a></li>
              <li><a href="/analytics" className="hover:text-primary transition-colors">Performance Analytics</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-headline font-bold mb-6 text-white transition-colors duration-300">Support</h5>
            <ul className="space-y-4 text-sm text-[#6b7c63] dark:text-slate-400 transition-colors duration-300">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t-0.5px border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[#6b7c63] dark:text-slate-400 transition-colors duration-300">
            © 2024 Astra AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[#6b7c63] dark:text-slate-400 transition-colors duration-300">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              AI System Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
