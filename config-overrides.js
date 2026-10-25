// Tailwind v4 requires the @tailwindcss/postcss plugin (not the tailwindcss CLI)
module.exports = function override(config) {
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
