export const notEmptyProps = (data) => {
  return Object.keys(data).reduce((result, key) => {
    if (data[key]) {
      result[key] = data[key];
    }
    return result;
  }, {});
};

export const throwIfAnyMissing = (props, source) => {
  props.forEach(key => {
    if (!source[key]) {
      throw Error(`Missing argument ${key}`);
    }
  });
};

export default {
  notEmptyProps,
  throwIfAnyMissing,
};
