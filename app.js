const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

var express = require('express')
var app = express()

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(function(req, res, next){
  res.setHeader('Content-Security-Policy', "object-src 'none';script-src 'nonce-{random}' 'strict-dynamic' https: http:;base-uri 'none';report-uri:/csp-report");
  next()
})

app.get('/', function(req, res){
  res.send(req.params)
})

app.post('/csp-report', function(req, res){
  res.send(req.params)
})

app.get('/noNonce', function(req, res){
  res.sendFile(__dirname + '/scriptwithoutnonce.html')
})
