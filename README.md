# Newton Graph Library 

[![Build Status](https://travis-ci.org/julie-ng/newtonjs-graph.svg?branch=master)](https://travis-ci.org/julie-ng/newtonjs-graph)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7a3975197c576202fe08/test_coverage)](https://codeclimate.com/github/julie-ng/newtonjs-graph/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/7a3975197c576202fe08/maintainability)](https://codeclimate.com/github/julie-ng/newtonjs-graph/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/julie-ng/newtonjs-graph/badge.svg?targetFile=package.json)](https://snyk.io/test/github/julie-ng/newtonjs-graph?targetFile=package.json)
[![Build Status](https://dev.azure.com/newtonjs/newton-graph/_apis/build/status/julie-ng.newtonjs-graph?branchName=master)](https://dev.azure.com/newtonjs/newton-graph/_build/latest?definitionId=1&branchName=master)

This repository contains learning and prototype code for a high-level dashboard for architects and stakeholders. The goal is to visualize architectures in large organizations as organisms that live and breath with deployments, problems, etc. These real-time visualizations could instead reveal insights about how [Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law) applies to the organization.

- [Live Demo &rarr;](https://newton-demo.azurewebsites.net/?data-server=https://newton-demo-data-editor.azurewebsites.net/)  	
- [API Documentation &rarr;](https://julie-ng.github.io/newtonjs-graph/)

### Example Graphs

The following show two different renders from the same demo data set:

| D3.js Engine | Webcola Engine |
|:--|:--|
| <img src="./images/screenshots/demo-d3-layout.png" alt="Example Graph with d3.js Layout Engine" width="350" style="max-width:100%"> | <img src="./images/screenshots/demo-cola-layout.png" alt="Example Graph with webcola Layout Engine" width="400" style="max-width:100%"> | 
| [d3-force](https://github.com/d3/d3-force) creates a "harmonious" distribution of nodes | [cola.js](https://ialab.it.monash.edu/webcola/) can create directional graphs |

### Highlight Relationships with Colors

In both examples above, the "Documents Service" is the **_highlighted node_**. The colors indicate a relationship to this node:

| Color | Relationship | Description |
|:--|:--|:--|
| Green | | In this example, the node had a status of `up`, so it is still green. |
| Red | `is-source` | These nodes directly depend on "Documents Service". |
| Orange | `is-deep-source` | These nodes do not _directly_ require "Documents Service", but may still be impacted. |
| Yellow | `is-target` | These nodes do not require "Documents Service", but may still be effected, e.g. decrease in incoming traffic. |
| Faded Out | `has-no-relationship` | No releationship to highlighted node. |

For more information **[view API Documentation &rarr;](https://julie-ng.github.io/newtonjs-graph/)**

## Network - Data Wrapper

A `Network` is essentially a data wrapper. Its biggest advantage is that it dynamically calculating links between nodes, based on a unique identifier `uid`, instead of array indexes.

Here is an example data set from the [demo](./demo/data/3a.data.js):

```javascript
const data = {
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
```

## Graph - Visualization

While `Network` handles the data, `Graph` handles the visualizations, including layout, animations, etc.


```javascript
const network = new Network(data.nodes, data.links)
const graph = new Graph({
	width: window.innerWidth,
	height: window.innerHeight,
	flow: 'horizontal',	
	draggable: true,
	network: network // required
})

graph.init()
graph.on('node:click', (n) => {
	graph.highlightDependencies(n, { arrows: true })
})
```

## Development

### Install dependencies

First install the dependencies required:

```bash
npm install
```

### Preview

To view the prototype in the browser, run

```bash
npm run demo:dev
```

which starts the webpack dev server and automatically opens [http://localhost:9000](http://localhost:9000) in a browser window.