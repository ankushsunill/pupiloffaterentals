const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || '127.0.0.1';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function safeResolve(requestPath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(requestPath.split('?')[0]);
  } catch (_) {
    return null;
  }

  const normalizedPath = path.normalize(decodedPath).replace(/^([/\\])+/, '');
  const filePath = path.resolve(root, normalizedPath || 'index.html');
  const relativePath = path.relative(root, filePath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) return null;
  return filePath;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/');
  let filePath = safeResolve(parsed.pathname || '/');

  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    const acceptsHtml = (req.headers.accept || '').includes('text/html');
    const ext = path.extname(filePath);

    if (req.method === 'GET' && acceptsHtml && !ext) {
      filePath = path.join(root, 'index.html');
    } else {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const range = req.headers.range;

    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
      });
      stream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

function listen(currentPort) {
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && currentPort < port + 20) {
      console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}...`);
      listen(currentPort + 1);
      return;
    }
    throw error;
  });

  server.listen(currentPort, host, () => {
    console.log(`POF Rental site running at http://${host}:${currentPort}`);
    console.log('Press Ctrl+C to stop the server.');
  });
}

listen(port);
