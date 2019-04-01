const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const baseConfig = require("./webpack.base.js");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const config = {
    target: "node",
    entry: path.join(__dirname, "src/server/index.tsx"),
    output: {
        filename: "server.js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [{ test: /\.scss$/, use: ["css-loader", "sass-loader"] }]
    },
    externals: [nodeExternals()],
    plugins: [
        new CleanWebpackPlugin() // Clear output.path (build)
    ]
};

module.exports = merge(baseConfig, config);
