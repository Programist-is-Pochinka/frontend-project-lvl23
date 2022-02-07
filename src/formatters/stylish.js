import _ from 'lodash';
import createTree from '../createTree.js';

const chooseKey = (value, status = 'notChanged') => {
  if (status === 'parent' || status === 'notChanged') {
    return `  ${value}`;
  }
  if (status === 'added') {
    return `+ ${value}`;
  }
  if (status === 'removed') {
    return `- ${value}`;
  }
  return undefined;
};

export const formatFunc = (value, replacer = ' ', spacesCount = 2) => {
  const iter = (currentValue, depth) => {
    console.log(currentValue);
    if (_.isNull(currentValue[1])) {
      return currentValue[1];
    }
    if (Array.isArray(currentValue[1]) === false) {
      return currentValue[1].toString();
    }

    const deepIndentSize = depth + spacesCount;
    const deepIndent = replacer.repeat(deepIndentSize);
    const currentIndent = replacer.repeat(depth);
    const lines = currentValue[1].map(([key, val]) => `${deepIndent}${key}: ${iter([key, val], deepIndentSize + 2)}`);

    return [
      '{',
      ...lines,
      `${currentIndent}}`,
    ].join('\n');
  };
  return iter(value, 0);
};

const deepEntries = (node) => {
  if (_.isPlainObject(node) === false) {
    return node;
  }
  return Object.entries(node).map(([key, value]) => {
    const newKey = chooseKey(key);
    if (_.isPlainObject(value)) {
      return [newKey, deepEntries(value)];
    }
    return [newKey, value];
  });
};

const format = (tree) => {
  const newTree = tree.map((item) => {
    const { key } = item;
    const newKey = chooseKey(key, item.status);
    if (item.status === 'parent') {
      return [newKey, format(item.children)];
    }
    if (_.isPlainObject(item.value)) {
      return [newKey, deepEntries(item.value)];
    }
    const { value } = item;
    return [newKey, value];
  });
  return newTree;
};

const stylishFunc = (obj1, obj2) => {
  const tree = createTree(obj1, obj2);
  const formatted = ['', format(tree)];
  return formatFunc(formatted);
};

export default stylishFunc;
