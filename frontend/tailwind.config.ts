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
        "royal-blue": "#4169E1",
        "royal-purple": "#8A2BE2",
        "dark-royal-blue": "#2A4B9A",
        "dark-royal-purple": "#6A1B9A",
        gold: "#FFD700",
        // Vintage luxury palette
        charcoal: "#1C1C1E",
        "charcoal-light": "#2D2D30",
        cream: "#F5F0E8",
        "cream-dark": "#E8DFD0",
        "antique-gold": "#C9A961",
        "antique-gold-light": "#D4BC82",
        "antique-gold-dark": "#A68B4B",
        burgundy: "#722F37",
        "burgundy-light": "#8B3A44",
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
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "gentle-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "gold-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "promo-marquee": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
      },
      boxShadow: {
        vintage: "0 4px 24px rgba(28, 28, 30, 0.12), 0 1px 3px rgba(201, 169, 97, 0.15)",
        gold: "0 0 20px rgba(201, 169, 97, 0.3), 0 0 40px rgba(201, 169, 97, 0.1)",
        "gold-lg": "0 0 30px rgba(201, 169, 97, 0.4), 0 4px 20px rgba(28, 28, 30, 0.2)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-dancing)", "cursive"],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "move-circle-1": "move-circle-1 20s ease-in-out infinite",
        "move-circle-2": "move-circle-2 25s ease-in-out infinite reverse",
        "move-circle-3": "move-circle-3 18s ease-in-out infinite",
        "move-circle-4": "move-circle-4 22s ease-in-out infinite",
        "move-circle-5": "move-circle-5 28s ease-in-out infinite reverse",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "gentle-float": "gentle-float 4s ease-in-out infinite",
        "gold-pulse": "gold-pulse 3s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "slide-in-left": "slide-in-left 0.7s ease-out forwards",
        "slide-in-right": "slide-in-right 0.7s ease-out forwards",
        "promo-marquee": "promo-marquee 38s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
