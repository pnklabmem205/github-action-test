const http = require('http');
const port = process.env.PORT || 3000;

// 브랜치 정보 표시 (환경 변수에서 가져오기)
const branchName = process.env.BRANCH_NAME || 'unknown';
const developer = process.env.DEVELOPER || 'unknown';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    app: 'githubactiontest',
    status: 'ok',
    branch: branchName,
    developer: developer,
    time: new Date().toISOString(),
    message: `This is deployed from branch: ${branchName} by ${developer}`,
  }));
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Branch: ${branchName}`);
  console.log(`Developer: ${developer}`);
});
