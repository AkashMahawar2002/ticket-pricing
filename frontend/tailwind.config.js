/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#101828', coral: '#ef6f61', mist: '#f5f7fa' },
      fontFamily: { sans: ['DM Sans', 'ui-sans-serif', 'system-ui'] },
      boxShadow: { soft: '0 18px 50px rgba(16, 24, 40, 0.08)' }
    }
  },
  plugins: []
};
