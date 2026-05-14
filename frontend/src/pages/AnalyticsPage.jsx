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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#000000]' : 'bg-[#f5f5f0]'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-[#00ffa3]' : 'border-[#2d5a27]'}`}></div>
          <p className={`transition-colors duration-300 ${isDark ? 'text-[#00ffa3] font-mono' : 'text-[#1a3d16]'}`}>{isDark ? 'LOADING_ANALYTICS...' : 'Loading analytics...'}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#000000]' : 'bg-[#f5f5f0]'}`}
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
            <h1 className={`font-headline text-3xl md:text-4xl font-extrabold mb-2 transition-colors duration-300 ${isDark ? 'text-[#00ffa3] font-mono uppercase tracking-widest' : 'text-[#1a3d16]'}`}>
              {isDark ? '> Performance Analytics' : 'Performance Analytics'}
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? 'text-[#006b4a] font-mono' : 'text-[#2d5a27]'}`}>
              Track your interview preparation progress and identify areas for improvement
            </p>
          </div>

          {/* Overall Score */}
          <Card padding="large" className={`mb-8 ${isDark ? 'bg-[#000000] border-[#00ffa3] shadow-[0_0_20px_rgba(0,255,163,0.15)]' : 'bg-gradient-to-br from-[#1a3d16] to-[#2d5a27]'}`}>
            <div className={`text-center ${isDark ? 'text-[#00ffa3]' : 'text-white'}`}>
              <p className={`text-sm uppercase tracking-wider mb-2 ${isDark ? 'font-mono' : 'opacity-80'}`}>
                Overall Performance Score
              </p>
              <p className={`font-headline text-6xl font-extrabold mb-4 ${isDark ? 'font-mono text-shadow-[0_0_10px_rgba(0,255,163,0.5)]' : ''}`}>
                {metrics?.overallScore || 0}%
              </p>
              <p className={isDark ? 'font-mono text-[#006b4a]' : 'opacity-90'}>
                Based on {metrics?.totalInterviews || 0} completed interviews
              </p>
            </div>
          </Card>

          {/* Skill Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card padding="large" className={isDark ? 'bg-[#0d0d0d] border-[#004d38]' : 'bg-white border-[#c8d5b9]'}>
              <h3 className={`font-headline text-xl font-bold mb-6 ${isDark ? 'text-[#00ffa3] font-mono uppercase' : 'text-[#1a3d16]'}`}>
                {isDark ? '> Skills Breakdown' : 'Skills Breakdown'}
              </h3>
              <div className="space-y-4">
                {metrics?.skillScores?.map((skill, index) => (
                  <ProgressBar
                    key={index}
                    label={isDark ? skill.name.toUpperCase() : skill.name}
                    value={skill.score}
                    variant="primary"
                    showLabel
                  />
                ))}
              </div>
            </Card>

            <Card padding="large" className={isDark ? 'bg-[#0d0d0d] border-[#004d38]' : 'bg-white border-[#c8d5b9]'}>
              <h3 className={`font-headline text-xl font-bold mb-6 ${isDark ? 'text-[#00ffa3] font-mono uppercase' : 'text-[#1a3d16]'}`}>
                {isDark ? '> Interview Types' : 'Interview Types'}
              </h3>
              <div className="space-y-4">
                {metrics?.interviewTypes?.map((type, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'bg-[#000000] border-[#004d38] hover:border-[#00ffa3]' : 'bg-slate-50 border-slate-200 hover:border-[#00ffa3]'}`} style={isDark ? { borderRadius: '3px' } : {}}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center shadow-lg ${isDark ? 'bg-[#002e26] border border-[#004d38] shadow-[#00ffa3]/10' : 'bg-[#1a3d16] rounded-full shadow-[#2d5a27]/20'}`} style={isDark ? { borderRadius: '2px' } : {}}>
                        <span className={`material-symbols-outlined text-sm ${isDark ? 'text-[#00ffa3]' : 'text-white'}`}>
                          {type.icon}
                        </span>
                      </div>
                      <div>
                        <p className={`font-label font-bold ${isDark ? 'text-[#00ffa3] font-mono uppercase tracking-wider' : 'text-[#1a3d16]'}`}>{type.name}</p>
                        <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-[#006b4a] font-mono' : 'text-slate-600'}`}>
                          {type.count} sessions
                        </p>
                      </div>
                    </div>
                    <span className={`text-2xl font-headline font-bold ${isDark ? 'text-[#00ffa3] font-mono' : 'text-[#2d5a27]'}`}>
                      {type.avgScore}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Sessions */}
          <Card padding="large" className={isDark ? 'bg-[#0d0d0d] border-[#004d38]' : 'bg-white border-[#c8d5b9]'}>
            <h3 className={`font-headline text-xl font-bold mb-6 ${isDark ? 'text-[#00ffa3] font-mono uppercase' : 'text-[#1a3d16]'}`}>
              {isDark ? '> Recent Sessions' : 'Recent Sessions'}
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
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'bg-[#000000] border-[#004d38] hover:border-[#00ffa3]' : 'bg-slate-50 border-slate-200 hover:border-[#2d5a27]'}`} style={isDark ? { borderRadius: '3px' } : {}}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 flex items-center justify-center ${
          session.score >= 80 ? (isDark ? 'bg-[#004d38]' : 'bg-[#002e26]') :
          session.score >= 60 ? (isDark ? 'bg-[#3d3d00]' : 'bg-[#fffbeb]') :
          (isDark ? 'bg-[#3d0000]' : 'bg-red-50')
        }`} style={isDark ? { borderRadius: '2px' } : { borderRadius: '0.75rem' }}>
          <span className={`material-symbols-outlined ${
            session.score >= 80 ? (isDark ? 'text-[#00ffa3]' : 'text-[#2d5a27]') :
            session.score >= 60 ? (isDark ? 'text-[#ffbd2e]' : 'text-[#b45309]') :
            (isDark ? 'text-[#ff6b6b]' : 'text-[#b91c1c]')
          }`} style={{fontVariationSettings: "'FILL' 1"}}>
            {session.score >= 80 ? 'emoji_events' :
             session.score >= 60 ? 'trending_up' :
             'psychology'}
          </span>
        </div>
        <div>
          <p className={`font-headline font-bold ${isDark ? 'text-[#00ffa3] font-mono' : 'text-[#1a3d16]'}`}>{session.title}</p>
          <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-[#006b4a] font-mono' : 'text-slate-600'}`}>{session.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-headline text-2xl font-bold ${isDark ? 'text-[#00ffa3] font-mono' : 'text-[#2d5a27]'}`}>
          {session.score}%
        </p>
        <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-[#006b4a] font-mono' : 'text-slate-600'}`}>{session.duration}</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
