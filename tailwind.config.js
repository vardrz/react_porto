/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "primary": "#14FFEC",
      "secondary": "#0D7377",
      "light": "#EAF2F0",
      "dark": "#12181A",
      "dark2": "#1D2528",
      "surface": "#161E1F",
      "line": "rgba(234,242,240,0.08)",
      "glow": "rgba(20,255,236,0.35)",
      transparency: "transparent",
      current: "currentColor",
      black: "#000000",
      white: "#ffffff",
    },
    extend: {
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(-8px)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
