const pgp = require('pg-promise')({
    promiseLib: require('bluebird'),
    noWarnings: true});
const databases = {
    gs: pgp(process.env.POSTGRES_GEOSERVER),
    ghs: pgp(process.env.POSTGRES_GHS)
};

function grid_query(req, res) {
    let q = 'SELECT lon, lat, ' +
        req.query.c + ' c, ' +
        req.query.v + ' v FROM ' +
        req.query.layer + ' WHERE ST_Intersects(ST_MakeEnvelope(' +
        req.query.west + ', ' +
        req.query.south + ', ' +
        req.query.east + ', ' +
        req.query.north + ', 4326), ' + req.query.geom + ') LIMIT 10000';

    // console.log(q);

    databases[req.query.database].any(q)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            console.log(err)
        });

}

module.exports = {
    grid_query: grid_query
};
