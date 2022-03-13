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

    this.lastLineData = lines[lines.length - 1];
    for (let i = 0; i < lines.length - 1; i++) {
      this.push(lines[i]);
    }
    callback();
  }

  _flush(callback) {
    if (this.lastLineData) {
      this.push(this.lastLineData);
    }
    callback();
    this.lastLineData = null;
  }
}

module.exports = LineSplitStream;
