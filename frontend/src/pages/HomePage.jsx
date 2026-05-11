import React from 'react';
import { motion } from 'framer-motion';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/Sections/HeroSection';
import FeatureBentoGrid from '../components/Sections/FeatureBentoGrid';
import HowItWorks from '../components/Sections/HowItWorks';
import FinalCTA from '../components/Sections/FinalCTA';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate('/interview');
  };

  return (
    <div className="bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-body transition-colors duration-300">
      <TopNavBar />
      
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* We can customize the Hero for logged in users if we want, 
              but for now let's keep it consistent as requested */}
          <HeroSection onStartTrial={handleStartInterview} />
          <FeatureBentoGrid />
          <HowItWorks />
          <FinalCTA onStartTrial={handleStartInterview} />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
