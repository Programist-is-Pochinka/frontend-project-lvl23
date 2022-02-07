import yaml from 'js-yaml';
import * as fs from 'fs';

export default (format, filePath) => {
  if (format === '.json') {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  if (format === '.yaml' || format === '.yml') {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  }

  return undefined;
};
