//- BUILD CONFIG -

const path = require("path");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const DIR = {
  dev: "dev",
  public: "yolanare.github.io"
};
const PATHS = {
  dev: path.join(__dirname, "../"+DIR.dev),
  public: path.join(__dirname, "../"+DIR.public),
  publicDev: path.join(__dirname, "../"+DIR.public+"/"+DIR.dev)
};
const specialFilesToCopy = [
  ["CNAME", "./"],
  [".nojekyll", "./"]
];

// CONFIG
const baseWebpackConfig = require("./webpack.base.conf");
const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  output: {
    publicPath: "./",
    path: PATHS.publicDev,
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })] // clean 'LICENSE.txt' files
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      dry: false
    }),
    ...specialFilesToCopy.map(File =>
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${DIR.dev}/${File[0]}`,
            to: File[1]
          }
        ]
      })
    ),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: DIR.dev+"/assets/medias/projects",
          to: "assets/medias/projects"
        }
      ]
    })
  ]
});

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
});