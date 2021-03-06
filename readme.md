<div align="center">
  <img width="150" height="150" title="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>URL Parameters</h1>
  <p>Add parameters to URLs</p>

  [![Version][npm-version-shield]][npm]
  [![License][license-shield]][license]
  [![Build][github-ci-shield]][github-ci]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## About

This is a PostHTML plugin that allows you to add parameters to URLs.

## Install

```
$ npm i posthtml posthtml-url-parameters
```

## Usage

```js
const posthtml = require('posthtml')
const urlParams = require('posthtml-url-parameters')

posthtml([
    urlParams({
      parameters: { foo: 'bar', baz: 'qux' }
    })
  ])
  .process('<a href="https://example.com">Test</div>')
  .then(result => console.log(result.html)))

  // <a href="https://example.com?baz=qux&foo=bar">Test</div>
```

## Configuration

### `parameters`

Default: `undefined`

Object containing parameter name (key) and its value.

Example:

```js
require('posthtml-url-parameters')({
  parameters: {
    utm_source: 'Campaign',
    '1stDraft': true
  }
})
```

### `tags`

Default: `[a]`

Array of tag names to process. Only URLs inside `href=""` attributes of tags in this array will be processed.

Example:

```js
require('posthtml-url-parameters')({
  tags: ['a', 'link'],
  // ...
})
```

### `qs`

Default: `undefined`

Options to pass to `query-string` - see available options [here](https://github.com/sindresorhus/query-string#stringifyobject-options).

For example, you can disable encoding:

```js
const posthtml = require('posthtml')
const urlParams = require('posthtml-url-parameters')

posthtml([
    urlParams({
      parameters: { foo: '@Bar@' },
      qs: {
        encode: false
      }
    })
  ])
  .process('<a href="https://example.com">Test</div>')
  .then(result => console.log(result.html)))

  // <a href="https://example.com?foo=@Bar@">Test</div>
```

[npm]: https://www.npmjs.com/package/posthtml-url-parameters
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-url-parameters.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-url-parameters
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-url-parameters.svg
[github-ci]: https://github.com/posthtml/posthtml-url-parameters/actions
[github-ci-shield]: https://img.shields.io/github/workflow/status/posthtml/posthtml-url-parameters/Node.js%20CI
[license]: ./license
[license-shield]: https://img.shields.io/npm/l/posthtml-url-parameters.svg
