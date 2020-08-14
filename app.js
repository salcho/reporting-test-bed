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
    res.setHeader('Content-Security-Policy', "object-src 'none';script-src 'nonce-1234' 'strict-dynamic' https: http:;base-uri 'none'; report-uri /csp-reports");
    next()
})

app.get('/', function(req, res){
    res.send(req.params)
})

app.post('/csp-reports', function(req, res){
  console.log('CSP violation!')
  console.log(req.body)
  var report = JSON.stringify(req.body)
  file_name = 'csp_' + dateFormat(Date.now(), "dd-mm-yyyy_h:MM:ss") + '.txt'
  fs.writeFile(__dirname + '/reports/' + file_name, report, function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });
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
