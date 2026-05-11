import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import HeroSection from '../components/Sections/HeroSection';
import FeatureBentoGrid from '../components/Sections/FeatureBentoGrid';
import HowItWorks from '../components/Sections/HowItWorks';
import FinalCTA from '../components/Sections/FinalCTA';
import Footer from '../components/layout/Footer';

// Modals
import LoginModal from '../components/common/LoginModal';
import SignupModal from '../components/common/SignupModal';

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  const switchToLogin = () => {
    closeSignupModal();
    openLoginModal();
  };

  const switchToSignup = () => {
    closeLoginModal();
    openSignupModal();
  };

  // If user visits /login or /signup, show popup modals (no standalone pages)
  useEffect(() => {
    const path = location.pathname;
    const params = new URLSearchParams(location.search);
    const auth = (params.get('auth') || '').toLowerCase();

    const shouldLogin = path === '/login' || auth === 'login';
    const shouldSignup = path === '/signup' || auth === 'signup';

    if (shouldLogin) {
      setIsSignupModalOpen(false);
      setIsLoginModalOpen(true);
    } else if (shouldSignup) {
      setIsLoginModalOpen(false);
      setIsSignupModalOpen(true);
    }
  }, [location.pathname, location.search]);

  const closeLoginAndCleanUrl = () => {
    closeLoginModal();
    if (location.pathname === '/login') navigate('/', { replace: true });
  };

  const closeSignupAndCleanUrl = () => {
    closeSignupModal();
    if (location.pathname === '/signup') navigate('/', { replace: true });
  };

  return (
    <div className="bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-body transition-colors duration-300">
      <TopNavBar 
        onLoginClick={openLoginModal} 
        onSignupClick={openSignupModal} 
      />
      <main className="pt-16">
        <HeroSection onStartTrial={openSignupModal} />
        <FeatureBentoGrid />
        <HowItWorks />
        <FinalCTA onStartTrial={openSignupModal} />
      </main>
      <Footer />

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginAndCleanUrl}
        onSwitchToSignup={switchToSignup}
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupAndCleanUrl}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};

export default LandingPage;