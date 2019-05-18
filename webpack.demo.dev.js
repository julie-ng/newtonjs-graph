const path = require('path')
const defaults = require('./webpack.demo')

const config = Object.assign({}, defaults, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'demo/dist'),
		compress: true,
		port: 9000
	},
})

delete config['optimization']

module.exports = config