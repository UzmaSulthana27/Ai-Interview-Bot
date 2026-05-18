import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
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
  const { isDark } = useTheme();
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

  const handleDeleteResume = (index) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      const updatedResumes = resumes.filter((_, i) => i !== index);
      setResumes(updatedResumes);
      localStorage.setItem('userResumes', JSON.stringify(updatedResumes));
      showToast('Resume deleted successfully', 'success');
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
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#000000]' : 'bg-[#f5f5f0]'}`}
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
            <h1 className={`font-headline text-4xl font-extrabold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
              {isDark ? 'Astra Environment' : 'Astra AI Environment'}
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Refine your digital presence and AI orchestration parameters.
            </p>
          </div>

          {/* Tabs */}
          <div className={`flex gap-8 mb-10 overflow-x-auto pb-4 md:pb-0 border-b ${isDark ? 'border-slate-800' : 'border-outline-variant/20'}`}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-headline font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? (isDark ? 'text-white border-b-2 border-primary' : 'text-[#2d5a27] border-b-2 border-[#2d5a27]')
                    : (isDark ? 'text-slate-500 hover:text-primary' : 'text-slate-500 hover:text-[#2d5a27]')
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
                  <Card padding="large" className={isDark ? 'bg-[#050505] border-slate-800' : 'bg-white border-[#c8d5b9]'}>
                    <h3 className={`text-xl font-headline font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>
                      {isDark ? 'Identity' : 'Identity'}
                    </h3>

                    {/* Profile Picture */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-8">
                      <div className="relative group">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                            String(userId || user?.email || 'user')
                          )}`}
                          alt="Profile"
                          className={`w-24 h-24 rounded-full object-cover ring-4 shadow-lg ${isDark ? 'ring-slate-800' : 'ring-white'}`}
                        />
                        <button className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform flex items-center justify-center ${isDark ? 'bg-[#000000] text-[#00ffa3] border border-primary' : 'signature-glow text-white'}`}>
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                      <div>
                        <p className={`text-lg font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>{profile.fullName}</p>
                        <p className={`mb-3 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{profile.role}</p>
                        <button className={`text-xs font-bold py-1 px-3 rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'text-primary bg-primary/10'}`}>
                          {isDark ? 'Pro Member' : 'Pro Member'}
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className={`text-xs font-bold uppercase tracking-wider block mb-2 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => handleProfileChange('fullName', e.target.value)}
                          className={`w-full border rounded-lg px-4 py-3 focus:border-transparent transition-all ${isDark ? 'bg-[#000000] border-slate-800 text-white focus:ring-2 focus:ring-primary/50' : 'bg-white border-[#c8d5b9] text-[#1a3d16] focus:ring-2 focus:ring-[#2d5a27]/20'}`}
                          style={isDark ? { borderRadius: '3px' } : {}}
                        />
                      </div>
                      <div>
                        <label className={`text-xs font-bold uppercase tracking-wider block mb-2 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className={`w-full border rounded-lg px-4 py-3 focus:border-transparent transition-all ${isDark ? 'bg-[#000000] border-slate-800 text-white focus:ring-2 focus:ring-primary/50' : 'bg-white border-[#c8d5b9] text-[#1a3d16] focus:ring-2 focus:ring-[#2d5a27]/20'}`}
                          style={isDark ? { borderRadius: '3px' } : {}}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex justify-between items-end gap-2 mb-2">
                          <label className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Your bio
                          </label>
                          <span className={`text-[10px] ${isDark ? 'text-slate-500 font-mono' : 'text-slate-500'}`}>
                            {(profile.bio || '').length}/{BIO_MAX}
                          </span>
                        </div>
                        <p className={`text-xs mb-2 ${isDark ? 'text-slate-500 font-mono' : 'text-slate-500'}`}>
                          Shown only on your account. Each user keeps a separate bio.
                        </p>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          rows={5}
                          maxLength={BIO_MAX}
                          placeholder="Write a short bio: your focus areas, years of experience, or what you are preparing for."
                          className={`w-full border rounded-lg px-4 py-3 focus:border-transparent transition-all ${isDark ? 'bg-[#000000] border-slate-800 text-white focus:ring-2 focus:ring-primary/50 placeholder:text-slate-700' : 'bg-white border-[#c8d5b9] text-[#1a3d16] focus:ring-2 focus:ring-[#2d5a27]/20 placeholder:text-slate-400'}`}
                          style={isDark ? { borderRadius: '3px' } : {}}
                        />
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* Resume Tab */}
              {activeTab === 'resume' && (
                <Card padding="large" className={isDark ? 'bg-[#050505] border-slate-800' : 'bg-white border-[#c8d5b9]'}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className={`text-xl font-headline font-bold ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>{isDark ? 'Resume Vault' : 'Resume Vault'}</h3>
                    <Button variant="primary" size="small" onClick={() => window.location.href = '/resume'}>
                      {isDark ? 'UPLOAD_NEW' : 'Upload New'}
                    </Button>
                  </div>
                  
                  {resumes.length === 0 ? (
                    <div className="text-center py-12">
                      <span className={`material-symbols-outlined text-4xl mb-4 block ${isDark ? 'text-slate-800' : 'text-slate-300'}`}>
                        description
                      </span>
                      <p className={`mb-4 ${isDark ? 'text-slate-500 font-mono' : 'text-slate-600'}`}>
                        {isDark ? 'NO_RESUMES_FOUND' : 'No resumes uploaded yet'}
                      </p>
                      <Button variant="outline" size="small" onClick={() => window.location.href = '/resume'}>
                        {isDark ? 'UPLOAD_RESUME()' : 'Upload Your Resume'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resumes.map((file, i) => (
                        <div key={i} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          file.active 
                            ? (isDark ? 'bg-primary/10 border-primary' : 'bg-[#e8f0e0] border-[#2d5a27]') 
                            : (isDark ? 'bg-[#000000] border-slate-800' : 'bg-white border-[#e2e8f0]')
                        }`} style={isDark ? { borderRadius: '3px' } : {}}>
                          <div className="flex items-center gap-4">
                            <span className={`material-symbols-outlined ${isDark ? 'text-[#00ffa3]' : 'text-[#2d5a27]'}`}>description</span>
                            <div>
                              <p className={`text-sm font-bold ${isDark ? 'text-white font-mono' : 'text-[#1a3d16]'}`}>{file.fileName || file.name}</p>
                              <p className={`text-[10px] ${isDark ? 'text-slate-500 font-mono' : 'text-slate-500'}`}>{file.uploadedAt || file.date} • {file.fileSize || file.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.active ? (
                              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${isDark ? 'text-[#000000] bg-primary font-mono' : 'text-primary bg-primary/20'}`}>Active</span>
                            ) : (
                              <button className={`text-[10px] font-bold uppercase transition-colors ${isDark ? 'text-slate-500 hover:text-primary font-mono' : 'text-slate-500 hover:text-primary'}`}>
                                Set Active
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteResume(i)} 
                              className={`p-1 rounded transition-colors ${isDark ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                              title="Delete Resume"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <Card padding="large" className={isDark ? 'bg-[#050505] border-slate-800' : 'bg-white border-[#c8d5b9]'}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className={`text-xl font-headline font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1a3d16]'}`}>{isDark ? 'AI Behavioral Logic' : 'AI Behavioral Logic'}</h3>
                    <span className={`material-symbols-outlined ${isDark ? 'text-slate-400' : 'text-secondary'}`}>auto_awesome</span>
                  </div>

                  <div className="space-y-8">
                    {/* Difficulty Slider */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className={`text-sm font-bold transition-colors duration-300 ${isDark ? 'text-white font-mono uppercase' : 'text-[#1a3d16]'}`}>Interview Difficulty</label>
                        <span className={`text-xs font-headline font-bold px-3 py-1 rounded-full ${isDark ? 'text-[#000000] bg-[#00ffa3] font-mono uppercase' : 'text-[#2d5a27] bg-[#e8f0e0]'}`}>
                          Adaptive Expert
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer ${isDark ? 'bg-[#004d38] accent-[#00ffa3]' : 'bg-slate-200 accent-[#2d5a27]'}`}
                      />
                      <div className={`flex justify-between text-[10px] uppercase font-black tracking-tighter transition-colors duration-300 ${isDark ? 'text-slate-600 font-mono' : 'text-slate-600'}`}>
                        <span>Conversational</span>
                        <span>Rigorous</span>
                        <span>Stress Test</span>
                      </div>
                    </div>

                    {/* Voice Selection */}
                    <div className="space-y-4">
                      <label className={`text-sm font-bold transition-colors duration-300 ${isDark ? 'text-white font-mono uppercase' : 'text-[#1a3d16]'}`}>AI Voice Style</label>
                      <div className="space-y-3">
                        <div
                          onClick={() => handlePreferenceChange('voiceStyle', 'standard-professional')}
                          className={`p-4 rounded-xl cursor-pointer border-l-4 transition-all ${
                            aiPreferences.voiceStyle === 'standard-professional'
                              ? (isDark ? 'bg-[#000000] border-[#00ffa3] shadow-[inset_0_0_10px_rgba(0,255,163,0.2)]' : 'bg-[#e8f0e0] border-[#2d5a27]')
                              : (isDark ? 'bg-[#000000] border-transparent hover:border-[#004d38]' : 'bg-white border-transparent hover:bg-[#f0f7ec]')
                          }`}
                          style={isDark ? { borderRadius: '3px' } : {}}
                        >
                          <p className={`text-xs font-bold transition-colors duration-300 ${isDark ? 'text-white font-mono uppercase' : 'text-[#1a3d16]'}`}>Standard Professional</p>
                          <p className={`text-[10px] transition-colors duration-300 ${isDark ? 'text-slate-500 font-mono' : 'text-slate-600'}`}>Neutral, warm, clear.</p>
                        </div>
                        <div
                          onClick={() => handlePreferenceChange('voiceStyle', 'visionary')}
                          className={`p-4 rounded-xl cursor-pointer border-l-4 transition-all ${
                            aiPreferences.voiceStyle === 'visionary'
                              ? (isDark ? 'bg-[#000000] border-[#00ffa3] shadow-[inset_0_0_10px_rgba(0,255,163,0.2)]' : 'bg-[#e8f0e0] border-[#2d5a27]')
                              : (isDark ? 'bg-[#000000] border-transparent hover:border-[#004d38]' : 'bg-white border-transparent hover:bg-[#f0f7ec]')
                          }`}
                          style={isDark ? { borderRadius: '3px' } : {}}
                        >
                          <p className={`text-xs font-bold transition-colors duration-300 ${isDark ? 'text-white font-mono uppercase' : 'text-[#1a3d16]'}`}>The Visionary</p>
                          <p className={`text-[10px] transition-colors duration-300 ${isDark ? 'text-slate-500 font-mono' : 'text-slate-600'}`}>Inspiring, fast-paced.</p>
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
          className={`px-6 py-3 font-headline font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isDark ? 'bg-[#00ffa3] text-[#000000] border-none font-mono uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,163,0.5)]' : 'signature-glow text-white hover:shadow-primary/20 rounded-xl'}`}
          style={isDark ? { borderRadius: '3px' } : {}}
        >
          <span>{isDark ? 'SAVE_SETTINGS()' : 'Save Settings'}</span>
          <span className="material-symbols-outlined text-sm">save</span>
        </button>
      </div>

      <ToastContainer />
      <Footer />
    </motion.div>
  );
};

export default SettingsPage;
