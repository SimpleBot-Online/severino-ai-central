const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  parser: 'postcss-scss',
  plugins: [
    tailwindcss,
    autoprefixer,
  ]
}
