//- DEV CONFIG -

const webpack = require("webpack");
const { merge } = require("webpack-merge");

const DIR = {
  dev: "dev",
  public: "yolanare.github.io"
};

// CONFIG
const baseWebpackConfig = require("./webpack.base.conf");
const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  output: {
    publicPath: "/"
  },
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: DIR.dev,
    port: 8888,
    client: {
      overlay: {
        errors: true,
        warnings: true
      },
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map"
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
});