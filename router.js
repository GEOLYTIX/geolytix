var express = require('express');
var router = express.Router();
var queries = require('./queries');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/mobile', function (req, res) {
    res.render('mobile');
});

router.get('/map', function (req, res) {
    res.render('map');
});

router.get('/map_mobile', function (req, res) {
    res.render('map_mobile');
});

router.get('/grid_query', queries.grid_query);

router.get('/iconst_fail', function (req, res) {
    res.render('iconst_fail');
});

module.exports = router;
