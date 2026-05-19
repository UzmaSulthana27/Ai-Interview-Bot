import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/Sections/HeroSection';
import FeatureBentoGrid from '../components/Sections/FeatureBentoGrid';
import HowItWorks from '../components/Sections/HowItWorks';
import FinalCTA from '../components/Sections/FinalCTA';
import UpgradePopup from '../components/UpgradePopup';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const {
    sessionsUsed,
    sessionsLeft,
    isPremium,
    showUpgradePopup,
    setShowUpgradePopup,
    refreshStatus
  } = useSession();

  // Define local state to satisfy the required handleStartInterview logic structure
  const [selectedRole, setSelectedRole] = useState('Java Developer');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedFormat, setSelectedFormat] = useState('QA');

  useEffect(() => { 
    refreshStatus(); 
  }, []);

  const handleStartInterview = () => {
    if (!selectedRole) {
      alert('Please select a role first!');
      return;
    }
    if (!isPremium && sessionsLeft <= 0) {
      setShowUpgradePopup(true);
      return;
    }
    localStorage.setItem('jobRole', selectedRole);
    localStorage.setItem('difficulty', selectedDifficulty);
    localStorage.setItem('format', selectedFormat);
    navigate('/interview');
  };

  const renderTrialBanner = () => {
    if (isPremium) {
      // State 1 — Premium user
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: 'var(--bg-premium)',
          border: 'var(--border-success)',
          borderRadius: 8,
          marginBottom: 20,
          fontFamily: 'monospace',
          fontSize: 13,
          maxWidth: '800px',
          margin: '20px auto'
        }}>
          <span style={{ color: 'var(--text-success)' }}>✓</span>
          <span style={{ color: 'var(--text-primary)' }}>
            Premium Member — Unlimited sessions
          </span>
        </div>
      );
    }

    if (sessionsLeft > 0) {
      // State 2 — Free trial available (sessionsLeft > 0)
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'var(--bg-trial-free)',
          border: 'var(--border-default)',
          borderRadius: 8,
          marginBottom: 20,
          maxWidth: '800px',
          margin: '20px auto'
        }}>
          <span style={{ fontFamily:'monospace', fontSize:13, color:'var(--text-primary)' }}>
            ⚡ Free Trial — {sessionsLeft} session{sessionsLeft !== 1 ? 's' : ''} remaining
          </span>
          <div style={{ display:'flex', gap:6 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: i <= sessionsUsed
                  ? 'var(--text-muted)'
                  : 'var(--primary)',
              }}/>
            ))}
          </div>
        </div>
      );
    }

    // State 3 — Trial expired (sessionsLeft === 0 AND not premium)
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'var(--bg-trial-warning)',
        border: '1px solid #e8c84a',
        borderRadius: 8,
        marginBottom: 20,
        maxWidth: '800px',
        margin: '20px auto'
      }}>
        <span style={{ fontFamily:'monospace', fontSize:13, color:'var(--text-primary)' }}>
          🔒 Free trial ended — upgrade for unlimited access
        </span>
        <button
          onClick={() => setShowUpgradePopup(true)}
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-text)',
            border: 'none',
            padding: '6px 14px',
            borderRadius: 6,
            fontFamily: 'monospace',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Upgrade →
        </button>
      </div>
    );
  };

  const buttonText = !isPremium && sessionsLeft <= 0
    ? '🔒 Upgrade to Start'
    : '$ start --interview';

  return (
    <div className={`font-body transition-colors duration-300 ${isDark ? 'bg-black text-slate-300' : 'bg-[#f5f5f0] text-[#1a3d16]'}`}>
      <TopNavBar />
      
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSection onStartTrial={handleStartInterview} buttonText={buttonText} />
          {renderTrialBanner()}
          <FeatureBentoGrid />
          <HowItWorks />
          <FinalCTA onStartTrial={handleStartInterview} />
        </motion.div>
      </main>

      <Footer />

      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
      />
    </div>
  );
};

export default HomePage;
