const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装

var config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    mode:"production",
   
    output: {
        path: __dirname + '/dist',   
        libraryTarget: 'umd',    
        environment: {
            arrowFunction: false
        },   
    },    
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],               
                    
                }
             },
        ]
    }
    ,
    plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
}

module.exports = config;