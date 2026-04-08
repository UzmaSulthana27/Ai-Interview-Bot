import { FiCpu } from 'react-icons/fi';

export default function FeatureCarousel() {
  return (
    <div style={styles.container}>
      {/* Subtle blueprint grid overlay */}
      <div style={styles.blueprintGrid}></div>
      
      <div style={styles.content} className="animate-fade-in-up">
        {/* Removed hover-float */}
        <div style={styles.brandHeader}>
          <div style={styles.iconContainer}>
            <FiCpu className="mega-icon animate-pulse" />
          </div>
          <h1 className="nexus-logo-large animate-breathing-glow" style={styles.logoText}>
            nexus
          </h1>
          <p style={styles.tagline}>
            intelligent mock interview framework
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#0a0a0c', 
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  },
  blueprintGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `linear-gradient(rgba(74, 222, 128, 0.05) 1px, transparent 1px), 
                      linear-gradient(90deg, rgba(74, 222, 128, 0.05) 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
    zIndex: 1,
    maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
    WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
  },
  content: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default'
  },
  brandHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '24px'
  },
  iconContainer: {
    marginBottom: '4px'
  },
  logoText: {
    fontSize: '76px', 
    margin: 0,
    letterSpacing: '-2px'
  },
  tagline: {
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    color: 'var(--text-muted)',
    letterSpacing: '3px',
    margin: 0,
    marginTop: '16px',
    opacity: 0.9,
    textTransform: 'uppercase'
  }
};
