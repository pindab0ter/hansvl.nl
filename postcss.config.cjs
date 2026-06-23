/** @type {import("postcss-load-config").Config} */
module.exports = {
  plugins: {
    // Don't rewrite url() paths: the @font-face rules use ../fonts/, which is
    // correct for Hugo (it serves static/fonts at /fonts/). The default rewrite
    // turns them into ./assets/fonts/, a 404, so the webfonts never load.
    "@tailwindcss/postcss": { transformAssetUrls: false },
  },
};
