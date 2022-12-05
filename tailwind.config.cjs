const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    /* add the blue color */
    extend: {
      colors: {
        boavizta_blue: '#003864',
        boavizta_green: '#008A8C'
      }
    }
  },
  plugins: []
};