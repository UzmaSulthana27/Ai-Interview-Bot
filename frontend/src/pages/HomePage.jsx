import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiCpu } from 'react-icons/fi';

export default function HomePage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  const [jobRole, setJobRole] = useState('Java Developer');

  const handleStartInterview = () => {
    localStorage.setItem('jobRole', jobRole);
    navigate('/interview');
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('jobRole');
    navigate('/');
  };

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="center-flex" style={styles.content}>
        <div style={styles.cardContainer}>
          {/* Animated Nexus AI branding */}
          <div style={styles.logoHeader}>
            <h1 className="nexus-logo-large" style={styles.logoWrapper}>
              <FiCpu style={styles.cpuIcon} /> 
              nexus ai
            </h1>
            <p style={styles.tagline}>
              intelligent mock interview framework
            </p>
          </div>

          <div style={styles.card} className="auth-card">
            <h2 style={styles.greeting}>hello, {userName}</h2>
            <p className="subtitle" style={styles.subtext}>ready to initialize sequence?</p>
            
            <div className="input-group mt-6">
              <label className="input-label" htmlFor="jobRole">$ select --role</label>
              <select 
                id="jobRole"
                className="input-field select-field"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              >
                <option value="Java Developer">Java Developer</option>
                <option value="React Developer">React Developer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>

            <div style={styles.buttonGroup}>
              <button className="btn-primary" onClick={handleStartInterview}>
                $ execute session
              </button>
              <button className="btn-outline" onClick={() => navigate('/history')}>
                view history →
              </button>
            </div>

            <div className="text-center mt-8">
              <button onClick={handleLogout} className="link-button" style={styles.logoutLink}>
                logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  content: {
    padding: '24px 16px',
    alignItems: 'flex-start',
    paddingTop: '64px'
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '520px'
  },
  logoHeader: {
    textAlign: 'center', 
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px'
  },
  cpuIcon: {
    fontSize: '56px',
    color: 'var(--accent-color)',
    filter: 'drop-shadow(0 0 12px rgba(74, 222, 128, 0.4))'
  },
  tagline: {
    fontFamily: 'var(--font-mono)', 
    color: 'var(--text-muted)', 
    opacity: 0.9, 
    margin: 0,
    fontSize: '16px',
    letterSpacing: '1px'
  },
  card: {
    textAlign: 'left',
    width: '100%'
  },
  greeting: {
    fontSize: '28px',
    margin: '0 0 8px 0',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600'
  },
  subtext: {
    textAlign: 'left',
    marginBottom: '32px'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '32px'
  },
  logoutLink: {
    color: 'var(--text-muted)',
    fontSize: '13px'
  }
};