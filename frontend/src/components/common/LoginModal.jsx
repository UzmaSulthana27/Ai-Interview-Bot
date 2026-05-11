import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../api/apiService';
import Input from './Input';
import Button from './Button';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const navigate = useNavigate();
  const { login, setAuthError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.login(formData.email, formData.password);
      const { user, token } = response.data;
      login(user, token);
      setTimeout(() => navigate('/home', { replace: true }), 300);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setGeneralError(message);
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: ''
    });
    setErrors({});
    setGeneralError('');
    setRememberMe(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-black/50 transition-colors duration-300 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-slate-700 transition-colors duration-300">
                <div>
                  <h2 className="font-headline text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
                    Sign In
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 transition-colors duration-300">
                    Welcome back
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                {/* General Error */}
                {generalError && (
                  <motion.div 
                    className="p-2 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-red-800 dark:text-red-200 text-xs font-medium transition-colors duration-300">
                      {generalError}
                    </p>
                  </motion.div>
                )}

                {/* Email Input */}
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="your@email.com"
                  icon="mail"
                />

                {/* Password Input */}
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                  icon="lock"
                />

                {/* Remember Me */}
                <div className="flex items-center gap-2 py-1">
                  <input 
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer transition-colors duration-300">
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-2 text-sm !bg-[#1a2e1a] !text-white hover:!bg-black dark:!bg-slate-100 dark:!text-slate-900 dark:hover:!bg-white"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-sm">
                        refresh
                      </span>
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Create account */}
                <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-3 transition-colors duration-300">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-slate-900 dark:text-slate-100 hover:underline font-bold"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
