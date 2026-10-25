// postcss.config.js is read by CRA's default PostCSS setup, but
// config-overrides.js overrides the postcss-loader with @tailwindcss/postcss + autoprefixer.
// We keep this file minimal to avoid conflicts — only autoprefixer runs here
// (if at all); the real work is done by the v4 plugin in config-overrides.js.
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
