var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/mobile', function(req, res) {
  res.render('mobile');
});

router.get('/map', function(req, res) {
  res.render('map');
});

module.exports = router;
