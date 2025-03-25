
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '3xs': '16rem',
      },
      borderRadius: {
        'xs': '0.125rem',
      },
      colors: {
        'cosmic-purple': {
          '50': '#f8f5ff',
          '100': '#f0e6ff',
          '200': '#e4d1ff',
          '300': '#d0b0ff',
          '400': '#b683ff',
          '500': '#9f54ff',
          '600': '#8e31f5',
          '700': '#7a20db',
          '800': '#661db3',
          '900': '#571d91',
          '950': '#370f66',
        },
        'cosmic-blue': {
          '50': '#f0f7ff',
          '100': '#e0eefe',
          '200': '#baddff',
          '300': '#7ec2ff',
          '400': '#3aa5ff',
          '500': '#0b80ff',
          '600': '#0063f5',
          '700': '#004be0',
          '800': '#0741b3',
          '900': '#0c3c8c',
          '950': '#0b244f',
        },
        'cosmic-green': {
          '50': '#efffee',
          '100': '#d7ffdb',
          '200': '#b2ffc0',
          '300': '#76ff95',
          '400': '#33ff62',
          '500': '#06ed3a',
          '600': '#00cc27',
          '700': '#00a123',
          '800': '#077f24',
          '900': '#096821',
          '950': '#003b10',
        },
      },
      fontFamily: {
        'game': ['"Press Start 2P"', 'cursive'],
        'futuristic': ['Orbitron', 'sans-serif'],
        'handwritten': ['Kalam', 'cursive'],
      },
    },
  },
  plugins: [],
}
