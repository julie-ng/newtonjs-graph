const colors = require('./colors')

const relationshipColors = {}
// relationshipColors['is-source-and-target'] = 'red'
relationshipColors['is-source'] 					 = colors.lightenDarkenColor(colors.yellow, -50)
relationshipColors['is-deep-source'] 			 = colors.darkOrange
relationshipColors['is-target'] 					 = colors.red
relationshipColors['has-no-relationship']  = colors.backgroundOffsetColor
// relationshipColors['is-same-node'] 				 = ''

const LinksUI = {
	relationshipColor: function (link, rel) {
		return relationshipColors.hasOwnProperty(rel)
			? relationshipColors[rel]
			: ''
	}
}

module.exports = LinksUI
