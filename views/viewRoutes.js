const express = require('express');

const router = express.Router();

router.get('/csp/scriptWithoutNonce', function(req, res){
  res.sendFile(__dirname + '/csp/scriptwithoutnonce.html')
})

router.get('/csp/inlineEventHandler', function(req, res){
  res.sendFile(__dirname + '/csp/inlineEventHandler.html')
})

router.get('/csp/jsUri', function(req, res){
    res.sendFile(__dirname + '/csp/jsUri.html')
})

router.get('/csp/unsafeEval', function(req, res){
  res.sendFile(__dirname + '/csp/unsafeEval.html')
})

router.get('/trustedTypes/innerHTML', (req, res) => {
  res.sendFile(__dirname + '/trustedTypes/innerHtmlTT.html')
})

router.get('/trustedTypes/scriptSrc', (req, res) => {
  res.sendFile(__dirname + '/trustedTypes/scriptSrcTT.html')
})

router.get('/coep/test', (req, res) => {
  // res.setHeader('Reporting-Endpoints', 'coep-endpoint="https://localhost:3443/coep-reports"')
  // res.setHeader("Report-To", "{ group: 'coep-endpoint', max_age: 86400, endpoints: [{ url: 'https://localhost:3443/coep-reports'}]}")
  res.setHeader("Cross-Origin-Embedder-Policy", 'require-corp; report-to="coep-endpoint"')
  res.sendFile(__dirname + '/coep/coepTest.html')
})

router.get('/coep/crossOriginIframe', (req, res) => {
  res.sendFile(__dirname + '/coep/crossOriginIframe.html')
})

router.get('/coep/crossOriginResources', (req, res) => {
  res.sendFile(__dirname + '/coep/crossOriginResources.html')
})

module.exports = router;