const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: 'production',
	entry: {
		newton: './newton/index.js',
		css: './newton/css.entry.js'
	},
	output: {
		filename: '[name].bundle.min.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'Newton',
		libraryTarget: 'umd',
	},
	devtool: 'cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new MiniCssExtractPlugin({
			filename: 'newton.css'
		})
	]
}