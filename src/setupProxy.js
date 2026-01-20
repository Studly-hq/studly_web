const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/coursebank',
        createProxyMiddleware({
            target: 'https://unesthetic-cretaceously-maris.ngrok-free.dev',
            changeOrigin: true,
        })
    );
    app.use(
        '/studlygram',
        createProxyMiddleware({
            target: 'https://unesthetic-cretaceously-maris.ngrok-free.dev',
            changeOrigin: true,
        })
    );
    app.use(
        '/profile',
        createProxyMiddleware({
            target: 'https://unesthetic-cretaceously-maris.ngrok-free.dev',
            changeOrigin: true,
        })
    );
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'https://unesthetic-cretaceously-maris.ngrok-free.dev',
            changeOrigin: true,
        })
    );
};
