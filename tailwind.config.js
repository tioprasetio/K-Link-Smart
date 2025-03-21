/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js", // Add the Flowbite components
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
