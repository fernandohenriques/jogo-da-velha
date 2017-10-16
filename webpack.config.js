const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var isInProduction = JSON.parse(process.env.NODE_ENV || '0');

module.exports = {
    entry: './src/js/app.js',
    output: {
        filename: './js/bundle.js'
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
    plugins: isInProduction ? [new UglifyJSPlugin({compress: { warnings: false }})] : []
};
