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
    primary: 'signature-glow dark:bg-emerald-500',
    secondary: 'bg-secondary dark:bg-slate-500',
    tertiary: 'bg-tertiary dark:bg-slate-400',
    success: 'bg-green-500 dark:bg-green-600',
    warning: 'bg-yellow-500 dark:bg-yellow-600',
    error: 'bg-error dark:bg-red-600'
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
          <span className="text-sm font-label text-slate-700 dark:text-slate-300">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-surface-container-high rounded-full overflow-hidden ${sizes[size]}`}>
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