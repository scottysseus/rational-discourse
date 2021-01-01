const webpack = require('webpack');
const path = require("path");

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const babelPresetEnv = require.resolve('@babel/preset-env');
const babelPresetReact = require.resolve('@babel/preset-react');

var appHost;

const getAppHost = () => {
    switch(process.env.NODE_ENV) {
        case 'development':
            appHost = 'http://localhost:3000';
            break;
        case 'production':
            appHost = 'https://scottysseus.github.io/rational-discourse/'
            break;
    }
}

module.exports = {
    output: {
        path: path.resolve(__dirname, 'docs')
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'build/assets',
                    to: 'assets'

                },
                {
                    from: 'build/styles',
                    to: 'styles'

                }
            ]
        }),
        new HTMLWebpackPlugin({
            template: 'build/index.html',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            __APP_HOST__: getAppHost()
        })
    ],
    module: {
        rules: [
            { test: /\.scss?$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.css?$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            babelPresetEnv,
                            babelPresetReact
                        ],
                        plugins: []
                    }
                }
            }
        ]
    },
}