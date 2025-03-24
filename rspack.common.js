import path from 'path';
import rspack from '@rspack/core';

const __dirname = import.meta.dirname;

/** @type {import('@rspack/core').Configuration} */
export default {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },
  devtool: "eval-source-map",
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  target: ['web', 'es2022'],
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
    hot: true, // Enables HMR to prevent full reloads
    liveReload: false, // Disables full page reloads
    port: 8080,
    allowedHosts: 'all',
    client: {
      reconnect: false,
    }
  },
  experiments: {
    css: true,
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'), // should follow same logic in j(t)sconfig.json
    },
    extensions: ['.ts', '.js'],
  },
};
