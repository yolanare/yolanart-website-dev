//- BUILD CONFIG -

const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const DIR = {
  dev: "dev",
  public: "../../yolanare.github.io/old/v1.7"
};
const specialFilesToCopy = [
  // ["CNAME", "./"],
  // [".nojekyll", "./"]
];

// CONFIG
const baseWebpackConfig = require("./webpack.base.conf");
const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  output: {
    publicPath: "./"
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })] // clean 'LICENSE.txt' files
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!.git/**"],
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
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: DIR.dev+"/assets/medias",
    //       to: "assets/medias"
    //     }
    //   ]
    // })
  ]
});

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
});