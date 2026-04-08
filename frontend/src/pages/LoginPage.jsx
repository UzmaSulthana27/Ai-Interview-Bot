import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import FeatureCarousel from '../components/FeatureCarousel';

export default function LoginPage() {
  const [email, setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]    = useState('');
  const [loading, setLoading]= useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await API.post('/auth/login', { email, password });
      
      // Robustly pull the ID and Name depending on backend JSON structure
      const parsedUserId = res.data.userId || res.data._id || res.data?.user?._id || res.data?.user?.id;
      const parsedUserName = res.data.userName || res.data.name || res.data.user?.name || res.data.user?.userName || 'User';

      localStorage.setItem('userId', parsedUserId);
      localStorage.setItem('userName', parsedUserName);
      
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-layout">
      {/* Marketing / Carousel Side on the Left */}
      <div className="split-right">
        <FeatureCarousel />
      </div>

      {/* Auth Side on the Right */}
      <div className="split-left">
        <div className="auth-card">
          <h1 className="mono-logo">nexus ai</h1>
          <p className="subtitle">terminal initialization</p>

          {error && (
            <div className="error-message animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label" htmlFor="email">$ email</label>
              <input 
                id="email"
                type="email" 
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@nexus.ai"
              />
            </div>

            <div className="input-group mb-2">
              <label className="input-label" htmlFor="password">$ password</label>
              <input 
                id="password"
                type="password" 
                className="input-field" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary mt-6" disabled={loading}>
              {loading ? 'executing...' : '$ login --start'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/register" className="link-button">no account? build sequence →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}