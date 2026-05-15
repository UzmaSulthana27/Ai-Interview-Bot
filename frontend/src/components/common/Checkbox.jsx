import React from 'react';

const Checkbox = ({ 
  label,
  checked,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="
          w-5 h-5
          rounded
          border-2 border-slate-800 dark:border-[#4a6044]
          text-primary dark:text-[#4ade80]
          focus:ring-2 focus:ring-[#2d5a27]/20 dark:focus:ring-[#2d5a27]/30
          disabled:cursor-not-allowed
          transition-all
          dark:bg-[#1a1a1a]
        "
      />
      <span className="text-sm font-label text-white dark:text-[#4ade80] select-none transition-colors duration-300">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;