// CRA ignores postcss.config.js (config: false) — point its postcss-loader at it instead
module.exports = function override(config) {
  const oneOf = config.module.rules.find((rule) => rule.oneOf).oneOf;
  for (const rule of oneOf) {
    if (!rule.use) continue;
    for (const use of rule.use) {
      if (use.loader && use.loader.includes('postcss-loader')) {
        use.options.postcssOptions.config = require('path').resolve(__dirname, 'postcss.config.js');
        delete use.options.postcssOptions.plugins;
      }
    }
  }
  return config;
};
