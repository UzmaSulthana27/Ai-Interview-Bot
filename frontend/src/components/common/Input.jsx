import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          className="block mb-2 transition-colors duration-300"
          style={isDark 
            ? { fontFamily: "'Courier New', monospace", color: '#166534', fontSize: '14px', textTransform: 'uppercase' }
            : { fontFamily: 'var(--font-label)', fontWeight: 600, color: '#1a3d16', fontSize: '14px' }
          }
        >
          {label}
          {required && <span className="text-[#cc3300] dark:text-[#cc3300] ml-1">*</span>}
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
            focus:outline-none
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-all duration-200
            ${isDark 
              ? 'bg-[#0d0d0d] border border-[#14532d] text-[#00ffa3] placeholder:text-[#166534] focus:border-[#00ffa3] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(0,255,163,0.1),0_0_12px_rgba(0,255,163,0.15)] font-mono tracking-[1px]'
              : 'bg-white border-slate-800 border rounded-xl text-white placeholder:text-[#6b7c63] focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10'
            }
          `}
          style={isDark ? { borderRadius: '3px' } : {}}
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