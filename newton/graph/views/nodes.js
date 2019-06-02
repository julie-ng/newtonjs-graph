const d3 = require('d3')
const View = require('./view')

/**
 * @typedef {Object} Node
 *
 * A node is an `Object` with node properties e.g. name, status, etc. These attributes are user defined.
 * The standard and minimum attributes include:
 *
 * ```javascript
 * let node = {
 * 	status: 'up',				// used for styling
 * 	id: 'web-frontend',			// identifier used in in links
 * 	label: 'Web Frontend'		// text label
 * }
 * ```
 * Note that `id`s must be unique and are used in referencing {@link Link}s.
 *
 * @property {String} id - Identifier referenced in {@link Link}s.
 * @property {String} label - Text label for the Node.
 * @property {String} status - This can be `up`, `down` or `deploying` and is used for styling.
 */

/**
 * Encapsulates what is needed to create the nodes of a network graph,
 * namely rendering, positioning and animation of nodes based on data.
 *
 * @extends View
 */
class Nodes extends View {
	/**
	 * @param {Object} options
	 * @param {String} [options.dom = window.document] - DOM reference, required for testing
	 * @param {String} [options.container] - HTML identifier used by for d3
	 */
	constructor (options = {}) {
		super(options)
	}

	/**
	 * Renders network graphs and passes hooks to d3.js's general update pattern via events.
	 * For more information on the general update pattern, see:
	 * [https://bost.ocks.org/mike/join/](https://bost.ocks.org/mike/join/)
	 *
	 * @param {Object} data - Network data with `nodes` attribute
	 */
	render (data) {
		// console.log(' nodes render()')
		if (data.nodes === undefined) { throw 'Error: missing `nodes` attribute on parameter.' }

		let nodes = d3.select(this.dom)
			.select(this.container)
			.selectAll('.node')
			.data(data.nodes, (d) => d.id)

		/**
		 * An `Array` of exiting Nodes, i.e. nodes to be removed per d3.js general update pattern.
		 *
		 * @event Nodes#exit
		 * @type {Array}
		 */
		this.emit('exit', nodes.exit())
		nodes.exit()
			.remove()

		/**
		 * An `Array` of enter Nodes, i.e. new nodes per d3.js general update pattern.
		 *
		 * @event Nodes#enter
		 * @type {Array}
		 */
		this.emit('enter', nodes.enter())
		nodes = nodes.enter()
			.append('circle')
				.attr('id', (n) => 'node-' + n.id)
			.merge(nodes)
				.attr('data-title', (n) => n.label)
				.attr('class', (n) => 'node status-' + n.status)
				.attr('r', (n) => n.status === 'up' ? 6 : 10)
				.on('mouseover', (n) => this.onMouseover(n))
				.on('mouseout', (n) => this.onMouseout(n))
				.on('click', (n) => this.onClick(n))

		/**
		 * An `Array` of combined existing and new Nodes, per d3.js general update pattern.
		 *
		 * @event Nodes#update
		 * @type {Array}
		 */
		this.emit('update', nodes)
		this.selection = nodes
	}

	/**
	 * Positions node `<circle>` at center
	 */
	position () {
		this.selection
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
	}

	/**
	 * Event handler for browser `mouseover` event. Handler is defined in [render()]{@link Nodes#render}.
	 *
	 * @param {Object} n - Node
	 * @emits Nodes#mouseover
	 */
	onMouseover (n) {
		/**
		 * Note: this is a custom event and _not_ a browser event.
		 *
		 * @event Nodes#mouseover
		 * @type {Node}
		 * @example
		 * nodes.on('mouseover', (node) => {
			* 	console.log('User hovered on node ' + node.name)
			* })
		 */
		this.emit('mouseover', n)
	}

	/**
	 * Event handler for browser `mouseout` event. Handler is defined in [render()]{@link Nodes#render}.
	 * @param {Object} n - Node
	 */
	onMouseout (n) {

		/**
		 * Note: this is a custom event and _not_ a browser event.
		 *
		 * @event Nodes#mouseout
		 * @type {Node}
		 * @example
		 * nodes.on('mouseout', (node) => {
			* 	console.log('mouse left node ' + node.name)
			* })
		 */
		this.emit('mouseout', n)
	}

	/**
	 * Event handler for browser `click` event. Handler is defined in [render()]{@link Nodes#render}.
	 * @param {Node} n - clicked on node
	 */
	onClick (n) {

		/**
		 * Note: this is a custom event and _not_ a browser event.
		 *
		 * @event Nodes#click
		 * @type {Node}
		 * @example
		 * nodes.on('click', (node) => {
		 * 	console.log('User clicked on node ' + node.name)
		 * })
		 */
		this.emit('click', n)
	}
}

module.exports = Nodes