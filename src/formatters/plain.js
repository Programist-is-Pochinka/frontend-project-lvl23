import _ from 'lodash';

const selectValue = (value) => {
  const newValue = _.isPlainObject(value) ? '[complex value]' : value;
  return newValue;
};

const createNewValue = (value) => {
  const newValue = typeof value === 'string' ? `'${value}'` : value;
  return newValue;
};

const changeValue = (prop, from, to) => {
  if (to === '[complex value]') {
    return `Property '${prop}' was updated. From ${createNewValue(from)} to [complex value]`;
  }
  if (from === '[complex value]') {
    return `Property '${prop}' was updated. From [complex value] to ${createNewValue(to)}`;
  }

  return `Property '${prop}' was updated. From ${createNewValue(from)} to ${createNewValue(to)}`;
};

const addValue = (prop, to) => {
  if (to === '[complex value]') {
    return `Property '${prop}' was added with value: [complex value]`;
  }
  return `Property '${prop}' was added with value: ${createNewValue(to)}`;
};

const removeValue = (prop) => `Property '${prop}' was removed`;

const formatPlain = (tree, isChild = false, parent = '') => tree
  .filter((item) => item.status !== 'notChanged')
  .flatMap((item) => {
    const key = isChild ? `${parent}.${item.key}` : item.key;
    if (item.status === 'parent') {
      return formatPlain(item.children, true, key);
    }
    if (item.status === 'removed') {
      return removeValue(key);
    }
    if (item.status === 'added') {
      return addValue(key, selectValue(item.value));
    }
    return changeValue(key, selectValue(item.valueBefore), selectValue(item.valueAfter));
  });

const outputPlain = (arr) => arr.join('\n');

export default (tree) => {
  const formatted = formatPlain(tree);
  return outputPlain(formatted);
};
