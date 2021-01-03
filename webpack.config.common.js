const webpack = require('webpack');
const path = require("path");

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const babelPresetEnv = require.resolve('@babel/preset-env');
const babelPresetReact = require.resolve('@babel/preset-react');

const getHosts = (mode) => {
    var appHost = 'http://localhost:3000';
    var apiHost = 'http://localhost:3001';

    switch(mode) {
        case 'production':
            appHost = 'https://scottysseus.github.io/rational-discourse/';
            apiHost = 'https://rational-discourse.herokuapp.com';
            break;
        default:
            appHost = 'http://localhost:3000';
            apiHost = "http://localhost:3001";
            break;
    }

    return {appHost, apiHost};
};

module.exports = env => {

    const hosts = getHosts(env);

    return {
        output: {
            path: path.resolve(__dirname, 'docs')
        },
        plugins: [
            new webpack.DefinePlugin({
                __APP_HOST__: JSON.stringify(hosts.appHost),
                __API_HOST__: JSON.stringify(hosts.apiHost),
            }),
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
};