const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/convert-magnet',
    createProxyMiddleware({
      target: 'http://localhost:3005',
      changeOrigin: true,
    })
  );
};
