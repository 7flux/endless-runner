const { merge } = require('webpack-merge');
const common = require('./rspack.common');
const rspack = require('@rspack/core');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  performance: {
    maxEntrypointSize: 90000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new RspackTerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new rspack.CleanWebpackPlugin(),
  ]
});
