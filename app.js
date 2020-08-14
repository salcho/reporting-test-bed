const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

var express = require('express')
var app = express()

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Security-Policy', "object-src 'none';script-src 'nonce-{random}' 'strict-dynamic' https: http:;base-uri 'none';report-uri csp-report");
  // res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/here', function(req, res){
  res.send(req.params)
})