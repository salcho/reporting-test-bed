const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

var express = require('express')
var app = express()

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', function(req, res){
  res.send(req.params)
})