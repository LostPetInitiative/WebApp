const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'app': { import: './src/index.tsx', dependOn: ['react-vendors','ui-vendors'], },
    'react-vendors': ['react', 'react-dom'],
    'ui-vendors': {import: ['@fluentui/react'], dependOn: ['react-vendors']},
  },
  //entry: './src/index.tsx',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
     {
       test: /\.(woff|woff2|eot|ttf|otf)$/i,
       type: 'asset/resource',
     },
    ],
  },
  devServer: {
    port: 3000
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: 'public/index.html',
      //publicPath: 'public',
    }),
  ],
  output: {
    filename: 'bundle.[name].[contenthash].js',
    chunkFilename: 'chunk.[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, 
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all' 
    }
  },
};