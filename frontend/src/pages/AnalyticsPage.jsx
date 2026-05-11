import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import apiService from '../api/apiService';

const AnalyticsPage = () => {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
          <div className="mb-12">
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold mb-2 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              Performance Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
              Track your interview preparation progress and identify areas for improvement
            </p>
          </div>

          {/* Overall Score */}
          <Card padding="large" className="mb-8 bg-gradient-to-br from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 border-blue-700">
            <div className="text-center text-white">
              <p className="text-sm uppercase tracking-wider mb-2 opacity-80">
                Overall Performance Score
              </p>
              <p className="font-headline text-6xl font-extrabold mb-4">
                {metrics?.overallScore || 0}%
              </p>
              <p className="opacity-90">
                Based on {metrics?.totalInterviews || 0} completed interviews
              </p>
            </div>
          </Card>

          {/* Skill Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card padding="large">
              <h3 className="font-headline text-xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                Skills Breakdown
              </h3>
              <div className="space-y-4">
                {metrics?.skillScores?.map((skill, index) => (
                  <ProgressBar
                    key={index}
                    label={skill.name}
                    value={skill.score}
                    variant="primary"
                    showLabel
                  />
                ))}
              </div>
            </Card>

            <Card padding="large">
              <h3 className="font-headline text-xl font-bold mb-6">
                Interview Types
              </h3>
              <div className="space-y-4">
                {metrics?.interviewTypes?.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined text-white text-sm">
                          {type.icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-label font-bold text-slate-900 dark:text-slate-100">{type.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                          {type.count} sessions
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-headline font-bold text-blue-600 dark:text-blue-400">
                      {type.avgScore}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Sessions */}
          <Card padding="large">
            <h3 className="font-headline text-xl font-bold mb-6">
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {metrics?.recentSessions?.map((session, index) => (
                <SessionCard key={index} session={session} />
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

const SessionCard = ({ session }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          session.score >= 80 ? 'bg-green-100' :
          session.score >= 60 ? 'bg-yellow-100' :
          'bg-red-100'
        }`}>
          <span className={`material-symbols-outlined ${
            session.score >= 80 ? 'text-green-600' :
            session.score >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`} style={{fontVariationSettings: "'FILL' 1"}}>
            {session.score >= 80 ? 'emoji_events' :
             session.score >= 60 ? 'trending_up' :
             'psychology'}
          </span>
        </div>
        <div>
          <p className="font-headline font-bold text-slate-900 dark:text-slate-100">{session.title}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">{session.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-headline text-2xl font-bold text-blue-600 dark:text-blue-400">
          {session.score}%
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">{session.duration}</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;