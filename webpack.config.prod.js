const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require("path");

const babelPresetEnv = require.resolve('@babel/preset-env');
const babelPresetReact = require.resolve('@babel/preset-react');

module.exports = {
    mode: 'production',
    devServer: {
        contentBase: 'prod',
        port: 3000
    },
    output: {
        path: path.resolve(__dirname, 'prod')
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
        }
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