import { merge } from 'webpack-merge';
import common from './rspack.common';
import rspack from '@rspack/core';

export default merge(common, {
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
