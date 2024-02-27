import qs from 'query-string'
import isUrl from 'is-url-superb'
import matchHelper from 'posthtml-match-helper'

const plugin = (config = {}) => tree => {
  config.strict = typeof config.strict === 'boolean' ? config.strict : true

  const process = node => {
    if (!config || !config.parameters) {
      return node
    }

    const tags = Array.isArray(config.tags) ? config.tags : ['a']

    const knownAttributes = new Set(config.attributes || ['href', 'src', 'poster', 'srcset', 'background'])

    tree.match(matchHelper(tags.join(',')), node => {
      if (!node.attrs) {
        return node
      }

      const matchingAttribute = Object.keys(node.attrs).find(key => knownAttributes.has(key))

      if (!matchingAttribute) {
        return node
      }

      const url = node.attrs[matchingAttribute]
      const parsed = qs.parseUrl(url, config.qs)

      if (config.strict && !isUrl(parsed.url.trim())) {
        return node
      }

      Object.keys(config.parameters).forEach(item => {
        parsed.query[item] = config.parameters[item]
      })

      node.attrs[matchingAttribute] = qs.stringifyUrl(parsed, config.qs)

      return node
    })

    return node
  }

  return new Promise(resolve => {
    tree.walk(process)
    resolve(tree)
  })
}

export default plugin
