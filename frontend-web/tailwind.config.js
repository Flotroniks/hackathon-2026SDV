/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 20px 45px -25px rgba(18, 54, 42, 0.35)',
      },
    },
  },
  daisyui: {
    themes: [
      {
        carbon: {
          primary: '#2f6f59',
          'primary-content': '#f5fbf8',
          secondary: '#6a8f7c',
          accent: '#d9a84f',
          neutral: '#20332c',
          'neutral-content': '#eef4f1',
          'base-100': '#f7f8f5',
          'base-200': '#edf1ea',
          'base-300': '#d8e2d8',
          'base-content': '#17251f',
          info: '#4b8dbd',
          success: '#2f8f5b',
          warning: '#d39a34',
          error: '#c84f4f',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
