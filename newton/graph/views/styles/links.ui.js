const colors = require('./colors')

const relationshipColors = {}
// relationshipColors['is-source-and-target'] = 'red'
relationshipColors['is-source'] 					 = colors.orange
relationshipColors['is-target'] 					 = colors.red
relationshipColors['has-no-relationship']  = colors.backgroundOffsetColor
// relationshipColors['is-same-node'] 				 = ''

const LinksUI = {
	relationshipColor: function (node, rel) {
		console.log(`relationshipColor(${node.label})`)

		let c = relationshipColors.hasOwnProperty(rel)
			? relationshipColors[rel]
			: ''

		// if (node.status !== 'up') {
		// 	console.log(`${node.label} is ${node.status}`)

		// 	c = colors.statusColors[node.status].fill
		// }
		return c
	}
}

module.exports = LinksUI
