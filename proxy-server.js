const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const OLLAMA_URL = 'http://localhost:11434';
const PORT = 3000;

const server = http.createServer((req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API 프록시
  if (req.url.startsWith('/api/')) {
    const apiPath = req.url.replace(/^\/api/, '');
    const ollamaUrl = `${OLLAMA_URL}/api${apiPath}`;

    const proxyReq = require('http').request(
      new url.URL(ollamaUrl),
      {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
        }
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on('error', (error) => {
      console.error('Ollama 연결 오류:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Ollama 서버 연결 실패', details: error.message }));
    });

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
    return;
  }

  // 정적 파일 제공
  let filePath = path.join(__dirname, req.url === '/' ? 'api-monitor-register.html' : req.url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, 'localhost', () => {
  console.log(`✅ 프록시 서버 시작: http://localhost:${PORT}`);
  console.log(`📡 Ollama 프록시: ${OLLAMA_URL}`);
  console.log(`\n🌐 브라우저에서 열기: http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ 포트 ${PORT}는 이미 사용 중입니다.`);
    console.error('해결책: 다른 터미널에서 실행 중인 서버를 종료하세요.');
  } else {
    console.error('서버 오류:', error);
  }
  process.exit(1);
});
