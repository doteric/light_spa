export const memoize = (fn, keymaker = JSON.stringify) => {
  const lookupTable = {};

  return function (...args) {
    const key = keymaker.apply(this, args);

    // console.log(lookupTable[key] ? "cache" : "miss");

    return lookupTable[key] || (lookupTable[key] = fn.apply(this, args));
  };
};