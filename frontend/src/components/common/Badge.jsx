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
    primary: "bg-primary-fixed text-primary",
    secondary: "bg-secondary-fixed text-secondary",
    tertiary: "bg-tertiary-fixed text-tertiary",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-error-container text-error",
    neutral: "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100",
    gradient: "signature-glow text-white"
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
