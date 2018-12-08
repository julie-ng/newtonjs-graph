const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: 'development',
	entry: './demo/index.js',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000
	},
	module: {
		rules: [
			{
				test: /\.hbs$/,
				use: 'handlebars-loader'
			},
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
			filename: '[name].css'
		}),
		new HtmlWebpackPlugin({
			templateParameters: {
				title: 'Microservices Dashboard Protoype (Demo)',
			},
			template: 'demo/index.hbs',
			filename: 'index.html'
		})
	]
}
