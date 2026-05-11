import React from 'react';
import { motion } from 'framer-motion';

const FeatureBentoGrid = () => {
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
    <section id="features" className="px-4 md:px-8 py-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="font-headline text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100 transition-colors duration-300"
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
              borderColor: 'rgba(37, 99, 235, 0.5)',
              boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.08)"
            }}
          >
            <div className="relative z-10">
              <motion.div 
                className="w-12 h-12 bg-indigo-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <span className="material-symbols-outlined text-[#2563eb] dark:text-[#60a5fa]" 
                      style={{fontVariationSettings: "'FILL' 1"}}>
                  description
                </span>
              </motion.div>
              <h3 className="font-headline text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100 transition-colors duration-300">
                Resume Analysis
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md transition-colors duration-300">
                Our AI parses your experience to generate hyper-relevant interview 
                questions tailored to your specific career trajectory.
              </p>
            </div>
            <div className="mt-8 relative z-10 hidden md:block">
              <motion.div 
                className="rounded-xl bg-slate-900/50 p-6 h-64 border border-indigo-500/20 flex flex-col gap-4 overflow-hidden"
                whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.4)' }}
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded bg-indigo-500/20 shrink-0" />
                    <div className="h-2 bg-slate-700 rounded-full w-full" />
                    <div className="h-2 bg-slate-800 rounded-full w-24" />
                  </div>
                ))}
                <div className="mt-auto p-4 rounded-lg bg-blue-600/10 border border-blue-500/20">
                   <p className="text-[10px] font-mono text-blue-400">$ analyzing_career_trajectory...</p>
                </div>
              </motion.div>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mb-32"></div>
          </motion.div>

          {/* Side Feature: Mock Interviews */}
          <motion.div 
            className="md:col-span-4 glass-panel rounded-2xl p-8 flex flex-col justify-center text-center border-t-4 border-blue-600 group w-full"
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              borderColor: 'rgba(37, 99, 235, 1)',
              boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.08)"
            }}
          >
            <motion.div 
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="material-symbols-outlined text-white text-3xl">
                video_chat
              </span>
            </motion.div>
            <h3 className="font-headline text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              Mock Interviews
            </h3>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300 relative z-10">
              Practice in a stress-free environment with our empathetic AI interviewer 
              that adapts to your responses.
            </p>
            <div className="mt-6 h-32 rounded-xl overflow-hidden relative border border-white/5 shadow-inner">
               <img 
                  src="/ai_interview_man_robot.jpg" 
                  alt="Mock Interview" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
               />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
            </div>
          </motion.div>

          {/* Bottom Features */}
          <motion.div 
            className="md:col-span-5 glass-panel rounded-2xl p-8 flex items-center gap-6 group w-full"
            variants={itemVariants}
            whileHover={{ 
              y: -8,
              boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.08)"
            }}
          >
            <motion.div 
              className="shrink-0 w-14 h-14 bg-cyan-100 dark:bg-cyan-900 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400" 
                    style={{fontVariationSettings: "'FILL' 1"}}>
                graphic_eq
              </span>
            </motion.div>
            <div>
              <h3 className="font-headline text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 transition-colors duration-300">
                Real-time Feedback
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                Instant analysis of your tone, pace, and content while you speak.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="md:col-span-7 bg-[#0a1128] dark:bg-[#0a1128] text-white rounded-2xl p-8 flex items-center justify-between overflow-hidden relative group shadow-xl border border-white/5 w-full"
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
                  className="w-2 bg-white/60 rounded-full"
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