const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const data = chunk.toString();

    if (!data.includes(os.EOL)) {
      this.lastLineData = `${this.lastLineData || ''}${data}`;
      callback();
      return;
    }

    const fullData = `${this.lastLineData || ''}${data}`;
    const lines = fullData.split(os.EOL);
    const firstLine = lines.shift();

    this.lastLineData = lines.join(os.EOL);
    callback(null, firstLine);
  }

  _flush(callback) {
    if (this.lastLineData) {
      callback(null, this.lastLineData);
    } else {
      callback();
    }

    this.lastLineData = null;
  }
}

module.exports = LineSplitStream;
