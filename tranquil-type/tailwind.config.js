/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cosmos': {
          primary: '#1a1a2e',
          secondary: '#16213e',
          accent: '#0f3460',
        },
        'serenity': {
          primary: '#2c3e50',
          secondary: '#34495e',
          accent: '#3498db',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
  safelist: [
    'text-white',
    'text-gray-400',
    'text-green-400',
    'text-red-400',
    'bg-white',
    'bg-gray-400',
    'bg-green-400',
    'bg-red-400',
    'hover:bg-white',
    'hover:bg-gray-400',
    'hover:bg-green-400',
    'hover:bg-red-400',
  ],
} 