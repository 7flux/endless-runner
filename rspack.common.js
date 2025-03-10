const path = require('path');
const rspack = require('@rspack/core');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },
  devtool: "eval-source-map",
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|vue)$/,
        exclude: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  },
  devServer: {
    static: path.resolve(__dirname, 'build'),
    compress: true,
    port: 8080,
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html'
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'assets/**/*'),
          to: path.resolve(__dirname, 'build')
        }
      ],
    })
  ],
};
