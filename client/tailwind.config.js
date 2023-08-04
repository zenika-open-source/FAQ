/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      "primary": "#af1e3a",
      "primary-light": "#e65564",
      "primary-dark": "#790015",
      "primary-font": "#ffffff",
      "primary-font-dark": "#000000",
      "secondary": "#d0d0d0",
      "secondary-light": "#fff",
      "secondary-dark": "#9f9f9f",
      "secondary-font": "#494949",
      "secondary-font-light": "#586069",
      "secondary-font-dark": "#000000",
      "background": "#edf2f5",
      "info": "#209cee",
      "success": "#23d160",
      "warning": "#ff9900",
      "error": "#ff3860",
    },
    fontSize: {
      sm: "0.7rem",
      base: "14px",
      lg: "1.1rem",
      xl: "1.3rem"
    },
    extend: {
      spacing: {
        'navbar': "64px"
      }
    }
  },
  plugins: [],
}