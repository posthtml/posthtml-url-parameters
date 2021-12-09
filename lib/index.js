import isUrl from 'is-url-superb'
import qs from 'query-string'

const plugin = config => tree => {
  const process = node => {
    if (!config || !config.parameters) {
      return node
    }

    const tags = config && config.tags ? config.tags : ['a']

    if (tags.includes(node.tag) && node.attrs && node.attrs.href) {
      const url = node.attrs.href
      const parsed = qs.parseUrl(url)

      if (isUrl(parsed.url.trim()) === false) {
        return node
      }

      Object.keys(config.parameters).forEach(item => {
        parsed.query[item] = config.parameters[item]
      })

      node.attrs.href = qs.stringifyUrl(parsed, config.qs)
    }

    return node
  }

  return new Promise(resolve => {
    tree.walk(process)
    resolve(tree)
  })
}

export default plugin
