module.exports = {
	nodes: [
		{ id: 'w', label: 'Web Frontend' },
		{ id: 'm', label: 'Mobile Device' },
		{ id: 'b', label: 'Monolith Backend' },
		{ id: 'd', label: 'Database' },
	],
	links: [
		{ source: 'w', target: 'b' },
		{ source: 'm', target: 'b' },
		{ source: 'b', target: 'd' }
	]
}