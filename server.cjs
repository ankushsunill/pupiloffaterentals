const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';

let nextApp = null;
let nextHandler = null;

try {
  const next = require('next');
  nextApp = next({ dev, dir: root });
  nextHandler = nextApp.getRequestHandler();
} catch (error) {
  console.warn('Next.js is not installed yet. Falling back to static HTML server.');
}

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

const staticPrefixes = ['/media/', '/vendor/'];
const staticFiles = new Set(['/app.js', '/styles.css', '/redesign.css', '/final.css', '/favicon.ico', '/robots.txt']);

function isStaticRequest(pathname) {
  return staticFiles.has(pathname) || staticPrefixes.some((prefix) => pathname.startsWith(prefix));
}

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

function parseRange(range, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(range || '');
  if (!match) return null;

  let start = match[1] === '' ? null : Number(match[1]);
  let end = match[2] === '' ? null : Number(match[2]);

  if (start === null && end === null) return null;
  if ((start !== null && !Number.isSafeInteger(start)) || (end !== null && !Number.isSafeInteger(end))) return null;

  if (start === null) {
    const suffixLength = end;
    if (!suffixLength || suffixLength <= 0) return null;
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  } else if (end === null) {
    end = size - 1;
  }

  if (start < 0 || end < start || start >= size) return null;
  return { start, end: Math.min(end, size - 1) };
}

function serveStatic(req, res, pathname) {
  let filePath = safeResolve(pathname || '/');

  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return true;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return true;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const isRuntimeAsset = ext === '.css' || ext === '.js';
    const range = req.headers.range;

    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parsedRange = parseRange(range, stat.size);
      if (!parsedRange) {
        res.writeHead(416, {
          'Content-Range': `bytes */${stat.size}`,
          'Accept-Ranges': 'bytes'
        });
        res.end('Range not satisfiable');
        return;
      }

      const { start, end } = parsedRange;
      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      });
      stream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' || isRuntimeAsset ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    fs.createReadStream(filePath).pipe(res);
  });

  return true;
}

function createServer() {
  return http.createServer((req, res) => {
    const parsed = url.parse(req.url || '/', true);
    const pathname = parsed.pathname || '/';

    if (pathname === '/**') {
      res.writeHead(302, { Location: '/' });
      res.end();
      return;
    }

    if (isStaticRequest(pathname)) {
      serveStatic(req, res, pathname);
      return;
    }

    if (nextHandler) {
      nextHandler(req, res, parsed);
      return;
    }

    serveStatic(req, res, pathname);
  });
}

function listen(server, currentPort) {
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && currentPort < port + 20) {
      console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}...`);
      listen(server, currentPort + 1);
      return;
    }
    throw error;
  });

  server.listen(currentPort, host, () => {
    const mode = nextHandler ? `Next.js ${dev ? 'dev SSR' : 'SSR'}` : 'static fallback';
    console.log(`POF Rental ${mode} running at http://${host}:${currentPort}`);
    console.log('Press Ctrl+C to stop the server.');
  });
}

async function main() {
  if (nextApp) await nextApp.prepare();
  listen(createServer(), port);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
