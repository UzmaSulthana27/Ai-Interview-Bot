import React, { useState } from 'react';
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

const HomePage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const isPremium = localStorage.getItem('isPremium') === 'true';
  const trialUsed = localStorage.getItem('trialUsed') === 'true';

  const handleStartInterview = () => {
    // If trial is used and not premium, show upgrade popup
    if (trialUsed && !isPremium) {
      setShowUpgradePopup(true);
      return;
    }
    // Otherwise navigate to interview
    navigate('/interview');
  };

  const renderTrialBanner = () => {
    if (isPremium) {
      // Premium Member
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={isDark ? {
            background: 'var(--bg-premium)',
            border: '1px solid #00ffa3',
            borderRadius: '4px',
            padding: '16px',
            marginTop: '24px',
            marginBottom: '24px',
            fontFamily: "'Courier New', monospace",
            fontSize: '14px',
            color: '#00ffa3',
            textAlign: 'center',
            fontWeight: '600',
            textShadow: '0 0 6px rgba(0, 255, 163, 0.5)',
            boxShadow: '0 0 16px rgba(0, 255, 163, 0.1)'
          } : {
            background: '#f0f7ec',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '24px',
            marginBottom: '24px',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#2d5a27',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          ✓ Premium Member — Unlimited Sessions
        </motion.div>
      );
    }

    if (!trialUsed) {
      // Free Trial Available
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={isDark ? {
            background: 'var(--bg-trial-free)',
            border: '1px solid #00ffa3',
            borderRadius: '4px',
            padding: '16px',
            marginTop: '24px',
            marginBottom: '24px',
            fontFamily: "'Courier New', monospace",
            fontSize: '14px',
            color: '#00ffa3',
            textAlign: 'center',
            fontWeight: '600',
            boxShadow: '0 0 16px rgba(0, 255, 163, 0.1)'
          } : {
            background: '#f0f7ec',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '24px',
            marginBottom: '24px',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#2d5a27',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          ⚡ Free Trial — 1 session available
        </motion.div>
      );
    }

    // Trial Used, Not Premium
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={isDark ? {
          background: 'var(--bg-trial-warning)',
          border: '1px solid #ffbd2e',
          borderRadius: '4px',
          padding: '16px',
          marginTop: '24px',
          marginBottom: '24px',
          fontFamily: "'Courier New', monospace",
          fontSize: '14px',
          color: '#ffbd2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 0 16px rgba(255,189,46,0.1)'
        } : {
          background: '#fff8e8',
          border: '2px solid #e8c84a',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '24px',
          marginBottom: '24px',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#7a5c00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <span style={{ fontWeight: '600' }}>🔒 Free trial used — Upgrade for unlimited access</span>
        <button
          onClick={() => setShowUpgradePopup(true)}
          style={isDark ? {
            background: '#ffbd2e',
            color: '#000',
            border: 'none',
            borderRadius: '3px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          } : {
            background: '#e8c84a',
            color: '#7a5c00',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (isDark) e.target.style.boxShadow = '0 0 12px rgba(255,189,46,0.6)';
            else e.target.style.background = '#d9b824';
          }}
          onMouseLeave={(e) => {
            if (isDark) e.target.style.boxShadow = 'none';
            else e.target.style.background = '#e8c84a';
          }}
        >
          Upgrade Now →
        </button>
      </motion.div>
    );
  };

  return (
    <div className={`font-body transition-colors duration-300 ${isDark ? 'bg-black text-slate-300' : 'bg-[#f5f5f0] text-[#1a3d16]'}`}>
      <TopNavBar />
      
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSection onStartTrial={handleStartInterview} />
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
        onUpgrade={() => {
          localStorage.setItem('isPremium', 'true');
          setShowUpgradePopup(false);
          window.location.reload();
        }}
      />
    </div>
  );
};

export default HomePage;
