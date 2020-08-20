const hostname = '127.0.0.1';
const port = 3443;
const puppeteer = require('puppeteer')
var crypto = require("crypto");
const express = require('express')
const bodyParser = require('body-parser');
const views = require('./views/viewRoutes');
const fs = require('fs');
var https = require('https');
var path = require('path')

const { saveReport, processReport } = require('./helpers')

var app = express();

app.use('/csp-reports', bodyParser.json({ type: 'application/csp-report' }));
app.use('/run-reports', express.urlencoded({ extended: true }))
app.use('/trustedTypes-report', bodyParser.json({ type: 'application/csp-report' }));

app.use('/csp/*', function (req, res, next) {
  res.setHeader('Content-Security-Policy', "object-src 'none';script-src 'nonce-r4nd0m' 'strict-dynamic' https: http:;base-uri 'none'; report-uri /csp-reports");
  next()
})

app.use('/trustedTypes/*', function (req, res, next) {
  res.setHeader('Content-Security-Policy', "object-src 'none'; require-trusted-types-for 'script';base-uri 'none'; report-uri /trustedTypes-report");
  next()
})

https.createServer({
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
}, app)
.listen(port, function () {
  console.log(`Example app listening on port ${port}! Go to https://localhost:${port}/`)
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/views" + "/index.html")
})

//!Leaving this in just incase we want it back later
// app.post('/run-reports', async (req, res) => {
//   var id = crypto.randomBytes(20).toString('hex');
//   try {
//     const browser = await puppeteer.launch();
//     const openPage = await browser.newPage();
//     const pages = Object.values(req.body).map(e => `http://${hostname}:${port}/${e}?id=${id}`)

//     // open report endpoints
//     for (const page of pages) {
//       await openPage.goto(page, { waitUntil: 'networkidle0' }) // wait for puppeteer to complete fetch
//     }
//     await browser.close()
//   } catch (e) {
//     console.log(e)
//   }
//   res.redirect('/see-reports?id=' + id);
// })

app.get(`/see-reports`, function (req, res) {
  res.sendFile(__dirname + '/views/seeReports.html');
})

app.get('/getTableContent', function (req, res) {
  const queue_file = __dirname + '/reports/table_queue.json'
  var directory = __dirname + '/reports'

  let rawdata = fs.readFileSync(queue_file, 'utf8')
  console.log(rawdata)
  var arr = JSON.parse(rawdata)

  var reports = {}
  for (i = arr.length - 1; i >= 0; i--) {
    var id = arr[i]['id']
    reports[id] = {
      'numberOfReports': fs.readdirSync(directory + '/' + id, 'utf8').length,
      'date': arr[i]['date']
    }
  }
  console.log(reports)
  res.send(reports)
})

app.get(`/get-reports`, function (req, res) {
  let directory_name = __dirname + '/reports/' + req.query.id

  //make sure directory exists
  if (!fs.existsSync(directory_name)) {
    res.sendStatus(400)
  }

  processedReports = []
  files = fs.readdirSync(directory_name)
  files.forEach(file => {
    let rawdata = fs.readFileSync(directory_name + '/' + file)
    let reportJSON = JSON.parse(rawdata);
    processedReports.push(reportJSON)
  })

  res.send(processedReports)
})

app.post('/csp-reports', function (req, res) {
  console.log('CSP violation!')
  console.log(req.body)
  saveReport(req.body, 'csp_')
  res.sendStatus(204)
})

app.post('/coep-reports', function (req, res) {
  console.log('COEP violation!')
  console.log(req.body)
  res.sendStatus(204)
})

app.post('/trustedTypes-report', function (req, res) {
  console.log('Trusted types violation!')
  console.log(req.body)
  saveReport(req.body, 'tt_')
  res.sendStatus(204)
})

app.use('/', views);