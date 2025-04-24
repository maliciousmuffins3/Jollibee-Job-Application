/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blood: '#ef4444', // ✅ Fixed (changed semicolon to a comma)
      },
    },
  },
  plugins: [require("daisyui")], // Enable DaisyUI
  daisyui: {
    themes: [
      "light", 
      "dark", 
      "cupcake", 
      {
        redtheme: {
          "primary": "#dc2626",  // Strong red
          "secondary": "#b91c1c",
          "accent": "#7f1d1d",
          "neutral": "#111827",
          "base-100": "#ffffff",
          "info": "#fca5a5",
          "success": "#16a34a",
          "warning": "#facc15",
          "error": "#b91c1c",
        },
      },
    ],
  },
};
