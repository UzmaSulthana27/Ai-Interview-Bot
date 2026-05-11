import React, { useState } from 'react';
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
        onClose={closeLoginModal}
        onSwitchToSignup={switchToSignup}
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};

export default LandingPage;