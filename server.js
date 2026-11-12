const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIR = path.join(__dirname, 'one10sports.in');

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml',
    '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/' || reqUrl === '') {
        reqUrl = '/index.html';
    }

    // Decode URL components
    reqUrl = decodeURIComponent(reqUrl);
    let filePath = path.join(ROOT_DIR, reqUrl);

    // Security check: prevent directory traversal
    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Check fallback for index.html in subdirectories
            const indexFallback = path.join(filePath, 'index.html');
            if (fs.existsSync(indexFallback) && fs.statSync(indexFallback).isFile()) {
                filePath = indexFallback;
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

let currentPort = PORT;

function startServer(port) {
    server.listen(port, '0.0.0.0', () => {
        console.log(`ONE10 SPORTS Local Server running at: http://localhost:${port}`);
        console.log(`Serving directory: ${ROOT_DIR}`);
    });
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${currentPort} in use, trying port ${currentPort + 1}...`);
        currentPort++;
        startServer(currentPort);
    } else {
        console.error('Server error:', err);
    }
});

startServer(currentPort);

