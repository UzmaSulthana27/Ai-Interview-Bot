export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;
  
  return (
    <div style={styles.wrapper}>
      <div style={styles.barContainer}>
        <div style={{ ...styles.filledBar, width: `${percentage}%` }}></div>
      </div>
      <div style={styles.label}>
        $ progress: [Q{current}/{total}]
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
    marginBottom: '24px'
  },
  barContainer: {
    width: '100%',
    height: '4px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  filledBar: {
    height: '100%',
    backgroundColor: 'var(--accent-color)',
    boxShadow: 'var(--accent-glow)',
    transition: 'width 0.3s ease'
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'right'
  }
};
