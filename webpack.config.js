var config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    mode:"development",
   
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
                    presets: ['@babel/preset-env']
                }
             },
        ]
    }
}

module.exports = config;