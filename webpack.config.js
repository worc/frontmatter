const webpack = require('webpack')
const packageJson = require('./package.json')

const banner = `${packageJson.name} ${packageJson.version} - ${packageJson.description}\nCopyright 2020 ${packageJson.author} - ${packageJson.homepage}\nLicense: ${packageJson.license}`

module.exports = {
  context: __dirname,
  entry: './frontmatter.js',
  mode: 'production',
  output: {
    path: __dirname + '/dist',
    filename: `${packageJson.name}.min.js`,
    library: `${packageJson.name}`,
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [ new webpack.BannerPlugin(banner) ],
}
