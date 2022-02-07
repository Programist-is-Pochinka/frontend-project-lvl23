import process from 'process';
import * as path from 'path';
import parse from '../parsers.js';
import plainFunc from './plain.js';
import jsonFunc from './json.js';
import stylishFunc from './stylish.js';
import createTree from '../createTree.js';

export default (path1, path2, format = 'stylish') => {
  const firstPath = path.resolve(process.cwd(), path1);
  const secondPath = path.resolve(process.cwd(), path2);

  const format1 = path.extname(firstPath);
  const format2 = path.extname(secondPath);

  const obj1 = parse(format1, firstPath);
  const obj2 = parse(format2, secondPath);
  const tree = createTree(obj1, obj2);
  const stylish = stylishFunc(obj1, obj2);

  switch (format) {
    case 'plain':
      return plainFunc(tree);
    case 'json':
      return jsonFunc(stylish);
    default:
      return stylish;
  }
};
