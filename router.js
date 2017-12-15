const router = require('express').Router();
const jsr = require('jsrender');
const Md = require('mobile-detect');
const queries = require('./queries');

router.get('/en/', function (req, res) {
    // if (/MSIE (\d+\.\d+);/.test(ua)) {
    //     if (Number(RegExp.$1) <= 7) {
    //         res.redirect('https://blog.geolytix.net');
    //     }
    // }
    let md = new Md(req.headers['user-agent']);

    let o = (md.mobile() === null || md.tablet() !== null) ?
        {
            tmpl: jsr.templates('./views/desktop.html'),
            platform: 'desktop'
        } : {
            tmpl: jsr.templates('./views/mobile.html'),
            platform: 'mobile'
        };

    let locales = {
        uk: {
            locale: 'uk',
            header: './public/tmpl/' + o.platform + '/uk_header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_white.css"/>',
            services: './public/tmpl/' + o.platform + '/uk_services.html',
            case_studies: './public/tmpl/' + o.platform + '/uk_case_studies.html',
            team: './public/tmpl/' + o.platform + '/uk_team.html',
            geodata: './public/tmpl/' + o.platform + '/uk_geodata.html',
            photo: './public/tmpl/' + o.platform + '/uk_team_photo.html',
            footer: './public/tmpl/' + o.platform + '/uk_footer.html'
        },
        cn: {
            locale: 'cn',
            header: './public/tmpl/' + o.platform + '/cn_header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
            services: './public/tmpl/' + o.platform + '/cn_services.html',
            team: './public/tmpl/' + o.platform + '/cn_team.html',
            geodata: './public/tmpl/' + o.platform + '/cn_geodata.html',
            photo: './public/tmpl/' + o.platform + '/cn_team_photo.html',
            footer: './public/tmpl/' + o.platform + '/cn_footer.html'
        },
        cn_en: {
            locale: 'cn_en',
            header: './public/tmpl/' + o.platform + '/cn_en_header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
            services: './public/tmpl/' + o.platform + '/cn_en_services.html',
            team: './public/tmpl/' + o.platform + '/cn_en_team.html',
            geodata: './public/tmpl/' + o.platform + '/cn_en_geodata.html',
            photo: './public/tmpl/' + o.platform + '/cn_team_photo.html',
            footer: './public/tmpl/' + o.platform + '/cn_footer.html'
        },
        jp: {
            locale: 'jp',
            header: './public/tmpl/' + o.platform + '/jp_header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
            team: './public/tmpl/' + o.platform + '/jp_team.html',
            geodata: './public/tmpl/' + o.platform + '/jp_geodata.html',
            footer: './public/tmpl/' + o.platform + '/jp_footer.html'
        }
    };

    req.headers.host.includes('.cn') ?
        res.send(o.tmpl.render(locales.cn)) : res.send(o.tmpl.render(locales.uk));

    // req.headers.host.includes('.cn') ?
    //     res.send(o.tmpl.render(locales.cn)) : req.headers.host.includes('.jp') ?
    //     res.send(o.tmpl.render(locales.jp)) : res.send(o.tmpl.render(locales.uk));

});

router.get('/', function (req, res) {
    // if (/MSIE (\d+\.\d+);/.test(ua)) {
    //     if (Number(RegExp.$1) <= 7) {
    //         res.redirect('https://blog.geolytix.net');
    //     }
    // }
    let md = new Md(req.headers['user-agent']);

    let o = (md.mobile() === null || md.tablet() !== null) ?
        {
            tmpl: jsr.templates('./views/desktop.html'),
            platform: 'desktop'
        } : {
            tmpl: jsr.templates('./views/mobile.html'),
            platform: 'mobile'
        };

    let locales = {
        uk: {
            locale: 'uk',
            header: './public/tmpl/' + o.platform + '/uk_header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_white.css"/>',
            services: './public/tmpl/' + o.platform + '/uk_services.html',
            case_studies: './public/tmpl/' + o.platform + '/uk_case_studies.html',
            team: './public/tmpl/' + o.platform + '/uk_team.html',
            geodata: './public/tmpl/' + o.platform + '/uk_geodata.html',
            photo: './public/tmpl/' + o.platform + '/uk_team_photo.html',
            footer: './public/tmpl/' + o.platform + '/uk_footer.html'
        },
        cn: {
            locale: 'cn',
            header: './public/tmpl/' + o.platform + '/cn_header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
            services: './public/tmpl/' + o.platform + '/cn_services.html',
            team: './public/tmpl/' + o.platform + '/cn_team.html',
            geodata: './public/tmpl/' + o.platform + '/cn_geodata.html',
            photo: './public/tmpl/' + o.platform + '/cn_team_photo.html',
            footer: './public/tmpl/' + o.platform + '/cn_footer.html'
        },
        cn_en: {
            locale: 'cn_en',
            header: './public/tmpl/' + o.platform + '/cn_en_header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
            services: './public/tmpl/' + o.platform + '/cn_en_services.html',
            team: './public/tmpl/' + o.platform + '/cn_en_team.html',
            geodata: './public/tmpl/' + o.platform + '/cn_en_geodata.html',
            photo: './public/tmpl/' + o.platform + '/cn_team_photo.html',
            footer: './public/tmpl/' + o.platform + '/cn_footer.html'
        },
        jp: {
            locale: 'jp',
            header: './public/tmpl/' + o.platform + '/jp_header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
            team: './public/tmpl/' + o.platform + '/jp_team.html',
            geodata: './public/tmpl/' + o.platform + '/jp_geodata.html',
            footer: './public/tmpl/' + o.platform + '/jp_footer.html'
        }
    };

    req.headers.host.includes('.cn') ?
        res.send(o.tmpl.render(locales.cn)) : res.send(o.tmpl.render(locales.uk));

    // req.headers.host.includes('.cn') ?
    //     res.send(o.tmpl.render(locales.cn)) : req.headers.host.includes('.jp') ?
    //     res.send(o.tmpl.render(locales.jp)) : res.send(o.tmpl.render(locales.uk));

});

router.get('/map', function (req, res) {
    let md = new Md(req.headers['user-agent']),
        dataset = req.originalUrl.substring(req.originalUrl.indexOf('?') + 1),
        tmpl = (md.mobile() === null || md.tablet() !== null) ?
            jsr.templates('./views/gd_map_d.html') :
            jsr.templates('./views/gd_map_m.html');

    require('fs').existsSync('./public/tmpl/gd_' + dataset + '.html') ?
        res.send(tmpl.render({gd_tmpl: './public/tmpl/gd_' + dataset + '.html'})):
        res.send(jsr.renderFile('./views/error.html'));
});

router.get('/grid_query', queries.grid_query);

module.exports = router;