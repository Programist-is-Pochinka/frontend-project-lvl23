import process from 'process';
import * as path from 'path';
import parse from '../parsers.js';
import plainFunc from './plain.js';
import jsonFunc from './json.js';
import { formatFunc, stylishFunc } from './stylish.js';

const chooseFormat = (obj, format) => {
  if (format === 'plain') {
    return plainFunc(obj);
  }
  if (format === 'json') {
    return jsonFunc(obj);
  }

  return formatFunc(obj);
};

export default (path1, path2, format = 'stylish') => {
  const firstPath = path.resolve(process.cwd(), path1);
  const secondPath = path.resolve(process.cwd(), path2);

  const format1 = path.extname(firstPath);
  const format2 = path.extname(secondPath);

  const obj1 = parse(format1, firstPath);
  const obj2 = parse(format2, secondPath);
  const finalObj = stylishFunc(obj1, obj2);

  return chooseFormat(finalObj, format);
};
