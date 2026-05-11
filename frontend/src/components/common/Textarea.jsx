import React from 'react';

const Textarea = ({ 
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  rows = 4,
  disabled = false,
  required = false,
  fullWidth = false,
  maxLength,
  showCount = false,
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
      
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full
          px-4 py-3
          bg-surface-container-low
          border-2
          ${error ? 'border-error' : 'border-transparent'}
          rounded-xl
          text-on-surface
          placeholder:text-on-surface-variant
          focus:outline-none
          focus:ring-2
          ${error ? 'focus:ring-error/20' : 'focus:ring-primary/20'}
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition-all
          resize-none
        `}
      />
      
      <div className="flex items-center justify-between mt-2">
        {(error || helperText) && (
          <p className={`text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'} transition-colors duration-300`}>
            {error || helperText}
          </p>
        )}
        {showCount && maxLength && (
          <p className="text-sm text-slate-600 dark:text-slate-400 ml-auto transition-colors duration-300">
            {value?.length || 0} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default Textarea;