import * as d3 from 'd3'
import * as Cola from 'webcola'

const Labels = require('./../labels')
const Links = require('./../links')
const Nodes = require('./../nodes')

const data = require('./data')
const margin = 40
const height = 550
const width = window.innerWidth - margin

/**
 * Setup Layout
 */
const cola = Cola.d3adaptor(d3).size([width, height])
const svg = d3.select('svg')
	.attr('width', width)
	.attr('height', height)

const links = new Links(data, {
	container: svg
})

const nodes = new Nodes(data.nodes, {
	container: svg,
	adapter: cola
})

const labels = new Labels(data, {
	container: svg
})

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
	links.render()
	nodes.render()
	labels.render()

	cola.on('tick', () => {
		labels.position()
		links.position()
		nodes.position()
	})

	nodes.animate()
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

		links.updateData(data)
		nodes.updateData(data.nodes)
		render()
	})