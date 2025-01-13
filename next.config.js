require('dotenv').config();
const Dotenv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
const withAntdLess = require('next-plugin-antd-less');

const moduleExports = withAntdLess({
  webpack: (config, { isServer }) => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ];

    // Set API_URL environment variable for local development
    if (!isServer) {
      const apiUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/graphql'
        : process.env.API_URL;

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.API_URL': JSON.stringify(
            'http://localhost:3000/api/graphql' 
            // process.env.API_URL
          ),
        })
      );
    }

    // Add the following lines to handle NEXT_RUNTIME
    const nextRuntime = process.env.NEXT_RUNTIME || 'default_runtime_value';

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_RUNTIME': JSON.stringify(nextRuntime),
      })
    );

    // ** Add the hashFunction configuration **
    config.output = {
      ...config.output, // Preserve existing output settings
      hashFunction: 'xxhash64',
    };

    return config;
  },
  lessVarsFilePath: './styles/variables.less',
  images: {
    formats: ['image/webp'],
    domains: ["images.ctfassets.net", "images.contentful.com", "cdn.shopify.com"],
    deviceSizes: [240, 360, 460, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  outputFileTracing: false
});

module.exports = moduleExports;
