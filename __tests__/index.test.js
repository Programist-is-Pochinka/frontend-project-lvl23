import { fileURLToPath } from 'url';
import * as path from 'path';
import fs from 'fs';
import gendiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const fileNames = ['file1.json', 'file2.json', 'file1.yml', 'file2.yml'];
const resultFileNames = ['result_stylish.txt', 'result_plain.txt'];

test('stylish format test', () => {
  const file1 = readFile(fileNames[0]);
  const file2 = readFile(fileNames[3]);
  const result = readFile(resultFileNames[0]);
  expect(gendiff(file1, file2)).toStrictEqual(result);
  expect(gendiff(file1, file2, 'stylish')).toStrictEqual(result);
});

test('plain format test', () => {
  const file1 = getFixturePath(fileNames[2]);
  const file2 = getFixturePath(fileNames[1]);
  const result = readFile(resultFileNames[1]);
  expect(gendiff(file1, file2, 'plain')).toStrictEqual(result);
});

test('JSON format test', () => {
  const file1 = readFile(fileNames[2]);
  const file2 = readFile(fileNames[3]);
  const result = readFile(resultFileNames[1]);
  expect(gendiff(file1, file2, 'json')).toStrictEqual(result);
});
