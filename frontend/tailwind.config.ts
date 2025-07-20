import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom Colors
        "royal-blue": "#4169E1", // A shade of royal blue
        "royal-purple": "#8A2BE2", // A shade of royal purple
        "dark-royal-blue": "#2A4B9A", // Darker shade for text
        "dark-royal-purple": "#6A1B9A", // Darker shade for text
        gold: "#FFD700", // Standard gold
        "pink-gradient-start": "#FFC0CB", // Light pink
        "pink-gradient-end": "#DA70D6", // Orchid/medium purple-pink
        // Updated background gradient colors
        "bg-white": "#FFFFFF",
        "bg-light-pink": "#FCE4EC", // Very light pink
        "bg-light-violet": "#E6E6FA", // Light lavender/violet
        // New title gradient colors
        "title-gradient-white": "#FFFFFF",
        "title-gradient-purple-pink": "#DA70D6", // Orchid/medium purple-pink
        "title-gradient-gold": "#FFD700",
        // New lighter footer gradient colors
        "light-purple": "#D8BFD8", // Thistle
        "light-pink": "#FFB6C1", // Light Pink
        "light-gold": "#FFECB3", // Light Gold (similar to a pale yellow)
        "footer-gradient-light-start": "#D8BFD8", // Light Purple
        "footer-gradient-light-end": "#FFB6C1", // Light Pink
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Custom keyframes for moving shapes
        "move-circle-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(20vw, 10vh) scale(1.2)" },
          "50%": { transform: "translate(0, 20vh) scale(0.8)" },
          "75%": { transform: "translate(-20vw, 10vh) scale(1.1)" },
        },
        "move-circle-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(-15vw, -5vh) scale(0.9)" },
          "50%": { transform: "translate(10vw, -15vh) scale(1.3)" },
          "75%": { transform: "translate(5vw, 10vh) scale(0.7)" },
        },
        "move-circle-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(10vw, -10vh) scale(1.1)" },
          "50%": { transform: "translate(-10vw, 5vh) scale(0.9)" },
          "75%": { transform: "translate(0, -15vh) scale(1.2)" },
        },
        "move-circle-4": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(-25vw, 15vh) scale(1.1)" },
          "50%": { transform: "translate(15vw, 25vh) scale(0.9)" },
          "75%": { transform: "translate(-5vw, -10vh) scale(1.3)" },
        },
        "move-circle-5": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(18vw, -8vh) scale(0.8)" },
          "50%": { transform: "translate(-12vw, -18vh) scale(1.2)" },
          "75%": { transform: "translate(7vw, 12vh) scale(1.0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "move-circle-1": "move-circle-1 20s ease-in-out infinite",
        "move-circle-2": "move-circle-2 25s ease-in-out infinite reverse",
        "move-circle-3": "move-circle-3 18s ease-in-out infinite",
        "move-circle-4": "move-circle-4 22s ease-in-out infinite",
        "move-circle-5": "move-circle-5 28s ease-in-out infinite reverse",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
