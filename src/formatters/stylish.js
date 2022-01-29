import _ from 'lodash';

const finalSort = (obj) => {
  const newObj = {};

  Object.keys(obj)
    .sort((a, b) => {
      if (a.slice(2) < b.slice(2)) {
        return -1;
      }
      if (a.slice(2) > b.slice(2)) {
        return 1;
      }
      return 0;
    })
    .forEach((key) => {
      newObj[key] = _.isPlainObject(obj[key]) ? finalSort(obj[key]) : obj[key];
    });
  return newObj;
};

const keyFormat = (node, isInclude = null) => {
  if (_.isPlainObject(node)) {
    return Object.keys(node).reduce((accum, key) => {
      const result = _.cloneDeep(accum);
      if (isInclude) {
        result[`  ${key}`] = _.isPlainObject(node[key]) ? keyFormat(node[key]) : node[key];
        return result;
      }
      if (isInclude === false) {
        result[`  ${key}`] = _.isPlainObject(node[key]) ? keyFormat(node[key]) : node[key];
        return result;
      }
      result[`  ${key}`] = _.isPlainObject(node[key]) ? keyFormat(node[key]) : node[key];
      return result;
    }, {});
  }
  return node;
};

const conditionFormat = (file1, file2) => {
  const result = {};

  Object.keys(file1).forEach((key1) => {
    Object.keys(file2).forEach((key2) => {
      if (Object.keys(file2).includes(key1) === false) {
        result[`- ${key1}`] = keyFormat(file1[key1], true);
      } else if (Object.keys(file1).includes(key2) === false) {
        result[`+ ${key2}`] = keyFormat(file2[key2], false);
      } else if (_._.isPlainObject(file1[key1]) && _._.isPlainObject(file2[key2])) {
        if (key1 === key2) {
          result[`  ${key1}`] = conditionFormat(file1[key1], file2[key2]);
        }
      } else if (key1 === key2 && file1[key1] !== file2[key2]) {
        result[`- ${key1}`] = keyFormat(file1[key1], true);
        result[`+ ${key1}`] = keyFormat(file2[key1], false);
      } else if (_._.isPlainObject(file1[key1]) || _._.isPlainObject(file2[key2])) {
        return 0;
      } else if (file1[key1] === file2[key2] && key1 === key2) {
        result[`  ${key1}`] = keyFormat(file1[key1]);
      } else if (file1[key1] === file2[key1]) {
        result[`  ${key1}`] = keyFormat(file1[key1]);
      } else if (file1[key2] === file2[key2]) {
        result[`  ${key2}`] = keyFormat(file1[key2]);
      } else if (file1[key1] !== file2[key1]) {
        result[`- ${key1}`] = keyFormat(file1[key1], true);
        result[`+ ${key1}`] = keyFormat(file2[key1], false);
      } else if (file1[key2] !== file2[key2]) {
        result[`- ${key1}`] = keyFormat(file1[key1], true);
        result[`+ ${key1}`] = keyFormat(file2[key1], false);
      } else if (file1[key1] !== file2[key2]) {
        result[`- ${key1}`] = keyFormat(file1[key1], true);
        result[`+ ${key1}`] = keyFormat(file2[key1], false);
      }

      return undefined;
    });
  });

  return result;
};

export const formatFunc = (value, replacer = ' ', spacesCount = 2) => {
  const iter = (currentValue, depth) => {
    if (_.isNull(currentValue)) {
      return currentValue;
    }
    if (_.isPlainObject(currentValue) === false) {
      return currentValue.toString();
    }

    const deepIndentSize = depth + spacesCount;
    const deepIndent = replacer.repeat(deepIndentSize);
    const currentIndent = replacer.repeat(depth);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${deepIndent}${key}: ${iter(val, deepIndentSize)}`);

    return [
      '{',
      ...lines,
      `${currentIndent}}`,
    ].join('\n');
  };

  return iter(value, 0);
};

export const stylishFunc = (obj1, obj2) => finalSort(conditionFormat(obj1, obj2));
