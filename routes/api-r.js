var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


router.post('/new/', function(req, res) {
  console.log(req.body);
  res.status(200);
});

module.exports = router;