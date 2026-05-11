import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMotionValue, useTransform, animate } from 'framer-motion';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import InteractiveCard, { InteractiveCardsGrid } from '../components/common/InteractiveCard';
import apiService from '../api/apiService';

const DashboardPage = () => {
  const navigate = useNavigate();
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
        className="relative bg-white dark:bg-[#0a1128] rounded-2xl p-6 border border-slate-200 dark:border-white/5 transition-all duration-300 group overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      >
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Icon container with glow */}
        <motion.div 
          className={`w-12 h-12 bg-indigo-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 relative transition-colors duration-300`}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div 
            className="absolute inset-0 rounded-xl bg-indigo-400/20 blur-lg group-hover:bg-indigo-400/40 transition-all"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <span className={`material-symbols-outlined text-[#2563eb] dark:text-[#60a5fa] relative z-10`}
                style={{fontVariationSettings: "'FILL' 1"}}>
            {icon}
          </span>
        </motion.div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 transition-colors duration-300 relative z-10">
          {label}
        </p>

        {/* Animated value with glow */}
        <div className="relative">
          <motion.p 
            className="font-headline text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300 relative z-10"
          >
            {typeof value === 'string' && value.includes('%') ? value : <motion.span>{displayValue}</motion.span>}
          </motion.p>
          <motion.div 
            className="absolute inset-0 text-3xl font-bold text-indigo-400/30 blur-sm"
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
      className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <TopNavBar />
      
      <main className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold mb-2 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              Welcome back! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
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
              className="text-2xl font-bold font-headline text-slate-900 dark:text-slate-100 mb-6 transition-colors duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Quick Actions
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
            className="bg-white dark:bg-[#0a1128] rounded-2xl p-8 transition-all duration-300 border border-slate-200 dark:border-white/5 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.h3 
              className="font-headline text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100 transition-colors duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Recent Activity
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
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-300 group cursor-pointer"
                      whileHover={{ x: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
                          whileHover={{ scale: 1.15 }}
                          animate={{ boxShadow: ["0 0 0 0 rgba(99, 102, 241, 0.7)", "0 0 0 10px rgba(99, 102, 241, 0)"] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="material-symbols-outlined text-white text-sm">
                            video_chat
                          </span>
                        </motion.div>
                        <div>
                          <p className="font-headline font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300 group-hover:text-[#2563eb] dark:group-hover:text-[#4ade80]">{interview.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">{interview.date}</p>
                        </div>
                      </div>
                      <motion.span 
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors duration-300 ${
                          interview.status === 'completed' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {interview.status}
                      </motion.span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <>
                  <motion.div
                  className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0a1128] min-h-[400px] flex items-center justify-center p-8 md:p-12 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Full-bleed blurred background image with hover reveal */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/dashboard_activity.jpg" 
                      alt="Background" 
                      className="w-full h-full object-cover opacity-40 transition-all duration-700 group-hover:opacity-80 group-hover:blur-none"
                      style={{ 
                        filter: 'blur(8px) saturate(1.2) hue-rotate(50deg)',
                        objectPosition: 'center 25%'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-[#0a1128]/70 to-transparent transition-opacity duration-700 group-hover:opacity-40"></div>
                  </div>

                  <div className="relative z-10 text-center max-w-lg">
                    <h3 className="font-headline text-3xl md:text-4xl font-extrabold mb-4 text-white">
                      Ready to ace your interviews?
                    </h3>
                    <p className="font-body text-slate-300 mb-8 text-lg max-w-md mx-auto">
                      Start your first AI-powered mock interview and get personalized feedback to improve your interview skills.
                    </p>

                    <motion.button
                      onClick={() => navigate('/interviews')}
                      className="signature-glow text-white px-10 py-4 rounded-xl font-headline font-bold text-lg shadow-xl hover:shadow-primary/40 flex items-center gap-2 mx-auto"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Your First Interview
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
                        className="p-3 bg-indigo-50 dark:bg-blue-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-blue-900/40 transition-colors duration-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                      >
                        <motion.p 
                          className="text-sm font-bold text-[#2563eb] dark:text-[#60a5fa]"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                        >
                          {stat.value}
                        </motion.p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
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