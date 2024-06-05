import {test, expect} from 'vitest'
import plugin from '../lib/index.js'
import posthtml from 'posthtml'

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (html, options, log = false) => {
  return posthtml([plugin(options)])
    .process(html)
    .then(result => log ? console.log(result.html) : clean(result.html))
}

test('Skip if config or parameters missing', async () => {
  const html = await process('<a href="https://example.com">Test</a>')

  expect(html).toEqual('<a href="https://example.com">Test</a>')
})

test('Skip if invalid URL (`strict` enabled)', async () => {
  const html = await process('<a href="undefined">Test</a>', {
    parameters: {foo: 'bar'}
  })

  expect(html).toEqual('<a href="undefined">Test</a>')
})

test('Apply to invalid URL (`strict` disabled)', async () => {
  const html = await process('<a href="undefined">Test</a>', {
    parameters: {foo: 'bar'},
    strict: false
  })

  expect(html).toEqual('<a href="undefined?foo=bar">Test</a>')
})

test('Adds parameters to a[href] attribute value', async () => {
  const html = await process('<a href="https://example.com">Test</a>', {
    parameters: {foo: 'bar', baz: 'qux'}
  })

  expect(html).toEqual('<a href="https://example.com?baz=qux&foo=bar">Test</a>')
})

test('URL with special characters', async () => {
  const html = await process('<a href="https://example.com/{{ var }}?foo=bar">Test</a>', {
    parameters: {bar: 'baz'},
    strict: false
  })

  expect(html).toEqual('<a href="https://example.com/{{ var }}?bar=baz&foo=bar">Test</a>')
})

test('Does not encode parameters if `encode` option is false', async () => {
  const html = await process('<a href="https://example.com">Test</a>', {
    qs: {encode: false},
    parameters: {foo: '@Bar@'}
  })

  expect(html).toEqual('<a href="https://example.com?foo=@Bar@">Test</a>')
})

test('Does not sort parameters if `sort` option is false', async () => {
  const html = await process('<a href="https://example.com">Test</a>', {
    qs: {sort: false},
    parameters: {foo: 'bar', baz: 'qux'}
  })

  expect(html).toEqual('<a href="https://example.com?foo=bar&baz=qux">Test</a>')
})

test('Appends new parameters to existing parameters', async () => {
  const html = await process('<a href="https://example.com?s=test">Test</a>', {
    parameters: {foo: 'bar', baz: 'qux'}
  })

  expect(html).toEqual('<a href="https://example.com?baz=qux&foo=bar&s=test">Test</a>')
})

test('Processes only tags provided in the `tags` option', async () => {
  const html = await process(
    `<a href="https://example.com">Test</a>
    <a href="https://skip.me">Skip</a>
    <link rel="stylesheet" href="https://example.com/style.css">
    <module href="https://example.com/header.html">`,
    {
      tags: ['a[href*="example.com"]', 'link'],
      parameters: {foo: 'bar'}
    }
  )

  expect(html).toEqual(`<a href="https://example.com?foo=bar">Test</a>
    <a href="https://skip.me">Skip</a>
    <link rel="stylesheet" href="https://example.com/style.css?foo=bar">
    <module href="https://example.com/header.html"></module>`)
})

test('Adds parameters to known attribute values', async () => {
  const html = await process(`
    <img src="https://example.com/image.jpg">
    <video poster="https://example.com/poster.jpg"></video>
    <table><td background="https://example.com/image.jpg"></td></table>
  `, {
    parameters: {foo: 'bar', baz: 'qux'},
    tags: ['img[src]', 'video[poster]', 'td[background]']
  })

  expect(html).toEqual(`<img src="https://example.com/image.jpg?baz=qux&foo=bar">
    <video poster="https://example.com/poster.jpg?baz=qux&foo=bar"></video>
    <table><td background="https://example.com/image.jpg?baz=qux&foo=bar"></td></table>`)
})

test('Adds parameters to specified attribute values only', async () => {
  const html = await process(`
    <a href="foo.html" data-href="https://example.com">Test</a>
    <img src="image.jpg">
  `, {
    parameters: {foo: 'bar'},
    tags: ['a', 'img'],
    attributes: ['data-href']
  })

  expect(html).toEqual(`<a href="foo.html" data-href="https://example.com?foo=bar">Test</a>
    <img src="image.jpg">`)
})

test('Skip if node has no attributes', async () => {
  const html = await process('<a>Test</a>', {
    parameters: {foo: 'bar'},
    tags: ['a']
  })

  expect(html).toEqual('<a>Test</a>')
})
