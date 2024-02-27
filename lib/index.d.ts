import type {StringifyOptions} from 'query-string';

export type URLParametersConfig = {
  /**
  Object containing parameter name (key) and its value.

  @default undefined

  @example
  ```
  import posthtml from 'posthtml'
  import urlParams from 'posthtml-url-parameters'

  posthtml([
    urlParams({
      parameters: {
        foo: 'bar'
      }
    })
  ])
    .process('<a href="https://example.com">Test</a>')
    .then(result => result.html)
  ```
  */
  parameters: Record<string, string>;

  /**
  Array of tag names to process.

  By default, only URLs inside known attributes of tags in this array will be processed.

  @default ['a']

  @example
  ```
  import posthtml from 'posthtml'
  import urlParams from 'posthtml-url-parameters'

  posthtml([
    urlParams({
      parameters: {
        foo: 'bar'
      },
      tags: ['a', 'img']
    })
  ])
    .process(`
      <a href="https://example.com">Test</a>
      <img src="https://example.com/image.jpg">
    `)
    .then(result => result.html)
  ```
  */
  tags?: string[];

  /**
  Array of attributes to process for the given tags.

  You may override this with your own list of attributes - the plugin will only process URLs in _these_ attributes.

  @default ['href', 'src', 'poster', 'srcset', 'background']

  @example
  ```
  import posthtml from 'posthtml'
  import urlParams from 'posthtml-url-parameters'

  posthtml([
    urlParams({
      parameters: {
        foo: 'bar'
      },
      attributes: ['data-href']
    })
  ])
    .process('<a href="foo.html" data-href="https://example.com">Test</a>')
    .then(result => result.html)
  ```
  */
  attributes?: string[];

  /**
  By default, query parameters are appended only to valid URLs.

  Disable strict mode to append parameters to any string.

  @default true

  @example
  ```
  import posthtml from 'posthtml'
  import urlParams from 'posthtml-url-parameters'

  posthtml([
    urlParams({
      parameters: {
        foo: 'bar'
      },
      strict: false
    })
  ])
    .process('<a href="example.html">Test</a>')
    .then(result => result.html)
  ```
  */
  strict?: boolean;

  /**
  Options to pass to the `query-string` library.

  @default undefined

  @example
  ```
  import posthtml from 'posthtml'
  import urlParams from 'posthtml-url-parameters'

  posthtml([
    urlParams({
      parameters: {
        foo: '@Bar@'
      },
      qs: {
        encode: false
      }
    })
  ])
    .process('<a href="https://example.com">Test</a>')
    .then(result => result.html)
  ```
  */
  qs?: StringifyOptions;
}
