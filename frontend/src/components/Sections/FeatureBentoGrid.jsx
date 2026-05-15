import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FeatureBentoGrid = () => {
  const { isDark } = useTheme();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="features" className="px-4 md:px-8 py-24 bg-[#f5f5f0] dark:bg-[#000000] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="font-headline text-3xl md:text-4xl font-bold mb-4 text-white transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
          >
            Sophisticated Intelligence
          </motion.h2>
          <p className="font-body text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Tools built for the modern digital atelier for talent.
          </p>
        </motion.div>

        {/* mobile flex-col stack, md grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[600px] relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          
          {/* Main Feature: Resume Analysis */}
          <motion.div 
            className="md:col-span-8 glass-panel rounded-2xl p-8 flex flex-col justify-between group overflow-hidden relative border border-transparent dark:border-white/5 w-full"
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              borderColor: isDark ? 'rgba(0, 255, 163, 0.4)' : 'rgba(45, 90, 39, 0.5)',
              boxShadow: isDark ? "0 25px 50px -12px rgba(0, 255, 163, 0.15)" : "0 25px 50px -12px rgba(45, 90, 39, 0.08)"
            }}
          >
            <div className="relative z-10">
              <motion.div 
                className="w-12 h-12 bg-[#e8f0e0] dark:bg-[#000000]/40 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <span className="material-symbols-outlined text-primary dark:text-[#c8e6c0]" 
                      style={{fontVariationSettings: "'FILL' 1"}}>
                  description
                </span>
              </motion.div>
              <h3 className="font-headline text-2xl font-bold mb-3 text-white transition-colors duration-300">
                Resume Analysis
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md transition-colors duration-300">
                Our AI parses your experience to generate hyper-relevant interview 
                questions tailored to your specific career trajectory.
              </p>
            </div>
            <div className="mt-8 relative z-10 hidden md:block">
              <motion.div 
                className="rounded-xl bg-white dark:bg-[#050505] p-6 h-64 border border-slate-800 flex flex-col gap-4 overflow-hidden relative group/inner shadow-inner"
                whileHover={{ y: -5, borderColor: isDark ? '#1e293b' : '#2d5a27' }}
              >
                {/* Active Scan Line */}
                <motion.div 
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-20"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="flex justify-between items-center mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-primary dark:text-slate-400">description</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-tighter">resume_v2.pdf</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/50"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {['REACT_JS', 'NODE_JS', 'PYTHON', 'SYSTEM_DESIGN'].map((skill, i) => (
                      <motion.span 
                        key={i}
                        className="px-2 py-1 bg-[#e8f0e0] dark:bg-slate-800/50 text-primary dark:text-slate-300 text-[9px] font-mono rounded border border-slate-800 dark:border-slate-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                  <div className="h-[1px] w-full bg-slate-100 dark:bg-[#00ffa3]/10"></div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">MATCH_CONFIDENCE</span>
                      <span className="text-[9px] text-white font-mono">94.2%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-[#002e26] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary dark:bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: '94.2%' }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-3 rounded-lg bg-[#e8f0e0]/50 dark:bg-slate-800/20 border border-slate-800">
                   <p className="text-[9px] font-mono text-primary dark:text-slate-300 flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
                    {isDark ? 'STATUS: EXTRACTING_SEMANTIC_NODES...' : 'Analyzing professional history...'}
                   </p>
                </div>
              </motion.div>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mb-32"></div>
          </motion.div>

          {/* Side Feature: Mock Interviews */}
          <motion.div 
            className="md:col-span-4 glass-panel rounded-2xl p-8 flex flex-col justify-center text-center group w-full"
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              borderColor: isDark ? 'rgba(0, 255, 163, 0.6)' : 'rgba(45, 90, 39, 1)',
              boxShadow: isDark ? "0 25px 50px -12px rgba(0, 255, 163, 0.2)" : "0 25px 50px -12px rgba(45, 90, 39, 0.08)"
            }}
          >
            <motion.div 
              className="mx-auto w-16 h-16 bg-[#e8f0e0] dark:bg-[#050505] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/20 border border-transparent dark:border-slate-800"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="material-symbols-outlined text-white text-3xl">
                video_chat
              </span>
            </motion.div>
            <h3 className="font-headline text-2xl font-bold mb-3 text-white transition-colors duration-300">
              Mock Interviews
            </h3>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300 relative z-10">
              Practice in a stress-free environment with our empathetic AI interviewer 
              that adapts to your responses.
            </p>
            <div className="mt-6 h-32 rounded-xl overflow-hidden relative border border-white/5 shadow-inner bg-black">
               <img 
                  src={isDark ? "/dark_backgroun_interviewer.png" : "/ai_interview_man_robot.jpg"} 
                  alt="Mock Interview" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
               />
                {!isDark && <div className="absolute inset-0 bg-gradient-to-t from-[#2d5a27]/40 to-transparent" />}
            </div>
          </motion.div>

          {/* Bottom Features */}
          <motion.div 
            className="md:col-span-5 glass-panel rounded-2xl p-8 flex items-center gap-6 group w-full"
            variants={itemVariants}
            whileHover={{ 
              y: -8,
              borderColor: isDark ? 'rgba(0, 255, 163, 0.4)' : 'transparent',
              boxShadow: isDark ? "0 25px 50px -12px rgba(0, 255, 163, 0.15)" : "0 25px 50px -12px rgba(45, 90, 39, 0.08)"
            }}
          >
            <motion.div 
              className="shrink-0 w-14 h-14 bg-[#e8f0e0] dark:bg-[#000000] rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <span className="material-symbols-outlined text-primary dark:text-[#c8e6c0]" 
                    style={{fontVariationSettings: "'FILL' 1"}}>
                graphic_eq
              </span>
            </motion.div>
            <div>
              <h3 className="font-headline text-xl font-bold text-white mb-1 transition-colors duration-300">
                Real-time Feedback
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                Instant analysis of your tone, pace, and content while you speak.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="md:col-span-7 glass-panel dark:bg-[#050505] text-white rounded-2xl p-8 flex items-center justify-between overflow-hidden relative group shadow-xl border border-white/5 w-full"
            variants={itemVariants}
            whileHover={{ 
              y: -8,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)"
            }}
          >
            <div className="relative z-10 origin-left">
              <h3 className="font-headline text-xl font-bold mb-1">
                Predictive Analytics
              </h3>
              <p className="text-sm opacity-90 max-w-xs">
                Know exactly which areas need improvement before the real interview.
              </p>
            </div>
            <div className="relative z-10 flex gap-1 items-end">
              {[16, 24, 32, 20, 28].map((height, i) => (
                <motion.div 
                  key={i}
                  className="w-2 bg-primary dark:bg-white rounded-full"
                  animate={{ height: [height * 2, height * 3, height * 2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full blur-3xl"></div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default FeatureBentoGrid;
