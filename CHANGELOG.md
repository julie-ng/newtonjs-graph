# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/julie-ng/newtonjs-graph/compare/v0.1.0...v0.2.0) (2019-09-08)


### Build System

* **deps:** bump eslint-utils from 1.3.1 to 1.4.2 ([a9fa0a7](https://github.com/julie-ng/newtonjs-graph/commit/a9fa0a7))
* **deps:** bump lodash from 4.17.11 to 4.17.14 ([52a44e7](https://github.com/julie-ng/newtonjs-graph/commit/52a44e7))
* **deps:** bump lodash.template from 4.4.0 to 4.5.0 ([f15dfa8](https://github.com/julie-ng/newtonjs-graph/commit/f15dfa8))


### Features

* **css:** set default background color ([6c0001f](https://github.com/julie-ng/newtonjs-graph/commit/6c0001f))
* **css:**  use css variables for font, stroke styling ([4cf2b57](https://github.com/julie-ng/newtonjs-graph/commit/4cf2b57))
* **css:**  use css variables for colors, remove sass functions ([a2a5a02](https://github.com/julie-ng/newtonjs-graph/commit/a2a5a02))
* **build:** add bundle for browsers ([c973e42](https://github.com/julie-ng/newtonjs-graph/commit/c973e42))
* **build:** output optimized version to dist folder ([48c6e8a](https://github.com/julie-ng/newtonjs-graph/commit/48c6e8a))
* **build:** refactor config, expose lib as global `Newton` for browsers ([afd8865](https://github.com/julie-ng/newtonjs-graph/commit/afd8865))



## 0.1.0 (2019-07-01)


### Bug Fixes

* **code-climate:** code coverage command in travis ([1b3aa77](https://github.com/julie-ng/newtonjs-graph/commit/1b3aa77))
* **drag:** now works before data update ([5360c2e](https://github.com/julie-ng/newtonjs-graph/commit/5360c2e))
* **neighbors:** calculate by id, not changing array indicies 🤦‍♀️ ([8135135](https://github.com/julie-ng/newtonjs-graph/commit/8135135))
* **security:** vulnerabilities in dev dependencies ([5a6b944](https://github.com/julie-ng/newtonjs-graph/commit/5a6b944))
* d3 data key functions to identify unique data ([843d4dc](https://github.com/julie-ng/newtonjs-graph/commit/843d4dc))
* only need restarts with webcola ([e31e703](https://github.com/julie-ng/newtonjs-graph/commit/e31e703))
* set labels after data merge ([01235ee](https://github.com/julie-ng/newtonjs-graph/commit/01235ee))
* update force layouts on new data ([2e1c4b0](https://github.com/julie-ng/newtonjs-graph/commit/2e1c4b0))
* update package after security audit ([c651aab](https://github.com/julie-ng/newtonjs-graph/commit/c651aab))


### Build System

* clean up webpack configs, try d3 modules ([865b936](https://github.com/julie-ng/newtonjs-graph/commit/865b936))
* **deps:** bump tar from 2.2.1 to 2.2.2 ([a9bff96](https://github.com/julie-ng/newtonjs-graph/commit/a9bff96))


### Features

* **highlight-neighbors:** show relationships and dependencies with color ([0cd0f08](https://github.com/julie-ng/newtonjs-graph/commit/0cd0f08))
* add larger demo data set ([a9ee076](https://github.com/julie-ng/newtonjs-graph/commit/a9ee076))
* graph option - left to right flow ([7f8b605](https://github.com/julie-ng/newtonjs-graph/commit/7f8b605))
* **bind-data:** re-render graph on data changes ([0c763a9](https://github.com/julie-ng/newtonjs-graph/commit/0c763a9))
* **ci:** integrate code coverage with coveralls ([fca0365](https://github.com/julie-ng/newtonjs-graph/commit/fca0365))
* **ci:** integrate travis ci ([a9ba2e9](https://github.com/julie-ng/newtonjs-graph/commit/a9ba2e9))
* **demo:** add build and static server ([964ca6f](https://github.com/julie-ng/newtonjs-graph/commit/964ca6f))
* **demo:** build and deploy ([04a36c3](https://github.com/julie-ng/newtonjs-graph/commit/04a36c3))
* **graph-types:** add option for default d3 and cola.js layouts ([08fb2d8](https://github.com/julie-ng/newtonjs-graph/commit/08fb2d8))
* **hooks:** add d3.js pattern hooks to bring back cola.js drag ([7afde43](https://github.com/julie-ng/newtonjs-graph/commit/7afde43))
* **socket:** bind to demo data server ([5a91ad7](https://github.com/julie-ng/newtonjs-graph/commit/5a91ad7))


### Tests

* fix paths after restructure ([3166333](https://github.com/julie-ng/newtonjs-graph/commit/3166333))
* graph and adjust jest config ([331dbe7](https://github.com/julie-ng/newtonjs-graph/commit/331dbe7))
* graph bindings ([3749664](https://github.com/julie-ng/newtonjs-graph/commit/3749664))
* **network:** increase coverage ([3df5273](https://github.com/julie-ng/newtonjs-graph/commit/3df5273))
* **view:** add initial coverage ([2e3bbe8](https://github.com/julie-ng/newtonjs-graph/commit/2e3bbe8))
* links ([e24f4ee](https://github.com/julie-ng/newtonjs-graph/commit/e24f4ee))
* nodes ([c2d1d1d](https://github.com/julie-ng/newtonjs-graph/commit/c2d1d1d))
* nodes ([a2bded8](https://github.com/julie-ng/newtonjs-graph/commit/a2bded8))
* pipe code coverage to code climate ([205b33e](https://github.com/julie-ng/newtonjs-graph/commit/205b33e))
* temporarily remove dependency audit, npmjs.org audit lately unreliable ([181f316](https://github.com/julie-ng/newtonjs-graph/commit/181f316))
