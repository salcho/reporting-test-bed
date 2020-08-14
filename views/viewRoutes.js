const express = require('express');

const router = express.Router();

router.get('/csp/scriptWithoutNonce', function(req, res){
  res.sendFile(__dirname + '/scriptwithoutnonce.html')
})

router.get('/csp/inlineEventHandler', function(req, res){
  res.sendFile(__dirname + '/inlineEventHandler.html')
})

router.get('/csp/jsUri', function(req, res){
    res.sendFile(__dirname + '/jsUri.html')
})

router.get('/csp/unsafeEval', function(req, res){
  res.sendFile(__dirname + '/unsafeEval.html')
})

router.get('/trustedTypes/innerHTML', (req, res) => {
  res.sendFile(__dirname + '/innerHtmlTT.html')
})

router.get('/trustedTypes/scriptSrc', (req, res) => {
  res.sendFile(__dirname + '/scriptSrcTT.html')
})

module.exports = router;