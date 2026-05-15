import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InteractiveCard, { InteractiveCardsGrid } from '../common/InteractiveCard';

/**
 * Quick Actions Section using Interactive Cards
 * Can be added to Dashboard or any page
 */

const QuickActionsSection = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      variant: 'green',
      title: 'Start Interview',
      subtitle: 'Practice Mock Session',
      icon: 'video_chat',
      onClick: () => navigate('/interviews')
    },
    {
      variant: 'purple',
      title: 'Upload Resume',
      subtitle: 'Get Personalized Questions',
      icon: 'description',
      onClick: () => navigate('/resume')
    },
    {
      variant: 'cyan',
      title: 'View Analytics',
      subtitle: 'Track Progress',
      icon: 'trending_up',
      onClick: () => navigate('/analytics')
    },
    {
      variant: 'pink',
      title: 'Browse Roles',
      subtitle: 'Explore Positions',
      icon: 'work',
      onClick: () => console.log('Browse roles')
    }
  ];

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Section Header */}
      <motion.h2
        className="text-2xl font-bold font-headline text-white dark:text-[#4ade80] mb-6 transition-colors duration-300"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        Quick Actions
      </motion.h2>

      {/* Cards Grid */}
      <div className="flex flex-col gap-4 max-w-3xl">
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            onHoverStart={(e) => {
              // Optional: Add custom hover logic
            }}
          >
            <InteractiveCard {...action} />
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <motion.p
        className="text-sm text-slate-600 dark:text-slate-400 mt-6 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        💡 Hover over any card to see interactive effects
      </motion.p>
    </motion.div>
  );
};

export default QuickActionsSection;
