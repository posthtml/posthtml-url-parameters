import qs from 'query-string';
import isUrl from 'is-url-superb';
import matchHelper from 'posthtml-match-helper';

const plugin = (config = {}) => (tree) => {
  config.strict = typeof config.strict === "boolean" ? config.strict : true;
  const process = (node) => {
    if (!config || !config.parameters) {
      return node;
    }
    const tags = Array.isArray(config.tags) ? config.tags : ["a"];
    const knownAttributes = new Set(config.attributes || ["href", "src", "poster", "srcset", "background"]);
    tree.match(matchHelper(tags.join(",")), (node2) => {
      if (!node2.attrs) {
        return node2;
      }
      const matchingAttribute = Object.keys(node2.attrs).find((key) => knownAttributes.has(key));
      if (!matchingAttribute) {
        return node2;
      }
      const url = node2.attrs[matchingAttribute];
      const parsed = qs.parseUrl(url, config.qs);
      if (config.strict && !isUrl(parsed.url.trim())) {
        return node2;
      }
      for (const item of Object.keys(config.parameters)) {
        parsed.query[item] = config.parameters[item];
      }
      node2.attrs[matchingAttribute] = qs.stringifyUrl(parsed, config.qs);
      return node2;
    });
    return node;
  };
  return new Promise((resolve) => {
    tree.walk(process);
    resolve(tree);
  });
};

export { plugin as default };
