import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import apiService from '../api/apiService';

const BIO_MAX = 2000;

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    bio: '',
    role: ''
  });
  const [resumes, setResumes] = useState([]);

  const [aiPreferences, setAiPreferences] = useState({
    difficulty: 'adaptive-expert',
    voiceStyle: 'standard-professional',
    theme: 'light'
  });

  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  const userId = user?.id ?? user?.userId;

  // Load profile from server so each account has its own persisted bio
  useEffect(() => {
    if (!userId || !user) return;

    setProfile({
      fullName: user.fullName || user.name || '',
      email: user.email || '',
      bio: typeof user.bio === 'string' ? user.bio : '',
      role: user.role || '',
    });
    fetchUserResumes(userId);

    let cancelled = false;
    (async () => {
      try {
        const { data } = await apiService.getUserProfile(userId);
        if (cancelled) return;
        setProfile((prev) => ({
          ...prev,
          fullName: data.fullName || prev.fullName,
          email: data.email || prev.email,
          bio: typeof data.bio === 'string' ? data.bio : '',
        }));
        updateUser({
          fullName: data.fullName,
          email: data.email,
          bio: typeof data.bio === 'string' ? data.bio : '',
        });
      } catch {
        /* keep auth snapshot if API unreachable */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, updateUser]); // intentionally not depending on `user` to avoid refetch loops after updateUser

  const fetchUserResumes = async (userId) => {
    try {
      // Fetch resumes from localStorage (most reliable for now)
      const savedResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      setResumes(savedResumes);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      setResumes([]);
    }
  };

  const handleProfileChange = (field, value) => {
    if (field === 'bio' && typeof value === 'string' && value.length > BIO_MAX) {
      value = value.slice(0, BIO_MAX);
    }
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field, value) => {
    setAiPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userId) {
      showToast('Please log in to save.', 'error');
      return;
    }
    try {
      const { data } = await apiService.updateUserProfile(userId, {
        bio: profile.bio ?? '',
      });
      updateUser({
        fullName: data.fullName,
        email: data.email,
        bio: typeof data.bio === 'string' ? data.bio : '',
      });
      setProfile((p) => ({
        ...p,
        fullName: data.fullName ?? p.fullName,
        email: data.email ?? p.email,
        bio: typeof data.bio === 'string' ? data.bio : '',
      }));
      showToast('Profile saved. Your bio is stored for this account only.', 'success');
    } catch (e) {
      showToast(
        e.response?.data?.message ||
          'Could not save profile. Check that the backend is running.',
        'error'
      );
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'resume', label: 'Resume Vault' },
    { id: 'preferences', label: 'AI Preferences' }
  ];

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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-headline text-4xl font-extrabold mb-2 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              Astra AI Environment
            </h1>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
              Refine your digital presence and AI orchestration parameters.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-10 overflow-x-auto pb-4 md:pb-0 border-b border-outline-variant/20">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-headline font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary dark:text-blue-400 border-b-2 border-primary dark:border-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  <Card padding="large">
                    <h3 className="text-xl font-headline font-bold text-slate-900 dark:text-slate-100 mb-6 transition-colors duration-300">
                      Identity
                    </h3>

                    {/* Profile Picture */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-8">
                      <div className="relative group">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                            String(userId || user?.email || 'user')
                          )}`}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-700 shadow-lg"
                        />
                        <button className="absolute bottom-0 right-0 signature-glow text-white p-2 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">{profile.fullName}</p>
                        <p className="text-slate-600 dark:text-slate-400 mb-3 transition-colors duration-300">{profile.role}</p>
                        <button className="text-xs font-bold text-primary py-1 px-3 bg-primary/10 rounded-full">
                          Pro Member
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2 transition-colors duration-300">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => handleProfileChange('fullName', e.target.value)}
                          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-emerald-500/30 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2 transition-colors duration-300">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-emerald-500/30 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex justify-between items-end gap-2 mb-2">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider transition-colors duration-300">
                            Your bio
                          </label>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {(profile.bio || '').length}/{BIO_MAX}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          Shown only on your account. Each user keeps a separate bio.
                        </p>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          rows={5}
                          maxLength={BIO_MAX}
                          placeholder="Write a short bio: your focus areas, years of experience, or what you are preparing for."
                          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-emerald-500/30 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* Resume Tab */}
              {activeTab === 'resume' && (
                <Card padding="large">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-headline font-bold text-slate-900 dark:text-slate-100">Resume Vault</h3>
                    <Button variant="primary" size="small" onClick={() => window.location.href = '/resume'}>
                      Upload New
                    </Button>
                  </div>
                  
                  {resumes.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-4 block">
                        description
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        No resumes uploaded yet
                      </p>
                      <Button variant="outline" size="small" onClick={() => window.location.href = '/resume'}>
                        Upload Your Resume
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resumes.map((file, i) => (
                        <div key={i} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          file.active 
                            ? 'bg-blue-500/10 border-blue-500/30' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}>
                          <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-blue-500">description</span>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{file.fileName || file.name}</p>
                              <p className="text-[10px] text-slate-500">{file.uploadedAt || file.date} • {file.fileSize || file.size}</p>
                            </div>
                          </div>
                          {file.active ? (
                            <span className="text-[10px] font-bold uppercase text-blue-500 px-2 py-1 bg-blue-500/20 rounded">Active</span>
                          ) : (
                            <button className="text-[10px] font-bold uppercase text-slate-500 hover:text-blue-500 transition-colors">
                              Set Active
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <Card padding="large">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-headline font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">AI Behavioral Logic</h3>
                    <span className="material-symbols-outlined text-secondary">auto_awesome</span>
                  </div>

                  <div className="space-y-8">
                    {/* Difficulty Slider */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">Interview Difficulty</label>
                        <span className="text-xs font-headline font-bold text-primary px-3 py-1 bg-primary-fixed rounded-full">
                          Adaptive Expert
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        className="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] uppercase font-black text-slate-600 dark:text-slate-400 tracking-tighter transition-colors duration-300">
                        <span>Conversational</span>
                        <span>Rigorous</span>
                        <span>Stress Test</span>
                      </div>
                    </div>

                    {/* Voice Selection */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">AI Voice Style</label>
                      <div className="space-y-3">
                        <div
                          onClick={() => handlePreferenceChange('voiceStyle', 'standard-professional')}
                          className={`p-4 rounded-xl cursor-pointer border-l-4 transition-all ${
                            aiPreferences.voiceStyle === 'standard-professional'
                              ? 'bg-blue-900 border-blue-400'
                              : 'bg-slate-700 border-transparent hover:bg-slate-600'
                          }`}
                        >
                          <p className="text-xs font-bold text-white transition-colors duration-300">Standard Professional</p>
                          <p className="text-[10px] text-blue-100 transition-colors duration-300">Neutral, warm, clear.</p>
                        </div>
                        <div
                          onClick={() => handlePreferenceChange('voiceStyle', 'visionary')}
                          className={`p-4 rounded-xl cursor-pointer border-l-4 transition-all ${
                            aiPreferences.voiceStyle === 'visionary'
                              ? 'bg-blue-900 border-blue-400'
                              : 'bg-slate-700 border-transparent hover:bg-slate-600'
                          }`}
                        >
                          <p className="text-xs font-bold text-white transition-colors duration-300">The Visionary</p>
                          <p className="text-[10px] text-blue-100 transition-colors duration-300">Inspiring, fast-paced.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Empty for now - can be used for additional info */}
            </div>
          </div>
        </div>
      </main>

      {/* Save Actions */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={handleSave}
          className="px-6 py-3 signature-glow text-white font-headline font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Save Settings</span>
          <span className="material-symbols-outlined text-sm">save</span>
        </button>
      </div>

      <ToastContainer />
      <Footer />
    </motion.div>
  );
};

export default SettingsPage;
