import * as d3 from 'd3'
import * as Cola from 'webcola'
import colors from './lib/colors'
import newton from './lib/nodes'
import newtonTransitions from './lib/transitions'
import styleNode from './lib/style-node'

const Labels = require('./../labels')
const Links = require('./../links')
const Nodes = require('./../nodes')

const data = require('./data')
const margin = 40
const height = 550
const width = window.innerWidth - margin
const fixedRadius = 12

/**
 * Setup Layout
 */
const cola = Cola.d3adaptor(d3).size([width, height])
const svg = d3.select('svg')
	.attr('width', width)
	.attr('height', height)

const links2 = new Links(data, {
	container: svg
})

const nodes2 = new Nodes(data.nodes, {
	container: svg,
	adapter: cola
})

const labels2 = new Labels(data, {
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
	links2.render()
	nodes2.render()
	labels2.render()

	cola.on('tick', () => {
		labels2.position()
		links2.position()
		nodes2.position()
	})

	nodes2.animate()
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

		links2.updateData(data)
		nodes2.updateData(data.nodes)
		render()
	})