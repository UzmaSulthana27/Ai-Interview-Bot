import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import InteractiveCard, { InteractiveCardsGrid } from '../components/common/InteractiveCard';
import apiService from '../api/apiService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    hoursSpent: 0,
    upcomingInterviews: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await apiService.getStats(userId);
      const data = response.data;
      setStats({
        totalInterviews: data.totalSessions || 0,
        averageScore: data.avgScore || 0,
        hoursSpent: (data.totalSessions || 0) * 0.5, // Mocking 30 mins per session
        upcomingInterviews: []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const StatCard = ({ icon, label, value, color = "primary", index = 0 }) => {
    const motionValue = useMotionValue(0);
    const displayValue = useTransform(motionValue, Math.round);

    useEffect(() => {
      const numValue = parseInt(value) || 0;
      animate(motionValue, numValue, { duration: 2, delay: index * 0.1 });
    }, [value, index, motionValue]);

    return (
      <motion.div 
        className={`relative bg-white rounded-2xl p-6 border transition-all duration-300 group overflow-hidden shadow-sm ${isDark ? 'dark:bg-[#000000] dark:border-[#004d38]' : 'border-[#c8d5b9]'}`}
        style={isDark ? { borderRadius: '4px' } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -8, boxShadow: isDark ? "0 20px 40px rgba(74,222,128,0.15)" : "0 20px 40px rgba(45,90,39,0.15)" }}
      >
        {/* Animated background gradient */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br transition-all duration-300 ${isDark ? 'from-[#0d0d0d] to-[#004d38]/20 group-hover:from-[#004d38]/40 group-hover:to-[#00ffa3]/10' : 'from-[#2d5a27]/0 to-[#2d5a27]/0 group-hover:from-[#2d5a27]/5 group-hover:to-[#2d5a27]/10'}`}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Icon container with glow */}
        <motion.div 
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative transition-colors duration-300 ${isDark ? 'bg-[#002e26]' : 'bg-[#002e26]'}`}
          style={isDark ? { borderRadius: '4px' } : {}}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div 
            className={`absolute inset-0 rounded-xl blur-lg transition-all ${isDark ? 'bg-[#00ffa3]/20 group-hover:bg-[#00ffa3]/40' : 'bg-[#2d5a27]/20 group-hover:bg-[#2d5a27]/40'}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <span className={`material-symbols-outlined relative z-10 ${isDark ? 'text-[#00ffa3]' : 'text-[#2d5a27]'}`}
                style={{fontVariationSettings: "'FILL' 1"}}>
            {icon}
          </span>
        </motion.div>

        <p className={`text-sm mb-1 transition-colors duration-300 relative z-10 ${isDark ? 'text-[#006b4a] uppercase font-mono' : 'text-slate-600'}`}>
          {label}
        </p>

        {/* Animated value with glow */}
        <div className="relative">
          <motion.p 
            className={`font-headline text-3xl font-bold transition-colors duration-300 relative z-10 ${isDark ? 'text-[#00ffa3] font-mono' : 'text-[#1a3d16]'}`}
          >
            {typeof value === 'string' && value.includes('%') ? value : <motion.span>{displayValue}</motion.span>}
          </motion.p>
          <motion.div 
            className={`absolute inset-0 text-3xl font-bold blur-sm ${isDark ? 'text-[#00ffa3]/50' : 'text-[#2d5a27]/30'}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {typeof value === 'string' && value.includes('%') ? value : <motion.span>{displayValue}</motion.span>}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className={`bg-[#f5f5f0] min-h-screen transition-colors duration-300 ${isDark ? 'dark:bg-[#000000]' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <TopNavBar />
      
      <main className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className={`font-headline text-3xl md:text-4xl font-extrabold mb-2 transition-colors duration-300 ${isDark ? 'text-[#00ffa3] font-mono uppercase tracking-wider' : 'text-[#1a3d16]'}`}>
              {isDark ? '> Welcome back_ 👋' : 'Welcome back! 👋'}
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? 'text-[#006b4a] font-mono' : 'text-slate-600'}`}>
              Here's your interview preparation progress
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <StatCard 
                icon="psychology" 
                label="Total Interviews" 
                value={stats.totalInterviews}
                color="primary"
                index={0}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard 
                icon="trending_up" 
                label="Average Score" 
                value={`${stats.averageScore}%`}
                color="secondary"
                index={1}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard 
                icon="schedule" 
                label="Hours Spent" 
                value={stats.hoursSpent}
                color="tertiary"
                index={2}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard 
                icon="emoji_events" 
                label="Streak" 
                value="7 days"
                color="primary"
                index={3}
              />
            </motion.div>
          </motion.div>

          {/* Quick Actions with Interactive Cards */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.h2
              className={`text-2xl font-bold font-headline mb-6 transition-colors duration-300 ${isDark ? 'text-[#00ffa3] font-mono uppercase tracking-widest' : 'text-[#1a3d16]'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {isDark ? '> Quick Actions' : 'Quick Actions'}
            </motion.h2>

            <div className="flex flex-col gap-4 max-w-3xl">
              {[
                {
                  variant: 'indigo',
                  title: 'Start Interview',
                  subtitle: 'Practice Mock Session',
                  icon: 'video_chat',
                  onClick: () => navigate('/interviews')
                },
                {
                  variant: 'blue',
                  title: 'Upload Resume',
                  subtitle: 'Get Personalized Questions',
                  icon: 'description',
                  onClick: () => navigate('/resume')
                },
                {
                  variant: 'cyan',
                  title: 'View Analytics',
                  subtitle: 'Track Progress',
                  icon: 'trending_up',
                  onClick: () => navigate('/analytics')
                }
              ].map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <InteractiveCard {...action} />
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-sm text-slate-600 dark:text-slate-400 mt-6 transition-colors duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              💡 Hover over any card to see interactive effects
            </motion.p>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            className={`bg-white rounded-2xl p-8 transition-all duration-300 border shadow-sm ${isDark ? 'dark:bg-[#000000] dark:border-[#004d38]' : 'border-[#c8d5b9]'}`}
            style={isDark ? { borderRadius: '4px' } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.h3 
              className={`font-headline text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-[#00ffa3] font-mono uppercase tracking-widest' : 'text-[#1a3d16]'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {isDark ? '> Recent Activity' : 'Recent Activity'}
            </motion.h3>
            <div className="space-y-4">
              {stats.upcomingInterviews.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {stats.upcomingInterviews.map((interview, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 group cursor-pointer ${isDark ? 'bg-[#000000] border border-[#004d38] hover:border-[#00ffa3]' : 'bg-slate-50 hover:bg-slate-100'}`}
                      style={isDark ? { borderRadius: '3px' } : {}}
                      whileHover={{ x: 8, boxShadow: isDark ? "0 4px 12px rgba(74,222,128,0.1)" : "0 4px 12px rgba(0,0,0,0.08)" }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className={`w-10 h-10 flex items-center justify-center ${isDark ? 'bg-[#002e26] border border-[#004d38]' : 'bg-gradient-to-br from-[#1a3d16] to-[#2d5a27] rounded-full'}`}
                          style={isDark ? { borderRadius: '2px' } : {}}
                          whileHover={{ scale: 1.15 }}
                          animate={isDark ? { boxShadow: ["0 0 0 0 rgba(74,222,128,0.7)", "0 0 0 10px rgba(74,222,128,0)"] } : { boxShadow: ["0 0 0 0 rgba(45,90,39,0.7)", "0 0 0 10px rgba(45,90,39,0)"] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className={`material-symbols-outlined text-sm ${isDark ? 'text-[#00ffa3]' : 'text-white'}`}>
                            video_chat
                          </span>
                        </motion.div>
                        <div>
                          <p className={`font-headline font-bold transition-colors duration-300 ${isDark ? 'text-[#00ffa3] group-hover:text-white font-mono' : 'text-[#1a3d16] group-hover:text-[#2d5a27]'}`}>{interview.title}</p>
                          <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-[#006b4a] font-mono' : 'text-slate-600'}`}>{interview.date}</p>
                        </div>
                      </div>
                      <motion.span 
                        className={`px-3 py-1 text-xs font-bold transition-colors duration-300 ${
                          interview.status === 'completed' 
                            ? (isDark ? 'bg-[#004d38] text-[#00ffa3] border border-[#00ffa3]' : 'bg-[#002e26] text-[#2d5a27]') 
                            : (isDark ? 'bg-[#1a1a00] text-[#ffbd2e] border border-[#ffbd2e]' : 'bg-[#e8f0e0] text-[#2d5a27]')
                        }`}
                        style={isDark ? { borderRadius: '2px', fontFamily: "'Courier New', monospace" } : { borderRadius: '9999px' }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {isDark ? interview.status.toUpperCase() : interview.status}
                      </motion.span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <>
                  <motion.div
                  className={`relative overflow-hidden border flex items-center justify-center p-8 md:p-12 group ${isDark ? 'bg-[#000000] border-[#004d38]' : 'bg-[#002e26] border-[#c8d5b9]'}`}
                  style={isDark ? { borderRadius: '6px' } : { borderRadius: '2.5rem' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Full-bleed blurred background image with hover reveal */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/dashboard_activity.png" 
                      alt="Background" 
                      className="w-full h-full object-cover opacity-40 transition-all duration-700 group-hover:opacity-80 group-hover:blur-none"
                      style={isDark ? { 
                        filter: 'blur(8px) saturate(0.5) hue-rotate(120deg) contrast(1.5)',
                        objectPosition: 'center 60%'
                      } : { 
                        filter: 'blur(8px) saturate(1.2) hue-rotate(50deg)',
                        objectPosition: 'center 60%'
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 group-hover:opacity-40 ${isDark ? 'from-[#0d0d0d] via-[#0d0d0d]/70 to-transparent' : 'from-[#1a3d16] via-[#1a3d16]/70 to-transparent'}`}></div>
                  </div>

                  <div className="relative z-10 text-center max-w-lg">
                    <h3 className={`font-headline text-3xl md:text-4xl font-extrabold mb-4 ${isDark ? 'text-[#00ffa3] font-mono uppercase' : 'text-white'}`}>
                      {isDark ? '> Ready to ace interviews?' : 'Ready to ace your interviews?'}
                    </h3>
                    <p className={`font-body mb-8 text-lg max-w-md mx-auto ${isDark ? 'text-[#006b4a] font-mono' : 'text-white/90'}`}>
                      Start your first AI-powered mock interview and get personalized feedback to improve your interview skills.
                    </p>

                    <motion.button
                      onClick={() => navigate('/interviews')}
                      className={`px-10 py-4 font-headline font-bold text-lg shadow-xl flex items-center gap-2 mx-auto ${isDark ? 'bg-[#00ffa3] text-[#000000] border-none font-mono uppercase tracking-[2px]' : 'bg-[#2d5a27] text-white hover:shadow-primary/40 rounded-xl'}`}
                      style={isDark ? { borderRadius: '3px' } : {}}
                      whileHover={isDark ? { scale: 1.05, y: -2, boxShadow: '0 0 28px rgba(74,222,128,0.7)' } : { scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isDark ? 'START_INTERVIEW()' : 'Start Your First Interview'}
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </motion.button>
                  </div>
                </motion.div>

                  {/* Animated stats cards */}
                  <motion.div 
                    className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5, staggerChildren: 0.1 }}
                  >
                    {[
                      { label: "Questions", value: "1000+" },
                      { label: "Users", value: "5000+" },
                      { label: "Success Rate", value: "95%" }
                    ].map((stat, idx) => (
                      <motion.div 
                        key={idx}
                        className={`p-3 transition-colors duration-300 ${isDark ? 'bg-[#000000] border border-[#004d38] hover:bg-[#002e26] hover:border-[#00ffa3]' : 'bg-[#e8f0e0] border border-[#c8d5b9] rounded-lg'}`}
                        style={isDark ? { borderRadius: '3px' } : {}}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                      >
                        <motion.p 
                          className={`text-sm font-bold ${isDark ? 'text-[#00ffa3] font-mono' : 'text-[#2d5a27]'}`}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                        >
                          {stat.value}
                        </motion.p>
                        <p className={`text-xs ${isDark ? 'text-[#006b4a] font-mono' : 'text-slate-600'}`}>{isDark ? stat.label.toUpperCase() : stat.label}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default DashboardPage;
