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
      return [{
        status: 'removed',
        key,
        value: file1[key],
      }, {
        status: 'added',
        key,
        value: file2[key],
      }];
    }

    return {
      status: 'notChanged',
      key,
      value: file2[key],
    };
  });
};
const obj1 = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting6: {
      key: 'value',
      doge: {
        wow: '',
      },
    },
  },
  group1: {
    baz: 'bas',
    foo: 'bar',
    nest: {
      key: 'value',
    },
  },
  group2: {
    abc: 12345,
    deep: {
      id: 45,
    },
  },
};
const obj2 = {
  common: {
    follow: false,
    setting1: 'Value 1',
    setting3: null,
    setting4: 'blah blah',
    setting5: {
      key5: 'value5',
    },
    setting6: {
      key: 'value',
      ops: 'vops',
      doge: {
        wow: 'so much',
      },
    },
  },
  group1: {
    foo: 'bar',
    baz: 'bars',
    nest: 'str',
  },
  group3: {
    deep: {
      id: {
        number: 45,
      },
    },
    fee: 100500,
  },
};

console.log(createTree(obj1, obj2)[0].children);

export default createTree;
