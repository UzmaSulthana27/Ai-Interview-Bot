import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../api/apiService';
import Input from './Input';
import Button from './Button';

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { signup, setAuthError } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    

    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms';
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
      const response = await apiService.signup(formData.fullName, formData.email, formData.password);
      const { user, token } = response.data;
      signup(user, token);
      setTimeout(() => navigate('/home', { replace: true }), 300);
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      setGeneralError(message);
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      password: ''
    });
    setErrors({});
    setGeneralError('');
    setAgreedToTerms(false);
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
            <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-xl dark:shadow-black/50 transition-colors duration-300 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-slate-700 transition-colors duration-300">
                <div>
                  <h2 className="font-headline text-lg font-bold text-white dark:text-[#4ade80] transition-colors duration-300">
                    Create Account
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 transition-colors duration-300">
                    Join us today
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

                {/* Full Name Input */}
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="John Doe"
                  icon="person"
                />

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
                  helperText={formData.password && !errors.password ? "✓ Valid password" : ""}
                />



                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 py-1">
                  <input 
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (errors.terms) {
                        setErrors(prev => ({
                          ...prev,
                          terms: ''
                        }));
                      }
                    }}
                    className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 cursor-pointer mt-0.5 flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer transition-colors duration-300 leading-tight">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-600 dark:text-red-400 text-xs transition-colors duration-300 -mt-2">
                    {errors.terms}
                  </p>
                )}

                {/* Signup Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-2 text-sm !bg-primary !text-[#f5f5f0] hover:!bg-primary/20 dark:!bg-primary dark:!text-[#f5f5f0] dark:hover:!bg-primary/20"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-sm">
                        refresh
                      </span>
                      Creating...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                {/* Already have account */}
                <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-3 transition-colors duration-300">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-white dark:text-[#4ade80] hover:underline font-bold"
                  >
                    Sign In
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

export default SignupModal;
