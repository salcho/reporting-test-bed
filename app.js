const hostname = '127.0.0.1';
const port = 3000;
const puppeteer = require('puppeteer')
var crypto = require("crypto");
const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');
const dateFormat = require('dateformat');
var app = express();

app.use('/csp-reports',bodyParser.json({type: 'application/csp-report'}));
app.use('/run-reports', express.urlencoded({extended: true}))
app.use('/trustedTypes-report',bodyParser.json({type: 'application/csp-report'}));

app.use('/csp/*', function(req, res, next){
  res.setHeader('Content-Security-Policy', "object-src 'none';script-src 'nonce-r4nd0m' 'strict-dynamic' https: http:;base-uri 'none'; report-uri /csp-reports");
  next()
})

app.use('/trustedTypes/*', function(req, res, next){
  res.setHeader('Content-Security-Policy', "object-src 'none'; require-trusted-types-for 'script';base-uri 'none'; report-uri /trustedTypes-report");
  next()
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', function(req, res){
    res.sendFile(__dirname + "/views" + "/index.html")
})

app.post('/run-reports', async (req, res) => {
  try {
  const browser = await puppeteer.launch();
  const openPage = await browser.newPage();
  var id = crypto.randomBytes(20).toString('hex');
  const pages = Object.values(req.body).map(e => `http://${hostname}:${port}/${e}?id=${id}`)
  console.log(pages)
  for (let i = 0; i < pages.length; i++) {
    await openPage.goto(pages[i])
  }
  await browser.close()
  } catch (e) {
    console.log(e)
  }
  res.sendStatus(204)
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

app.get('/trustedTypes/innerHTML', (req, res) => {
  res.sendFile(__dirname + '/views/innerHtmlTT.html')
})

app.get('/trustedTypes/scriptSrc', (req, res) => {
  res.sendFile(__dirname + '/views/scriptSrcTT.html')
})