
import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import TerminalBox from '../components/TerminalBox';

export default function InterviewPage() {
  const [question, setQuestion]   = useState('');
  const [answer, setAnswer]       = useState('');
  const [feedback, setFeedback]   = useState('');
  const [score, setScore]         = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [qCount, setQCount]       = useState(1);
  const [isAnswerMode, setIsAnswerMode] = useState(false);
  
  const navigate  = useNavigate();
  const userId    = localStorage.getItem('userId');
  const jobRole   = localStorage.getItem('jobRole');
  const answerRef = useRef(null);

  useEffect(() => { 
    startInterview(); 
  }, []);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await API.post(`/interview/start?jobRole=${jobRole}&userId=${userId}`);
      setSessionId(res.data.sessionId);
      setQuestion(res.data.question);
      setIsAnswerMode(true);
    } catch (err) {
      alert('Failed to start interview. Please try again.');
    }
    setLoading(false);
  };

  const extractScore = (text) => {
    if (!text) return '?';
    const match = text.match(/(\d+)\s*\/\s*10/);
    return match ? match[1] : '?';
  };

  const originalSubmitAnswer = async () => {
      if (!answer.trim()) {
        alert('Please type your answer first!');
        return;
      }
      setLoading(true);
      try {
        const res = await API.post('/interview/answer', {
          sessionId,
          question,
          answer
        });
        setFeedback(res.data.feedback);
        setScore(res.data.score || extractScore(res.data.feedback));
        setQuestion(res.data.nextQuestion);
        setAnswer('');
        setQCount(q => q + 1);
      } catch (err) {
        alert('Failed to submit answer. Please try again.');
      }
      setLoading(false);
  };

  return (
    <div className="page-container" style={{backgroundColor: 'var(--bg-color)'}}>
      <Navbar />
      
      <div className="center-flex" style={{padding: '24px 16px', alignItems: 'flex-start'}}>
        <div className="auth-card" style={styles.interviewContainer}>
          
          <ProgressBar current={qCount} total={5} />
          
          <TerminalBox question={question} jobRole={jobRole} />
          
          {feedback && (
            <div style={styles.feedbackBox} className="animate-slide-up">
              <div style={styles.feedbackHeader}>
                <span style={styles.feedbackLabel}>// ai_feedback.log</span>
                <span style={styles.scoreBadge}>score: {score}/10</span>
              </div>
              <p style={styles.feedbackText}>{feedback}</p>
            </div>
          )}

          <div style={styles.answerWrapper} className="input-field">
            <div style={styles.answerLabel}>// your_answer.txt</div>
            <textarea
              ref={answerRef}
              style={styles.textarea}
              placeholder="awaiting candidate input..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={5}
              disabled={loading}
            />
          </div>

          <div style={styles.btnRow}>
            <button 
              className="btn-primary" 
              onClick={originalSubmitAnswer} 
              disabled={loading}
              style={styles.primaryBtn}
            >
              {loading ? 'executing...' : '$ submit --answer'}
            </button>
            <button 
              className="btn-outline" 
              onClick={() => navigate('/history')}
              style={styles.secondaryBtn}
            >
              escape →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  interviewContainer: {
    maxWidth: '800px',
    padding: '32px',
    backgroundColor: 'var(--card-bg)',
    position: 'relative',
    marginTop: '16px'
  },
  feedbackBox: {
    backgroundColor: 'rgba(74, 222, 128, 0.03)',
    border: '1px solid var(--accent-color)',
    boxShadow: 'var(--accent-glow)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px'
  },
  feedbackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  feedbackLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--accent-color)',
    textShadow: '0 0 4px rgba(74, 222, 128, 0.4)'
  },
  scoreBadge: {
    backgroundColor: '#0a0a0c',
    color: 'var(--accent-color)',
    border: '1px solid var(--accent-color)',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'bold',
    boxShadow: '0 0 6px rgba(74, 222, 128, 0.3)'
  },
  feedbackText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--text-primary)'
  },
  answerWrapper: {
    padding: '16px',
    marginBottom: '24px'
  },
  answerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '12px'
  },
  textarea: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    lineHeight: '1.5'
  },
  btnRow: {
    display: 'flex',
    gap: '16px',
    flexDirection: 'row',
    '@media (max-width: 600px)': {
      flexDirection: 'column'
    }
  },
  primaryBtn: {
    flex: 2
  },
  secondaryBtn: {
    flex: 1
  }
};