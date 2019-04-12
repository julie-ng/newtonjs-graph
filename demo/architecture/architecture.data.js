const elements = [
	{
		id: "1",
		status: "up",
		label: "Frontend"
	},
	{
		id: "2",
		status: "up",
		label: "API Gateway"
	},
	{
		id: "3",
		status: "up",
		label: "Search Service"
	},
	{
		id: "4",
		status: "up",
		label: "Product Service"
	},
	{
		id: "5",
		status: "up",
		label: "Main Database"
	},
	{
		id: "6",
		status: "up",
		label: "Auth Service"
	},
	{
		id: "7",
		status: "deploying",
		label: "Users Database"
	},
	{
		id: "8",
		status: "down",
		label: "Payment Service"
	}
]

// links by reference
const linksMap = [
	{ source: '1', target: '2' },
	{ source: '2', target: '3' },
	{ source: '2', target: '4' },
	{ source: '3', target: '5' },
	{ source: '4', target: '5' },
	{ source: '2', target: '6' },
	{ source: '6', target: '7' },
	{ source: '2', target: '8' }
]

module.exports = {
	nodes: elements,
	linksMap: linksMap
}