const hostname = '127.0.0.1';
const port = 3000;

const express = require('express')
const bodyParser = require('body-parser');
var app = express()

app.use('/csp-reports',bodyParser.json({type: 'application/csp-report'}));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(function(req, res, next){
    res.setHeader('Content-Security-Policy', "object-src 'none';script-src 'nonce-1234' 'strict-dynamic' https: http:;base-uri 'none'; report-uri /csp-report");
    next()
})

app.get('/', function(req, res){
    res.send(req.params)
})

app.post('/csp-reports', function(req, res){
  console.log('CSP violation!')
  console.log(req.body)
  res.sendStatus(204)
})

app.post('/trustedTypes-report', (req, res) => {
  console.log('Trusted Types')
  console.log(req.body)
  res.sendStatus(204)
})


app.get('/scriptWithoutNonce', function(req, res){
    res.sendFile(__dirname + '/scriptwithoutnonce.html')
})

app.get('/inlineEventHandler', function(req, res){
  res.sendFile(__dirname + '/inlineEventHandler.html')
})

app.get('/jsUri', function(req, res){
    res.sendFile(__dirname + '/jsUri.html')
})

app.get('/trustedTypes', (req, res) => {
  res.setHeader('Content-Security-Policy', "object-src 'none'; require-trusted-types-for 'script';base-uri 'none'; report-uri /trustedTypes-report");
  res.sendFile(__dirname + '/trustedTypes.html')
})
