var express = require('express');
var router = express.Router();


router.post('/new', function(req, res) {
  var data_collection = req.app.locals.data_collection;
  data_collection.insertOne(
      {"original_url": req.body.url, "id": req.body.id},
      function(err, result) {
        if (!err) {
          res.send(req.body.id);
        }
        else {
          console.error('Adding the new URL to the database was unsuccessful');
          res.status(500);
        }
      }
  );
});

router.post('/update', function(req, res) {
  var data_collection = req.app.locals.data_collection;
  data_collection.updateOne(
      {"original_url": req.body.url},
      { "$set": {"id": req.body.id}},
      function(err, result) {
        if (!err) {
          res.send(req.body.id);
        }
        else {
          console.error('Adding the new URL to the database was unsuccessful');
          res.status(500);
        }
      }
  );
});

router.post('/redirect', function(req, res) {
  var data_collection = req.app.locals.data_collection;
  console.log(req.body.id);
  data_collection.find(
      {id: req.body.id}).toArray(function(err, items) {
    if (err) {
      console.err(err);
    }
    else {
      console.log(items[0]);
      res.send(items[0].original_url);
    }
  });
});

module.exports = router;