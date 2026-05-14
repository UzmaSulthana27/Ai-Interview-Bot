import React from 'react';

const ProgressBar = ({ 
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'medium',
  showLabel = false,
  label,
  animated = false,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#1a3d16] to-[#2d5a27] dark:bg-[#4ade80]',
    secondary: 'bg-[#5a8a52] dark:bg-[#5a8a52]',
    tertiary: 'bg-[#c8e6c0] dark:bg-[#c8e6c0]',
    success: 'bg-[#2d5a27] dark:bg-[#4ade80]',
    warning: 'bg-[#e8a020] dark:bg-[#e8a020]',
    error: 'bg-[#cc3300] dark:bg-[#cc3300]'
  };
  
  const sizes = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3'
  };
  
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-label text-[#5a8a52] dark:text-[#c8e6c0]">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-bold text-[#2d5a27]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-[#e8f0e0] rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`
            ${sizes[size]} 
            ${variants[variant]} 
            rounded-full 
            transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;