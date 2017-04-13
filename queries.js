var promise = require('bluebird');
var pgp = require('pg-promise')({promiseLib: promise});
var db = pgp(process.env.POSTGRES);

function grid_query(req, res) {
    db.any('SELECT lon, lat, ' +
        req.query.c + ' c, ' +
        req.query.v + ' v FROM ' +
        req.query.layer + ' WHERE ST_DWithin(ST_MakeEnvelope(' +
        req.query.west + ', ' +
        req.query.south + ', ' +
        req.query.east + ', ' +
        req.query.north + ', 4326), geom, 0.000001) LIMIT 10000')
        .then(function (data) {
            res.status(200).json(data);
        });
}

module.exports = {
    grid_query: grid_query
};
