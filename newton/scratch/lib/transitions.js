import * as d3 from 'd3'
import newton from './nodes'

/**
 * Flashes a circle inifinitely
 *
 * @param {node} circle - d3 selected elememt/node to animate
 * @param {Object} opts - map of colors
 */
function flash (circle, opts = {}) {

	circle.transition()
		.on('start', function repeat(d) {
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
		.on('start', function repeat(d) {
			let originalRadius = newton.calculateRadius(d)
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

export default {
	flash: flash,
	pulse: pulse
}
