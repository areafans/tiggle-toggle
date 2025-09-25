/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors with professional accents
        background: "hsl(222.2 84% 4.9%)",
        foreground: "hsl(210 40% 98%)",
        card: "hsl(222.2 84% 4.9%)",
        "card-foreground": "hsl(210 40% 98%)",
        popover: "hsl(222.2 84% 4.9%)",
        "popover-foreground": "hsl(210 40% 98%)",
        primary: "hsl(210 40% 98%)",
        "primary-foreground": "hsl(222.2 84% 4.9%)",
        secondary: "hsl(217.2 32.6% 17.5%)",
        "secondary-foreground": "hsl(210 40% 98%)",
        muted: "hsl(217.2 32.6% 17.5%)",
        "muted-foreground": "hsl(215 20.2% 65.1%)",
        accent: "hsl(217.2 32.6% 17.5%)",
        "accent-foreground": "hsl(210 40% 98%)",
        destructive: "hsl(0 62.8% 30.6%)",
        "destructive-foreground": "hsl(210 40% 98%)",
        border: "hsl(217.2 32.6% 17.5%)",
        input: "hsl(217.2 32.6% 17.5%)",
        ring: "hsl(212.7 26.8% 83.9%)",
        // Professional colorful accents
        blue: {
          500: "hsl(217 91% 60%)",
          600: "hsl(217 91% 55%)",
        },
        green: {
          500: "hsl(142 76% 36%)",
          600: "hsl(142 76% 31%)",
        },
        purple: {
          500: "hsl(262 83% 58%)",
          600: "hsl(262 83% 53%)",
        },
        orange: {
          500: "hsl(25 95% 53%)",
          600: "hsl(25 95% 48%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}