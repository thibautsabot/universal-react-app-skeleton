module.exports = {
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [{ test: /\.tsx$/, exclude: /node_modules/, use: { loader: "ts-loader" } }]
    },
    mode: process.env.NODE_ENV || "development"
};
