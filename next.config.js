const path = require('path');
const webpack = require('webpack');
const { withSentryConfig } = require('@sentry/nextjs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const withTM = require('next-transpile-modules')(['antd', 'rc-pagination']); // Add any other packages you need transpiled

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

const moduleExports = withTM({
  distDir: 'build',

  webpack: (config, { isServer }) => {
    config.plugins = config.plugins || [];

    // Add environment variables for API_URL
    const apiUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/graphql'
        : process.env.API_URL;

    const nextRuntime = process.env.NEXT_RUNTIME || 'default_runtime_value';

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(apiUrl),
        'process.env.NEXT_RUNTIME': JSON.stringify(nextRuntime),
      })
    );

    // CSS Loader for global CSS files (like Ant Design reset.css)
    config.module.rules.push({
      test: /\.css$/,
      use: [
        isServer ? 'null-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            sourceMap: true,
            modules: false, // Disable CSS modules for global styles
          },
        },
      ],
    });

    // Add MiniCssExtractPlugin for CSS extraction
    if (!isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[id].[contenthash].css',
        })
      );
    }

    // Handle ES Module Compatibility
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },

  images: {
    formats: ['image/webp'],
    domains: [
      'images.ctfassets.net',
      'images.contentful.com',
      'cdn.shopify.com',
    ],
    deviceSizes: [240, 360, 460, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  outputFileTracing: false,
});

const SentryWebpackPluginOptions = {
  silent: true,
  debug: false,
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
