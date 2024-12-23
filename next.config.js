const path = require('path');
const webpack = require('webpack');
const { withSentryConfig } = require('@sentry/nextjs');
const withAntdLess = require('next-plugin-antd-less');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

const moduleExports = withAntdLess({
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

    // Add MiniCssExtractPlugin for handling CSS/LESS
    if (!isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[id].[contenthash].css',
        })
      );
    }

    // Update Ant Design LESS rule
    config.module.rules.push({
      test: /\.less$/,
      use: [
        isServer
          ? 'null-loader' // Server-side should not process styles into CSS
          : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            sourceMap: true,
            modules: false, // Disable CSS modules for global Ant Design styles
          },
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              modifyVars: {
                'primary-color': '#1890ff', // Customize primary color
                'link-color': '#1DA57A', // Customize link color
              },
              javascriptEnabled: true,
            },
          },
        },
      ],
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
