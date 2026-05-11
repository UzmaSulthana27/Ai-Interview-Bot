import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Sync Your Identity",
      description: "Upload your resume and the target job description. Astra AI builds a custom semantic map of your professional profile in seconds."
    },
    {
      number: 2,
      title: "Conduct the Session",
      description: "Engage in a voice or video-based mock interview. Our AI models analyze not just what you say, but how you communicate confidence and clarity."
    },
    {
      number: 3,
      title: "Optimize & Refine",
      description: "Receive a deep-dive analytics report highlighting your strengths and specific phrases to improve. Repeat sessions until you achieve your peak score."
    }
  ];

  return (
    <section id="how-it-works" className="px-4 md:px-8 py-32 overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          {/* Sticky Title */}
          <motion.div 
            className="md:w-1/3 md:sticky md:top-32 w-full"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-slate-100 transition-colors duration-300">
              The Astra AI Architecture
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 transition-colors duration-300 leading-relaxed">
              Three steps to professional mastery. We've simplified the complexity 
              of AI into a focused journey.
            </p>
            <motion.button 
              className="flex items-center gap-2 text-[#2563eb] dark:text-[#60a5fa] font-bold group cursor-pointer w-full md:w-auto"
              whileHover={{ x: 5 }}
            >
              Explore the Platform
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </motion.button>
          </motion.div>

          {/* Steps */}
          <div className="w-full md:w-2/3 flex flex-col gap-8 md:space-y-12 h-full z-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-[23px] top-10 bottom-10 w-[2px] bg-slate-100 dark:bg-slate-800 z-0 overflow-hidden">
               <motion.div 
                className="w-full h-full bg-indigo-500 origin-top"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
               />
            </div>

            {steps.map((step, idx) => (
              <motion.div 
                key={step.number} 
                className="flex gap-4 md:gap-8 group glass-panel p-6 md:p-8 rounded-2xl transition-all duration-300 relative z-10 bg-white/80 dark:bg-slate-900/80 border border-transparent dark:border-white/5 w-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.2)', boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
              >
                <motion.div 
                  className="flex-none w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#2563eb] dark:border-blue-500 text-[#2563eb] dark:text-blue-500 font-headline font-extrabold flex items-center justify-center text-lg md:text-xl transition-all shadow-lg bg-white dark:bg-slate-900"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                >
                  {step.number}
                </motion.div>
                <div className="pt-1 md:pt-2 flex-1">
                  <h4 className="font-headline text-xl md:text-2xl font-bold mb-2 md:mb-3 text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h4>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;