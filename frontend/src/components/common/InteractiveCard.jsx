import React from 'react';
import { motion } from 'framer-motion';

/**
 * Interactive Card Component with hover effects
 * Features: Scale on hover, blur sibling cards, smooth transitions
 * Suitable for showcasing features, stats, or interactive elements
 */

const InteractiveCard = ({ 
  variant = 'indigo', 
  title, 
  subtitle, 
  icon,
  onClick,
  containerClassName = ''
}) => {
  const colorVariants = {
    indigo: 'from-indigo-600 to-indigo-700 dark:from-[#0a1128] dark:to-[#1e1b4b]',
    purple: 'from-purple-600 to-purple-700 dark:from-[#0a1128] dark:to-[#2e1065]',
    cyan: 'from-cyan-600 to-cyan-700 dark:from-[#0a1128] dark:to-[#083344]',
    pink: 'from-pink-600 to-pink-700 dark:from-[#0a1128] dark:to-[#500724]',
    green: 'from-green-600 to-green-700 dark:from-[#0a1128] dark:to-[#064e3b]',
    blue: 'from-blue-600 to-blue-700 dark:from-[#0a1128] dark:to-[#172554]',
  };

  return (
    <motion.div
      className={`
        bg-gradient-to-br ${colorVariants[variant]}
        p-6 rounded-2xl w-full
        flex items-center gap-6
        text-white cursor-pointer
        transition-all duration-500
        hover:shadow-2xl hover:shadow-${variant}-500/40 relative overflow-hidden glass-panel
        group hover-lift card-hover
        ${containerClassName}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      {/* Icon */}
      {icon && (
        <motion.div
          className="mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>
            {icon}
          </span>
        </motion.div>
      )}

      {/* Title */}
      <p className="text-sm font-bold font-headline leading-tight group-hover:scale-105 transition-transform">
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs opacity-90 mt-1">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

/**
 * Interactive Cards Container
 * Manages blur effect on sibling cards on hover
 */
export const InteractiveCardsGrid = ({ cards, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          animate={{
            filter: hoveredIndex !== null && hoveredIndex !== index ? 'blur(8px) brightness(0.9)' : 'blur(0px) brightness(1)',
            scale: hoveredIndex !== null && hoveredIndex !== index ? 0.95 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <InteractiveCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};

export default InteractiveCard;
