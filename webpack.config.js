const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var isInProduction = JSON.parse(process.env.NODE_ENV || '0');

module.exports = {
    entry: './src/js/app.js',
    output: {
        filename: './public/js/app.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: isInProduction ? [new UglifyJSPlugin()] : []
};
