import _ from 'lodash';

const selectValue = (value) => {
  const newValue = _.isPlainObject(value) ? '[complex value]' : value;
  return newValue;
};

const updateString = (prop, from, to) => {
  if (to === '[complex value]') {
    return `Property '${prop}' was updated. From '${from}' to [complex value]`;
  }
  if (from === '[complex value]') {
    return `Property '${prop}' was updated. From [complex value] to '${to}'`;
  }

  return `Property '${prop}' was updated. From '${from}' to '${to}'`;
};

const addString = (prop, to) => {
  if (to === '[complex value]') {
    return `Property '${prop}' was added with value: [complex value]`;
  }
  return `Property '${prop}' was added with value: '${to}'`;
};

const removeString = (prop) => `Property '${prop}' was removed`;

const result = [];

const formatPlain = (node, prop = '', isRecursion = false) => {
  const parent = prop;
  Object.keys(node).forEach((key) => {
    const dublicateKeys = Object
      .keys(node)
      .filter((item) => {
        if (key !== item) {
          return key.substring(2) === item.substring(2);
        }

        return false;
      });
    const selectedValue = selectValue(node[dublicateKeys[0]]);
    if (isRecursion) {
      const newParent = parent.concat('.', key.substring(2));
      if (dublicateKeys.length === 1) {
        if (_.isPlainObject(node[key])) {
          result.push(updateString(newParent, '[complex value]', selectedValue));
        } else {
          result.push(updateString(newParent, node[key], selectedValue));
        }
        return;
      } if (key[0] === '-') {
        result.push(removeString(newParent));
        return;
      } if (key[0] === '+') {
        result.push(addString(newParent, selectValue(node[key])));
        return;
      }

      if (_.isPlainObject(node[key])) {
        result.concat(formatPlain(node[key], newParent, true));
      }
    } else {
      const newParent = key.substring(2);
      if (dublicateKeys.length === 1) {
        if (_.isPlainObject(node[key])) {
          result.push(updateString(newParent, '[complex value]', selectedValue));
        } else {
          result.push(updateString(newParent, node[key], selectedValue));
        }
        return;
      } if (key[0] === '-') {
        result.push(removeString(newParent));
        return;
      } if (key[0] === '+') {
        result.push(addString(newParent, selectValue(node[key])));
        return;
      }

      if (_.isPlainObject(node[key])) {
        result.concat(formatPlain(node[key], prop.concat('', key.substring(2)), true));
      }
    }
  });

  return result;
};

const filterPlain = (arr) => {
  const newArr = [...arr];
  return newArr.filter((item, index, array) => {
    if (index > 0) {
      return item.split('').sort().join() !== array[index - 1].split('').sort().join();
    }
    return item.split('').sort().join() !== array[index + 1].split('').sort().join();
  });
};

const outputPlain = (arr) => arr.join('\n');

export default (obj) => {
  const formatted = formatPlain(obj);
  const filtered = filterPlain(formatted);
  return outputPlain(filtered);
};
