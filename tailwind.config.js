/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.js",
    "./components/**/*.js",
  ],
  theme: {
    screens: {
      'sm': '512px',
      'md': '512px',
      'lg': '512px',
      'xl': '512px',
      '2xl': '512px',
    },
    extend: {
      height: {
        button: '50px',
      },
      fontFamily: {
        mulish: "Mulish",
      },
      blur: {
        sm: '2px'
      },
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        backgrop: 'rgba(0,0,0,0.3)'
      }
    },
  },
  plugins: [],
}
