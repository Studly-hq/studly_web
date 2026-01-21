const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/coursebank',
        createProxyMiddleware({
            target: 'https://studly-server-production.up.railway.app',
            changeOrigin: true,
        })
    );
    app.use(
        '/studlygram',
        createProxyMiddleware({
            target: 'https://studly-server-production.up.railway.app',
            changeOrigin: true,
        })
    );
    app.use(
        '/profile',
        createProxyMiddleware({
            target: 'https://studly-server-production.up.railway.app',
            changeOrigin: true,
        })
    );
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'https://studly-server-production.up.railway.app',
            changeOrigin: true,
        })
    );
};
