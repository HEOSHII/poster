/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        background: {
          light: '#F7ECDE',
          dark: '#222831',
        },

        textColor: {
          light: '#393939',
          dark: '#EEEEEE',
        },

        header: {
          light: "#E9DAC1",
          dark: '#393E46',
        },

        container: {
          light: '#FBF8F1',
          dark: '#393E46'
        },

        button: {
          light: '#54BAB9',
          dark: '#FFD369'
        },

        backdrop: 'rgba(0,0,0,0.3)',

        delete: 'hsl(var(--delete) / <alpha-value>)',        
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
