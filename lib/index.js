const qs = require('query-string')
const isUrl = require('is-url-superb')
const matchHelper = require('posthtml-match-helper')

module.exports = (config = {}) => tree => {
  config.strict = config.strict ?? true

  const process = node => {
    if (!config || !config.parameters) {
      return node
    }

    const tags = config && config.tags ? config.tags : ['a']

    tree.match(matchHelper(tags.join(',')), node => {
      const url = node.attrs.href
      const parsed = qs.parseUrl(url, config.qs)

      if (config.strict && !isUrl(parsed.url.trim())) {
        return node
      }

      Object.keys(config.parameters).forEach(item => {
        parsed.query[item] = config.parameters[item]
      })

      node.attrs.href = qs.stringifyUrl(parsed, config.qs)

      return node
    })

    return node
  }

  return new Promise(resolve => {
    tree.walk(process)
    resolve(tree)
  })
}
