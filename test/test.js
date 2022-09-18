const test = require('ava')
const plugin = require('../lib')
const posthtml = require('posthtml')

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (html, options, log = false) => {
  return posthtml([plugin(options)])
    .process(html)
    .then(result => log ? console.log(result.html) : clean(result.html))
}

test('Skip if config or parameters missing', async t => {
  const html = await process('<a href="https://example.com">Test</a>')

  t.is(html, '<a href="https://example.com">Test</a>')
})

test('Skip if invalid URL (`strict` enabled)', async t => {
  const html = await process('<a href="undefined">Test</a>', {
    parameters: {foo: 'bar'}
  })

  t.is(html, '<a href="undefined">Test</a>')
})

test('Apply to invalid URL (`strict` disabled)', async t => {
  const html = await process('<a href="undefined">Test</a>', {
    parameters: {foo: 'bar'},
    strict: false
  })

  t.is(html, '<a href="undefined?foo=bar">Test</a>')
})

test('Adds parameters to a[href] attribute value', async t => {
  const html = await process('<a href="https://example.com">Test</a>', {
    parameters: {foo: 'bar', baz: 'qux'}
  })

  t.is(html, '<a href="https://example.com?baz=qux&foo=bar">Test</a>')
})

test('URL with special characters', async t => {
  const html = await process('<a href="https://example.com/{{ var }}?foo=bar">Test</a>', {
    parameters: {bar: 'baz'},
    strict: false
  })

  t.is(html, '<a href="https://example.com/{{ var }}?bar=baz&foo=bar">Test</a>')
})

test('Does not encode parameters if `encode` option is false', async t => {
  const html = await process('<a href="https://example.com">Test</a>', {
    qs: {encode: false},
    parameters: {foo: '@Bar@'}
  })

  t.is(html, '<a href="https://example.com?foo=@Bar@">Test</a>')
})

test('Does not sort parameters if `sort` option is false', async t => {
  const html = await process('<a href="https://example.com">Test</a>', {
    qs: {sort: false},
    parameters: {foo: 'bar', baz: 'qux'}
  })

  t.is(html, '<a href="https://example.com?foo=bar&baz=qux">Test</a>')
})

test('Appends new parameters to existing parameters', async t => {
  const html = await process('<a href="https://example.com?s=test">Test</a>', {
    parameters: {foo: 'bar', baz: 'qux'}
  })

  t.is(html, '<a href="https://example.com?baz=qux&foo=bar&s=test">Test</a>')
})

test('Processes only tags provided in the `tags` option', async t => {
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

  t.is(html, `<a href="https://example.com?foo=bar">Test</a>
    <a href="https://skip.me">Skip</a>
    <link rel="stylesheet" href="https://example.com/style.css?foo=bar">
    <module href="https://example.com/header.html"></module>`)
})
