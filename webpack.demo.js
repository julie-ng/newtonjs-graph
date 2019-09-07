const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: 'production',
	entry: {
		demo: './demo/entry.js'
		// newton: './newton/index.js'
	},
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, 'demo/build')
	},
	// optimization: {
	// 	splitChunks: {
	// 		chunks: 'all'
	// 	}
	// },
	// optimization: {
	// 	runtimeChunk: true,
	//   splitChunks: {
	// 		chunks: 'all',
	// 		cacheGroups: {
	//       vendor: {
	//         test: /[\\/]node_modules[\\/](d3|webcola|socket.io-client)[\\/]/,
	//         name: 'vendor',
	//         chunks: 'all',
	//       }
	//     }
	// 		// cacheGroups: {
	//     //   commons: {
	//     //     test: /[\\/]node_modules[\\/]/,
	//     //     name: 'vendors',
	//     //     chunks: 'all'
	//     //   }
	//     // }
	// 	}
	// },
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
}
