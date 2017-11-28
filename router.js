const router = require('express').Router();
const jsr = require('jsrender');
const md = require('mobile-detect');
let queries = require('./queries');

router.get('/', function (req, res) {
    // if (/MSIE (\d+\.\d+);/.test(ua)) {
    //     if (Number(RegExp.$1) <= 7) {
    //         res.redirect('https://blog.geolytix.net');
    //     }
    // }
    let _md = new md(req.headers['user-agent']);

    let o = (_md.mobile() === null || _md.tablet() !== null) ?
        {
            tmpl: jsr.templates('./views/desktop.html'),
            platform: './public/tmpl/desktop/'
        } : {
            tmpl: jsr.templates('./views/mobile.html'),
            platform: './public/tmpl/mobile/'
        };

    let locales = {
        uk: {
            locale: 'uk',
            header: o.platform + 'uk_header.html',
            case_studies: o.platform + 'uk_case_studies.html',
            team: o.platform + 'uk_team.html',
            geodata: o.platform + 'uk_geodata.html',
            photo: o.platform + 'uk_team_photo.html',
            footer: o.platform + 'uk_footer.html'
        },
        cn: {
            locale: 'cn',
            header: o.platform + 'cn_header.html',
            team: o.platform + 'cn_team.html',
            geodata: o.platform + 'cn_geodata.html',
            photo: o.platform + 'cn_team_photo.html',
            footer: o.platform + 'cn_footer.html'
        },
        jp: {
            locale: 'jp',
            header: o.platform + 'jp_header.html',
            team: o.platform + 'jp_team.html',
            geodata: o.platform + 'jp_geodata.html',
            footer: o.platform + 'jp_footer.html'
        }
    };

    req.headers.host.includes('.cn') ?
        res.send(o.tmpl.render(locales.cn)) : res.send(o.tmpl.render(locales.uk));

    // req.headers.host.includes('.cn') ?
    //     res.send(o.tmpl.render(locales.cn)) : req.headers.host.includes('.jp') ?
    //     res.send(o.tmpl.render(locales.jp)) : res.send(o.tmpl.render(locales.uk));

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