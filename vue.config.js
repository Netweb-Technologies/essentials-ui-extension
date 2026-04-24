const config = require('@rancher/shell/vue.config');

const baseConfig = config(__dirname, {
  excludes: [],
});

module.exports = {
  ...baseConfig,
  devServer: {
    ...baseConfig.devServer,
    // Prevent WebSocket proxy errors from causing full reloads
    hot: true,
    liveReload: false,
    client: {
      webSocketURL: {
        hostname: 'localhost',
        pathname: '/ws',
        port: 8006,
        protocol: 'wss',
      },
      overlay: {
        errors: true,
        warnings: false,
      },
      reconnect: 5,
    },
    proxy: {
      ...baseConfig.devServer?.proxy,
      '/ws': {
        target: process.env.API || 'https://192.168.0.38',
        ws: true,
        secure: false,
        changeOrigin: true,
        // Suppress the EPIPE noise
        on: {
          error: (err, req, res) => {
            if (err.code !== 'EPIPE' && err.code !== 'ECONNRESET') {
              console.error('Proxy error:', err);
            }
          },
        },
      },
    },
  },
};