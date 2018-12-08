const d3 = require('d3')
const colors = require('./config/colors')

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

function fillColor (node) {
	return colors.statusColors[node.status].fill
}

function strokeColor (node) {
	return colors.statusColors[node.status].stroke
}

const calculateRadius = function (node) {
	return fixedRadius // temp
}

const NodeUI = {
	styleNode: function (selection) {
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