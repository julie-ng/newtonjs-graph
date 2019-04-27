module.exports = {
	nodes: [
		{ id: 'a', status: 'up', label: 'Deep Source' },
		{ id: 'b', status: 'up', label: 'Source' },
		{ id: 'c', status: 'up', label: 'Highlighted Node' },
		{ id: 'd', status: 'up', label: 'Target' },
		{ id: 'e', status: 'up', label: 'Unrelated' },
		{ id: 'f', status: 'up', label: 'Unrelated' },
	],
	links: [
		{ source: 'a', target: 'b' },
		{ source: 'b', target: 'c' },
		{ source: 'c', target: 'd' },
		{ source: 'd', target: 'e' },
		{ source: 'b', target: 'f' },
	]
}