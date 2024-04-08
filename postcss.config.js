/** @type {import("tailwindcss/types/config").Config} */
module.exports = {
  plugins: {
    "postcss-import": {
      path: ["./assets/"],
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};
