const plugin = require('tailwindcss/plugin');
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{html,scss,ts}",
  ],
  purge: {
    enabled: process.env.TAILWIND_MODE === 'build',
    content: [
      './src/**/*.{html,scss,ts}',
    ],
  },
  // darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      'inter-tight': 'Inter Tight',
    },
    backgroundPosition: {
      bottom: 'bottom',
      center: 'center',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-top': 'right top',
      top: 'top',
    },
  },
  variants: {},
};
