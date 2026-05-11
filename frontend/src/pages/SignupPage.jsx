import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import apiService from '../api/apiService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

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

const SignupPage = () => {
  const navigate = useNavigate();
  const { setAuthError } = useAuth();
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors]         = useState({});
  const [isLoading, setIsLoading]   = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMsg, setSuccessMsg]  = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const e = {};
    if (!formData.fullName)              e.fullName    = 'Please enter your name';
    else if (formData.fullName.length < 2) e.fullName  = 'Name must be at least 2 characters';

    if (!formData.email)                 e.email       = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Please enter a valid email';

    if (!formData.password)              e.password    = 'Please enter a password';
    else if (formData.password.length < 6) e.password  = 'Password must be at least 6 characters';

    if (!formData.confirmPassword)         e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match';

    if (!agreedToTerms) e.terms = 'You must agree to the terms';
    return e;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setGeneralError(''); setSuccessMsg('');
    const newErrors = validateForm();
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      await apiService.signup(formData.fullName, formData.email, formData.password);
      setSuccessMsg('Account created! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Signup failed. Please try again.';
      setGeneralError(message);
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-300 flex items-center justify-center py-12 px-4">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/20">
            <span className="material-symbols-outlined text-white text-2xl">person_add</span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
            Create Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 transition-colors duration-300">
            Start your interview preparation journey
          </p>
        </motion.div>

        <Card variant="default" padding="large">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Success */}
            {successMsg && (
              <motion.div
                className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-green-800 dark:text-green-200 text-sm font-medium">{successMsg}</p>
              </motion.div>
            )}

            {/* General error */}
            {generalError && (
              <motion.div
                className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">{generalError}</p>
              </motion.div>
            )}

            {[
              { label: 'Full Name',        type: 'text',     name: 'fullName',        ph: 'John Doe',     icon: 'person',     delay: 0.2 },
              { label: 'Email Address',    type: 'email',    name: 'email',           ph: 'your@email.com', icon: 'mail',     delay: 0.25 },
              { label: 'Password',         type: 'password', name: 'password',        ph: '••••••••',     icon: 'lock',       delay: 0.3 },
              { label: 'Confirm Password', type: 'password', name: 'confirmPassword', ph: '••••••••',     icon: 'lock_check', delay: 0.35 },
            ].map(f => (
              <motion.div key={f.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: f.delay }}>
                <Input
                  label={f.label} type={f.type} name={f.name}
                  value={formData[f.name]} onChange={handleChange}
                  onKeyDown={f.name === 'confirmPassword' ? handleKeyDown : undefined}
                  error={errors[f.name]} placeholder={f.ph} icon={f.icon}
                  helperText={f.name === 'password' ? 'At least 6 characters' : ''}
                />
              </motion.div>
            ))}

            {/* Terms */}
            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
              <input
                type="checkbox" id="terms" checked={agreedToTerms}
                onChange={e => { setAgreedToTerms(e.target.checked); if (errors.terms) setErrors(p => ({ ...p, terms: '' })); }}
                className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 cursor-pointer mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer transition-colors duration-300">
                I agree to the{' '}
                <Link to="/terms" className="text-[#2563eb] dark:text-[#60a5fa] hover:underline font-medium">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#2563eb] dark:text-[#60a5fa] hover:underline font-medium">Privacy Policy</Link>
              </label>
            </motion.div>
            {errors.terms && <p className="text-red-600 dark:text-red-400 text-sm -mt-2">{errors.terms}</p>}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Button type="submit" variant="primary" disabled={isLoading} className="w-full" style={{ cursor: 'pointer' }}>
                {isLoading
                  ? <span className="flex items-center justify-center gap-2"><Spinner /> Creating Account...</span>
                  : 'Create Account'}
              </Button>
            </motion.div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700 transition-colors duration-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Already have an account?
                </span>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Link to="/login">
                <Button type="button" variant="secondary" className="w-full">Sign In</Button>
              </Link>
            </motion.div>
          </form>
        </Card>

        <motion.p
          className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6 transition-colors duration-300"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        >
          Join thousands of candidates preparing for their dream jobs
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
