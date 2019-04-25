const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: 'development',
	entry: {
		demo: './demo/entry.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'demo/dist')
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'demo/dist'),
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
		new CleanWebpackPlugin(['demo/dist']),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new HtmlWebpackPlugin({
			templateParameters: {
				title: 'Newton.js Demo',
			},
			chunks: ['demo'],
			template: 'demo/demo.layout.hbs',
			filename: 'index.html'
		})
	]
}
