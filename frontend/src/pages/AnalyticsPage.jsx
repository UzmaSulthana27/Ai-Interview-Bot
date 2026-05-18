import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import apiService from '../api/apiService';

const AnalyticsPage = () => {
  const { isDark } = useTheme();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found in localStorage');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.getPerformanceMetrics(userId);
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#080808]' : 'bg-[#f5f5f0]'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-primary' : 'border-[#2d5a27]'}`}></div>
          <p className={`transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-[#2d5a27]'}`}>{isDark ? 'LOADING_ANALYTICS...' : 'Loading analytics...'}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-[#f5f5f0]'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <TopNavBar />
      
      <main className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className={`font-headline text-3xl md:text-4xl font-extrabold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
              Performance Analytics
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-[#4a6741]'}`}>
              Track your interview preparation progress and identify areas for improvement
            </p>
          </div>

          {/* Overall Score */}
          <Card padding="large" className={`mb-8 ${isDark ? 'bg-[#050505] border-slate-800 shadow-xl' : 'bg-white border-[#c8d5b9] shadow-md'}`}>
            <div className={`text-center ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
              <p className={`text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-[#4a6741]'}`}>
                Overall Performance Score
              </p>
              <p className="font-headline text-6xl font-extrabold mb-4">
                {metrics?.overallScore || 0}%
              </p>
              <p className={isDark ? 'text-slate-500' : 'text-[#4a6741]'}>
                Based on {metrics?.totalInterviews || 0} completed interviews
              </p>
            </div>
          </Card>

          {/* Skill Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card padding="large" className={isDark ? 'bg-[#050505] border-slate-800' : 'bg-white border-[#c8d5b9]'}>
              <h3 className={`font-headline text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
                Skills Breakdown
              </h3>
              <div className="space-y-4">
                {metrics?.skillScores?.map((skill, index) => (
                  <ProgressBar
                    key={index}
                    label={skill.name.toUpperCase()}
                    value={skill.score}
                    variant="primary"
                    showLabel
                  />
                ))}
              </div>
            </Card>

            <Card padding="large" className={isDark ? 'bg-[#0a0a0a] border-[#1e293b]' : 'bg-white border-[#c8d5b9]'}>
              <h3 className={`font-headline text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
                Interview Types
              </h3>
              <div className="space-y-4">
                {metrics?.interviewTypes?.map((type, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'bg-[#000000] border-slate-800 hover:border-primary hover:bg-primary/5' : 'bg-[#f0f7ec] border-[#c8d5b9] hover:border-[#2d5a27] hover:shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center shadow-lg ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-[#e8f0e0] rounded-full border border-[#c8d5b9]'}`}>
                        <span className={`material-symbols-outlined text-sm ${isDark ? 'text-white' : 'text-[#2d5a27]'}`}>
                          {type.icon}
                        </span>
                      </div>
                      <div>
                        <p className={`font-label font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>{type.name}</p>
                        <p className={`text-sm font-mono ${isDark ? 'text-slate-400' : 'text-[#4a6741]'}`}>
                          {type.count} sessions
                        </p>
                      </div>
                    </div>
                    <span className={`text-2xl font-headline font-bold font-mono ${isDark ? 'text-white' : 'text-[#2d5a27]'}`}>
                      {type.avgScore}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Sessions */}
          <Card padding="large" className={isDark ? 'bg-[#0a0a0a] border-[#1e293b]' : 'bg-white border-[#c8d5b9]'}>
            <h3 className={`font-headline text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {metrics?.recentSessions?.map((session, index) => (
                <SessionCard key={index} session={session} isDark={isDark} />
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

const SessionCard = ({ session, isDark }) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'bg-[#000000] border-slate-800 hover:border-primary hover:bg-primary/5' : 'bg-[#f0f7ec] border-[#c8d5b9] hover:border-[#2d5a27] hover:shadow-sm'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 flex items-center justify-center ${
          session.score >= 80 ? (isDark ? 'bg-emerald-900/30' : 'bg-emerald-50') :
          session.score >= 60 ? (isDark ? 'bg-amber-900/30' : 'bg-amber-50') :
          (isDark ? 'bg-red-900/30' : 'bg-red-50')
        }`} style={{ borderRadius: '0.75rem' }}>
          <span className={`material-symbols-outlined ${
            session.score >= 80 ? (isDark ? 'text-[#00ffa3]' : 'text-[#2d5a27]') :
            session.score >= 60 ? 'text-amber-400' :
            'text-red-400'
          }`} style={{fontVariationSettings: "'FILL' 1"}}>
            {session.score >= 80 ? 'emoji_events' :
             session.score >= 60 ? 'trending_up' :
             'psychology'}
          </span>
        </div>
        <div>
          <p className={`font-headline font-bold ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>{session.title}</p>
          <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-500 font-mono' : 'text-[#4a6741]'}`}>{session.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-headline text-2xl font-bold ${isDark ? 'text-white' : 'text-[#2d5a27]'}`}>
          {session.score}%
        </p>
        <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-slate-500 font-mono' : 'text-[#4a6741]'}`}>{session.duration}</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
