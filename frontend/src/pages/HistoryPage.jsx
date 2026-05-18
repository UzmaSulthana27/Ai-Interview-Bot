import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import apiService from '../api/apiService';
import { useToast } from '../components/common/Toast';

const Spinner = () => (
  <motion.div 
    className="w-6 h-6 border-2 border-slate-800 border-t-[#2d5a27] rounded-full inline-block"
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
  />
);

const ALL_ROLES = ['All', 'Java', 'React', 'Python', 'Full Stack', 'Frontend', 'Backend', 'Data', 'DevOps'];

const HistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, ToastContainer } = useToast();
  const { isDark } = useTheme();
  
  const [sessions, setSessions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  
  useEffect(() => {
    const uid = localStorage.getItem('userId');
    if (!uid) { navigate('/login'); return; }

    fetchHistory(uid);
  }, [navigate]);

  const fetchHistory = async (uid) => {
    try {
      const res = await apiService.getHistory(uid);
      const data = Array.isArray(res.data) ? res.data : [];
      setSessions(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (role) => {
    setActiveFilter(role);
    if (role === 'All') {
      setFiltered(sessions);
    } else {
      const searchRole = role.toLowerCase();
      setFiltered(sessions.filter(s => 
        s.jobRole && s.jobRole.toLowerCase().includes(searchRole)
      ));
    }
  };

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    
    try {
      const uid = localStorage.getItem('userId');
      await apiService.deleteHistory(sessionId, uid);
      
      const newSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(newSessions);
      if (activeFilter === 'All') setFiltered(newSessions);
      else setFiltered(newSessions.filter(s => s.jobRole && s.jobRole.includes(activeFilter)));
      
      showToast('Session deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete session', 'error');
    }
  };

  return (
    <div className="bg-[#f5f5f0] dark:bg-[#000000] min-h-screen transition-colors duration-300">
      <TopNavBar />
      <ToastContainer />

      <main className="pt-24 px-4 md:px-8 pb-24 md:pb-16 max-w-5xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold mb-2 text-white">
            Interview History
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Review your past sessions and track your improvement.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-2">
            {ALL_ROLES.map(role => (
              <motion.button
                key={role}
                onClick={() => handleFilter(role)}
                className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeFilter === role 
                    ? (isDark ? 'bg-[var(--bg-pill-selected)] text-[var(--text-pill-selected)] shadow-[0_0_8px_rgba(0,255,163,0.3)] border-none' : 'bg-primary text-white shadow-lg shadow-primary/20')
                    : (isDark ? 'bg-[var(--bg-pill-default)] text-[var(--text-pill-default)] border border-[var(--border-default)] hover:border-[var(--border-active)]' : 'bg-white text-slate-600 border border-slate-800 hover:border-[#2d5a27]')
                }`}
                style={isDark ? { borderRadius: '2px', fontFamily: "'Courier New', monospace", textTransform: 'uppercase' } : { borderRadius: '9999px' }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDark ? role.toUpperCase() : role}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Session List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3].map(i => (
                <motion.div 
                  key={`skeleton-${i}`} 
                  className="bg-slate-100 dark:bg-[#000000]/50 rounded-xl p-6 h-28 animate-pulse border border-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              ))
            ) : filtered.length === 0 ? (
              <motion.div 
                className="bg-slate-50 dark:bg-[#000000]/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key="empty"
              >
                <p className="text-slate-500 font-mono text-sm mb-6">$ no sessions found in this category</p>
                <motion.button 
                  onClick={() => navigate('/home')}
                  className="bg-primary text-black px-6 py-2 rounded-xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Practice
                </motion.button>
              </motion.div>
            ) : (
              filtered.map((session, idx) => (
                <motion.div 
                  key={session.id}
                  className="bg-white dark:bg-[#000000] border border-slate-800 rounded-xl p-5 md:p-6 flex items-center justify-between cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 5, shadow: "0 0 15px rgba(0, 255, 163, 0.4)", borderColor: isDark ? 'rgba(0, 255, 163, 0.4)' : 'rgba(45, 90, 39, 0.3)' }}
                  onClick={() => {/* Expand details logic */}}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-headline font-bold text-lg md:text-xl text-white">
                        {session.jobRole || 'General Interview'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        session.score >= 7 ? 'bg-green-100 text-green-700' : 
                        session.score >= 5 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {session.score}/10
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(session.createdAt).toLocaleDateString()} @ {new Date(session.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  
                  <div className="pl-4">
                    <motion.button
                      onClick={(e) => handleDelete(e, session.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete session"
                    >
                      <span className="material-symbols-outlined text-xl">delete_outline</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
