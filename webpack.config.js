var config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    mode:"production",
    output: {
        path: __dirname + '/dist',   
        libraryTarget: 'umd',       
    }
}

module.exports = config;