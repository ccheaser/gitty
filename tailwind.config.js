/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Koyu mod için 'dark' sınıfını kullan
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#10B981',
          dark: '#8B5CF6',
        },
        secondary: {  // Secondary renk eklendi
          light: '#F97316',
          dark: '#F97316',
        },
        background: {
          light: '#F9FAFB',
          dark: '#1F2937',
        },
        card: {
          light: '#FFFFFF',
          dark: '#2D3748',
        },
        text: {
          light: '#1F2937',
          dark: '#D1D5DB',
        },
        muted: {
          light: '#6B7280',
          dark: '#9CA3AF',
        },
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 7s infinite',
        slideUp: 'slideUp 0.5s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out',
        scaleIn: 'scaleIn 0.5s ease-out',
        bounce: 'bounce 1s infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
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
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
    },
  },
  plugins: [],
}