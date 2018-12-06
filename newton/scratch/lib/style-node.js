import * as d3 from 'd3'
import newton from './nodes'

const fixedRadius = 12

export default function (circle) {
	circle.attr('class', (node) => 'node status-' + node.status)
		.attr('fill', newton.calculateFill)
		.attr('stroke', newton.calculateStroke)
		.attr('stroke-width', '3px')
		.attr('r', fixedRadius)
}