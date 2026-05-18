import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();
  const baseStyles = isDark 
    ? "font-mono uppercase tracking-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold border-none"
    : "font-headline font-bold transition-all flex items-center justify-center gap-2 cursor-pointer";
  
  const variants = {
    primary: isDark 
      ? "bg-[#00ffa3] text-[#000000] shadow-[0_0_16px_rgba(0,255,163,0.4)] hover:shadow-[0_0_28px_rgba(0,255,163,0.7)] hover:-translate-y-[1px]"
      : "bg-[#2d5a27] text-[#f5f5f0] hover:bg-[#1a3d16] shadow-[0px_20px_40px_rgba(45,90,39,0.15)]",
    secondary: isDark
      ? "bg-[#000000] text-[#00ffa3] border border-[#004d38] hover:bg-[#00ffa3] hover:text-[#000000]"
      : "bg-[#e8f0e0] text-[#2d5a27] hover:bg-[#d0e8d0]",
    outline: isDark
      ? "bg-transparent text-[#00ffa3] !border-[1px] !border-solid !border-[#00ffa3] hover:bg-[#00ffa3]/10 hover:shadow-[0_0_12px_rgba(0,255,163,0.2)]"
      : "bg-white border-0.5px border-[#2d5a27] text-[#2d5a27] hover:bg-[#f0f5ec]",
    gradient: isDark
      ? "bg-[#00ffa3] text-[#000000] shadow-[0_0_16px_rgba(0,255,163,0.4)] hover:shadow-[0_0_28px_rgba(0,255,163,0.7)] hover:-translate-y-[1px]"
      : "bg-gradient-to-r from-[#1a3d16] to-[#2d5a27] text-[#f5f5f0] hover:opacity-90 shadow-lg shadow-[#2d5a27]/20",
    ghost: isDark
      ? "bg-transparent text-[#00ffa3] hover:bg-[#00ffa3]/10"
      : "bg-transparent text-[#2d5a27] hover:bg-[#2d5a27]/10",
    danger: isDark
      ? "bg-[#1a0505] text-[#ff6b6b] border border-[#7f1d1d] hover:bg-[#3f0f0f]"
      : "bg-[#cc3300] text-white hover:bg-[#bb2e00]"
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
      style={isDark ? { borderRadius: '3px', fontFamily: "'Courier New', monospace" } : {}}
      whileHover={!disabled && !isDark ? { scale: 1.02 } : {}}
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