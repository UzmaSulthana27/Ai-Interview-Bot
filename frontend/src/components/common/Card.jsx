import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'medium',
  hover = false,
  border = false,
  className = ''
}) => {
  const baseStyles = "bg-surface-container-lowest dark:bg-slate-800 rounded-2xl border border-outline-variant/10 dark:border-slate-700 transition-all duration-300";
  
  const variants = {
    default: "hover:shadow-xl dark:shadow-black/20",
    glass: "glass-panel shadow-xl dark:shadow-2xl dark:shadow-black/40",
    gradient: "signature-glow text-white dark:shadow-2xl dark:shadow-primary/40",
    bordered: "border-2 border-outline-variant/30 dark:border-slate-600 hover:border-primary/50",
    elevated: "shadow-lg hover:shadow-2xl dark:shadow-black/40 transform hover:-translate-y-1"
  };
  
  const paddings = {
    none: "",
    small: "p-4",
    medium: "p-6",
    large: "p-8"
  };
  
  const borderAccent = border ? "border-l-4 border-primary" : "";
  
  return (
    <motion.div 
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${borderAccent}
        ${className}
      `}
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