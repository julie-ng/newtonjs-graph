/**
 * Custom d3 build
 *
 * The d3 engine itself requires these minimum libraries:
 *
 * - d3-array
 * - d3-selection
 * - d3-collection
 * - d3-drag
 * - d3-force
 * - d3-timer
 * - d3-dispatch
 * - d3-quadtree
 *
 * Webcola will also render. But dragging does not work.
 */


const d3 = Object.assign({},
	require('d3-array'),
	// require('d3-axis'),
	// require('d3-brush'),
	// require('d3-chord'),
	require('d3-collection'),
	// require('d3-color'),
	// require('d3-contour'),
	require('d3-dispatch'),
	require('d3-drag'),
	// require('d3-ease'),
	// require('d3-dsv'),
	// require('d3-fetch'),
	require('d3-force'),
	// require('d3-format'),
	// require('d3-geo'),
	// require('d3-hierarchy'),
	// require('d3-interpolate'),
	// require('d3-path'),
	// require('d3-polygon'),
	require('d3-quadtree'),
	// require('d3-random'),
	// require('d3-scale'),
	// require('d3-scale-chromatic'),
	require('d3-selection'),
	// require('d3-shape'),
	// require('d3-time'),
	// require('d3-time-format'),
	require('d3-timer')
	// require('d3-transition'),
	// require('d3-voronoi'),
	// require('d3-zoom'),
)

module.exports = d3