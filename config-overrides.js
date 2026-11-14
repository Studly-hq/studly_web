// Tailwind v4 requires the @tailwindcss/postcss plugin (not the tailwindcss CLI)
const path = require('path');

module.exports = function override(config) {
  // Fix for @hugeicons/react CJS build bug - alias to wrapper that imports from working CJS file
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  config.resolve.alias['@hugeicons/react'] = path.resolve(__dirname, 'src/lib/hugeicons-wrapper.js');

  const oneOf = config.module.rules.find((rule) => rule.oneOf);
  if (!oneOf) return config;

  for (const rule of oneOf.oneOf) {
    if (!rule.use) continue;
    const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
    for (const use of uses) {
      if (use.loader && use.loader.includes('postcss-loader')) {
        use.options.postcssOptions = {
          plugins: [
            require('@tailwindcss/postcss'),
            require('autoprefixer'),
          ],
        };
      }
    }
  }

  return config;
};
