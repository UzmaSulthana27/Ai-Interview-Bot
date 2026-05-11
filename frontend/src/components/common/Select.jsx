import React from 'react';

const Select = ({ 
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  className = ''
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-label font-semibold text-slate-900 dark:text-slate-300 mb-2 transition-colors duration-300">
          {label}
          {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full
            pl-4 pr-10 py-3
            bg-white dark:bg-slate-700
            border-2
            ${error ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'}
            rounded-xl
            text-slate-900 dark:text-slate-100
            focus:outline-none
            focus:ring-2
            ${error ? 'focus:ring-red-500/20 dark:focus:ring-red-500/20' : 'focus:ring-indigo-500/20 dark:focus:ring-emerald-500/30'}
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
            appearance-none
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 transition-colors duration-300">
            expand_more
          </span>
        </div>
      </div>
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'} transition-colors duration-300`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;