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
        "on-secondary-fixed-variant": "#5a00c6",
        "on-secondary-container": "#fffbff",
        "primary": "#392cc1",
        "surface-container-high": "#e6e8ea",
        "inverse-surface": "#2d3133",
        "on-primary-fixed": "#100069",
        "surface-container": "#eceef0",
        "surface-bright": "#f7f9fb",
        "secondary-container": "#8a4cfc",
        "surface-container-low": "#f2f4f6",
        "secondary": "#712ae2",
        "on-primary": "#ffffff",
        "on-error": "#ffffff",
        "tertiary-fixed": "#acedff",
        "on-primary-container": "#dbd7ff",
        "surface-tint": "#5148d7",
        "on-primary-fixed-variant": "#372abf",
        "on-tertiary-fixed-variant": "#004e5c",
        "on-tertiary": "#ffffff",
        "background": "#f7f9fb",
        "tertiary-fixed-dim": "#4cd7f6",
        "on-secondary-fixed": "#25005a",
        "surface-variant": "#e0e3e5",
        "surface-container-lowest": "#ffffff",
        "on-surface-variant": "#464555",
        "primary-fixed-dim": "#c3c0ff",
        "on-error-container": "#93000a",
        "surface": "#f7f9fb",
        "error-container": "#ffdad6",
        "surface-container-highest": "#e0e3e5",
        "secondary-fixed": "#eaddff",
        "primary-fixed": "#e3dfff",
        "on-secondary": "#ffffff",
        "surface-dim": "#d8dadc",
        "outline": "#777587",
        "error": "#ba1a1a",
        "outline-variant": "#c7c4d8",
        "tertiary": "#00505f",
        "on-surface": "#191c1e",
        "secondary-fixed-dim": "#d2bbff",
        "inverse-primary": "#c3c0ff",
        "primary-container": "#534ad9",
        "on-background": "#191c1e",
        "on-tertiary-container": "#93e8ff",
        "tertiary-container": "#006a7c",
        "on-tertiary-fixed": "#001f26",
        "inverse-on-surface": "#eff1f3"
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