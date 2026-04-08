import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import FeatureCarousel from '../components/FeatureCarousel';

export default function RegisterPage() {
  const [name, setName]      = useState('');
  const [email, setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]    = useState('');
  const [loading, setLoading]= useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      await API.post('/auth/register', { name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <p className="subtitle">user sequence registration</p>

          {error && (
            <div className="error-message animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label className="input-label" htmlFor="name">$ identity</label>
              <input 
                id="name"
                type="text" 
                className="input-field" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>

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
              {loading ? 'building...' : '$ create --account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="link-button">have an account? execute login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}