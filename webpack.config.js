var path            = require('path');
var UglifyJsPlugin  = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'module-source-map',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'bin')
    },
    module: {
        rules: 
        [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 
                [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.(glsl|vs|fs|frag|vert)$/,
                loader: 'shader-loader',
                options: {
                    glsl: {
                        chunkPath: path.resolve("/glsl/chunks")
                    }
                }
            }
        ]
    }
};