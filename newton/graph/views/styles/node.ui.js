const d3 = require('d3')
const colors = require('./colors')

/**
 * @module NodeUI
 */

const defaultRadius = 10

const relationshipColors = {}
relationshipColors['is-source-and-target-fill'] = colors.green
relationshipColors['is-source-fill'] 						= colors.red
relationshipColors['is-deep-source-fill']				= colors.orange
relationshipColors['is-target-fill'] 						= colors.lightenDarkenColor(colors.yellow, -40)
relationshipColors['has-no-relationship-fill'] 	= colors.backgroundOffsetColor
relationshipColors['is-same-node-fill'] 				= ''

relationshipColors['is-source-and-target-stroke'] = colors.lightenDarkenColor(colors.green, 20)
relationshipColors['is-source-stroke'] 						= colors.lightenDarkenColor(colors.red, 20)
relationshipColors['is-deep-source-stroke']				= colors.lightenDarkenColor(colors.orange, 20)
relationshipColors['is-target-stroke'] 						= colors.lightenDarkenColor(colors.yellow, -10)
relationshipColors['has-no-relationship-stroke'] 	= colors.lightenDarkenColor(colors.backgroundOffsetColor, 20)
relationshipColors['is-same-node-stroke'] 				= ''

function fillColor (node) {
	let status = node.status || 'up'
	return colors.statusColors[status].fill
}

function strokeColor (node) {
	let status = node.status || 'up'
	return colors.statusColors[status].stroke
}

function calculateRadius (node) {
	let r = (node.status === 'up')
		? defaultRadius
		: defaultRadius + 4
	return r
}
const NodeUI = {
	relationshipColor: function (prop, node, rel) {
		if (node.status !== 'up' && prop === 'stroke') {
			return strokeColor(node)
		} if (node.status !== 'up' && prop === 'fill') {
			return fillColor(node)
		} else {
			let key = rel + '-' + prop
			return relationshipColors.hasOwnProperty(key)
				? relationshipColors[key]
				: ''
		}
	},

	styleNode: function (selection) {
		selection.attr('fill', fillColor)
			.attr('stroke', strokeColor)
			.attr('stroke-width', '3px')
			.attr('r', (n) => calculateRadius(n))
	}
}

module.exports = NodeUI