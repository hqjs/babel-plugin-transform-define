const replaceAndEvaluateNode = (replaceFn, nodePath, replacement) => {
  nodePath.replaceWith(replaceFn(replacement));

  if (nodePath.parentPath.isBinaryExpression()) {
    const result = nodePath.parentPath.evaluate();

    if (result.confident) {
      nodePath.parentPath.replaceWith(replaceFn(result.value));
    }
  }
};

const processNode = (replacements, nodePath, replaceFn, comparator) => {
  const replacementKey = Array.from(Object.keys(replacements))
    .find(value => comparator(nodePath, value));
  if (replacements[replacementKey]) {
    replaceAndEvaluateNode(replaceFn, nodePath, replacements[replacementKey]);
  }
};

const memberExpressionComparator = (nodePath, value) => nodePath.matchesPattern(value);
const identifierComparator = (nodePath, value) => nodePath.node.name === value;
const unaryExpressionComparator = (nodePath, value) => nodePath.node.argument.name === value;

const TYPEOF_LENGTH = 7;

module.exports = function({ types: t }) {
  return {
    visitor: {

      // const x = { version: VERSION };
      Identifier(nodePath, state) {
        processNode(state.opts, nodePath, t.valueToNode, identifierComparator);
      },

      // process.env.NODE_ENV;
      MemberExpression(nodePath, state) {
        processNode(state.opts, nodePath, t.valueToNode, memberExpressionComparator);
      },

      // typeof window
      UnaryExpression(nodePath, state) {
        if (nodePath.node.operator !== 'typeof') return;

        const typeofValues = Object.entries(state.opts)
          .filter(([ key ]) => key.substring(0, TYPEOF_LENGTH) === 'typeof ')
          .reduce((res, [ key, val ]) => {
            res[key.substring(TYPEOF_LENGTH)] = val;
            return res;
          }, {});

        processNode(typeofValues, nodePath, t.valueToNode, unaryExpressionComparator);
      },

    },
  };
};
