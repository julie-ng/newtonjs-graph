import * as d3 from 'd3'
import * as Cola from 'webcola'
import colors from './lib/colors'
import newton from './lib/nodes'
import newtonTransitions from './lib/transitions'
import styleNode from './lib/style-node'

const data = require('./data')
const margin = 40
const height = 550
const width = window.innerWidth - margin
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

/**
 * Setup Layout
 */
const cola = Cola.d3adaptor(d3).size([width, height])
const svg = d3.select('svg')
	.attr('width', width)
	.attr('height', height)

// Organize elements into containers
// svg.append('g').attr('id', 'links-container')
// svg.append('g').attr('id', 'labels-container')
// 	.attr('class', 'labels-container')
// svg.append('g').attr('id', 'circles-container')

const linksContainer =  svg // d3.select('#links-container')
const labelsContainer =  svg // d3.select('#labels-container')
const circlesContainer =  svg // d3.select('#circles-container')

/**
 * Layout: use cola
 */
cola.nodes(data.nodes)
	.links(data.links)
	.jaccardLinkLengths(100,0.8)
	.start(30)

render()


/**
 * Render Helper
 */
function render () {
	let t = d3.transition()
		.duration(250)
		.ease(d3.easeLinear)

	// Links
	let links = linksContainer.selectAll('.link')
	.data(data.links)

	links = links.enter()
		.append('line')
		.merge(links)
			.attr('class', 'link')
			.style('stroke-width', 1)

	// TODO: simplify example like this:
	// https://github.com/d3/d3-selection#joining-data
	let nodes = svg.selectAll('circle')
	.data(data.nodes, (d) => d.id)

	nodes = nodes.enter()
		.append('circle')
			.attr('data-title', (d) => d.label)
		.merge(nodes)
			.call(styleNode)
			.call(cola.drag)

	// Labels
	let labels = labelsContainer.selectAll('text')
	.data(data.nodes)

	labels.transition(t)
		.attr('font-size', newton.calculateFontSize)

	labels = labels.enter().append('text')
		.text((node) => node.label)
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'central')
			.attr('font-size', newton.calculateFontSize)
		.merge(labels)
			.attr('dx', (node) => node.cx)
			.attr('dy', (node) => node.cy)
			.attr('class', (node) => 'label status-' + node.status)


	// Position everything
	cola.on('tick', () => {
		links.attr('x1', (d) => d.source.x)
			.attr('y1', (d) => d.source.y)
			.attr('x2', (d) => d.target.x)
			.attr('y2', (d) => d.target.y)

		labels.attr('x', (d) => d.x)
			.attr('y', (d) => d.y + fixedRadius*2.5)

		nodes.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
	})

	// Animations
	nodes.filter('.status-down')
	.call(newtonTransitions.flash, flashColors)

	nodes.filter('.status-deploying')
	.call(newtonTransitions.pulse, 3)
}


/**
 * Update Button
 */
document.querySelector('#js-update')
	.addEventListener('click', () => {
		console.log('UPDATE')
		console.log('	before: ', data.nodes[data.nodes.length-1])
		data.nodes[data.nodes.length-1].status = "down"
		console.log('	after: ', data.nodes[data.nodes.length-1])

		// note, we changed data, but we need to apply styles to update, not just enter()

		render()
	})