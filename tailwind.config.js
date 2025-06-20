module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#00594C',
        secondary: '#03B1A9',
        background: '#f4f4f4',
        'text-dark': '#1f2937',
        'text-light': '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}