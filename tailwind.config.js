const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["layouts/**/*.html", "assets/js/**/*.js"],

  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        headline: ["Inter"],
        body: ["Inter"],
        mono: ["PragmataPro"],
      },

      colors: {
        accent: {
          light: {
            50: "#ebf6ff",
            100: "#d1eaff",
            200: "#aedbff",
            300: "#76c7ff",
            400: "#35a6ff",
            500: "#077bff",
            600: "#0055ff",
            700: "#003cff",
            800: "#0031d7",
            900: "#0033b3",
            950: "#061e65",
          },

          dark: {
            50: "#fcf7ee",
            100: "#f5e7d0",
            200: "#e9cd9e",
            300: "#deaf6b",
            400: "#d69749",
            500: "#cc7832",
            600: "#b55c2a",
            700: "#974326",
            800: "#7b3625",
            900: "#662e21",
            950: "#3a150e",
          },
        },

        gray: {
          50: "#f7f8fa",
          75: "#f1f2f5",
          100: "#ebecf0",
          200: "#cfd1d2",
          300: "#adb1b3",
          400: "#84898c",
          500: "#696e71",
          600: "#5a5e60",
          700: "#4d4f51",
          800: "#323335",
          900: "#2b2b2b",
          950: "#232425",
          975: "#1c1c1c",
        },

        keyword: {
          light: "#0033b3",
          dark: "#cc7832",
        },

        field: {
          light: "#871094",
          dark: "#A782BB",
        },

        "local-variable": {
          light: "#660000",
          dark: "#9876aa",
        },

        "function-declaration": {
          light: "#00627a",
          dark: "#ffc66d",
        },

        string: {
          light: "#067d17",
          dark: "#6a8759",
        },

        number: {
          light: "#3677a9",
          dark: "#6897bb",
        },

        comment: {
          light: "#8c8c8c",
          dark: "#808080",
        },

        doc: {
          light: "#8c8c8c",
          dark: "#629755",
        },

        link: {
          light: "#006dcc",
          dark: "#287bde",
          visited: {
            light: "#8552c6",
            dark: "#287bde",
          },
        },

        "header-bg": {
          light: "rgba(247,248,250,0.75)",
          dark: "rgba(43,43,43,0.75)",
        },
      },

      spacing: {
        1.5: "0.375rem", // 6px
        1.6: "0.4375rem", // 7px
        2.1: "0.5625rem", // 9px
        3.2: "0.8125rem", // 16px
        4.5: "1.125rem", // 8px
      },

      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: { color: theme("colors.gray.700") },
            h2: { color: theme("colors.gray.700") },
            h3: { color: theme("colors.gray.700") },
            h4: { color: theme("colors.gray.700") },
            h5: { color: theme("colors.gray.700") },
            h6: { color: theme("colors.gray.700") },
            p: { color: theme("colors.gray.700") },
            strong: { color: theme("colors.gray.700") },
            a: {
              fontWeight: "500",
              color: theme("colors.accent.light.500"),
              "&:hover": {
                color: theme("colors.accent.light.700"),
              },
            },
            pre: false,
            code: false,
            "pre code": false,
            "code::before": false,
            "code::after": false,
            "--tw-prose-headings": [theme("colors.gray.700")],
            "--tw-prose-quote-borders": theme("colors.accent.light.500"),
            "--tw-prose-hr": theme("colors.gray.200"),
          },
        },

        lg: {
          css: {
            pre: false,
            code: false,
            "pre code": false,
            "code::before": false,
            "code::after": false,
          },
        },

        dark: {
          css: {
            color: theme("colors.gray.200"),
            a: {
              color: theme("colors.accent.dark.500"),
              "&:hover": {
                color: theme("colors.accent.dark.700"),
              },
            },
            h1: { color: theme("colors.gray.200") },
            h2: { color: theme("colors.gray.200") },
            h3: { color: theme("colors.gray.200") },
            h4: { color: theme("colors.gray.200") },
            h5: { color: theme("colors.gray.200") },
            h6: { color: theme("colors.gray.200") },
            p: { color: theme("colors.gray.200") },
            ul: { color: theme("colors.gray.200") },
            ol: { color: theme("colors.gray.200") },
            figcaption: { color: theme("colors.gray.300") },
            strong: { color: theme("colors.gray.200") },
            span: { color: theme("colors.gray.200") },
            "--tw-prose-headings": [theme("colors.gray.200")],
            "--tw-prose-quote-borders": theme("colors.accent.dark.500"),
            "--tw-prose-hr": theme("colors.gray.700"),
          },
        },
      }),
    },

    borderColor: (theme) => ({
      ...theme("colors"),
    }),

    keyframes: (theme) => ({
      blink: {
        "0%, 100%": { opacity: 0 },
        "50%": { opacity: 1 },
      },
      bounce: {
        "0%, 100%": {
          transform: "translateY(-25%)",
          "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
        },
        "50%": {
          transform: "translateY(0)",
          "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
        },
      },
    }),
    animation: {
      blink: "blink 1s step-end infinite",
      bounce: "bounce 1s infinite",
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
