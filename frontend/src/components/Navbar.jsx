import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('jobRole');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div>
        <span className="nav-logo">nexus ai</span>
      </div>
      <div className="nav-right">
        <span className="neon-username">[{userName}]</span>
        <button 
          onClick={handleLogout} 
          className="nav-logout"
          title="Logout"
        >
          <span className="req-desktop-text">logout</span>
          <span className="req-mobile-icon">×</span>
        </button>
      </div>
    </nav>
  );
}
