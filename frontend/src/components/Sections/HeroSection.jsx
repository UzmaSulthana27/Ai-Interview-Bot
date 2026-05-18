import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const StatCounter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}{suffix}</span>;
};

const TypingText = ({ text, className = "", delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }
    }, 80 + Math.random() * 40); // Slower, more rhythmic typing
    return () => clearTimeout(timer);
  }, [index, text]);

  return (
    <span className={className}>
      {displayedText}
      {index < text.length && (
        <motion.span 
          className="inline-block w-2 h-8 ml-1 bg-white align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </span>
  );
};

const HeroSection = ({ onStartTrial }) => {
  const { isDark } = useTheme();
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative px-4 md:px-8 pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        <motion.div 
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 cursor-pointer ${isDark ? 'bg-[var(--bg-badge)] border border-slate-800 text-slate-300' : 'bg-[#e8f0e0] text-[#2d5a27]'}`}
          style={isDark ? { borderRadius: '2px' } : { borderRadius: '20px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={isDark ? { scale: 1.05, boxShadow: '0 0 12px rgba(0,255,163,0.4)' } : { scale: 1.05, backgroundColor: 'rgba(200, 213, 185, 0.2)' }}
          transition={{ duration: 0.5 }}
        >
          {isDark ? (
            <span className="font-mono">⚡ AI-POWERED INTERVIEW PRACTICE</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-xs" 
                    style={{fontVariationSettings: "'FILL' 1"}}>
                eco
              </span>
              🌿 AI-Powered Interview Practice
            </>
          )}
        </motion.div>

        {/* Terminal Headline Box */}
        <motion.div 
          className="w-full max-w-4xl mx-auto mb-12 bg-[#000000] p-6 md:p-8 font-mono text-left relative overflow-hidden"
          style={isDark ? {
            borderRadius: '4px',
            border: '1px solid #1e293b',
            boxShadow: '0 0 24px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5)',
          } : {
            borderRadius: '12px',
            border: '1px solid #2d5a27',
            background: '#ffffff'
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`absolute top-0 left-0 w-1.5 h-full ${isDark ? 'bg-primary' : 'bg-[#2d5a27]'}`} />
          
          <div className={`flex justify-between items-center mb-6 pb-4 border-b ${isDark ? 'border-[#00ffa3]/20' : 'border-[#c8d5b9]'}`}>
            <span className="text-slate-500 font-bold text-sm md:text-base tracking-widest">
              {isDark ? '// SYSTEM_INITIALIZED' : '$ AI_SYSTEM'}
            </span>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
              <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-[#00ffa3]/50' : 'bg-[#2d5a27]/50'}`}></div>
            </div>
          </div>

          <h1 className={`font-headline text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-[#1a3d16]'}`}>
            <TypingText text="Elevate Your Career with " />
            <span className={`italic underline decoration-4 underline-offset-8 ${isDark ? 'text-white decoration-primary/40' : 'text-[#1a3d16] decoration-[#2d5a27]/40'}`}>AI</span>
          </h1>
        </motion.div>

        <motion.p 
          className={`font-body text-base md:text-lg max-w-2xl mb-10 leading-relaxed transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {isDark 
            ? "Professional technical interview practice powered by advanced AI. Get instant feedback, analyze your narrative, and land your dream job."
            : "Personalized coaching powered by the Astra AI Engine. Refine your narrative, analyze your resume, and practice with real-time feedback."}
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.button 
            onClick={onStartTrial}
            className={isDark 
              ? "w-full sm:w-auto bg-transparent text-white border border-slate-700 px-10 py-4 font-mono uppercase tracking-[2px] font-bold hover:bg-primary hover:text-black hover:border-primary transition-all"
              : "w-full sm:w-auto bg-[#2d5a27] text-white px-10 py-5 rounded-[8px] font-headline font-extrabold text-xl shadow-xl shadow-[#2d5a27]/20 hover:bg-[#1a3d16] transition-all"}
            style={isDark ? { borderRadius: '2px' } : {}}
            whileHover={isDark 
              ? { scale: 1.02, boxShadow: "0 0 20px rgba(0,255,163,0.3)" }
              : { scale: 1.05, y: -4, boxShadow: "0 25px 30px -5px rgba(45, 90, 39, 0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            {isDark ? "> INITIALIZE_INTERVIEW" : "Start Interview"}
          </motion.button>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            { label: 'Interviews Conducted', value: 500, suffix: 'k+' },
            { label: 'Success Rate', value: 92, suffix: '%' },
            { label: 'Roles Available', value: 120, suffix: '+' },
            { label: 'Active Users', value: 50, suffix: 'k+' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className={`text-center p-4 rounded-2xl transition-colors duration-300 ${isDark ? 'hover:bg-primary/5' : 'hover:bg-slate-50'}`}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className={`text-3xl md:text-4xl font-headline font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-[#2d5a27]'}`}>
                <StatCounter end={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Product Preview */}
        <motion.div 
          className="relative w-full max-w-5xl group hidden md:block"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="absolute -inset-4 signature-glow opacity-10 blur-3xl rounded-[2rem] group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(45,90,39,0.15)] border border-white/10 dark:border-white/5 glass-panel backdrop-blur-md">
            <div className="aspect-video flex items-center justify-center relative overflow-hidden bg-black">
              <img 
              src={isDark ? "/dark_backgroun_interviewer.png" : "/light_backgroun_interviewer.png"} 
                alt="Astra AI Interview" 
                className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105"
                style={{ 
                  filter: 'contrast(1.05) brightness(1.1) saturate(1.1)',
                }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            </div>

            {/* AI Floating Overlay */}
            <motion.div 
              className="absolute top-8 right-8 glass-panel p-6 rounded-xl border border-white/20 shadow-xl max-w-xs text-left"
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 0.5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'signature-glow' : 'bg-[#2d5a27]'}`}>
                  <span className="material-symbols-outlined text-white" 
                        style={{fontVariationSettings: "'FILL' 1"}}>
                    analytics
                  </span>
                </div>
                <div>
                  <p className={`text-[10px] uppercase tracking-wider font-bold ${isDark ? 'text-primary' : 'text-[#2d5a27]'}`}>
                    Live Insight
                  </p>
                  <p className={`font-headline font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
                    Confidence Score
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-[#e8f0e0] rounded-full overflow-hidden mb-2">
                <motion.div 
                  className={`h-full ${isDark ? 'signature-glow' : 'bg-[#2d5a27]'}`}
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">
                "Your pacing is excellent. Try to elaborate more on the technical challenges."
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
