const hostname = '127.0.0.1';
const port = 3000;

const express = require('express')
const bodyParser = require('body-parser');
var app = express()

app.use(bodyParser.json({type: 'application/csp-report'}));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(function(req, res, next){
    res.setHeader('Content-Security-Policy', "object-src 'none';script-src 'nonce-r4nd0m' 'strict-dynamic' https: http:;base-uri 'none'; report-uri /csp-reports");
    next()
})

app.get('/', function(req, res){
    res.send(req.params)
})

app.post('/csp-reports', function(req, res){
  console.log('CSP violation!')
//   console.log(req.body)
  res.sendStatus(204)
})

app.get('/noNonce', function(req, res){
    res.sendFile(__dirname + '/scriptwithoutnonce.html')
})

app.get('/jsUri', function(req, res){
    res.sendFile(__dirname + '/jsUri.html')
})

app.get('/unsafeEval', function(req, res){
    res.sendFile(__dirname + '/unsafeEval.html')
})
