const d3 = require('d3')
const colors = require('./config/colors')

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
const calculateRadius = function (node) {
	return fixedRadius // temp
}

/**
 * Flashes a circle inifinitely
 *
 * @param {node} circle - d3 selected elememt/node to animate
 * @param {Object} opts - map of colors
 */
function flash (circle, opts = {}) {
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
}

/**
 * Pulses a circle infinitely
 *
 * @param {node} circle - d3 selected elememt/node to animate
 * @param {Integer} delta - amount to increase radius by
 */
function pulse (circle, delta) {
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

const styleNode = function (selection) {
	selection.attr('class', (node) => 'node status-' + node.status)
		.attr('fill', fillColor)
		.attr('stroke', strokeColor)
		.attr('stroke-width', '3px')
		.attr('r', fixedRadius)
}

const fillColor = function (node) {
	return colors.statusColors[node.status].fill
}

const strokeColor = function (node) {
	return colors.statusColors[node.status].stroke
}

// ------------------------

class Nodes {
	constructor (data, opts) {
		console.log('new Nodes()')
		this.data = data
		this.container = opts.container // d3 select() element
		this.adapter = opts.adapter // cola
	}

	updateData (data) {
		this.data = data
	}

	render () {
		console.log('Nodes.render()')

		let nodes = this.container.selectAll('circle')
			.data(this.data, (d) => d.id)

		nodes = nodes.enter()
			.append('circle')
				.attr('data-title', (d) => d.label)
			.merge(nodes)
				.call(styleNode)
				.call(this.adapter.drag)

		this.nodes = nodes
	}

	position () {
		// console.log('Nodes.position()')
		this.nodes.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
	}

	animate () {
		// console.log('Nodes.animate()')
		this.nodes.filter('.status-down')
			.call(flash, flashColors)

		this.nodes.filter('.status-deploying')
			.call(pulse, 3)
	}
}


module.exports = Nodes