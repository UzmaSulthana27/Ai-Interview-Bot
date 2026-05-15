module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'reverse-spin-slow': 'reverse-spin 12s linear infinite',
      },
      keyframes: {
        'reverse-spin': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      colors: {
        "on-secondary-fixed-variant": "#5a8a52",
        "on-secondary-container": "#ffffff",
        "primary": "#00ffa3",
        "surface-container-high": "#e8f0e0",
        "inverse-surface": "#1a1a1a",
        "on-primary-fixed": "#001a00",
        "surface-container": "#ede8e0",
        "surface-bright": "#f5f5f0",
        "secondary-container": "#c8d5b9",
        "surface-container-low": "#f0ebe3",
        "secondary": "#5a8a52",
        "on-primary": "#f5f5f0",
        "on-error": "#ffffff",
        "tertiary-fixed": "#c8e6c0",
        "on-primary-container": "#e8f0e0",
        "surface-tint": "#2d5a27",
        "on-primary-fixed-variant": "#1a3d16",
        "on-tertiary-fixed-variant": "#0d3d1a",
        "on-tertiary": "#ffffff",
        "background": "#f5f5f0",
        "tertiary-fixed-dim": "#4ade80",
        "on-secondary-fixed": "#001a00",
        "surface-variant": "#c8d5b9",
        "surface-container-lowest": "#ffffff",
        "on-surface-variant": "#4a6044",
        "primary-fixed-dim": "#c8e6c0",
        "on-error-container": "#ffffff",
        "surface": "#f5f5f0",
        "error-container": "#fff5f0",
        "surface-container-highest": "#e8f0e0",
        "secondary-fixed": "#e8f0e0",
        "primary-fixed": "#e8f0e0",
        "on-secondary": "#ffffff",
        "surface-dim": "#d8d3cb",
        "outline": "#6b7c63",
        "error": "#cc3300",
        "outline-variant": "#c8d5b9",
        "tertiary": "#2d5a27",
        "on-surface": "#1a3d16",
        "secondary-fixed-dim": "#c8e6c0",
        "inverse-primary": "#c8e6c0",
        "primary-container": "#1a3d16",
        "on-background": "#1a3d16",
        "on-tertiary-container": "#c8e6c0",
        "tertiary-container": "#0d3d1a",
        "on-tertiary-fixed": "#001a00",
        "inverse-on-surface": "#f5f5f0"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}