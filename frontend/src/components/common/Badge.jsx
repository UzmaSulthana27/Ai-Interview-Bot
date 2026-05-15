import React from 'react';

const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  icon,
  pill = false,
  className = ''
}) => {
  const baseStyles = "inline-flex items-center gap-1 font-label font-bold";
  
  const variants = {
    primary: "bg-[#e8f0e0] text-primary border-0.5px border-slate-800",
    secondary: "bg-[#e8f0e0] text-[#5a8a52] border-0.5px border-slate-800",
    tertiary: "bg-[#f0f5ec] text-primary",
    success: "bg-[#f0f5ec] text-primary border-0.5px border-slate-800",
    warning: "bg-[#fff8e8] text-[#7a5c00] border-0.5px border-[#e8c84a]",
    error: "bg-[#fff5f0] text-[#cc3300] border-0.5px border-[#ffccbb]",
    neutral: "bg-white dark:bg-[#1a1a1a] text-white dark:text-[#4ade80] border-0.5px border-slate-800",
    gradient: "bg-gradient-to-r from-[#1a3d16] to-[#2d5a27] text-[#f5f5f0]"
  };
  
  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-2 text-base"
  };
  
  const shape = pill ? "rounded-full" : "rounded-lg";
  
  return (
    <span className={`
      ${baseStyles}
      ${variants[variant]}
      ${sizes[size]}
      ${shape}
      ${className}
    `}>
      {icon && (
        <span className="material-symbols-outlined text-xs" 
              style={{fontVariationSettings: "'FILL' 1"}}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
