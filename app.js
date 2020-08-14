const hostname = '127.0.0.1';
const port = 3000;

const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');
const dateFormat = require('dateformat');
var app = express()

app.use('/csp-reports',bodyParser.json({type: 'application/csp-report'}));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(function(req, res, next){
    res.setHeader('Content-Security-Policy', "object-src 'none';script-src 'nonce-r4nd0m' 'strict-dynamic' https: http:;base-uri 'none'; report-uri /csp-reports");
    next()
})

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html")
})

app.post('/csp-reports', function(req, res){
  console.log('CSP violation!')
  console.log(req.body)
  var report = JSON.stringify(req.body)
  file_name = 'csp_' + dateFormat(Date.now(), "dd-mm-yyyy_h:MM:ss") + "_rand" + Math.floor((Math.random() * 5000) + 1) + '.txt'
  fs.writeFile(__dirname + '/reports/' + file_name, report, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  res.sendStatus(204)
})

app.post('/trustedTypes-report', function(req, res){
  console.log('Trusted types violation!')
  console.log(req.body)
  var report = JSON.stringify(req.body)
  file_name = 'trutstedTypes_' + dateFormat(Date.now(), "dd-mm-yyyy_h:MM:ss") + "_rand" + Math.floor((Math.random() * 5000) + 1) + '.txt'
  fs.writeFile(__dirname + '/reports/' + file_name, report, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  res.sendStatus(204)
})

app.get('/csp/scriptWithoutNonce', function(req, res){
    res.sendFile(__dirname + '/views/scriptwithoutnonce.html')
})

app.get('/csp/inlineEventHandler', function(req, res){
  res.sendFile(__dirname + '/views/inlineEventHandler.html')
})

app.get('/csp/jsUri', function(req, res){
    res.sendFile(__dirname + '/views/jsUri.html')
})

app.get('/csp/unsafeEval', function(req, res){
  res.sendFile(__dirname + '/views/unsafeEval.html')
})

app.get('/trustedTypes', (req, res) => {
  res.setHeader('Content-Security-Policy', "object-src 'none'; require-trusted-types-for 'script';base-uri 'none'; report-uri /trustedTypes-report");
  res.sendFile(__dirname + '/views/trustedTypes.html')
})
