const hostname = '127.0.0.1';
const port = 3000;

const express = require('express')
const bodyParser = require('body-parser');
var app = express()

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(function(req, res, next){
  res.setHeader('Content-Security-Policy', "object-src 'none';script-src 'nonce-1234' 'strict-dynamic' https: http:;base-uri 'none'; report-uri /csp-report");
  next()
})

app.use(bodyParser.raw())

app.get('/', function(req, res){
  res.send(req.params)
})

app.post('/csp-report', function(req, res){
  console.log('CSP violation!')
  console.log(req)
  res.sendStatus(204)
})

app.get('/noNonce', function(req, res){
  res.sendFile(__dirname + '/scriptwithoutnonce.html')
})
