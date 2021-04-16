const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path=require('path')
const HTMLWwebpackPlugin =require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin")

const isProd = process.env.NODE_ENV==='production'
const isDev = !isProd

const filename=ext=>isDev? `bundle.${ext}`:`bundle.[hash].${ext}`

const jsLoaders=()=>{
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]
  if (isDev) {
    loaders.push('eslint-loader')
  }

    return loaders
}
module.exports={
    context: path.resolve(__dirname, 'src'), //указывает где лажат исходники

    mode: 'development',
    entry: ['@babel/polyfill','./index.js'], //start point/ babel for async
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname,'src'),
            '@core': path.resolve(__dirname, 'src/core')
        }
    },
    devtool: isDev ? 'source-map' : false,
    //watch: true,//default in dev-server
    target: 'web',
    // watchOptions: {
    //     ignored: /node_modules/,
    //     aggregateTimeout: 200,
    //     poll: 1000,
    // },
    devServer: {
        //contentBase: path.resolve(__dirname,'src'),
        //watchContentBase: true,
        port: 3000,
        hot: isDev
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWwebpackPlugin({
            template: 'index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            },

        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')}

            ],
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                       loader: MiniCssExtractPlugin.loader,
                        options: {
                           //hmr: isDev,
                          //  reloadAll: true //reload scss
                        }
                    },

                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader"
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            }
        ],
    },
}
