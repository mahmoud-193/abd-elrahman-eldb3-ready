'use strict';

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const contentTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

function resolvePublicFile(urlPath) {
  let requested;
  try { requested = decodeURIComponent(urlPath); } catch { return null; }
  requested = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
  if (requested.split('/').some((part) => part.startsWith('.'))) return null;
  const file = path.resolve(root, requested);
  return file === root || file.startsWith(root + path.sep) ? file : null;
}

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    let file = resolvePublicFile(url.pathname);
    if (!file) { response.writeHead(400); response.end('Bad request'); return; }
    try {
      const stat = await fs.stat(file);
      if (!stat.isFile()) throw new Error('Not a file');
    } catch { file = path.join(root, 'index.html'); }
    const body = await fs.readFile(file);
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    response.end('Internal server error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Abdelrahman Eldb3 website listening on port ${port}`);
});
