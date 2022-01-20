import process from 'process';
import * as path from 'path';
import _ from 'lodash';
import parse from './parsers.js';

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
      newObj[key] = obj[key];
    });
  return newObj;
};

const keyFormat = (node, isInclude = null) => {
  if (_.isPlainObject(node)) {
    return Object.keys(node).reduce((accum, key) => {
      if (isInclude) {
        accum[`  ${key}`] = _.isPlainObject(node[key]) ? keyFormat(node[key]) : node[key];
        return accum;
      }
      if (isInclude === false) {
        accum[`  ${key}`] = _.isPlainObject(node[key]) ? keyFormat(node[key]) : node[key];
        return accum;
      }
      accum[`  ${key}`] = _.isPlainObject(node[key]) ? keyFormat(node[key]) : node[key];
      return accum;
    }, {})
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
      } else if (_.isPlainObject(file1[key1]) && _.isPlainObject(file2[key2])) {
        if (key1 === key2) {
          result[`  ${key1}`] = conditionFormat(file1[key1], file2[key2]);
        }
      } else if (key1 === key2 && file1[key1] !== file2[key2]) {
        result[`- ${key1}`] = keyFormat(file1[key1], true);
        result[`+ ${key1}`] = keyFormat(file2[key1], false);
      } else if (_.isPlainObject(file1[key1]) || _.isPlainObject(file2[key2])) {
        return 0;
      } else if (file1[key1] === file2[key2]) {
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

const format = (value, replacer = ' ', spacesCount = 2) => {
  const formatStr = (value, count) => {
    let str = '{';

    Object.entries(value).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        count += spacesCount;
        value = formatStr(value, count);
        count -= spacesCount;
      }

      str += `\n${replacer.repeat(count)}${key}: ${value}`;
    })
    count -= spacesCount - 2;
    str += `\n${replacer.repeat(count)}}`;
    return str;
  };

  return formatStr(value, spacesCount);
};

export default (path1, path2) => {
  const firstPath = path.resolve(process.cwd(), path1);
  const secondPath = path.resolve(process.cwd(), path2);

  const format1 = path.extname(firstPath);
  const format2 = path.extname(secondPath);

  const obj1 = parse(format1, firstPath);
  const obj2 = parse(format2, secondPath);

  return format(finalSort(conditionFormat(obj1, obj2)));
};
