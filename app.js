var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    http = require('http'),
    api = require('./routes/api-r');

// The express app
var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.set('view engine', 'ejs');

app.get('/', function(req, res, next){
      res.render('index');
    })
    .get('/:id', function(req, res) {
      res.render('redirect')
    });

var db = mongodb.MongoClient;
var data_collection;
//mongodb API url
var url = 'mongodb://aryan:2016Aryan@ds061405.mongolab.com:61405/my-direct';

db.connect(url, function (err, db){
  if(err) {
    console.error('Unable to connect to the mongoDB server. Error: ', err);
  }
  else {
    console.info('MongoDB connected!');
    data_collection = db.collection("data");
    app.locals.data_collection = data_collection;

  }
});


// Routes
app
    .use(express.static(__dirname + '/public'))
    .use('/api', api);


//listen to server and set up socket.io handshake

var server = http.createServer(app);
var port = process.env.PORT || 3000;

//send success message
server.listen(port, function() {
  console.log(' - listening on ' + port+ ' ' + __dirname);
});




module.exports = app;
