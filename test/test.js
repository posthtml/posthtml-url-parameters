const test = require('ava')
const plugin = require('../lib')
const posthtml = require('posthtml')

const {join} = require('path')
const {readFileSync} = require('fs')

const fixture = file => readFileSync(join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(join(__dirname, 'expected', `${file}.html`), 'utf8')

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (t, name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => t.is(html, expected(name).trim()))
}

test('Basic', t => {
  return process(t, 'basic', {
    parameters: {foo: 'bar', baz: 'qux'}
  })
})

test('Skip if config or parameters missing', t => {
  return process(t, 'no-config')
})

test('Skip if invalid URL', t => {
  return process(t, 'invalid-url', {
    parameters: {foo: 'bar'}
  })
})

test('Does not skip variable URL', t => {
  return process(t, 'variable-url')
})

test('Does not encode parameters if `encode` option is false', t => {
  return process(t, 'no-encode', {
    qs: {encode: false},
    parameters: {foo: '@Bar@'}
  })
})

test('Does not sort parameters if `sort` option is false', t => {
  return process(t, 'no-sort', {
    qs: {sort: false},
    parameters: {foo: 'bar', baz: 'qux'}
  })
})

test('Appends new parameters to existing parameters', t => {
  return process(t, 'appends-existing', {
    parameters: {foo: 'bar', baz: 'qux'}
  })
})

test('Processes only tags provided in the `tags` option', t => {
  return process(t, 'tags', {
    tags: ['a', 'link'],
    parameters: {foo: 'bar'}
  })
})
