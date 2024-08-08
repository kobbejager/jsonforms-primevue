/** @type {import('tailwindcss').Config} */
const primeui = require('tailwindcss-primeui');

// tailwind.config.js
module.exports = {
    content: [
        "./index.html", 
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./presets/**/*.{js,vue,ts}",],
    plugins: [primeui],
};