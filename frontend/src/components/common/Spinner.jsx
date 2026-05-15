import React from 'react';

const Spinner = ({ 
  size = 'medium',
  color = 'primary',
  className = ''
}) => {
  const sizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };
  
  const colors = {
    primary: 'border-slate-800 border-t-[#2d5a27]',
    secondary: 'border-secondary border-t-transparent',
    white: 'border-white border-t-transparent'
  };
  
  return (
    <div 
      className={`
        ${sizes[size]}
        ${colors[color]}
        rounded-full
        animate-spin
        ${className}
      `}
    ></div>
  );
};

export default Spinner;