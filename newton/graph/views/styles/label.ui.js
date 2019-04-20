const colors = require('./colors')

const relationshipColors = {}
// relationshipColors['is-source-and-target'] = colors.green
relationshipColors['is-source'] 					 = colors.lightenDarkenColor(colors.red, 50)
relationshipColors['is-target'] 					 = colors.lightenDarkenColor(colors.yellow, -20)
relationshipColors['has-no-relationship']  = colors.backgroundOffsetColor
relationshipColors['is-same-node'] 				 = ''

const LabelUI = {
	relationshipColor: function (node, rel) {
		let c = relationshipColors.hasOwnProperty(rel)
			? relationshipColors[rel]
			: ''

		if (node.status !== 'up') {
			c = colors.statusColors[node.status].fill
		}
		return c
	}
}

module.exports = LabelUI