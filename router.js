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
            jsr.templates('./views/index.html') : jsr.templates('./views/mobile.html'),
        flags = req.headers.host.includes('.cn') ?
            '<a class="flag_link img__load" data-src="gb.svg" href="http://atap.geolytix.net"></a>' :
            req.headers.host.includes('.jp') ?
                '<a class="flag_link img__load" data-src="gb.svg" href="http://atap.geolytix.net"></a>' :
                '<a class="flag_link img__load" data-src="cn.svg" href="http://atap.geolytix.cn"></a><a class="flag_link img__load" data-src="jp.svg" href="http://atap.geolytix.jp"></a>';

    res.send(tmpl.render({
        flags: flags
    }));
});

router.get('/map', function (req, res) {
    let _md = new md(req.headers['user-agent']),
        dataset = req.originalUrl.substring(req.originalUrl.indexOf('?') + 1),
        tmpl = (_md.mobile() === null || _md.tablet() !== null) ?
            jsr.templates('./views/gd_map_d.html') :
            jsr.templates('./views/gd_map_m.html');

    require('fs').existsSync('./public/tmpl/gd_' + dataset + '.html') ?
        res.send(tmpl.render({gd_tmpl: './public/tmpl/gd_' + dataset + '.html'})):
        res.send(jsr.renderFile('./views/error.html'));
});

router.get('/grid_query', queries.grid_query);

module.exports = router;