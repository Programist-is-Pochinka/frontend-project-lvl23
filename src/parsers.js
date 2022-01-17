import yaml from 'js-yaml';
import * as fs from 'fs';

const sortObject = (obj) => {
  const newObj = {};

  Object.keys(obj).sort().forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj;
};

export default (format, filePath) => {
  if (format === '.json') {
    return sortObject(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  }
  if (format === '.yaml' || format === '.yml') {
    return sortObject(yaml.load(fs.readFileSync(filePath, 'utf8')));
  }

  return undefined;
};
