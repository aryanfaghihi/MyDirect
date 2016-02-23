var express = require('express');
var router = express.Router();


router.post('/new', function(req, res) {
  var data_collection = req.app.locals.data_collection;
  data_collection.insertOne(
      {"original_url": req.body.original_url, "id": req.body.id},
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

router.post('/redirect/:id', function(req, res) {
  var data_collection = req.app.locals.data_collection;
  console.log(req);
  console.log(req.body);
  console.log(req.params.id);

  data_collection.findAndModify(
      { id: req.params.id },     // query
      [],               // represents a sort order if multiple matches
      { $push: {"data": req.body} },   // update statement
      { new: true },    // options - new to return the modified document
      function(err,doc) {
        // doc.value includes the object that has been modified.
        console.log(doc.value);
        res.send(doc.value.original_url);
      }
  );
});

router.get('/manage/:id', function(req, res) {
  var data_collection = req.app.locals.data_collection;

  data_collection.find({id: req.params.id}).toArray(function(err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.send(data[0]);
    }
  })
});

module.exports = router;