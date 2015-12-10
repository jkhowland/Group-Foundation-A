var express = require('express');
var path = require( 'path' );
var port = process.env.PORT || 3000;
var app = express();

app.use(express.static(path.join(__dirname, "/")));
app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(port);