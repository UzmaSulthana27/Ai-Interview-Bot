import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiTrash2 } from 'react-icons/fi';

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      // Retaining previous endpoint since the backend route might only enforce /history prefix on the controller
      const res = await API.get(`/interview/history/${userId}`);
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
    setLoading(false);
  };

  const handleDelete = async (e, session) => {
    e.stopPropagation(); // prevent clicking the row when clicking delete
    
    // Spring Boot often expects a strict Long or UUID. Find the exact primary key property:
    const sessionId = session.id || session._id || session.sessionId || session.interviewId;
    
    console.log("Attempting to delete session: ", session);
    console.log("Extracted ID: ", sessionId);

    if (!sessionId) {
      alert("Error: Missing session ID. Check browser console.");
      return;
    }

    try {
      // Connects to @DeleteMapping("/history/{sessionId}") with @RequestParam Long userId
      await API.delete(`/interview/history/${sessionId}?userId=${userId}`);
      // Optimistically slice from state so UI refreshes without reload
      setSessions((prev) => prev.filter(s => (s.id || s._id || s.sessionId || s.interviewId) !== sessionId));
    } catch (err) {
      console.error('Failed to delete session', err);
      alert('Error deleting session. Ensure backend is running.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="page-container history-container">
      <Navbar />
      
      <div className="center-flex" style={styles.layout}>
        <div style={styles.card} className="auth-card">
          
          <div style={styles.headerRow}>
            <h2 style={styles.title}>// session_history.log</h2>
            <button style={styles.backBtn} onClick={() => navigate('/home')}>
              ← ~/home
            </button>
          </div>

          <div style={styles.sessionsList}>
            {loading ? (
              <p style={{fontFamily: 'var(--font-mono)', color: 'var(--text-muted)'}}>parsing logs...</p>
            ) : sessions.length === 0 ? (
               <div style={styles.emptyState}>
                 <p style={styles.emptyText}>no logs detected. initialize sequence  →</p>
                 <button className="btn-primary mt-4" onClick={() => navigate('/home')}>
                   $ run --interview
                 </button>
               </div>
            ) : (
               sessions.map((session, i) => (
                 <div 
                   key={session._id || session.id || i} 
                   style={{...styles.sessionCard, animationDelay: `${i * 0.1}s`}} 
                   className="animate-slide-up"
                   onMouseEnter={(e) => {
                     e.currentTarget.style.borderColor = 'var(--accent-color)';
                     e.currentTarget.style.boxShadow = 'var(--accent-glow)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.borderColor = 'var(--border-color)';
                     e.currentTarget.style.boxShadow = 'none';
                   }}
                 >
                   <div style={styles.sessionLeft}>
                     <div style={styles.sessionTitle}>
                       <span style={{color: 'var(--accent-color)', marginRight: '8px'}}>λ</span>
                       {session.jobRole || 'Unknown Role'}
                     </div>
                     <div style={styles.sessionDate}>
                       [{formatDate(session.createdAt || session.date)}]
                     </div>
                   </div>
                   
                   <div style={styles.sessionRight}>
                     <span style={styles.badge}>v{i + 1}.0</span>
                     
                     <button 
                       onClick={(e) => handleDelete(e, session)}
                       style={styles.deleteBtn}
                       title="Delete Session"
                     >
                       <FiTrash2 />
                     </button>
                   </div>
                 </div>
               ))
            )}
          </div>

          {sessions.length > 0 && (
             <button 
               className="btn-outline mt-8" 
               onClick={() => navigate('/home')}
               style={{width: '100%'}}
             >
               $ execute new_session
             </button>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    padding: '24px 16px',
    alignItems: 'flex-start',
    paddingTop: '64px'
  },
  card: {
    maxWidth: '600px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontFamily: 'var(--font-mono)',
    fontSize: '20px',
    margin: 0,
    color: 'var(--accent-color)',
    textShadow: '0 0 6px rgba(74, 222, 128, 0.3)'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  sessionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: '#141417',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    opacity: 0 
  },
  sessionLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  sessionTitle: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 'bold',
    fontSize: '15px',
    color: 'var(--text-primary)'
  },
  sessionDate: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  sessionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  badge: {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-muted)',
    border: 'var(--border-style)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)'
  },
  deleteBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    color: '#ef4444', /* neon red */
    fontSize: '18px',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '50%',
    transition: 'all 0.2s ease'
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px 0'
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px'
  }
};