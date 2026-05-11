import React, { useState } from 'react';

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon,
  disabled = false,
  required = false,
  fullWidth = false,
  name = '',
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-label font-semibold text-slate-900 dark:text-slate-300 mb-2 transition-colors duration-300">
          {label}
          {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 transition-colors duration-300">
              {icon}
            </span>
          </div>
        )}
        
        <input
          type={currentType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            ${icon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'} py-3
            bg-white dark:bg-slate-700
            border-2
            ${error ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'}
            rounded-xl
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-500 dark:placeholder:text-slate-400
            focus:outline-none
            focus:ring-2
            ${error ? 'focus:ring-red-500/20 dark:focus:ring-red-500/30' : 'focus:ring-indigo-500/20 dark:focus:ring-emerald-500/30'}
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-all duration-200
          `}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
          >
            <span className="material-symbols-outlined text-sm md:text-base">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'} transition-colors duration-300`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;