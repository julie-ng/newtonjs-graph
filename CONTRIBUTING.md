
# Contributing to Newton.js

Thank you for your interest in supporting this project!

#### Table of Contents

- **[Bugs and Suggestions](#bugs-and-suggestions)**
- **[Code Contributions](#code-contributions)**
	- [Create a Fork](#create-a-fork)
	- [Use Feature Branches - plural](#use-feature-branches---plural)
- **[Code Quality and CI](#code-quality-and-ci)**
	- Tests
	- [Create a Pull Request](#create-a-pull-request)
- **Styleguide**
	- [JavaScript Styleguide, Linting](#javascript-styleguide-linting)
	- [Documentation Styleguide (JSDoc)](#documentation-styleguide-jsdoc)
	- [Git "Conventional Commit" Messages](#git-conventional-commit-messages)

### Resources

Before you start contributing, have a look at these existing resources to get a feel for the project.

| Resource | URL |
|:--|:--|
| API Documentation | [https://julie-ng.github.io/newtonjs-graph/](https://julie-ng.github.io/newtonjs-graph/) |
| Report Bugs | [https://github.com/julie-ng/newtonjs-graph/issues](https://github.com/julie-ng/newtonjs-graph/issues) |
| Feature Requests | [https://github.com/julie-ng/newtonjs-graph/issues](https://github.com/julie-ng/newtonjs-graph/issues) |

## Bugs and Suggestions

The easiest way to contribute is to provide feedback.

* **Report Bugs**
	If you find issues, please open a GitHub issue:
[https://github.com/julie-ng/newtonjs-graph/issues &rarr;](https://github.com/julie-ng/newtonjs-graph/issues)

* **Feature Requests**
	Feel free to make suggestions by opening a GitHub issue:
	[https://github.com/julie-ng/newtonjs-graph/issues &rarr;](https://github.com/julie-ng/newtonjs-graph/issues)

* **Ask a Question**
	Also in GitHub 😊
	[https://github.com/julie-ng/newtonjs-graph/issues &rarr;](https://github.com/julie-ng/newtonjs-graph/issues)

## Code Contributions

Code contributions are made via pull request, a standard open source process. Because the project has an existing strong test suite and continuous integration, there already a pre-defined high standard. Therefore **please read through all the sections below carefully for highest success of your request being accepted.**

### Create a Fork

To get started, fork this repository. Please make your changes in your fork in **a feature branch**, ideally beginning with `feat/*`

To setup the project, all you need to do is run

```
npm install
npm run demo:dev
```

For more commands and how to setup the project on your local machine, see the [README.md](./README.md)

#### Use Feature Branches - plural

Large Pull Requests can be a challenge to merge. Consider separating changes are you would into smaller bits like features and create separate pull requests for each.

### Code Quality and CI 👌

Ensure you have tests and pass code qaulity checks. As of November 2019, the CI pipeline checks the following:

- [ ] Linting (ESLint)
- [ ] Tests (Jest)
- [ ] Build Library
- [ ] Demo Demo

To see if your code would pass all these checks in the CI build, just run:

```
npm run preflight
```

If it passes on your local machine, it _should_ be green in the build.

### Tests

Please write tests for your code. As of November 2019, the project has 88% code coverage.

### Create a Pull Request

When you are ready and checked you have met all code requirements described above, you can open a pull request.

⚠️ Only Pull Requests with passing builds can be accepted for merging

## Styleguides

- #### JavaScript Styleguide, Linting
	Please be aware the Linting rules are very opinionated (esp. regarding semicolons).

	Do not change the `.eslintrc` file. Your pull request will be rejected. If you want to change the rules, please open a GitHub issue and we'll discuss it.

- #### Documentation Styleguide (JSDoc)
	This library uses [JSDoc](https://jsdoc.app/) for auto generated API documentation. Please document any code changes you make using JSDoc so we can continue to auto-generate the [API docs](https://julie-ng.github.io/newtonjs-graph/) so people can use this project.

	If you do not include JSDoc syntax, your pull request may be rejected.

- #### Git "Conventional Commit" Messages
	Please write commit messages per the [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/), using prefixes like `docs:`, `feat:` or `fix:` in your git commit messages to help autogenerate the [CHANGELOG.md](./CHANGELOG.md)