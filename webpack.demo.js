const path = require('path')
const defaults = require('./webpack.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const loaders = [
	{
		test: /\.hbs$/,
		use: 'handlebars-loader'
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
	},
	{
		test: /\.(eot|ttf|woff|woff2)$/,
		use: [
			{
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]',
				}
			}
		]
	}
]

module.exports = Object.assign({}, defaults, {
	mode: 'production',
	entry: {
		demo: './demo/entry.js'
	},
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, 'demo/build')
	},
	module: {
		rules: loaders.concat(defaults.module.rules)
	},
	plugins: [
		new CleanWebpackPlugin(['demo/build']),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new HtmlWebpackPlugin({
			templateParameters: {
				title: 'Newton.js Demo',
			},
			chunks: ['demo', 'newton'],
			template: 'demo/index.hbs',
			filename: 'index.html'
		})
	]
})
