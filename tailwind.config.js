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
        comment: 'Open Sans'
      },
      blur: {
        sm: '2px'
      },
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        backgroundColor: '#B9B7BD',
        textColor: '#868B8E',
        headerColor: '#868B8E',
        wrapperColor: '#EEEDE7',
        buttonColor: {
          main: '#7cc2af',
          hover: '#6fbca7',
        },
        backgropColor: 'rgba(0,0,0,0.3)',
        delete: {
          primary: 'hsl(var(--delete) / <alpha-value>)',
          hover: 'hsl(var(--delete-hover) / <alpha-value>)',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
