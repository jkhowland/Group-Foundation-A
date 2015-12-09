var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
app.use(express.static(__dirname + "/dist"));
app.get('/', function(req, res){
  res.render('./index.html');
});
app.listen(port);