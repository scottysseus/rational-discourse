const { merge } = require('webpack-merge');
const path = require("path");

const common = require('./webpack.config.common.js');

const devConfig = {
    mode: 'development',
    devServer: {
        contentBase: 'dev',
        port: 3000
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dev')
    },
};



module.exports = env => merge(common(env), devConfig);