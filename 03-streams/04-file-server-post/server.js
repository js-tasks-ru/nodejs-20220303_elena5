const LimitSizeStream = require('./LimitSizeStream');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname && pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('pathname cann\'t be nested');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);
  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('The file have already exists');
    return;
  }

  switch (req.method) {
    case 'POST':
      const limitedStream = new LimitSizeStream({limit: 1000000, encoding: 'utf-8'});
      const stream = fs.createWriteStream(filepath);

      limitedStream.pipe(stream);
      req.pipe(limitedStream);

      limitedStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          fs.unlink(filepath, (err) => {
            if (err) {
              unexpectedError(res, err.message);
              return;
            }
            res.statusCode = 413;
            res.end('Limit has been exceeded');
          });
          return;
        }

        unexpectedError(res, error.message);
      });

      stream.on('error', (error) => {
        unexpectedError(res, error.message);
      });

      limitedStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File was created');
      });

      req.on('aborted', () => {
        limitedStream.destroy();
        fs.unlink(filepath, (err) => {
          if (err) {
            unexpectedError(res, err.message);
            return;
          }
          unexpectedError(res, 'Request was aborted');
        });
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});


/* Helpers */
function unexpectedError(res, message) {
  res.statusCode = 500;
  const resMessage = message ? `: ${message}` : '';
  res.end(`Unexpected error${resMessage}`);
}

module.exports = server;
