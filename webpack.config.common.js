const webpack = require('webpack');
const path = require("path");

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const babelPresetEnv = require.resolve('@babel/preset-env');
const babelPresetReact = require.resolve('@babel/preset-react');

var appHost = "http://localhost:3000";
var apiHost = "http://localhost:3001";

const getHosts = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            appHost = 'https://scottysseus.github.io/rational-discourse/';
            apiHost = 'https://rational-discourse.herokuapp.com';
            break;
        default:
            appHost = 'http://localhost:3000';
            apiHost = "http://localhost:3001";
            break;
    }
};

getHosts();

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
            __APP_HOST__: appHost,
            __API_HOST__: apiHost,
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