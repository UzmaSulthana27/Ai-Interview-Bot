import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();

  return (
    <motion.div
      className={`
        p-6 rounded-2xl w-full
        flex items-center gap-6
        cursor-pointer
        transition-all duration-500
        hover:shadow-2xl relative overflow-hidden glass-panel
        group hover-lift card-hover
        ${isDark ? 'bg-[#000000] border border-[#004d38] hover:border-[#00ffa3] text-[#00ffa3]' : 'bg-gradient-to-br from-[#1a3d16] to-[#2d5a27] text-white hover:shadow-green-900/40'}
        ${containerClassName}
      `}
      style={isDark ? { borderRadius: '3px' } : {}}
      whileHover={isDark ? { scale: 1.02, boxShadow: '0 0 16px rgba(74,222,128,0.2)' } : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? 'bg-[rgba(74,222,128,0.05)]' : 'bg-white/5'}`}></div>
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
      <p className={`text-sm font-bold font-headline leading-tight group-hover:scale-105 transition-transform ${isDark ? 'font-mono uppercase tracking-widest' : ''}`}>
        {isDark ? title.toUpperCase() : title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className={`text-xs opacity-90 mt-1 ${isDark ? 'font-mono text-[#166534]' : ''}`}>
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
