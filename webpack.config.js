const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: 'development',
	entry: {
		elements: './demo/elements/index.js',
		architecture: './demo/architecture/index.js'
	},
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
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[ext]',
						}
					}
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
				title: 'Prototype Demo: Network with Elements',
			},
			chunks: ['elements'],
			template: 'demo/elements/elements.demo.hbs',
			filename: 'demo/elements.html'
		}),
		new HtmlWebpackPlugin({
			templateParameters: {
				title: 'Newton.JS Demo',
			},
			chunks: ['architecture'],
			template: 'demo/architecture/architecture.demo.hbs',
			filename: 'index.html'
		})
	]
}
