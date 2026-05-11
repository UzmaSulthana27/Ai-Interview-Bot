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
          border-2 border-outline dark:border-slate-500
          text-primary dark:text-emerald-500
          focus:ring-2 focus:ring-primary/20 dark:focus:ring-emerald-500/30
          disabled:cursor-not-allowed
          transition-all
          dark:bg-slate-700
        "
      />
      <span className="text-sm font-label text-slate-900 dark:text-slate-100 select-none transition-colors duration-300">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;