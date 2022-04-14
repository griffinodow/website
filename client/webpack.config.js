const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const templates = [];
const files = fs.readdirSync("src");
files.forEach((file) => {
  if (file.match(/\.pug$/)) {
    let filename = file.substring(0, file.length - 4);
    templates.push(
      new HtmlWebpackPlugin({
        template: "src/" + filename + ".pug",
        filename: filename + ".html",
      })
    );
  }
});

module.exports = {
  entry: "./src/index.ts",
  plugins: [
    ...templates,
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "src/favicon.ico", to: "" },
        { from: "src/site.webmanifest", to: "" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss?$/,
        use: [
          {
            loader: "file-loader",
            options: { outputPath: "/", name: "style.min.css" },
          },
          "sass-loader",
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.pug$/,
        use: ["raw-loader", "pug-html-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.min.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
};
