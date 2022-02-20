const path = require('path');
const debug = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/js/game.ts',
  mode: debug ? 'development' : 'production',
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'dist/js'),
    clean: true,
  },
};