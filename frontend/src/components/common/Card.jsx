import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'medium',
  hover = false,
  border = false,
  className = ''
}) => {
  const { isDark } = useTheme();
  
  const baseStyles = isDark
    ? "bg-[#0d0d0d] border border-[#14532d] transition-all duration-300"
    : "bg-white rounded-2xl border-0.5px border-[#c8d5b9] transition-all duration-300";
  
  const variants = {
    default: isDark
      ? "hover:bg-[#111111] hover:border-[#4ade80]"
      : "hover:shadow-xl hover:border-[#2d5a27]",
    glass: isDark
      ? "bg-transparent border border-[#14532d]"
      : "glass-panel shadow-xl",
    gradient: isDark
      ? "bg-[#0d0d0d] border border-[#4ade80] shadow-[0_0_16px_rgba(74,222,128,0.08)]"
      : "bg-gradient-to-r from-[#1a3d16] to-[#2d5a27] text-white",
    bordered: isDark
      ? "border-2 border-[#14532d] hover:border-[#4ade80]"
      : "border-2 border-[#c8d5b9] hover:border-[#2d5a27]",
    elevated: isDark
      ? "shadow-[0_0_16px_rgba(74,222,128,0.08)] hover:shadow-[0_0_24px_rgba(74,222,128,0.12)] transform hover:-translate-y-[1px]"
      : "shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
  };
  
  const paddings = {
    none: "",
    small: "p-4",
    medium: "p-6",
    large: "p-8"
  };
  
  const borderAccent = border ? "border-l-4 border-[#2d5a27]" : "";
  
  return (
    <motion.div 
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${borderAccent}
        ${className}
      `}
      style={isDark ? { borderRadius: '4px' } : {}}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;