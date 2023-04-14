const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/convert-magnet',
    createProxyMiddleware({
      target: 'http://localhost/',
      changeOrigin: true,
    })
  );
};
