var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb');

// The express app
var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.set('view engine', 'ejs');

app.get('/', function(req, res, next){
      res.render('index');
    });

var db = mongodb.MongoClient;

//mongodb API url
var url = 'mongodb://aryan:2016Aryan@ds061405.mongolab.com:61405/my-direct';

db.connect(url, function (err, db){
  if(err) {
    console.log('Unable to connect to the mongoDB server. Error: ', err);
  }
  else {
    console.log('MongoDB connected!');

    app.use(express.static(__dirname + '/public'))
        .use(express.static(__dirname + '/bower_components'));

    //listen to server and set up socket.io handshake
    var http = require('http');
    var server = http.createServer(app);
    var port = process.env.PORT || 3000;

    //send success message
    server.listen(port, function() {
          console.log(' - listening on ' + port+ ' ' + __dirname);
    });
  }
});




module.exports = app;
