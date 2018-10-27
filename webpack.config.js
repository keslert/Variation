'use strict';

var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// helpers for writing path names
// e.g. join("web/static") => "/full/disk/path/to/hello/web/static"
function join(dest) { return path.resolve(__dirname, dest); }
function web(dest) { return join('web/static/' + dest); }

var env = process.env.MIX_ENV || 'dev';
var prod = (env === 'prod');

// This is necessary to get the sass @import's working
var stylePathResolves = (
  'includePaths[]=' + path.resolve('./') + '&' +
  'includePaths[]=' + path.resolve('./node_modules')
)

var config = module.exports = {
  entry: [
    web('css/app.sass'),
    web("js/app.js"),
  ],
  output: {
    path: join("priv/static"),
    filename: "js/app.js"
  },
  devtool: 'source-map',

  resolve: {
    extensions: ['', '.js', '.sass'],
    modulesDirectories: ['node_modules'],
    alias: {
      phoenix_html:
        __dirname + '/deps/phoenix_html/web/static/js/phoenix_html.js',
      phoenix:
        __dirname + '/deps/phoenix/web/static/js/phoenix.js',
      vex: 'vex-js'
    }
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel",
      query: {
        cacheDirectory: true,
        plugins: ['transform-decorators-legacy'],
        presets: ['react', 'es2015', 'stage-2', 'stage-0'],
      },
    },{
      test: /\.s[a|c]ss$/,
      loader: ExtractTextPlugin.extract('style', 'css!sass?indentedSyntax&includePaths[]=' + __dirname +  '/node_modules'),
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      vex: 'vex-js',
      // "vex.dialog": 'vex-js/js/vex.dialog'
    }),
    new ExtractTextPlugin("css/app.css")
  ],
  bail: false,
  cache: true,
  debug: true
};


if (prod) {
  var webpack = require('webpack');
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  );
}
