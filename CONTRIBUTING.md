
# Contributing to Newton.js

Thank you for your interest in supporting this project! Before you get started, please read the guide described below. By contributing, you agree to the code of conduct, as described in [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

#### Table of Contents

- **[Bugs and Suggestions](#bugs-and-suggestions)**
- **[Code Contributions](#code-contributions)**
	- [Create a Fork](#create-a-fork)
	- [Use Feature Branches - plural](#use-feature-branches---plural)
- **[Code Quality and Tests](#code-quality-and-tests)**	
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

Because the project has an existing strong test suite and continuous integration, there already a pre-defined high standard. Therefore **please read through all the sections below carefully for highest success of your contribution being accepted.**

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

### Code Quality and Tests 👌

[![Maintainability](https://api.codeclimate.com/v1/badges/7a3975197c576202fe08/maintainability)](https://codeclimate.com/github/julie-ng/newtonjs-graph/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7a3975197c576202fe08/test_coverage)](https://codeclimate.com/github/julie-ng/newtonjs-graph/test_coverage)

Ensure you have tests and pass code qaulity checks. As of November 2019, the CI pipeline checks the following:

- Linting ([ESLint](https://eslint.org/))
- Tests ([Jest](https://jestjs.io/))
- Build Library
- Build Demo

To see if your code would pass all these checks in the CI build, just run:

```
npm run preflight
```

If it passes on your local machine, it _should_ be green in the CI build.

### Tests

Please write tests for your code. As of November 2019, the project has 88% code coverage.

## Styleguides

- #### JavaScript Styleguide, Linting
	Please be aware the Linting rules are very opinionated (esp. regarding semicolons).

	Do not change the `.eslintrc` file. Your pull request will be rejected. If you want to change the rules, please open a GitHub issue and we'll discuss it.

- #### Documentation Styleguide (JSDoc)
	This library uses [JSDoc](https://jsdoc.app/) for auto generated API documentation. Please document any code changes you make using JSDoc so we can continue to auto-generate the [API docs](https://julie-ng.github.io/newtonjs-graph/) so people can use this project.

	If you do not include JSDoc syntax, your pull request may be rejected.

- #### Git "Conventional Commit" Messages
	Please write commit messages per the [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/), using prefixes like `docs:`, `feat:` or `fix:` in your git commit messages to help autogenerate the [CHANGELOG.md](./CHANGELOG.md)

- #### Git "Conventional Commit" Messages  
	Please write commit messages per the [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/), using prefixes like `docs:`, `feat:` or `fix:` in your git commit messages to help autogenerate the [CHANGELOG.md](./CHANGELOG.md)

## Create a Pull Request

⚠️ Only Pull Requests with passing builds can be accepted for merging

When you are ready and checked you have met all code requirements described above, you can open a pull request.	When you do so, a CI build should be automatically started.

If you're having difficulty, please feel free to reach out for help by [opening an issue]((https://github.com/julie-ng/newtonjs-graph/issues)) or via Twitter [@jng5](https://twitter.com/jng5).
