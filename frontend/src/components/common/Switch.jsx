import React from 'react';

const Switch = ({ 
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          w-11 h-6 rounded-full transition-colors
          ${checked ? 'bg-primary' : 'bg-surface-container-high'}
        `}>
          <div className={`
            absolute top-0.5 left-0.5
            w-5 h-5
            rounded-full
            bg-white
            shadow-md
            transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}></div>
        </div>
      </div>
      {label && (
        <span className="text-sm font-label text-on-surface select-none">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;