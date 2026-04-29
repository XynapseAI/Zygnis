export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yugi: {
          purple: '#4B0082',
          gold: '#FFD700',
          dark: '#1a1a2e',
          card: '#cba052'
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'], // We'll import a pixel font
      }
    },
  },
  plugins: [],
}
