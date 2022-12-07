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
        backgroundColor: '#3F4E4F',
        textColor: '#2C3639',
        headerColor: '#2C3639',
        wrapperColor: '#DCD7C9',
        buttonColor: {
          main: '#A27B5C',
          hover: '#957255',
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
