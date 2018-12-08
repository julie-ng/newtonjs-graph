/**
 * Reusable Transitions
 *
 * @module Transitions
 */
module.exports = {
	FadeDown: require('./fade-down'),

	/**
	 * @function fadeOut
	 * @param {d3Transition} transition
	 * @param {Integer} [fadeTo=0] - target opacity
	 */
	fadeOut: require('./fade-out')
}
