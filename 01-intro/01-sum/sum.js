function sum(a, b) {
  if (!Number.isInteger(a)) {
    throw new TypeError(`First argument is not a number: ${a}`);
  }
  if (!Number.isInteger(b)) {
    throw new TypeError(`Second argument is not a number: ${b}`);
  }

  return a + b;
}

module.exports = sum;
