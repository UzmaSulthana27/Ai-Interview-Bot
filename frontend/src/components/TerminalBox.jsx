import { useState, useEffect } from 'react';

export default function TerminalBox({ question, jobRole }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!question) {
      setDisplayedText('');
      return;
    }
    
    setDisplayedText('');
    let currentIndex = 0;
    
    const intervalId = setInterval(() => {
      if (currentIndex < question.length) {
        setDisplayedText(question.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 28);
    
    return () => clearInterval(intervalId);
  }, [question]);

  return (
    <div style={styles.terminalBox}>
      {/* Window Controls */}
      <div style={styles.controlsRow}>
        <div style={{...styles.dot, backgroundColor: '#ff5f56'}}></div>
        <div style={{...styles.dot, backgroundColor: '#ffbd2e'}}></div>
        <div style={{...styles.dot, backgroundColor: '#27c93f', boxShadow: '0 0 6px #27c93f'}}></div>
      </div>
      
      {/* Content */}
      <div style={styles.terminalContent}>
        <div style={styles.firstLine}>
          $ ./ai_interviewer --role="{jobRole}" --start
        </div>
        <div style={styles.questionLine}>
          <span>{displayedText}</span>
          <span style={styles.cursor}></span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  terminalBox: {
    backgroundColor: '#0a0a0c', // Darker than card-bg
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '24px',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
  },
  controlsRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  terminalContent: {
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#ffffff',
  },
  firstLine: {
    color: 'var(--text-muted)',
    marginBottom: '12px',
  },
  questionLine: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap',
    color: 'var(--accent-color)', // Question written in glowing neon text
    textShadow: '0 0 4px rgba(74, 222, 128, 0.4)',
  },
  cursor: {
    display: 'inline-block',
    width: '8px',
    height: '16px',
    backgroundColor: 'var(--accent-color)',
    boxShadow: '0 0 8px rgba(74, 222, 128, 0.8)',
    animation: 'blink 1s steps(2, start) infinite',
    marginLeft: '4px',
    transform: 'translateY(2px)' // align slightly with text base
  }
};
