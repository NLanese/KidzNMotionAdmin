const withAntdLess = require('next-plugin-antd-less');

const moduleExports = withAntdLess({
  webpack: (config, { isServer, webpack }) => {
    config.plugins = config.plugins || [];

    // Note: Next.js loads .env / .env.local by itself. Server code reads
    // process.env at runtime; never inject the env files into the browser bundle.

    // Set API_URL environment variable for local development
    if (!isServer) {
      const apiUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/graphql'
        : process.env.API_URL;

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.API_URL': JSON.stringify(
            // 'http://localhost:3000/api/graphql' 
            process.env.API_URL
          ),
        })
      );
    }

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
