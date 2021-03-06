const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const HTMLPlugin = require('html-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

baseConfig.plugins.unshift(new webpack.DefinePlugin({
                                                      CLIENT: true,
                                                      SERVER: false,
                                                      TEST:   true,
                                                    }));

const clientConfig = merge(baseConfig, {
  entry:        {
    app: './src/client/index',
  },
  output:       {
    path:          path.join(__dirname, '..', 'dist', 'client'),
    filename:      '[name].[chunkHash].js',
    publicPath:    '/client/',
    chunkFilename: '[name].[id].[chunkhash].js',
  },
  optimization: {
    splitChunks:  {
      cacheGroups: {
        commons: {
          test:   /[\\/]node_modules[\\/]/,
          name:   'vendor',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
  },
  plugins:      [
    new HTMLPlugin({
                     filename: '../index.html',
                     template: 'src/app/index.template.html',
                     spa:      true,
                   }),
    new CopyWebpackPlugin([
                            { from: 'src/assets', to: '../assets' },
                            { from: 'src/assets/pwa/browserconfig.xml', to: '../browserconfig.xml' },
                            { from: 'src/assets/pwa/sitemap.xml', to: '../sitemap.xml' },
                            { from: 'src/assets/pwa/robots.txt', to: '../robots.txt' },
                            { from: 'src/assets/pwa/manifest.json', to: '../manifest.json' },
                            { from: 'src/assets/logo.png', to: '../favicon.png' },
                            { from: './i18n', to: '../i18n' },
                          ]),
    new ServiceWorkerWebpackPlugin({
                                     entry:    path.join(__dirname, '..', 'src/client/sw.ts'),
                                     filename: '../sw.js',
                                   }),
    new CompressionPlugin({
                            asset:     '[path].gz[query]',
                            algorithm: 'gzip',
                            test:      /\.js$|\.css$|\.html$/,
                            threshold: 0,
                            minRatio:  1,
                          }),
  ],
});

module.exports = clientConfig;
