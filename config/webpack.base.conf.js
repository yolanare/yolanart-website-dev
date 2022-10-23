//- BASE CONFIG -

const path = require("path");
const webpack = require('webpack');
const fg = require("fast-glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// VARIABLES
const DIR = {
  dev: "dev",
  public: "yolanare.github.io"
};
const PATHS = {
  dev: path.join(__dirname, "../"+DIR.dev),
  public: path.join(__dirname, "../"+DIR.public)
};

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    sourceMap: true,
    postcssOptions: {
      plugins: [
        require('postcss-preset-env')({}),
        require("autoprefixer")({}),
        require("cssnano")({
          preset: [
            "default",
            {
              discardComments: {
                removeAll: true
              }
            }
          ]
        })
      ]
    }
  }
};

// PAGES
var PAGES = [];
const pagesGlob = fg.sync([`${DIR.dev}/**/*.html`]); // gets all html files

pagesGlob.forEach(pagePath => {
  var split = []; // final return
  const p = (pagePath.split(`${DIR.dev}/`))[1]; // remove root dir from string

  if(p.split("/")[0] != "assets") { // sort out if asset
    const newPath = p.split(/[^/]*$/)[0]; // remove what's after last '/' to get newPath
    split.push(newPath); // [0] newPath   --- //split.push(newPath == "" ? "./" : newPath); // [0] newPath if root or subdir ; may end with "/"

    split.push((p.split("/")).slice(-1)[0]); // [1] file is last item

    // [2] publicPath
    if(split[0] != "./") { // if not at root
      const subDirNb = (split[0].split("/")).length - 1; // count subdirs
      split.push("../".repeat(subDirNb));
    } else {
      split.push("./");
    }

    PAGES.push(split); // 0=path ; 1=file ; 2=publicPath
  }
})
console.info(PAGES.length, "pages", PAGES, "\n");

// WEBPACK
module.exports = {
  entry: {
    app: `${PATHS.dev}/main.js`
  },
  output: {
    filename: "app.[contenthash].js",
    assetModuleFilename: "[name][ext]",
    path: PATHS.public,
    assetModuleFilename: (pathData) => {
      const filepath = path.dirname(pathData.filename).split("/").slice(1).join("/");
      return `${filepath}/[name][ext]`;
    }
  },
  module: { // for files imported in entry (js) or related
    rules: [
      { // js
        test: /\.m?js$/i,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      { // html
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          minimize: false
        }
      },
      { // images
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource"
      },
      { // fonts
        test: /\.(ttf|woff2?|eot)$/i,
        type: "asset/resource"
      },
      { // sass
        test: /\.(sa|sc)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true }
          },
          postcssLoader,
          {
            loader: "sass-loader",
            options: { sourceMap: true }
          }
        ]
      },
      { // css
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true }
          },
          postcssLoader
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css"
    }),
    // PAGES - do not forget to import page in entry, here it is done automatically
    ...PAGES.map(Page =>
      new HtmlWebpackPlugin({
        template: `${DIR.dev}/${Page[0]}${Page[1]}`,
        filename: `${Page[0]}${Page[1]}`,
        publicPath: Page[2],
        minify: false
      })
    ),
  ]
};