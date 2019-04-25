module.exports = {
	nodes: [
		{ id: 'w', label: 'Web Frontend'},
		{ id: 'm', label: 'Mobile Device'},
		{ id: 'apig', label: 'API Gateway'},
		{ id: 'd1', label: 'Downstream 1'},
		{ id: 'd2', label: 'Downstream 2'},
		{ id: 'd3', label: 'Downstream 3'}
	],
	links: [
		{ source: 'w', target: 'apig' },
		{ source: 'm', target: 'apig' },
		{ source: 'apig', target: 'd1' },
		{ source: 'apig', target: 'd2' },
		{ source: 'apig', target: 'd3' }
	]
}