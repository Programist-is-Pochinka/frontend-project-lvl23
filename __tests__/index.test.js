import gendiff from '../index.js';

test('JSON-flat', () => {
  const expectedValue = {
    '- follow': false,
    '  host': 'hexlet.io',
    '- proxy': '123.234.53.22',
    '- timeout': 50,
    '+ timeout': 20,
    '+ verbose': true,
  };
  expect(gendiff('__fixtures__/file1.json', '__fixtures__/file2.json')).toStrictEqual(expectedValue);
});

test('YAML-flat', () => {
  const expectedValue = {
    '- follow': false,
    '  host': 'hexlet.io',
    '- proxy': '123.234.53.22',
    '- timeout': 50,
    '+ timeout': 20,
    '+ verbose': true,
  };
  expect(gendiff('__fixtures__/file1.yaml', '__fixtures__/file2.yaml')).toStrictEqual(expectedValue);
});
