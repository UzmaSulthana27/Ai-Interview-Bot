import React from 'react';

const IconBadge = ({ 
  icon, 
  color = 'primary',
  size = 'medium',
  variant = 'filled',
  pulse = false,
  className = ''
}) => {
  const sizes = {
    small: { container: 'w-8 h-8', icon: 'text-sm' },
    medium: { container: 'w-12 h-12', icon: 'text-base' },
    large: { container: 'w-16 h-16', icon: 'text-2xl' }
  };
  
  const colors = {
    primary: {
      filled: 'bg-primary-fixed',
      gradient: 'signature-glow',
      outline: 'border-2 border-primary bg-transparent'
    },
    secondary: {
      filled: 'bg-secondary-fixed',
      gradient: 'bg-gradient-to-br from-secondary to-secondary-container',
      outline: 'border-2 border-secondary bg-transparent'
    },
    tertiary: {
      filled: 'bg-tertiary-fixed',
      gradient: 'bg-gradient-to-br from-tertiary to-tertiary-container',
      outline: 'border-2 border-tertiary bg-transparent'
    },
    success: {
      filled: 'bg-green-100',
      gradient: 'bg-gradient-to-br from-green-400 to-green-600',
      outline: 'border-2 border-green-500 bg-transparent'
    },
    error: {
      filled: 'bg-error-container',
      gradient: 'bg-gradient-to-br from-error to-red-700',
      outline: 'border-2 border-error bg-transparent'
    }
  };
  
  const iconColors = {
    primary: variant === 'gradient' ? 'text-white' : 'text-primary',
    secondary: variant === 'gradient' ? 'text-white' : 'text-secondary',
    tertiary: variant === 'gradient' ? 'text-white' : 'text-tertiary',
    success: variant === 'gradient' ? 'text-white' : 'text-green-600',
    error: variant === 'gradient' ? 'text-white' : 'text-error'
  };
  
  const pulseAnimation = pulse ? 'animate-pulse' : '';
  
  return (
    <div className={`
      ${sizes[size].container}
      ${colors[color][variant]}
      rounded-xl
      flex items-center justify-center
      ${pulseAnimation}
      ${className}
    `}>
      <span 
        className={`material-symbols-outlined ${sizes[size].icon} ${iconColors[color]}`}
        style={{fontVariationSettings: "'FILL' 1"}}
      >
        {icon}
      </span>
    </div>
  );
};

export default IconBadge;