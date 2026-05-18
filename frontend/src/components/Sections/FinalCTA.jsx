import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FinalCTA = ({ onStartTrial }) => {
  const { isDark } = useTheme();
  return (
    <section className="px-4 md:px-8 py-24 relative z-10">
      <motion.div 
        className={`max-w-7xl mx-auto rounded-[3rem] p-10 md:p-16 lg:p-20 text-left overflow-hidden relative shadow-2xl transition-colors duration-500 ${isDark ? 'bg-[#000000] border border-[#1e293b] text-slate-100 shadow-black/50' : 'bg-white border border-[#c8d5b9] text-[#1a3d16] shadow-[#2d5a27]/10'}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative Blobs */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse ${isDark ? 'bg-white/10' : 'bg-[#2d5a27]/5'}`}></div>
        <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] -ml-32 -mb-32 ${isDark ? 'bg-[#00ffa3]/20' : 'bg-[#2d5a27]/5'}`}></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:max-w-2xl">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={`font-headline text-4xl md:text-6xl font-extrabold mb-6 leading-tight ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
                Ready to secure your <span className={`underline decoration-4 underline-offset-8 ${isDark ? 'text-white decoration-primary' : 'text-[#2d5a27] decoration-[#2d5a27]'}`}>dream role?</span>
              </h2>
              <p className={`font-body text-lg md:text-xl mb-10 max-w-xl ${isDark ? 'opacity-80' : 'text-[#4a6741]'}`}>
                Join 10,000+ professionals using Astra AI to land offers 
                at top-tier tech companies. The future of interviewing is here.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                onClick={onStartTrial}
                className={`px-10 py-5 rounded-2xl font-headline font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-[#00ffa3] text-[#000000] hover:bg-[#00e691]' : 'bg-[#2d5a27] text-white hover:bg-[#1a3d16] shadow-[#2d5a27]/20'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Your Free Trial
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </motion.button>
              <motion.button 
                className={`backdrop-blur-md border px-10 py-5 rounded-2xl font-headline font-bold text-lg transition-all ${isDark ? 'bg-transparent border-[#1e293b] text-slate-400 hover:border-[#00ffa3] hover:text-[#00ffa3]' : 'bg-transparent border-[#2d5a27] text-[#2d5a27] hover:bg-[#2d5a27]/5'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                Talk to an Expert
              </motion.button>
            </motion.div>
          </div>

          <motion.div 
            className="relative lg:w-1/3 flex justify-center lg:justify-end"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="relative w-80 h-80 md:w-96 md:h-96"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Glowing ring behind image */}
              <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-4 border border-white/10 rounded-full animate-reverse-spin-slow"></div>
              
              <img 
                src={isDark ? "/cta_dark.png" : "/cta_light.png"} 
                alt="Astra AI Platform" 
                className="w-full h-full object-contain relative z-20 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
