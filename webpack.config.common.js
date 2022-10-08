const webpack = require('webpack');
const path = require("path");

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const babelPresetEnv = require.resolve('@babel/preset-env');
const babelPresetReact = require.resolve('@babel/preset-react');

const getHosts = (mode) => {
    const isProd = mode === 'production';
    const appHost = isProd ?
        'https://scottysseus.github.io/rational-discourse/' :
        'http://localhost:3000';
    const apiHost = isProd ?
        'https://rational-discourse.fly.dev' :
        'http://localhost:8080';

    return { appHost, apiHost };
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
                        from: 'static/assets',
                        to: 'assets'

                    },
                    {
                        from: 'static/styles',
                        to: 'styles'

                    }
                ]
            }),
            new HTMLWebpackPlugin({
                template: 'static/index.html',
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
