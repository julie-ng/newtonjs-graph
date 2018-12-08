/** @namespace Transitions */

/**
 * @module FadeDown
 * @memberOf Transitions
 * @inner
 */

/**
 *
 * @param {d3Transition} transition
 * @param {Integer} [offset] - distance along y-axis to fade down
 */
function circle (transition, offset = 5) {
	transition
		.attr('cy', (d) => d.y + offset)
}

/**
 *
 * @param {d3Transition} transition
 * @param {Integer} [offset] - distance along y-axis to fade down
 */
function line (transition, offset = 2) {
	transition
		.attr('y1', (d) => d.source.y + offset)
		.attr('y2', (d) => d.target.y + offset)
}

/**
 *
 * @param {d3Transition} transition
 * @param {Integer} [offset] - distance along y-axis to fade down
 */
function text (transition, offset = 5) {
	transition
		.attr('y', (d) => d.y + offset)
}

module.exports = {
	circle: circle,
	line: line,
	text: text
}