let router = require('express').Router();
let jsr = require('jsrender');
let md = require('mobile-detect');
let queries = require('./queries');

router.get('/', function (req, res) {
    // if (/MSIE (\d+\.\d+);/.test(ua)) {
    //     if (Number(RegExp.$1) <= 7) {
    //         res.redirect('https://blog.geolytix.net');
    //     }
    // }
    let _md = new md(req.headers['user-agent']),
        tmpl = (_md.mobile() === null || _md.tablet() !== null) ?
            jsr.templates(req.headers.host.includes('.cn') ?
                './views/index_cn.html' :
                req.headers.host.includes('.jp') ?
                    './views/index_jp.html' :
                    './views/index.html') :
            jsr.templates(req.headers.host.includes('.cn') ?
                './views/mobile_cn.html' :
                req.headers.host.includes('.jp') ?
                    './views/mobile_jp.html' :
                    './views/mobile.html');

    res.send(tmpl.render());
});

router.get('/map', function (req, res) {
    let _md = new md(req.headers['user-agent']),
        dataset = req.originalUrl.substring(req.originalUrl.indexOf('?') + 1),
        tmpl = (_md.mobile() === null || _md.tablet() !== null) ?
            jsr.templates('./views/gd_map.html') :
            jsr.templates('./views/gd_map_m.html');

    require('fs').existsSync('./public/tmpl/gd_' + dataset + '.html') ?
        res.send(tmpl.render({gd_tmpl: './public/tmpl/gd_' + dataset + '.html'})):
        res.send(jsr.renderFile('./views/error.html'));
});

router.get('/grid_query', queries.grid_query);

module.exports = router;