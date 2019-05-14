const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: 'production',
	entry: {
		newton: './newton/index.js',
		css: './newton/css.entry.js'
		// d3: './newton/d3.js'
	},
	output: {
		filename: '[name].min.js',
		path: path.resolve(__dirname, 'build'),
		library: 'newton',
		libraryExport: 'default',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},
	devtool: 'none',
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
		new CleanWebpackPlugin(['build']),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
	]
}
