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
    primary: 'bg-[#00ffa3] shadow-[0_0_10px_#00ffa3]',
    secondary: 'bg-[#00ffa3]/80 shadow-[0_0_8px_#00ffa3/50]',
    tertiary: 'bg-slate-400',
    success: 'bg-[#00ffa3]',
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
          <span className="text-sm font-label text-slate-400 dark:text-slate-300">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-bold text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${sizes[size]}`}>
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