<div align="center">
  <img width="150" height="150" title="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>URL Parameters</h1>
  <p>Add parameters to URLs</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## About

This is a PostHTML plugin that allows you to add query string parameters to URLs.

## Install

```
npm i posthtml posthtml-url-parameters
```

## Usage

```js
import posthtml from 'posthtml'
import urlParams from 'posthtml-url-parameters'

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
import posthtml from 'posthtml'
import urlParams from 'posthtml-url-parameters'

posthtml([
  urlParams({
    parameters: {
      utm_source: 'Campaign',
      '1stDraft': true
    }
  })
])
  .process('<a href="https://example.com">Test</a>')
  .then(result => console.log(result.html))
```

### `tags`

Default: `[a]`

Array of tag names to process. 

By default, only URLs inside [known attributes](#attributes) of tags in this array will be processed.

Example:

```js
import posthtml from 'posthtml'
import urlParams from 'posthtml-url-parameters'

posthtml([
  urlParams({
    tags: ['a', 'img']
  })
])
  .process(`
    <a href="https://example.com">Test</a>
    <img src="https://example.com/image.jpg">
  `)
  .then(result => console.log(result.html))
```

You may use some CSS selectors when specifying tags:

```js
posthtml([
  urlParams({
    tags: ['a.button', 'a[href*="example.com"]' 'link'],
  })
])
  .process(/*...*/)
```

All [`posthtml-match-helper` selectors](https://github.com/posthtml/posthtml-match-helper) are supported.

### attributes

Type: `Array`\
Default: `['src', 'href', 'poster', 'srcset', 'background']`

Array of attributes to process for the given tags.

You may override this with your own list of attributes - the plugin will only process URLs in _these_ attributes.

```js
posthtml([
  urlParams({
    parameters: {foo: 'bar'},
    attributes: ['data-href']
  })
])
  .process('<a href="foo.html" data-href="https://example.com">Test</a>')
  .then(result => console.log(result.html)))

// <a href="foo.html" data-href="https://example.com?foo=bar">Test</a>
```

### `strict`

Default: `false`

By default, the plugin will append query parameters only to valid URLs.

You may disable `strict` mode to append parameters to any string:

```js
import posthtml from 'posthtml'
import urlParams from 'posthtml-url-parameters'

posthtml([
  urlParams({
    parameters: { foo: 'bar' },
    strict: false,
  })
])
  .process('<a href="https://example.com/campaigns/{{ id }}">Details</a>')
  .then(result => console.log(result.html)))

// <a href="https://example.com/campaigns/{{ id }}?foo=bar">Details</a>
```

### `qs`

Default: `undefined`

Options to pass to `query-string` - see available options [here](https://github.com/sindresorhus/query-string#stringifyobject-options).

For example, you may disable encoding:

```js
import posthtml from 'posthtml'
import urlParams from 'posthtml-url-parameters'

posthtml([
  urlParams({
    parameters: { foo: '@Bar@' },
    qs: {
      encode: false
    }
  })
])
  .process('<a href="https://example.com">Test</a>')
  .then(result => console.log(result.html)))

// <a href="https://example.com?foo=@Bar@">Test</a>
```

[npm]: https://www.npmjs.com/package/posthtml-url-parameters
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-url-parameters.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-url-parameters
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-url-parameters.svg
[github-ci]: https://github.com/posthtml/posthtml-url-parameters/actions
[github-ci-shield]: https://github.com/posthtml/posthtml-url-parameters/actions/workflows/nodejs.yml/badge.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-url-parameters.svg
