module.exports = {
	nodes: [
		{ id: 'w', label: 'Web Frontend'},
		{ id: 'm', label: 'Mobile Device'},
		{ id: 'w-bff', label: 'Web BFF'},
		{ id: 'm-bff', label: 'Mobile BFF'},
		{ id: 'd1', label: 'Downstream 1'},
		{ id: 'd2', label: 'Downstream 2'},
		{ id: 'd3', label: 'Downstream 3'}
	],
	links: [
		{ source: 'w', target: 'w-bff' },
		{ source: 'm', target: 'm-bff' },
		{ source: 'w-bff', target: 'd1' },
		{ source: 'm-bff', target: 'd1' },
		{ source: 'w-bff', target: 'd2' },
		{ source: 'm-bff', target: 'd3' }
	]
}