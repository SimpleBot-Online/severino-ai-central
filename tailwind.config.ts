
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Share Tech Mono'", "monospace"],
        mono: ["'Share Tech Mono'", "monospace"],
        cyber: ["'Orbitron'", "sans-serif"],
      },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        severino: {
          dark: "#0F0F14",
          pink: "#FF003C",
          cyan: "#00FFC8",
          gray: "#1A1A22",
          lightgray: "#25252F",
        },
        cyber: {
          primary: "#00FFC8",
          secondary: "#FF003C",
          tertiary: "#7C00FF",
          dark: "#0F0F14",
          light: "#EEFFFF",
          code: "#00FFC8",
          warning: "#FF9D00",
          error: "#FF003C",
          glow: "rgba(0, 255, 200, 0.7)",
          muted: "rgba(0, 255, 200, 0.5)",
          border: "rgba(0, 255, 200, 0.3)",
        },
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
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        scanline: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        typing: {
          "from": { width: "0" },
          "to": { width: "100%" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideUp: "slideUp 0.4s ease-out",
        glitch: "glitch 0.4s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        scanline: "scanline 8s linear infinite",
        blink: "blink 1s infinite",
        typing: "typing 3.5s steps(40, end)",
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 255, 200, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 200, 0.1) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(45deg, rgba(0, 255, 200, 0.1), rgba(255, 0, 60, 0.1))',
      },
      textShadow: {
        'cyber': '0 0 5px #00FFC8, 0 0 10px #00FFC8',
        'cyber-glow': '0 0 7px #FF003C',
        'terminal': '0 0 5px rgba(0, 255, 200, 0.5)',
      },
      boxShadow: {
        'cyber': '0 0 10px rgba(0, 255, 200, 0.7), inset 0 0 10px rgba(0, 255, 200, 0.5)',
        'cyber-input': '0 0 5px rgba(0, 255, 200, 0.5), inset 0 0 5px rgba(0, 255, 200, 0.2)',
        'cyber-button': '0 0 15px rgba(255, 0, 60, 0.7), inset 0 0 8px rgba(255, 0, 60, 0.5)',
        'terminal': '0 0 10px rgba(0, 255, 200, 0.3)',
        'terminal-hover': '0 0 15px rgba(0, 255, 200, 0.5)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
