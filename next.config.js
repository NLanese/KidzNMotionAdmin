require('dotenv').config();
const { withSentryConfig } = require("@sentry/nextjs");
const withAntdLess = require('next-plugin-antd-less');
const webpack = require('webpack');
const path = require('path');

// Main configuration with Ant Design LESS
const moduleExports = withAntdLess({
  images: {
    formats: ['image/webp'],
    domains: ["images.ctfassets.net", "images.contentful.com", "cdn.shopify.com"],
    deviceSizes: [240, 360, 460, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,            // Shim `fs` module
      child_process: false, // Shim `child_process` module
      net: false,           // Shim `net` module
      dns: false,           // Shim `dns` module
      tls: false,           // Shim `tls` module
      worker_threads: false // Shim 'worker_threads' for the browser
    };
    config.plugins = config.plugins || [];
    console.log(process.env.NODE_ENV);
    console.log(process.env.NEXT_RUNTIME);

    // Add Dotenv for .env file support
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api/graphql'
            : process.env.API_URL
        ),
        'process.env.NEXT_RUNTIME': JSON.stringify(
          process.env.NEXT_RUNTIME || 'default_runtime_value'
        ),
      })
    );
    return config;
  },
});

// Sentry options
const SentryWebpackPluginOptions = {
  silent: true,
  debug: false,
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
