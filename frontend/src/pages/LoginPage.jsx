import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';
import apiService from '../api/apiService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/* Inline spinner — no extra library */
const Spinner = () => (
  <div style={{
    width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.4)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin-btn 0.8s linear infinite',
    display: 'inline-block',
  }} />
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setAuthError } = useAuth();
  const { isDark } = useTheme();
  const { updateSessionInfo } = useSession();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setGeneralError('');
    const newErrors = validateForm();
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      const response = await apiService.login(formData.email, formData.password);
      const { user, token } = response.data;
      
      const sessionsUsed = response.data.sessionsUsed !== undefined ? response.data.sessionsUsed : (user.sessionsUsed || 0);
      const sessionsLeft = response.data.sessionsLeft !== undefined ? response.data.sessionsLeft : Math.max(0, 3 - sessionsUsed);
      const isPremium = response.data.isPremium !== undefined ? response.data.isPremium : (user.isPremium || false);
      const userId = response.data.userId || user.id;
      const userName = response.data.name || user.fullName;

      localStorage.setItem('userId',       userId);
      localStorage.setItem('userName',     userName);
      localStorage.setItem('isPremium',    isPremium);
      localStorage.setItem('sessionsUsed', sessionsUsed);
      localStorage.setItem('sessionsLeft', sessionsLeft);
      
      updateSessionInfo(sessionsUsed, sessionsLeft, isPremium);
      
      login(user, token);
      navigate('/home');
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Login failed. Please try again.';
      setGeneralError(message);
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="bg-white dark:bg-[#000000] min-h-screen transition-colors duration-300 flex items-center justify-center py-12 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-slate-800 rounded-2xl mb-4 shadow-lg shadow-black/20 hover:border-primary transition-all group">
            <span className="material-symbols-outlined text-white group-hover:text-primary text-2xl transition-colors">login</span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-white transition-colors duration-300">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 transition-colors duration-300">
            Sign in to your account
          </p>
        </motion.div>

        <Card variant="default" padding="large">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General error */}
            {generalError && (
              <motion.div
                className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ animation: 'fadeSlideUp 0.3s ease' }}
              >
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">{generalError}</p>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData(p => ({ ...p, email: e.target.value }));
                  if (errors.email) setErrors(prev => ({...prev, email: ''}));
                }}
                error={errors.email}
                placeholder="your@email.com"
                icon="mail"
              />
              {errors.email && (
                <p style={{
                  color: '#cc0000',
                  fontSize: 12,
                  marginTop: 4,
                  fontFamily: 'monospace',
                  animation: 'fadeSlideUp 0.3s ease'
                }}>
                  ⚠ {errors.email}
                </p>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData(p => ({ ...p, password: e.target.value }));
                  if (errors.password) setErrors(prev => ({...prev, password: ''}));
                }}
                onKeyDown={handleKeyDown}
                error={errors.password}
                placeholder="••••••••"
                icon="lock"
              />
              {errors.password && (
                <p style={{
                  color: '#cc0000',
                  fontSize: 12,
                  marginTop: 4,
                  fontFamily: 'monospace',
                  animation: 'fadeSlideUp 0.3s ease'
                }}>
                  ⚠ {errors.password}
                </p>
              )}
            </motion.div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 cursor-pointer" />
                <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">Remember me</span>
              </label>
              <Link to="/forgot-password" disabled className="text-sm text-primary dark:text-slate-400 hover:text-primary transition-colors duration-300">
                Forgot password?
              </Link>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full"
                style={{ cursor: 'pointer' }}
              >
                {isLoading
                  ? <span className="flex items-center justify-center gap-2"><Spinner /> Signing in...</span>
                  : 'Sign In'}
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700 transition-colors duration-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#0a0a0a] text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  New to Astra AI?
                </span>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <Link to="/signup">
                <Button type="button" variant="secondary" className="w-full">Create Account</Button>
              </Link>
            </motion.div>
          </form>
        </Card>

        <motion.p
          className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6 transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
