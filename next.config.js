require('dotenv').config();
const Dotenv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
const { withSentryConfig } = require("@sentry/nextjs");
const withAntdLess = require('next-plugin-antd-less');

const moduleExports = withAntdLess({
  lessVarsFilePath: './styles/variables.less',
  webpack: (config, { isServer }) => {
    config.plugins = config.plugins || [];

    config.plugins.push(
      new Dotenv({
        path: path.resolve(process.cwd(), '.env'), // Corrected path resolution
        systemvars: true,
      })
    );

    if (!isServer) {
      const apiUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api/graphql'
          : process.env.API_URL;

      console.log("Hitting ", apiUrl);

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.API_URL': JSON.stringify(apiUrl), // Simplified environment variable definition
        })
      );
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_RUNTIME': JSON.stringify(process.env.NEXT_RUNTIME || 'default_runtime_value'),
      })
    );

    return config;
  },
  images: { // Moved to top-level configuration
    formats: ['image/webp'],
    domains: ["images.ctfassets.net", "images.contentful.com", "cdn.shopify.com"],
    deviceSizes: [240, 360, 460, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
});

const SentryWebpackPluginOptions = {
  silent: true,
  debug: false,
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
