import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../api/apiService';
import { useTheme } from '../context/ThemeContext';

const UpgradePopup = ({ isOpen, onClose, onUpgrade }) => {
  const { isDark } = useTheme();
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      setError('');
      const userId = localStorage.getItem('userId');
      
      const res = await apiService.post('/auth/upgrade', { userId });

      // Update localStorage
      localStorage.setItem('isPremium', 'true');

      // Show success message
      setUpgradeSuccess(true);

      // Close popup after 2 seconds
      setTimeout(() => {
        onUpgrade();
        setUpgradeSuccess(false);
        setUpgrading(false);
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Upgrade error:', err);
      setError(err.response?.data?.message || 'Upgrade failed. Please try again.');
      setUpgrading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(26, 61, 22, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              background: isDark ? '#000000' : 'white',
              borderRadius: isDark ? '6px' : '16px',
              border: isDark ? '1px solid #00ffa3' : 'none',
              padding: '40px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: isDark ? '0 0 40px rgba(0, 255, 163, 0.2)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              fontFamily: isDark ? "'Courier New', monospace" : 'inherit',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>

            {!upgradeSuccess ? (
              <>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: isDark ? '#00ffa3' : '#1f2937',
                      textShadow: isDark ? '0 0 10px rgba(0, 255, 163, 0.5)' : 'none',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Trial Ended
                  </h2>
                  <p
                    style={{
                      color: '#666',
                      fontSize: '14px',
                      margin: '0',
                    }}
                  >
                    You've used your free session
                  </p>
                </div>

                {/* Features list */}
                <div style={{ marginBottom: '32px' }}>
                  <p
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: isDark ? '#00ffa3' : '#1f2937',
                      marginBottom: '12px',
                    }}
                  >
                    What you get with Premium:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      'Unlimited interview sessions',
                      'All 8 job roles',
                      'MCQ + Q/A formats',
                      'Detailed AI feedback',
                      'Full session history',
                    ].map((feature, idx) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isDark ? '#00ffa3' : 'inherit' }} key={idx}>
                        <span style={{ color: isDark ? '#00ffa3' : '#2d5a27', fontWeight: 'bold', fontSize: '16px', textShadow: isDark ? '0 0 8px rgba(0, 255, 163, 0.5)' : 'none' }}>✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    style={{
                      background: '#fee2e2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                      fontSize: '12px',
                      color: '#dc2626',
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    style={{
                      background: isDark ? '#00ffa3' : '#2d5a27',
                      color: isDark ? '#000' : 'white',
                      border: 'none',
                      borderRadius: isDark ? '3px' : '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '800',
                      textTransform: isDark ? 'uppercase' : 'none',
                      boxShadow: isDark ? '0 0 16px rgba(0, 255, 163, 0.4)' : 'none',
                      cursor: upgrading ? 'not-allowed' : 'pointer',
                      opacity: upgrading ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!upgrading) e.target.style.background = isDark ? '#22c55e' : '#1a3d16';
                      if (!upgrading && isDark) e.target.style.boxShadow = '0 0 24px rgba(0, 255, 163, 0.7)';
                    }}
                    onMouseLeave={(e) => {
                      if (!upgrading) e.target.style.background = isDark ? '#00ffa3' : '#2d5a27';
                      if (!upgrading && isDark) e.target.style.boxShadow = '0 0 16px rgba(0, 255, 163, 0.4)';
                    }}
                  >
                    {upgrading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }}
                        />
                        Upgrading...
                      </span>
                    ) : (
                      '🚀 Upgrade to Premium — Free'
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    style={{
                      background: 'transparent',
                      color: isDark ? '#006b4a' : '#666',
                      border: isDark ? '1px solid #004d38' : '1px solid #e5e7eb',
                      borderRadius: isDark ? '3px' : '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textTransform: isDark ? 'uppercase' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = isDark ? 'rgba(74,222,128,0.05)' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                  >
                    {isDark ? 'CANCEL' : 'Maybe Later'}
                  </button>
                </div>

                <style>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </>
            ) : (
              <>
                {/* Success state */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                  style={{ textAlign: 'center', marginBottom: '32px' }}
                >
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                </motion.div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: isDark ? '#00ffa3' : '#2d5a27',
                    textShadow: isDark ? '0 0 10px rgba(0, 255, 163, 0.5)' : 'none',
                    textAlign: 'center',
                    margin: '0 0 8px 0',
                  }}
                >
                  Welcome to Premium!
                </h2>
                <p
                  style={{
                    color: isDark ? '#006b4a' : '#4a6044',
                    fontSize: '14px',
                    textAlign: 'center',
                    margin: '0',
                  }}
                >
                  You now have unlimited access.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradePopup;
