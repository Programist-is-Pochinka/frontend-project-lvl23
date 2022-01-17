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

const formatObject = (file1, file2) => {
  const result = {};

  Object.keys(file1).forEach((key1) => {
    Object.keys(file2).forEach((key2) => {
      if (_.isPlainObject(file1[key1]) && _.isPlainObject(file2[key2])) {
        if (Object.keys(file1).includes(key2) && key1 === key2) {
          result[`  ${key1}`] = formatObject(file1[key1], file1[key2]);
        } else if (Object.keys(file2).includes(key1) && key1 === key2) {
          result[`  ${key1}`] = formatObject(file2[key1], file2[key2]);
        } else if (Object.keys(file1).includes(key2) === false) {
          result[`-  ${key1}`] = file1[key1];
        } else if (Object.keys(file2).includes(key1) === false) {
          result[`+  ${key2}`] = file2[key2];
        }
      } else if (file1[key1] === file2[key1]) {
        result[`  ${key1}`] = file1[key1];
      } else if (Object.prototype.hasOwnProperty.call(file2, key1) === false) {
        result[`- ${key1}`] = file1[key1];
      } else if (Object.prototype.hasOwnProperty.call(file1, key2) === false) {
        result[`+ ${key2}`] = file2[key2];
      } else if (file1[key1] !== file2[key1]) {
        result[`- ${key1}`] = file1[key1];
        result[`+ ${key1}`] = file2[key1];
      } else if (file1[key1] === file2[key2]) {
        result[`  ${key1}`] = file1[key1];
      }
    });
  });

  return result;
};

export default (path1, path2) => {
  const firstPath = path.resolve(process.cwd(), path1);
  const secondPath = path.resolve(process.cwd(), path2);

  const format1 = path.extname(firstPath);
  const format2 = path.extname(secondPath);

  const obj1 = parse(format1, firstPath);
  const obj2 = parse(format2, secondPath);

  return finalSort(formatObject(obj1, obj2));
};
