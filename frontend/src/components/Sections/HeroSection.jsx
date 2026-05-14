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
          className="inline-block w-2 h-8 ml-1 bg-[#00ffa3] align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ boxShadow: '0 0 8px #00ffa3' }}
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
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 cursor-pointer ${isDark ? 'bg-[var(--bg-badge)] border border-[#00ffa3] text-[#00ffa3] drop-shadow-[0_0_6px_#00ffa3]' : 'bg-[#e8f0e0] text-[#2d5a27]'}`}
          style={isDark ? { borderRadius: '2px' } : { borderRadius: '20px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={isDark ? { scale: 1.05, boxShadow: '0 0 12px rgba(74,222,128,0.4)' } : { scale: 1.05, backgroundColor: 'rgba(200, 213, 185, 0.2)' }}
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

        <motion.h1 
          className={`font-headline text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl transition-colors duration-300 ${isDark ? 'text-[var(--text-heading)] drop-shadow-[0_0_6px_rgba(74,222,128,0.25)]' : 'text-[#1a3d16]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {isDark ? (
            <>
              <TypingText text="Master Your Next " />
              <motion.span 
                className="italic inline-block text-[var(--text-secondary)] drop-shadow-[0_0_12px_#00ffa3]"
                whileHover={{ scale: 1.05, rotate: -1 }}
              >
                <TypingText text="Interview" delay={1} />
              </motion.span>
              <TypingText text=" with AI" delay={2} />
            </>
          ) : (
            <>
              Master Your Next <motion.span 
                className="italic inline-block text-[#2d5a27]"
                whileHover={{ scale: 1.05, rotate: -1 }}
              >Interview</motion.span> with AI
            </>
          )}
        </motion.h1>

        <motion.p 
          className={`font-body text-base md:text-lg max-w-2xl mb-10 leading-relaxed transition-colors duration-300 ${isDark ? 'font-mono text-[#006b4a]' : 'text-slate-600'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {isDark 
            ? "$ practice --unlimited | $ feedback --instant"
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
              ? "w-full sm:w-auto bg-[#00ffa3] text-[#000000] border-none px-10 py-5 font-mono uppercase tracking-[2px] shadow-[0_0_12px_rgba(74,222,128,0.3)] font-bold"
              : "w-full sm:w-auto bg-[#2d5a27] text-[#f5f5f0] px-10 py-5 rounded-[8px] font-headline font-extrabold text-xl shadow-xl shadow-green-500/20"}
            style={isDark ? { borderRadius: '3px' } : {}}
            whileHover={isDark 
              ? { scale: 1.05, y: -1, boxShadow: "0 0 28px rgba(74,222,128,0.7)" }
              : { scale: 1.05, y: -4, boxShadow: "0 25px 30px -5px rgba(45, 90, 39, 0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            {isDark ? "$ START --INTERVIEW" : "Start Interview"}
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
              className="text-center p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-3xl md:text-4xl font-headline font-bold text-[#1a3d16] dark:text-[#00ffa3] mb-1">
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
            <div className="aspect-video flex items-center justify-center relative overflow-hidden bg-slate-900">
              <img 
                src="/dark_backgroun_interviewer.png" 
                alt="Astra AI Interview" 
                className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105"
                style={{ 
                  filter: 'contrast(1.05) brightness(1.1) saturate(1.1)',
                }}
              />
              <div className="absolute inset-0 bg-[#020617]/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
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
                <div className="w-10 h-10 rounded-full signature-glow flex items-center justify-center">
                  <span className="material-symbols-outlined text-white" 
                        style={{fontVariationSettings: "'FILL' 1"}}>
                    analytics
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#2d5a27]">
                    Live Insight
                  </p>
                  <p className="font-headline font-bold text-[#1a3d16] dark:text-[#00ffa3] transition-colors duration-300">
                    Confidence Score
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-[#e8f0e0] rounded-full overflow-hidden mb-2">
                <motion.div 
                  className="h-full signature-glow"
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
