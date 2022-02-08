import _ from 'lodash';

const createTree = (file1, file2) => {
  const obj = Object.keys({
    ...file1,
    ...file2,
  });
  const sorted = _.sortBy(obj);
  return sorted.flatMap((key) => {
    if (Object.keys(file1).includes(key) === false) {
      return {
        status: 'added',
        key,
        value: file2[key],
      };
    }
    if (Object.keys(file2).includes(key) === false) {
      return {
        status: 'removed',
        key,
        value: file1[key],
      };
    }
    if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
      const children = createTree(file1[key], file2[key]);
      return {
        status: 'parent',
        key,
        children,
      };
    }
    if (file1[key] !== file2[key]) {
      return {
        status: 'changed',
        key,
        valueBefore: file1[key],
        valueAfter: file2[key],
      };
    }

    return {
      status: 'notChanged',
      key,
      value: file2[key],
    };
  });
};

export default createTree;
