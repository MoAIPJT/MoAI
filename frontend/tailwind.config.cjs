/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",              // Vite 루트에 있는 index.html
    "./src/**/*.{js,ts,jsx,tsx}" // src 폴더 내 모든 js/ts/jsx/tsx 파일
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
