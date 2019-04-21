const colors = require('./colors')

const relationshipColors = {}
// relationshipColors['is-source-and-target'] = colors.green
relationshipColors['is-source'] 					 = colors.lightenDarkenColor(colors.red, 50)
relationshipColors['is-deep-source'] 			 = colors.darkOrange
relationshipColors['is-target'] 					 = colors.lightenDarkenColor(colors.yellow, -20)
relationshipColors['has-no-relationship']  = colors.backgroundOffsetColor
relationshipColors['is-same-node'] 				 = 'white'

const LabelUI = {
	relationshipColor: function (node, rel) {
		let c = relationshipColors.hasOwnProperty(rel)
			? relationshipColors[rel]
			: ''
		return c
	}
}

module.exports = LabelUI