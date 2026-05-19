import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';
import API from '../api/axios';

const UpgradePopup = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { updateSessionInfo } = useSession();
  
  // Step can be: 'benefits', 'payment', 'success'
  const [step, setStep] = useState('benefits');
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Pre-populate name if available
  useEffect(() => {
    if (isOpen) {
      setStep('benefits');
      setError('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      const name = localStorage.getItem('name') || '';
      setCardName(name.toUpperCase());
    }
  }, [isOpen]);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCvv(value);
  };

  const handleCardNameChange = (e) => {
    setCardName(e.target.value.toUpperCase());
  };

  const handleUpgradeClick = async (e) => {
    e.preventDefault();
    setUpgrading(true);
    setError('');
    const userId = localStorage.getItem('userId');
    
    // Clean card number for sending to backend
    const rawCardNumber = cardNumber.replace(/\s+/g, '');
    
    try {
      await API.post('/auth/upgrade', { 
        userId,
        amount: 19.99,
        cardNumber: rawCardNumber,
        expiry,
        cvv
      });
      
      // Update local storage and context
      localStorage.setItem('isPremium', 'true');
      const sessionsUsed = parseInt(localStorage.getItem('sessionsUsed') || '0');
      updateSessionInfo(sessionsUsed, 999, true);

      setStep('success');
      setTimeout(() => {
        setUpgrading(false);
        onClose();
        window.location.reload();
      }, 2500);
    } catch (err) {
      console.error('Upgrade error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Payment processing failed. Please check your card details.');
      setUpgrading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !upgrading) {
      onClose();
    }
  };

  // Card details formatted for visualization
  const displayCardNumber = cardNumber.padEnd(19, '•').replace(/(.{4})/g, '$1 ');
  const displayExpiry = expiry || 'MM/YY';
  const displayCardName = cardName || 'CARDHOLDER NAME';

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
            background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(26, 61, 22, 0.45)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              background: isDark ? '#000000' : 'white',
              borderRadius: isDark ? '4px' : '16px',
              border: isDark ? '1px solid #00ffa3' : '1px solid #c8d5b9',
              padding: '32px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: isDark ? '0 0 32px rgba(0, 255, 163, 0.2)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              fontFamily: isDark ? "'Courier New', monospace" : 'inherit',
              color: isDark ? '#ffffff' : '#1a3d16',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Close button */}
            {!upgrading && (
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: isDark ? '#00ffa3' : '#666',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                ✕
              </button>
            )}

            {step === 'benefits' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>💎</div>
                  <h2
                    style={{
                      fontSize: '22px',
                      fontWeight: 'bold',
                      color: isDark ? '#00ffa3' : '#2d5a27',
                      textShadow: isDark ? '0 0 8px rgba(0, 255, 163, 0.4)' : 'none',
                      margin: '0 0 6px 0',
                    }}
                  >
                    Upgrade to Premium
                  </h2>
                  <p style={{ color: isDark ? '#888' : '#555', fontSize: '13px', margin: 0 }}>
                    Get unlimited access to all AI Interview features
                  </p>
                </div>

                {/* Benefits Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', marginBottom: '24px' }}>
                  <thead>
                    <tr style={{ borderBottom: isDark ? '1px solid #00ffa3' : '1px solid #c8d5b9' }}>
                      <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '13px', color: isDark ? '#00ffa3' : '#2d5a27' }}>Feature</th>
                      <th style={{ textAlign: 'center', padding: '8px 0', fontSize: '13px', color: isDark ? '#888' : '#555' }}>Free</th>
                      <th style={{ textAlign: 'center', padding: '8px 0', fontSize: '13px', color: isDark ? '#00ffa3' : '#2d5a27' }}>Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: isDark ? '1px solid #1a1a1a' : '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 0', fontSize: '13px' }}>Sessions Used</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', fontSize: '13px' }}>Max 3</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', color: isDark ? '#00ffa3' : '#2d5a27', fontWeight: 'bold', fontSize: '13px' }}>Unlimited</td>
                    </tr>
                    <tr style={{ borderBottom: isDark ? '1px solid #1a1a1a' : '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 0', fontSize: '13px' }}>Resume Tailoring</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', fontSize: '13px' }}>Limited</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', color: isDark ? '#00ffa3' : '#2d5a27', fontWeight: 'bold', fontSize: '13px' }}>Full Support</td>
                    </tr>
                    <tr style={{ borderBottom: isDark ? '1px solid #1a1a1a' : '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 0', fontSize: '13px' }}>AI Model Priority</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', fontSize: '13px' }}>Standard</td>
                      <td style={{ textAlign: 'center', padding: '10px 0', color: isDark ? '#00ffa3' : '#2d5a27', fontWeight: 'bold', fontSize: '13px' }}>High Speed</td>
                    </tr>
                  </tbody>
                </table>

                {/* Plan Pricing info */}
                <div style={{
                  padding: '16px',
                  borderRadius: isDark ? '3px' : '12px',
                  border: isDark ? '1px dashed #00ffa3' : '1px dashed #2d5a27',
                  textAlign: 'center',
                  marginBottom: '24px',
                  background: isDark ? 'rgba(0, 255, 163, 0.05)' : '#f4fbf4',
                }}>
                  <span style={{ fontSize: '12px', color: isDark ? '#888' : '#555', display: 'block', textTransform: isDark ? 'uppercase' : 'none' }}>One-Time Lifetime Access</span>
                  <span style={{ fontSize: '32px', fontWeight: '800', color: isDark ? '#00ffa3' : '#2d5a27', margin: '4px 0', display: 'block' }}>$19.99</span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => setStep('payment')}
                    style={{
                      background: isDark ? '#00ffa3' : '#2d5a27',
                      color: isDark ? '#000000' : '#ffffff',
                      border: 'none',
                      borderRadius: isDark ? '3px' : '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '800',
                      textTransform: isDark ? 'uppercase' : 'none',
                      boxShadow: isDark ? '0 0 12px rgba(0, 255, 163, 0.3)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={onClose}
                    style={{
                      background: 'transparent',
                      color: isDark ? '#888' : '#666',
                      border: isDark ? '1px solid #333' : '1px solid #ccc',
                      borderRadius: isDark ? '3px' : '8px',
                      padding: '10px 24px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Maybe Later
                  </button>
                </div>
              </>
            )}

            {step === 'payment' && (
              <form onSubmit={handleUpgradeClick}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: isDark ? '#00ffa3' : '#2d5a27',
                      textShadow: isDark ? '0 0 8px rgba(0, 255, 163, 0.4)' : 'none',
                      margin: '0 0 4px 0',
                    }}
                  >
                    Secure Checkout
                  </h2>
                  <p style={{ color: isDark ? '#888' : '#555', fontSize: '13px', margin: 0 }}>
                    Enter card details to unlock Premium ($19.99)
                  </p>
                </div>

                {/* Virtual Card Preview */}
                <div style={{
                  width: '100%',
                  height: '190px',
                  borderRadius: isDark ? '8px' : '14px',
                  background: isDark 
                    ? 'linear-gradient(135deg, #070f0b 0%, #000000 50%, #01140e 100%)' 
                    : 'linear-gradient(135deg, #2d5a27 0%, #1c3d18 100%)',
                  border: isDark ? '1px solid #00ffa3' : 'none',
                  boxShadow: isDark ? '0 0 20px rgba(0, 255, 163, 0.15)' : '0 10px 20px rgba(45, 90, 39, 0.2)',
                  padding: '24px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  color: 'white',
                }}>
                  {/* Subtle Grid Pattern for Dark Mode */}
                  {isDark && (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundImage: 'radial-gradient(rgba(0, 255, 163, 0.08) 1px, transparent 0)',
                      backgroundSize: '12px 12px',
                      pointerEvents: 'none',
                    }} />
                  )}
                  
                  {/* Card Header (Chip & Logo) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                    {/* Chip */}
                    <div style={{
                      width: '42px',
                      height: '30px',
                      borderRadius: '4px',
                      background: isDark 
                        ? 'linear-gradient(135deg, #00ffa3 0%, #006640 100%)' 
                        : 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)',
                      opacity: 0.85,
                      boxShadow: isDark ? '0 0 8px rgba(0, 255, 163, 0.4)' : 'none',
                      position: 'relative',
                    }}>
                      <div style={{ position: 'absolute', top: '10px', left: 0, width: '100%', height: '1px', background: 'rgba(0,0,0,0.2)' }} />
                      <div style={{ position: 'absolute', top: '20px', left: 0, width: '100%', height: '1px', background: 'rgba(0,0,0,0.2)' }} />
                      <div style={{ position: 'absolute', top: 0, left: '14px', width: '1px', height: '100%', background: 'rgba(0,0,0,0.2)' }} />
                      <div style={{ position: 'absolute', top: 0, left: '28px', width: '1px', height: '100%', background: 'rgba(0,0,0,0.2)' }} />
                    </div>
                    {/* Card Brand */}
                    <span style={{
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                      fontSize: '16px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      color: isDark ? '#00ffa3' : '#ffffff',
                    }}>PREMIUM PASS</span>
                  </div>

                  {/* Card Number */}
                  <div style={{
                    fontSize: isDark ? '18px' : '20px',
                    letterSpacing: '2.5px',
                    fontFamily: isDark ? "'Courier New', monospace" : "'Courier New', monospace",
                    textAlign: 'center',
                    margin: '20px 0',
                    zIndex: 1,
                    textShadow: isDark ? '0 0 6px #00ffa3' : '0 2px 4px rgba(0,0,0,0.3)',
                    color: isDark ? '#00ffa3' : '#ffffff',
                  }}>
                    {displayCardNumber}
                  </div>

                  {/* Card Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.7, letterSpacing: '1px' }}>Cardholder</span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        maxWidth: '220px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        letterSpacing: '1px',
                        fontFamily: isDark ? "'Courier New', monospace" : 'inherit',
                      }}>
                        {displayCardName}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.7, letterSpacing: '1px' }}>Expires</span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        fontFamily: isDark ? "'Courier New', monospace" : 'inherit',
                      }}>
                        {displayExpiry}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  {/* Cardholder Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: isDark ? '#888' : '#555', textTransform: isDark ? 'uppercase' : 'none' }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={handleCardNameChange}
                      placeholder="JOHN DOE"
                      style={{
                        padding: '10px 12px',
                        borderRadius: isDark ? '3px' : '6px',
                        border: isDark ? '1px solid #333' : '1px solid #ccc',
                        background: isDark ? '#111' : 'white',
                        color: isDark ? '#fff' : '#111',
                        fontSize: '14px',
                        fontFamily: isDark ? "'Courier New', monospace" : 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => isDark && (e.target.style.borderColor = '#00ffa3')}
                      onBlur={(e) => isDark && (e.target.style.borderColor = '#333')}
                    />
                  </div>

                  {/* Card Number */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: isDark ? '#888' : '#555', textTransform: isDark ? 'uppercase' : 'none' }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 1234 5678"
                      maxLength={19}
                      style={{
                        padding: '10px 12px',
                        borderRadius: isDark ? '3px' : '6px',
                        border: isDark ? '1px solid #333' : '1px solid #ccc',
                        background: isDark ? '#111' : 'white',
                        color: isDark ? '#fff' : '#111',
                        fontSize: '14px',
                        fontFamily: isDark ? "'Courier New', monospace" : 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => isDark && (e.target.style.borderColor = '#00ffa3')}
                      onBlur={(e) => isDark && (e.target.style.borderColor = '#333')}
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: isDark ? '#888' : '#555', textTransform: isDark ? 'uppercase' : 'none' }}>
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={expiry}
                        onChange={handleExpiryChange}
                        style={{
                          padding: '10px 12px',
                          borderRadius: isDark ? '3px' : '6px',
                          border: isDark ? '1px solid #333' : '1px solid #ccc',
                          background: isDark ? '#111' : 'white',
                          color: isDark ? '#fff' : '#111',
                          fontSize: '14px',
                          fontFamily: isDark ? "'Courier New', monospace" : 'inherit',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => isDark && (e.target.style.borderColor = '#00ffa3')}
                        onBlur={(e) => isDark && (e.target.style.borderColor = '#333')}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: isDark ? '#888' : '#555', textTransform: isDark ? 'uppercase' : 'none' }}>
                        CVV
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength={4}
                        value={cvv}
                        onChange={handleCvvChange}
                        style={{
                          padding: '10px 12px',
                          borderRadius: isDark ? '3px' : '6px',
                          border: isDark ? '1px solid #333' : '1px solid #ccc',
                          background: isDark ? '#111' : 'white',
                          color: isDark ? '#fff' : '#111',
                          fontSize: '14px',
                          fontFamily: isDark ? "'Courier New', monospace" : 'inherit',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => isDark && (e.target.style.borderColor = '#00ffa3')}
                        onBlur={(e) => isDark && (e.target.style.borderColor = '#333')}
                      />
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    style={{
                      background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                      border: isDark ? '1px solid #ef4444' : '1px solid #fecaca',
                      borderRadius: isDark ? '3px' : '4px',
                      padding: '10px',
                      marginBottom: '16px',
                      fontSize: '12px',
                      color: isDark ? '#ff6b6b' : '#dc2626',
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                {/* Checkout Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    disabled={upgrading}
                    onClick={() => setStep('benefits')}
                    style={{
                      background: 'transparent',
                      color: isDark ? '#888' : '#666',
                      border: isDark ? '1px solid #333' : '1px solid #ccc',
                      borderRadius: isDark ? '3px' : '8px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      cursor: upgrading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      flex: 1,
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={upgrading}
                    style={{
                      background: isDark ? '#00ffa3' : '#2d5a27',
                      color: isDark ? '#000000' : '#ffffff',
                      border: 'none',
                      borderRadius: isDark ? '3px' : '8px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '800',
                      textTransform: isDark ? 'uppercase' : 'none',
                      boxShadow: isDark ? '0 0 12px rgba(0, 255, 163, 0.3)' : 'none',
                      cursor: upgrading ? 'not-allowed' : 'pointer',
                      opacity: upgrading ? 0.7 : 1,
                      transition: 'all 0.2s ease',
                      flex: 2,
                    }}
                  >
                    {upgrading ? 'Processing...' : 'Pay $19.99'}
                  </button>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  style={{ fontSize: '56px', marginBottom: '16px' }}
                >
                  🎉
                </motion.div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: isDark ? '#00ffa3' : '#2d5a27',
                    margin: '0 0 8px 0',
                    textShadow: isDark ? '0 0 8px rgba(0, 255, 163, 0.4)' : 'none',
                  }}
                >
                  Upgrade Successful!
                </h2>
                <p style={{ color: isDark ? '#888' : '#555', fontSize: '14px', margin: 0 }}>
                  You are now a Premium member. Enjoy unlimited sessions!
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradePopup;
