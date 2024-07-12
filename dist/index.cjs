'use strict';

const qs = require('query-string');
const isUrl = require('is-url-superb');
const matchHelper = require('posthtml-match-helper');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const qs__default = /*#__PURE__*/_interopDefaultCompat(qs);
const isUrl__default = /*#__PURE__*/_interopDefaultCompat(isUrl);
const matchHelper__default = /*#__PURE__*/_interopDefaultCompat(matchHelper);

const plugin = (config = {}) => (tree) => {
  config.strict = typeof config.strict === "boolean" ? config.strict : true;
  const process = (node) => {
    if (!config || !config.parameters) {
      return node;
    }
    const tags = Array.isArray(config.tags) ? config.tags : ["a"];
    const knownAttributes = new Set(config.attributes || ["href", "src", "poster", "srcset", "background"]);
    tree.match(matchHelper__default(tags.join(",")), (node2) => {
      if (!node2.attrs) {
        return node2;
      }
      const matchingAttribute = Object.keys(node2.attrs).find((key) => knownAttributes.has(key));
      if (!matchingAttribute) {
        return node2;
      }
      const url = node2.attrs[matchingAttribute];
      const parsed = qs__default.parseUrl(url, config.qs);
      if (config.strict && !isUrl__default(parsed.url.trim())) {
        return node2;
      }
      for (const item of Object.keys(config.parameters)) {
        parsed.query[item] = config.parameters[item];
      }
      node2.attrs[matchingAttribute] = qs__default.stringifyUrl(parsed, config.qs);
      return node2;
    });
    return node;
  };
  return new Promise((resolve) => {
    tree.walk(process);
    resolve(tree);
  });
};

module.exports = plugin;
