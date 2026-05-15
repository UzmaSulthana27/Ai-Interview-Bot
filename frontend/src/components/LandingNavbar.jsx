import React from 'react';

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
    <section className="px-4 md:px-8 py-32">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          {/* Sticky Title */}
          <div className="md:w-1/3 md:sticky md:top-32 w-full">
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-6 tracking-tight text-white dark:text-[#4ade80] transition-colors duration-300">
              The Astra AI Architecture
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 transition-colors duration-300">
              Three steps to professional mastery. We've simplified the complexity 
              of AI into a focused journey.
            </p>
            <button className="flex items-center gap-2 text-primary font-bold group cursor-pointer w-full md:w-auto">
              Explore the Platform
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Steps */}
          <div className="w-full md:w-2/3 flex flex-col gap-8 md:space-y-12 h-full z-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-[23px] top-10 bottom-10 w-[2px] bg-indigo-500/20 z-0 overflow-hidden">
               <div className="w-full h-full bg-indigo-500 animate-[progressFill_1s_ease_forwards_0.5s]"></div>
            </div>

            {steps.map((step, idx) => (
              <div 
                key={step.number} 
                className="flex gap-4 md:gap-8 group glass-panel p-6 rounded-2xl transition-all duration-300 relative z-10 bg-white/80 dark:bg-[#0d0d0d]/80 opacity-0 w-full"
                style={{ animation: `fadeSlideUp 0.6s ease forwards ${idx * 0.2}s` }}
              >
                <div className="flex-none w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary-fixed text-primary font-headline font-extrabold flex items-center justify-center text-lg md:text-xl transition-all shadow-lg bg-white dark:bg-[#0d0d0d] group-hover:animate-pulse-soft">
                  {step.number}
                </div>
                <div className="pt-1 md:pt-2 flex-1">
                  <h4 className="font-headline text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white dark:text-[#4ade80]">
                    {step.title}
                  </h4>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;