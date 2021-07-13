const moment = require('moment');
const packageJson = require('./package.json');
const sentryConfig = {
  organization: 'fpx-fe',
  project: 'giws',
  apiKey: 'c345a9192e444c249a421547d0af9db57aafb834ba5f454595e18f465c08a959',
  include: /\.map$/,
  baseSentryURL: 'http://123.58.43.40:9000/api/0',
  suppressConflictError: true,
  deleteAfterCompile: true,
};
module.exports = {
  plugins: [
    [
      'build-plugin-fusion',
      {
        themePackage: '@alifd/theme-18273',
      },
    ],
    [
      'build-plugin-moment-locales',
      {
        locales: ['zh-cn', 'en-au'],
      },
    ],
  ],
  babelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@fpxfd/next',
        style: true,
      },
    ],
  ],
  proxy: {
    '/api': {
      enable: true,
      target: '',
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  router: {
    lazy: true,
  },
  hash: 'contenthash', // 哈希
  terserOptions: {
    compress: {
      unused: true,
      // eslint-disable-next-line quote-props
      'drop_console': true,
    },
  },
  modeConfig: {
    dev: {
      dll: true,
    },
    test: {
      webpackPlugins: {
        'webpack-visualizer-plugin': {
          options: {
            filename: './statistics.html',
          },
        },
      },
      plugins: [
        ['build-plugin-splitchunk'],
      ],
    },
    stage: {
      sourceMap: true,
      webpackPlugins: {
        'webpack-sentry-plugin': {
          options: {
            ...sentryConfig,
            release: `giws-stage-${packageJson.version}`,
          },
        },
      },
      plugins: [
        ['build-plugin-splitchunk'],
      ],
    },
    prod: {
      sourceMap: true,
      webpackPlugins: {
        'webpack-sentry-plugin': {
          options: {
            ...sentryConfig,
            release: `giws-prod-${packageJson.version}`,
          },
        },
      },
      plugins: [
        ['build-plugin-splitchunk'],
      ],
    },
    eu: {
      sourceMap: true,
      webpackPlugins: {
        'webpack-sentry-plugin': {
          options: {
            ...sentryConfig,
            release: `giws-eu-${packageJson.version}`,
          },
        },
      },
      plugins: [
        ['build-plugin-splitchunk'],
      ],
    },
    us: {
      sourceMap: true,
      webpackPlugins: {
        'webpack-sentry-plugin': {
          options: {
            ...sentryConfig,
            release: `giws-us-${packageJson.version}`,
          },
        },
      },
      plugins: [
        ['build-plugin-splitchunk'],
      ],
    },
  },
};