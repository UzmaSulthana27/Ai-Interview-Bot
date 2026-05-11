import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  as: Component = 'button'
}) => {
  const baseStyles = "font-headline font-bold transition-all flex items-center justify-center gap-2 cursor-pointer";
  
  const variants = {
    primary: "bg-primary dark:bg-[#2d8c4e] text-white dark:text-slate-100 hover:signature-glow dark:hover:bg-emerald-700 shadow-[0px_20px_40px_rgba(57,44,193,0.15)] dark:shadow-lg dark:shadow-primary/30",
    secondary: "bg-surface-container-highest dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-surface-variant dark:hover:bg-slate-600",
    outline: "bg-transparent border-2 border-primary dark:border-emerald-400 text-primary dark:text-[#4ade80] hover:bg-primary dark:hover:bg-[#2d8c4e] hover:text-white dark:hover:text-white",
    gradient: "signature-glow text-white hover:opacity-90 shadow-lg shadow-primary/20 dark:shadow-lg dark:shadow-primary/40",
    ghost: "bg-transparent text-primary dark:text-[#4ade80] hover:bg-primary/10 dark:hover:bg-[#2d8c4e]/20",
    danger: "bg-error dark:bg-red-700 text-white dark:text-slate-100 hover:bg-error/90 dark:hover:bg-red-800"
  };
  
  const sizes = {
    small: "px-4 py-2 text-sm rounded-lg",
    medium: "px-6 py-3 text-base rounded-xl",
    large: "px-8 py-4 text-lg rounded-xl"
  };
  
  const disabledStyles = "opacity-50 cursor-not-allowed";
  
  const MotionComponent = motion[Component] || motion.button;
  
  return (
    <MotionComponent
      type={Component === 'button' ? type : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${disabled ? disabledStyles : ''} 
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {icon && iconPosition === 'left' && (
        <motion.span 
          className="material-symbols-outlined"
          animate={{ x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <motion.span 
          className="material-symbols-outlined"
          animate={{ x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.span>
      )}
    </MotionComponent>
  );
};

export default Button;