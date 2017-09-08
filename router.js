let express = require('express');
let router = express.Router();
let queries = require('./queries');
let jsr = require('jsrender');
let fs = require('fs');
let md = require('mobile-detect');

router.get('/', function (req, res) {
    // if (/MSIE (\d+\.\d+);/.test(ua)) {
    //     if (Number(RegExp.$1) <= 7) {
    //         res.redirect('https://blog.geolytix.net');
    //     }
    // }


    console.log(req.headers.host.includes('.cn'));


    let _md = new md(req.headers['user-agent']),
        tmpl = (_md.mobile() === null || _md.tablet() !== null) ?
            jsr.templates(req.headers.host.includes('.cn') ? './views/index_cn.html' : './views/index.html') : jsr.templates('./views/mobile.html');

    res.send(tmpl.render());


});

router.get('/map', function (req, res) {
    var ua = req.headers['user-agent'];
    var _md = new md(ua);
    var _md_mobile = _md.mobile();
    var _md_tablet = _md.tablet();

    var tmpl;
    if (_md_mobile === null || _md_tablet !== null) {
        tmpl = jsr.templates('./views/gd_map.html');
    } else {
        tmpl = jsr.templates('./views/gd_map_m.html');
    }

    var dataset = req.originalUrl.substring(req.originalUrl.indexOf('?') + 1);

    if (fs.existsSync('./public/tmpl/gd_' + dataset + '.html')){
        var html = tmpl.render({
            gd_tmpl: './public/tmpl/gd_' + dataset + '.html'
        });
        res.send(html);
    } else {
        res.send(jsr.renderFile('./views/error.html'));
    }
});

router.get('/grid_query', queries.grid_query);

module.exports = router;