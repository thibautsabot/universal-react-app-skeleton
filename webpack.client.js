const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const ReactLoadablePlugin = require("react-loadable/webpack").ReactLoadablePlugin;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const conditionalPlugins = [];

if (process.env.NODE_ENV !== "production") {
    conditionalPlugins.push(new webpack.HotModuleReplacementPlugin());
    conditionalPlugins.push(new webpack.NoEmitOnErrorsPlugin());
}
if (process.env.ANALYZE) {
    conditionalPlugins.push(new BundleAnalyzerPlugin());
}

const entries = {
    client: [path.join(process.cwd(), "/src/client/index.tsx")],
    vendor: ["react", "react-dom", "react-router-dom"]
};

if (process.env.NODE_ENV !== "production") {
    Object.values(entries).forEach((entry) => {
        entry.push("webpack-hot-middleware/client");
    });
}

const config = {
    entry: entries,
    output: {
        path: path.join(__dirname, "public"),
        filename: process.env.NODE_ENV === "production" ? "[name].[contenthash].js" : "[name].[hash].js"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    process.env.NODE_ENV === "production" ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    optimization: {
        /*
          Avoid duplication of some modules (= smaller bundles).
          But this cause the hashes from one page to another to be different than the page bundle itself
          which prevent the service worker to be fully effective

          sideEffects: false,
        */
        splitChunks: {
            chunks: "all",
            minSize: 0
        }
    },
    plugins: [
        ...conditionalPlugins,
        new BrotliPlugin({
            asset: "[file].br",
            test: /\.(js|css)$/
        }),
        new CompressionPlugin({
            test: /\.(js|css)$/
        }),
        new ManifestPlugin(), // Generate assets manifest used in SSR
        new ReactLoadablePlugin({
            filename: "./public/react-loadable.json"
        }),
        new webpack.HashedModuleIdsPlugin(), // Don't change the file hash if nothing have changed (for caching)
        new CleanWebpackPlugin(), // Clear output.path (public)
        // Create a css file for each JS file which contains CSS (code splitting)
        new MiniCssExtractPlugin({
            filename: process.env.NODE_ENV === "production" ? "[name].[contenthash].css" : "[name].[hash].css"
        }),
        // Minimize CSS assets and avoid deduplication
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.s?css$/g
        }),
        new CopyWebpackPlugin([
            { from: "./favicon.ico" },
            { from: "./sw.js" },
            { from: "./sw_manifest.json" },
            { from: "./manifestIcon.png" }
        ])
    ],

    mode: process.env.NODE_ENV || "development"
};

module.exports = merge(baseConfig, config);
