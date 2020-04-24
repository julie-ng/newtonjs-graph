const EventEmitter = require('events').EventEmitter

/**
 * Base Class to force interface to be implemented
 */
class View extends EventEmitter {
	/**
	 * @param {Object} options
	 * @param {String} [options.dom = window.document] - DOM reference, required for testing
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super()
		this.dom = options.dom || window.document
		this.container = options.container || 'g'
	}

	/**
	 * Binds this view to a graph so we can react to
	 * changes and re-render and adjust the graph as necessary.
	 *
	 * @param {Graph} graph - graph to listen to for changes
	 */
	bindGraph (graph) {
		this.graph = graph
		this.graph.on('tick', () => this.position())
		// graph.on('update', (data) => this.render(data))
	}

	/**
	 * Renders all elements, including related transitions and animations based on data parameters, which should be references to real time data.
	 *
	 * Each `render()` executes method chains that follow the [d3.js General Update Pattern](https://bl.ocks.org/mbostock/3808234):
	 *
	 * 1. d3.js's `data()` method returns all _changed_ nodes
	 * 1. Remove _deleted_ elements via `exit().remove()`
	 * 1. Add _new_ elements via `enter()`
	 * 1. Apply styles and UI to _all_ new and existing elements via `merge()`
	 *
	 * This method also stores references to generated elements to the instance for re-positioning by layout adapter.
	 *
	 * Lastly, this method is meant to be a callback listener to an event, although it can be called directly.
	 *
	 * @param {Object} data
	 * @param {Array} data.nodes
	 * @param {Array} data.links
	 */
	render (data) {
		throw interfaceError('render')
	}

	/**
	 * Re-calculates and repositions elements using current data.
	 * This is used by the webcola layout adapter
	 * for "less noisy" network visualizations.
	 */
	position (data) {
		throw interfaceError('position')
	}

	highlightDependencies (data) {
		throw interfaceError('highlightDependencies')
	}

	/**
	 * Classifies elements based on relationship to node parameter.
	 * CSS styling is based on `data-rel` attribute set on the DOM element.
	 *
	 * @param {Node} node
	 */
	setRelationships (node) {
		this.selection.attr('data-rel', (i) => this.graph.network.getRelationship(i, node))
	}

	/**
	 * Visually hides elements unrelated to node parameter.
	 * CSS styling is based on `data-hidden` attribute set on the DOM element.
	 *
	 * @param {Node} node
	 */
	hideUnrelated (node) {
		this.selection.attr('data-hidden', (i) => {
			(this.graph.network.getRelationship(i, node) === 'has-no-relationship')
				? '1'
				: ''
		})
	}

	/**
	 * Reset all styles, e.g. colors and visibility
	 */
	resetStyles () {
		this.selection
			.attr('data-rel', '')
			.attr('data-hidden', '')
	}
}

function interfaceError (methodName) {
	return `View interface error - subclasses must implement the ${methodName}() method`
}

module.exports = View