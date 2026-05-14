import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import InterviewPage from './pages/InterviewPage';
import ResumePage from './pages/ResumePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ScanlineOverlay = () => {
  const { isDark } = useTheme();
  if (!isDark) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      right: 0, bottom: 0,
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74,222,128,0.015) 2px, rgba(74,222,128,0.015) 4px)',
      pointerEvents: 'none',
      zIndex: 9999,
    }} />
  );
};

function App() {
  return (
    <ThemeProvider>
      <ScanlineOverlay />
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            {/* Kept for backwards compatibility — shows popup modal, not a dedicated page */}
            <Route path="/login" element={<LandingPage />} />
            <Route path="/signup" element={<LandingPage />} />

            {/* Protected Routes — new */}
            <Route path="/home" element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute><HistoryPage /></ProtectedRoute>
            } />
            {/* /interview alias used by InterviewPage flow */}
            <Route path="/interview" element={
              <ProtectedRoute><InterviewPage /></ProtectedRoute>
            } />

            {/* Protected Routes — existing */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/interviews" element={
              <ProtectedRoute><InterviewPage /></ProtectedRoute>
            } />
            <Route path="/resume" element={
              <ProtectedRoute><ResumePage /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><SettingsPage /></ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;