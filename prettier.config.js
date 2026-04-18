/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/app/globals.css",
  tailwindFunctions: ["cva", "cn"],
};
