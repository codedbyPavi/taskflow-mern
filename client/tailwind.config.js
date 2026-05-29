/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"]
      },
      colors: {
        brand: {
          50: "#F4F3F8",
          100: "#E8E6EF",
          200: "#D1CDDF",
          300: "#A9A3BC",
          400: "#7B7394",
          500: "#48426D",
          600: "#3D385C",
          700: "#312C51",
          800: "#262240",
          900: "#1C1930"
        },
        accent: {
          cream: "#F0C38E",
          peach: "#F1AA9B"
        },
        success: {
          50: "#F0FDF4",
          500: "#22C55E",
          600: "#16A34A"
        },
        surface: {
          DEFAULT: "#F7F4EF",
          card: "#FFFFFF",
          alt: "#FAF8F5",
          border: "#E5E7EB",
          subtle: "#F0EDE8"
        },
        sidebar: {
          DEFAULT: "#312C51",
          hover: "#3D385C",
          active: "rgba(240, 195, 142, 0.15)",
          border: "rgba(255,255,255,0.08)",
          muted: "rgba(255,255,255,0.55)",
          text: "rgba(255,255,255,0.92)"
        }
      },
      boxShadow: {
        xs: "0 1px 2px rgba(72, 66, 109, 0.04)",
        sm: "0 1px 3px rgba(72, 66, 109, 0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 16px rgba(72, 66, 109, 0.08), 0 2px 4px rgba(0,0,0,0.04)",
        lg: "0 12px 32px rgba(72, 66, 109, 0.1), 0 4px 12px rgba(0,0,0,0.05)",
        card: "0 2px 8px rgba(72, 66, 109, 0.06), 0 1px 3px rgba(0,0,0,0.04)",
        "card-lift": "0 12px 28px rgba(72, 66, 109, 0.12), 0 4px 10px rgba(0,0,0,0.05)",
        modal: "0 24px 64px rgba(49, 44, 81, 0.18), 0 8px 24px rgba(0,0,0,0.08)",
        auth: "0 32px 80px rgba(72, 66, 109, 0.14), 0 12px 40px rgba(240, 195, 142, 0.12)",
        dropdown: "0 8px 24px rgba(72, 66, 109, 0.1), 0 2px 8px rgba(0,0,0,0.04)"
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px"
      },
      animation: {
        "fade-up": "fadeUp 0.25s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)",
        "slide-in": "slideIn 0.25s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 1.8s linear infinite"
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" }
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" }
        }
      },
      backgroundImage: {
        "auth-gradient":
          "radial-gradient(ellipse 70% 55% at 50% -10%, rgba(240,195,142,0.35) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(72,66,109,0.08) 0%, transparent 60%)",
        "shimmer-gradient": "linear-gradient(90deg, #F0EDE8 25%, #E5E7EB 50%, #F0EDE8 75%)"
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};
