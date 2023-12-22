require('dotenv').config()
const Dotenv = require('dotenv-webpack')
const path = require('path')
const withAntdLess = require('next-plugin-antd-less');
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = withAntdLess({
  webpack: config => {
    
    config.plugins = config.plugins || []
    config.plugins = [
      ...config.plugins,
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ]
    return config
  },
  lessVarsFilePath: './styles/variables.less', // optional 
  images: {
    formats: [ 'image/webp'],
    domains: ["images.ctfassets.net", "images.contentful.com", "cdn.shopify.com"],
    deviceSizes: [240, 360, 460, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  outputFileTracing: false
})

const SentryWebpackPluginOptions = {
  silent: true,
  debug: false
};

module.exports =  withSentryConfig(moduleExports, SentryWebpackPluginOptions)