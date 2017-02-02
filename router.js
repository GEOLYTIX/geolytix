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

router.get('/grid_query', queries.grid_query);

router.get('/iconst_fail', function (req, res) {
    res.render('iconst_fail');
});

router.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send('User-agent: *');
});

module.exports = router;
