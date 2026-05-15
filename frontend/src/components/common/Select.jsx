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
        <label className="block text-sm font-label font-semibold text-white dark:text-[#166534] mb-2 transition-colors duration-300">
          {label}
          {required && <span className="text-[#cc3300] dark:text-[#cc3300] ml-1">*</span>}
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
            bg-white dark:bg-[#1a1a1a]
            border-0.5px
            ${error ? 'border-[#cc3300] dark:border-[#cc3300]' : 'border-slate-800 dark:border-[#4a6044]'}
            rounded-xl
            text-white dark:text-[#4ade80]
            focus:outline-none
            focus:border-[#2d5a27]
            ${error ? 'focus:ring-2 focus:ring-[#cc3300]/20 dark:focus:ring-[#cc3300]/30' : 'focus:ring-2 focus:ring-[#2d5a27]/10 dark:focus:ring-[#2d5a27]/30'}
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