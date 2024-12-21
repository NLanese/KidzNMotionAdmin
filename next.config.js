const path = require('path');
const webpack = require('webpack');
const { withSentryConfig } = require('@sentry/nextjs');
const withAntdLess = require('next-plugin-antd-less');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

const moduleExports = withAntdLess({
  // Custom Webpack configuration
  webpack: (config, { isServer }) => {
    config.plugins = config.plugins || [];

    // Add environment variables for API_URL
    const apiUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/graphql'
      : process.env.API_URL;

    const nextRuntime = process.env.NEXT_RUNTIME || 'default_runtime_value';

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(apiUrl),
        'process.env.NEXT_RUNTIME': JSON.stringify(nextRuntime),
      })
    );

    // Add Ant Design LESS variables customization
    config.module.rules.push({
      test: /\.less$/,
      use: [
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              modifyVars: {
                'primary-color': '#1890ff', // Example: Update primary color
                'link-color': '#1DA57A',   // Example: Update link color
              },
              javascriptEnabled: true,
            },
          },
        },
      ],
    });

    return config;
  },

  // Image configuration
  images: {
    formats: ['image/webp'],
    domains: ['images.ctfassets.net', 'images.contentful.com', 'cdn.shopify.com'],
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
