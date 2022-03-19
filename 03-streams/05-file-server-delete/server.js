const fs = require('fs');
const http = require('http');
const path = require('path');

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

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('The file doesn\'t exists');
    return;
  }

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('Unexpected error');
          return;
        }
        res.statusCode = 200;
        res.end('The file was deleted.');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
