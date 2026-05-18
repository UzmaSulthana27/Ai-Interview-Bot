import React from 'react';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();
  const percentage = Math.min((value / max) * 100, 100);

  const variants = {
    primary: isDark
      ? 'bg-[#00ffa3] shadow-[0_0_10px_#00ffa3]'
      : 'bg-[#2d5a27]',
    secondary: isDark
      ? 'bg-[#00ffa3]/80 shadow-[0_0_8px_rgba(0,255,163,0.5)]'
      : 'bg-[#4a6741]',
    tertiary: 'bg-slate-400',
    success: isDark ? 'bg-[#00ffa3]' : 'bg-[#2d5a27]',
    warning: 'bg-[#e8a020]',
    error: 'bg-[#cc3300]'
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
          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#2d5a27]'}`}>
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