const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.maxLength = options.limit;
    this.currentLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this.currentLength += chunk.length;

    if (this.currentLength > this.maxLength) {
      callback(new LimitExceededError());
      return;
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
