const d3 = require('d3')
const colors = require('./colors')

/**
 * @module NodeUI
 */

const fixedRadius = 12

const flashColors = {
	original: {
		fill: colors.statusColors.down.fill,
		stroke: colors.statusColors.down.stroke
	},
	target: {
		fill: '#700000',
		stroke: '#700000'
	}
}

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

const calculateRadius = function (node) {
	return fixedRadius // temp
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
		// console.log('styleNode', selection)
		selection.attr('class', (node) => 'node status-' + node.status)
			.attr('fill', fillColor)
			.attr('stroke', strokeColor)
			.attr('stroke-width', '3px')
			.attr('r', fixedRadius)
	},

	/**
	 * Flashes a circle inifinitely
	 * @private
	 * @param {node} circle - d3 selected elememt/node to animate
	 * @param {Object} opts - map of colors
	 */
	flash: function (circle, opts = flashColors) {
		circle.transition()
			.on('start', function repeat (d) {
				d3.active(this)
					.duration(200)
					.attr('fill', opts.target.fill)
					.attr('stroke', opts.target.stroke)
				.transition()
					.duration(350)
					.attr('fill', opts.original.fill)
					.attr('stroke', opts.original.stroke)
				.transition()
					.delay(200)
					.on('start', repeat)
			})
	},

	/**
	 * Pulses a circle infinitely
	 * @private
	 * @param {node} circle - d3 selected elememt/node to animate
	 * @param {Integer} delta - amount to increase radius by
	 */
	pulse: function (circle, delta) {
		circle.transition()
			.on('start', function repeat (d) {
				let originalRadius = calculateRadius(d)
				d3.active(this)
					.duration(300)
					.attr('r', originalRadius + delta)
				.transition()
					.duration(800)
					.attr('r', originalRadius)
				.transition()
					.on('start', repeat)
			})
	}
}

module.exports = NodeUI